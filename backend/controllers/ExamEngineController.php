<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Logger;
use App\Helpers\CertificateGenerator;
use PDO;

class ExamEngineController {
    public function startExam(int $examId): void {
        $user = Auth::requireRole(['student', 'superadmin', 'teacher']);
        $db = Database::getConnection();

        // 1. Fetch Exam
        $stmt = $db->prepare("SELECT * FROM exams WHERE id = ?");
        $stmt->execute([$examId]);
        $exam = $stmt->fetch();

        if (!$exam) {
            Response::notFound('Exam not found.');
        }

        if ($exam['status'] !== 'published' && $user['role'] === 'student') {
            Response::error('This exam is currently not available.', 403);
        }

        // Check start/end dates
        $now = time();
        if (!empty($exam['start_datetime']) && strtotime($exam['start_datetime']) > $now) {
            Response::error('This exam has not started yet. Starts at: ' . $exam['start_datetime'], 400);
        }
        if (!empty($exam['end_datetime']) && strtotime($exam['end_datetime']) < $now) {
            Response::error('This exam deadline has expired.', 400);
        }

        // Check active in-progress attempt to resume
        $chkActive = $db->prepare("
            SELECT * FROM exam_attempts
            WHERE exam_id = ? AND student_id = ? AND status = 'in_progress'
            ORDER BY id DESC LIMIT 1
        ");
        $chkActive->execute([$examId, $user['id']]);
        $activeAttempt = $chkActive->fetch();

        if ($activeAttempt) {
            // Check if attempt has already expired on server clock
            $remaining = strtotime($activeAttempt['expected_end_time']) - time();
            if ($remaining <= 0) {
                // Auto-submit expired attempt
                $this->finalizeAttempt((int)$activeAttempt['id'], 'timed_out');
            } else {
                // Resume active attempt
                $this->returnLiveExamSession($activeAttempt, $exam, $user);
                return;
            }
        }

        // Check attempt limit
        $attCountStmt = $db->prepare("
            SELECT COUNT(*) FROM exam_attempts
            WHERE exam_id = ? AND student_id = ? AND status = 'submitted'
        ");
        $attCountStmt->execute([$examId, $user['id']]);
        $completedCount = (int)$attCountStmt->fetchColumn();

        if ($completedCount >= (int)$exam['attempt_limit'] && $user['role'] === 'student') {
            Response::error('You have reached the maximum attempt limit for this exam.', 403);
        }

        // 2. Fetch Exam Questions
        $qStmt = $db->prepare("
            SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d,
                   q.difficulty, q.marks, q.negative_marks, q.question_image, s.name as subject_name
            FROM exam_questions eq
            JOIN questions q ON eq.question_id = q.id
            JOIN subjects s ON q.subject_id = s.id
            WHERE eq.exam_id = ?
            ORDER BY eq.question_order ASC
        ");
        $qStmt->execute([$examId]);
        $questions = $qStmt->fetchAll();

        if (empty($questions)) {
            Response::error('This exam has no questions configured yet.', 400);
        }

        // Question randomization
        if ($exam['randomize_questions']) {
            shuffle($questions);
        }

        $questionOrder = array_column($questions, 'id');
        $optionOrders = [];

        // Option shuffling
        if ($exam['shuffle_options']) {
            foreach ($questions as $q) {
                $opts = ['A', 'B', 'C', 'D'];
                shuffle($opts);
                $optionOrders[$q['id']] = $opts;
            }
        }

        $durationMinutes = (int)$exam['duration_minutes'];
        $startTime = date('Y-m-d H:i:s');
        $expectedEndTime = date('Y-m-d H:i:s', time() + ($durationMinutes * 60));
        $attemptNum = $completedCount + 1;

        // Create attempt record
        $insAttempt = $db->prepare("
            INSERT INTO exam_attempts (
                exam_id, student_id, attempt_number, start_time, expected_end_time,
                total_questions, status, tab_switch_count, ip_address, user_agent,
                question_order_json, option_order_json
            ) VALUES (?, ?, ?, ?, ?, ?, 'in_progress', 0, ?, ?, ?, ?)
        ");
        $insAttempt->execute([
            $examId,
            $user['id'],
            $attemptNum,
            $startTime,
            $expectedEndTime,
            count($questions),
            $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
            substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500),
            json_encode($questionOrder),
            json_encode($optionOrders)
        ]);

        $attemptId = (int)$db->lastInsertId();

        // Initialize answer slots
        $ansIns = $db->prepare("
            INSERT INTO student_answers (attempt_id, question_id, is_visited, is_marked_for_review)
            VALUES (?, ?, 0, 0)
        ");
        foreach ($questions as $q) {
            $ansIns->execute([$attemptId, $q['id']]);
        }

        // Fetch fresh attempt
        $stmtFresh = $db->prepare("SELECT * FROM exam_attempts WHERE id = ?");
        $stmtFresh->execute([$attemptId]);
        $newAttempt = $stmtFresh->fetch();

        Logger::log("Started Exam Attempt: {$exam['title']}", 'ExamEngine', ['attempt_id' => $attemptId, 'exam_id' => $examId], $user['id'], $user['role']);

        $this->returnLiveExamSession($newAttempt, $exam, $user);
    }

    public function saveAnswer(): void {
        $user = Auth::authenticate();
        $input = Validator::getJsonInput();

        $attemptId = (int)($input['attempt_id'] ?? 0);
        $questionId = (int)($input['question_id'] ?? 0);
        $selectedOption = !empty($input['selected_option']) ? strtoupper(trim($input['selected_option'])) : null;
        $isMarkedForReview = !empty($input['is_marked_for_review']) ? 1 : 0;
        $isVisited = isset($input['is_visited']) ? (int)$input['is_visited'] : 1;
        $timeSpentSeconds = (int)($input['time_spent_seconds'] ?? 0);

        if ($selectedOption !== null && !in_array($selectedOption, ['A', 'B', 'C', 'D'])) {
            $selectedOption = null;
        }

        $db = Database::getConnection();

        // Verify attempt ownership and active status
        $stmt = $db->prepare("SELECT * FROM exam_attempts WHERE id = ? AND student_id = ?");
        $stmt->execute([$attemptId, $user['id']]);
        $attempt = $stmt->fetch();

        if (!$attempt) {
            Response::forbidden('Invalid exam session.');
        }

        if ($attempt['status'] !== 'in_progress') {
            Response::error('This exam attempt is already completed and locked.', 403);
        }

        // Server side time check (allow 30s grace for network latency)
        if (strtotime($attempt['expected_end_time']) + 30 < time()) {
            $this->finalizeAttempt($attemptId, 'timed_out');
            Response::error('Exam time has elapsed. Attempt has been auto-submitted.', 408);
        }

        // Upsert student answer
        $upd = $db->prepare("
            INSERT INTO student_answers (attempt_id, question_id, selected_option, is_marked_for_review, is_visited, time_spent_seconds)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                selected_option = VALUES(selected_option),
                is_marked_for_review = VALUES(is_marked_for_review),
                is_visited = VALUES(is_visited),
                time_spent_seconds = time_spent_seconds + VALUES(time_spent_seconds)
        ");
        $upd->execute([
            $attemptId,
            $questionId,
            $selectedOption,
            $isMarkedForReview,
            $isVisited,
            $timeSpentSeconds
        ]);

        Response::success([
            'saved' => true,
            'question_id' => $questionId,
            'selected_option' => $selectedOption,
            'is_marked_for_review' => (bool)$isMarkedForReview
        ], 'Answer auto-saved.');
    }

    public function logSecurityEvent(): void {
        $user = Auth::authenticate();
        $input = Validator::getJsonInput();

        $attemptId = (int)($input['attempt_id'] ?? 0);
        $eventType = trim($input['event_type'] ?? 'tab_switch');
        $eventData = trim($input['event_data'] ?? '');

        if (!in_array($eventType, ['tab_switch', 'window_blur', 'fullscreen_exit', 'multiple_login', 'reconnect'])) {
            $eventType = 'tab_switch';
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT ea.*, e.tab_switch_limit FROM exam_attempts ea JOIN exams e ON ea.exam_id = e.id WHERE ea.id = ? AND ea.student_id = ?");
        $stmt->execute([$attemptId, $user['id']]);
        $attempt = $stmt->fetch();

        if (!$attempt || $attempt['status'] !== 'in_progress') {
            Response::error('Session inactive.', 400);
        }

        // Log security event
        $ins = $db->prepare("INSERT INTO exam_security_events (attempt_id, student_id, exam_id, event_type, event_data) VALUES (?, ?, ?, ?, ?)");
        $ins->execute([$attemptId, $user['id'], $attempt['exam_id'], $eventType, $eventData]);

        // Increment tab switch count if tab_switch or window_blur
        $newCount = (int)$attempt['tab_switch_count'] + 1;
        $upd = $db->prepare("UPDATE exam_attempts SET tab_switch_count = ? WHERE id = ?");
        $upd->execute([$newCount, $attemptId]);

        $limit = (int)$attempt['tab_switch_limit'];
        $terminated = false;

        if ($limit > 0 && $newCount >= $limit) {
            // Auto terminate exam attempt due to security limit violation
            $this->finalizeAttempt($attemptId, 'terminated');
            $terminated = true;
        }

        Response::success([
            'tab_switch_count' => $newCount,
            'tab_switch_limit' => $limit,
            'remaining_warnings' => max(0, $limit - $newCount),
            'terminated' => $terminated
        ], $terminated ? 'Exam terminated due to exceeding security switch limit.' : 'Security event recorded.');
    }

    public function submitExam(): void {
        $user = Auth::authenticate();
        $input = Validator::getJsonInput();

        $attemptId = (int)($input['attempt_id'] ?? 0);
        $db = Database::getConnection();

        $stmt = $db->prepare("SELECT * FROM exam_attempts WHERE id = ? AND student_id = ?");
        $stmt->execute([$attemptId, $user['id']]);
        $attempt = $stmt->fetch();

        if (!$attempt) {
            Response::forbidden('Exam attempt not found.');
        }

        if ($attempt['status'] !== 'in_progress') {
            Response::success(['attempt_id' => $attemptId], 'Exam was already submitted.');
        }

        $result = $this->finalizeAttempt($attemptId, 'submitted');
        Response::success($result, 'Exam submitted successfully.');
    }

    private function returnLiveExamSession(array $attempt, array $exam, array $user): void {
        $db = Database::getConnection();

        $remainingSeconds = max(0, strtotime($attempt['expected_end_time']) - time());

        // Parse question ordering
        $questionIds = json_decode($attempt['question_order_json'] ?? '[]', true);
        if (empty($questionIds)) {
            $qStmt = $db->prepare("SELECT question_id FROM exam_questions WHERE exam_id = ? ORDER BY question_order ASC");
            $qStmt->execute([$exam['id']]);
            $questionIds = $qStmt->fetchAll(PDO::FETCH_COLUMN);
        }

        // Fetch questions content in preserved order
        $placeholders = str_repeat('?,', count($questionIds) - 1) . '?';
        $qFetch = $db->prepare("
            SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d,
                   q.difficulty, q.marks, q.negative_marks, q.question_image,
                   s.name as subject_name
            FROM questions q
            JOIN subjects s ON q.subject_id = s.id
            WHERE q.id IN ($placeholders)
        ");
        $qFetch->execute($questionIds);
        $allFetched = $qFetch->fetchAll();
        $fetchedMap = [];
        foreach ($allFetched as $f) {
            $fetchedMap[$f['id']] = $f;
        }

        $orderedQuestions = [];
        foreach ($questionIds as $qId) {
            if (isset($fetchedMap[$qId])) {
                $orderedQuestions[] = $fetchedMap[$qId];
            }
        }

        // Fetch student answers saved so far
        $ansStmt = $db->prepare("SELECT * FROM student_answers WHERE attempt_id = ?");
        $ansStmt->execute([$attempt['id']]);
        $savedAnswers = $ansStmt->fetchAll();
        $answersMap = [];
        foreach ($savedAnswers as $a) {
            $answersMap[$a['question_id']] = [
                'selected_option' => $a['selected_option'],
                'is_marked_for_review' => (bool)$a['is_marked_for_review'],
                'is_visited' => (bool)$a['is_visited']
            ];
        }

        // Calculate summary counts for initial palette
        $answeredCount = 0;
        $markedCount = 0;
        $notAnsweredCount = 0;
        $notVisitedCount = 0;

        foreach ($orderedQuestions as $q) {
            $ans = $answersMap[$q['id']] ?? null;
            if (!$ans || !$ans['is_visited']) {
                $notVisitedCount++;
            } elseif ($ans['selected_option']) {
                $answeredCount++;
                if ($ans['is_marked_for_review']) {
                    $markedCount++;
                }
            } elseif ($ans['is_marked_for_review']) {
                $markedCount++;
            } else {
                $notAnsweredCount++;
            }
        }

        Response::success([
            'attempt_id' => $attempt['id'],
            'exam' => [
                'id' => $exam['id'],
                'title' => $exam['title'],
                'exam_code' => $exam['exam_code'],
                'duration_minutes' => $exam['duration_minutes'],
                'instructions' => $exam['instructions'],
                'negative_marking' => (bool)$exam['negative_marking'],
                'default_negative_marks' => $exam['default_negative_marks'],
                'tab_switch_limit' => $exam['tab_switch_limit']
            ],
            'student' => [
                'id' => $user['id'],
                'full_name' => $user['full_name'],
                'login_id' => $user['login_id']
            ],
            'questions' => $orderedQuestions,
            'answers' => $answersMap,
            'remaining_seconds' => $remainingSeconds,
            'start_time' => $attempt['start_time'],
            'expected_end_time' => $attempt['expected_end_time'],
            'tab_switch_count' => (int)$attempt['tab_switch_count'],
            'palette_summary' => [
                'total' => count($orderedQuestions),
                'answered' => $answeredCount,
                'marked' => $markedCount,
                'not_answered' => $notAnsweredCount,
                'not_visited' => $notVisitedCount
            ]
        ], 'Live exam session active.');
    }

    public function finalizeAttempt(int $attemptId, string $status = 'submitted'): array {
        $db = Database::getConnection();

        // 1. Fetch attempt and exam
        $stmt = $db->prepare("
            SELECT ea.*, e.passing_percentage, e.negative_marking, e.certificate_eligibility, e.min_certificate_percentage,
                   u.class_id
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            JOIN users u ON ea.student_id = u.id
            WHERE ea.id = ?
        ");
        $stmt->execute([$attemptId]);
        $attempt = $stmt->fetch();

        if (!$attempt) {
            return [];
        }

        // 2. Fetch all questions and student answers
        $ansStmt = $db->prepare("
            SELECT sa.*, q.correct_option, q.marks as q_marks, q.negative_marks as q_neg_marks
            FROM student_answers sa
            JOIN questions q ON sa.question_id = q.id
            WHERE sa.attempt_id = ?
        ");
        $ansStmt->execute([$attemptId]);
        $answers = $ansStmt->fetchAll();

        $totalQuestions = count($answers);
        $answeredCount = 0;
        $correctCount = 0;
        $wrongCount = 0;
        $unansweredCount = 0;
        $totalScore = 0.00;
        $maxPossibleMarks = 0.00;

        $updAnswerStmt = $db->prepare("
            UPDATE student_answers
            SET is_correct = ?, marks_awarded = ?
            WHERE id = ?
        ");

        foreach ($answers as $ans) {
            $qMarks = (float)$ans['q_marks'];
            $maxPossibleMarks += $qMarks;

            if (empty($ans['selected_option'])) {
                $unansweredCount++;
                $updAnswerStmt->execute([0, 0.00, $ans['id']]);
            } else {
                $answeredCount++;
                if ($ans['selected_option'] === $ans['correct_option']) {
                    $correctCount++;
                    $totalScore += $qMarks;
                    $updAnswerStmt->execute([1, $qMarks, $ans['id']]);
                } else {
                    $wrongCount++;
                    $neg = (float)$ans['q_neg_marks'];
                    $totalScore -= $neg;
                    $updAnswerStmt->execute([0, -$neg, $ans['id']]);
                }
            }
        }

        // Ensure total score does not go negative if configured
        $finalScore = max(0.00, $totalScore);
        $percentage = ($maxPossibleMarks > 0) ? round(($finalScore / $maxPossibleMarks) * 100, 2) : 0.00;
        $passingReq = (float)$attempt['passing_percentage'];
        $isPassed = ($percentage >= $passingReq) ? 1 : 0;

        $submittedAt = date('Y-m-d H:i:s');
        $timeSpent = max(1, strtotime($submittedAt) - strtotime($attempt['start_time']));

        // Update attempt record and lock it
        $updAttempt = $db->prepare("
            UPDATE exam_attempts SET
                status = ?,
                submitted_at = ?,
                time_spent_seconds = ?,
                total_questions = ?,
                answered_count = ?,
                correct_count = ?,
                wrong_count = ?,
                unanswered_count = ?,
                score = ?,
                percentage = ?,
                passed = ?
            WHERE id = ?
        ");

        $updAttempt->execute([
            $status,
            $submittedAt,
            $timeSpent,
            $totalQuestions,
            $answeredCount,
            $correctCount,
            $wrongCount,
            $unansweredCount,
            $finalScore,
            $percentage,
            $isPassed,
            $attemptId
        ]);

        // Recalculate ranks across exam attempts (Score DESC, Time Taken ASC)
        $this->calculateRanks((int)$attempt['exam_id'], (int)($attempt['class_id'] ?? 0));

        // Generate Certificate if eligible
        $cert = CertificateGenerator::generateCertificateForAttempt($attemptId);

        Logger::log("Finalized Exam Attempt #$attemptId [Status: $status, Score: $finalScore]", 'ExamEngine', [
            'attempt_id' => $attemptId,
            'score' => $finalScore,
            'percentage' => $percentage
        ], (int)$attempt['student_id'], 'student');

        return [
            'attempt_id' => $attemptId,
            'status' => $status,
            'total_questions' => $totalQuestions,
            'answered_count' => $answeredCount,
            'correct_count' => $correctCount,
            'wrong_count' => $wrongCount,
            'unanswered_count' => $unansweredCount,
            'score' => $finalScore,
            'percentage' => $percentage,
            'passed' => (bool)$isPassed,
            'certificate_generated' => $cert !== null,
            'certificate_number' => $cert['certificate_number'] ?? null
        ];
    }

    private function calculateRanks(int $examId, int $classId): void {
        $db = Database::getConnection();

        // 1. Overall Exam Rank (Score DESC, time_spent_seconds ASC, id ASC)
        $stmt = $db->prepare("
            SELECT id FROM exam_attempts
            WHERE exam_id = ? AND status = 'submitted'
            ORDER BY score DESC, time_spent_seconds ASC, id ASC
        ");
        $stmt->execute([$examId]);
        $rankings = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $updRank = $db->prepare("UPDATE exam_attempts SET rank_exam = ? WHERE id = ?");
        foreach ($rankings as $idx => $attId) {
            $updRank->execute([$idx + 1, $attId]);
        }

        // 2. Class Rank if classId is present
        if ($classId > 0) {
            $stmtC = $db->prepare("
                SELECT ea.id FROM exam_attempts ea
                JOIN users u ON ea.student_id = u.id
                WHERE ea.exam_id = ? AND u.class_id = ? AND ea.status = 'submitted'
                ORDER BY ea.score DESC, ea.time_spent_seconds ASC, ea.id ASC
            ");
            $stmtC->execute([$examId, $classId]);
            $cRankings = $stmtC->fetchAll(PDO::FETCH_COLUMN);

            $updCRank = $db->prepare("UPDATE exam_attempts SET rank_class = ? WHERE id = ?");
            foreach ($cRankings as $idx => $attId) {
                $updCRank->execute([$idx + 1, $attId]);
            }
        }
    }
}
