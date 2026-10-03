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
        $stmt = $db->prepare("
            SELECT e.*, u.full_name as author_name
            FROM exams e
            LEFT JOIN users u ON e.created_by = u.id
            WHERE e.id = ?
        ");
        $stmt->execute([$examId]);
        $exam = $stmt->fetch();

        if (!$exam) {
            Response::notFound('Exam not found.');
        }

        if ($user['role'] === 'student') {
            if ($exam['status'] !== 'published') {
                Response::error('This exam is currently not available.', 403);
            }
            // Strict Class Match Verification
            if (!empty($exam['class_id']) && !empty($user['class_id']) && (int)$exam['class_id'] !== (int)$user['class_id']) {
                Response::error('This examination is restricted to students of another class.', 403);
            }
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
                'author_name' => $exam['author_name'] ?? 'Faculty Member',
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

    public function submitGeneratedTest(): void {
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        // 1. Resolve Student accurately without throwing 401 exit
        $user = Auth::getOptionalUser();

        if (!$user && !empty($data['student_id'])) {
            $uStmt = $db->prepare("SELECT u.*, ac.name as class_name FROM users u LEFT JOIN academic_classes ac ON u.class_id = ac.id WHERE u.id = ? LIMIT 1");
            $uStmt->execute([(int)$data['student_id']]);
            $user = $uStmt->fetch();
        }

        if (!$user && !empty($data['student_login_id'])) {
            $uStmt = $db->prepare("SELECT u.*, ac.name as class_name FROM users u LEFT JOIN academic_classes ac ON u.class_id = ac.id WHERE u.login_id = ? LIMIT 1");
            $uStmt->execute([trim($data['student_login_id'])]);
            $user = $uStmt->fetch();
        }

        if (!$user && !empty($data['student_email'])) {
            $uStmt = $db->prepare("SELECT u.*, ac.name as class_name FROM users u LEFT JOIN academic_classes ac ON u.class_id = ac.id WHERE u.email = ? LIMIT 1");
            $uStmt->execute([trim($data['student_email'])]);
            $user = $uStmt->fetch();
        }

        if (!$user && !empty($data['student_name'])) {
            $uStmt = $db->prepare("SELECT u.*, ac.name as class_name FROM users u LEFT JOIN academic_classes ac ON u.class_id = ac.id WHERE u.full_name LIKE ? AND u.role = 'student' ORDER BY u.id DESC LIMIT 1");
            $uStmt->execute(["%" . trim($data['student_name']) . "%"]);
            $user = $uStmt->fetch();
        }

        if (!$user) {
            $stdStmt = $db->query("SELECT u.*, ac.name as class_name FROM users u LEFT JOIN academic_classes ac ON u.class_id = ac.id WHERE u.role = 'student' ORDER BY u.id DESC LIMIT 1");
            $user = $stdStmt->fetch();
            if (!$user) {
                $stdStmt = $db->query("SELECT u.*, ac.name as class_name FROM users u LEFT JOIN academic_classes ac ON u.class_id = ac.id ORDER BY u.id ASC LIMIT 1");
                $user = $stdStmt->fetch();
            }
        }

        // If school_name or city passed in payload, ensure student profile has it
        if ($user && !empty($data['student_school']) && (empty($user['school_name']) || $user['school_name'] === 'Delhi Public School' || $user['school_name'] === 'Independent Candidate')) {
            $updSchool = $db->prepare("UPDATE users SET school_name = ? WHERE id = ?");
            $updSchool->execute([trim($data['student_school']), $user['id']]);
        }

        $studentId = (int)($user['id'] ?? 1);
        $subjectKey = strtolower(trim($data['subject'] ?? 'math'));
        $gradeName = trim($data['grade'] ?? ($data['class'] ?? ($user['class_name'] ?? ($user['class'] ?? 'Class 6'))));
        $level = trim($data['level'] ?? 'Level 1');
        $difficulty = trim($data['difficulty'] ?? 'Foundation');
        $totalQuestions = (int)($data['totalQuestions'] ?? 10);
        $durationMinutes = (int)($data['durationMinutes'] ?? 15);
        $timeSpentSeconds = max(1, (int)($data['timeSpentSeconds'] ?? 30));
        $score = (float)($data['score'] ?? 0);
        $totalMarks = (float)($data['totalMarks'] ?? $totalQuestions);
        $percentage = ($totalMarks > 0) ? round(($score / $totalMarks) * 100, 2) : 0.00;
        $correctCount = (int)($data['correctCount'] ?? 0);
        $wrongCount = (int)($data['wrongCount'] ?? 0);
        $unansweredCount = (int)($data['unansweredCount'] ?? max(0, $totalQuestions - ($correctCount + $wrongCount)));
        $passed = ($percentage >= 40.0) ? 1 : 0;
        $questions = is_array($data['questions'] ?? null) ? $data['questions'] : [];
        $existingExamId = isset($data['exam_id']) ? (int)$data['exam_id'] : null;

        // 2. Resolve Subject ID
        $subMap = [
            'math' => ['Mathematics', 'IMO', 'Maths'],
            'english' => ['English', 'IEO'],
            'science' => ['Science', 'ISO', 'NSO'],
            'cyber' => ['Cyber', 'ICO', 'ICSO', 'Computer'],
            'gk' => ['General Knowledge', 'IGKO', 'GK'],
            'reasoning' => ['Reasoning', 'Logical Reasoning', 'LRO', 'ISSO']
        ];
        $searchTerms = $subMap[$subjectKey] ?? [$subjectKey];
        $subjectId = null;
        foreach ($searchTerms as $term) {
            $sStmt = $db->prepare("SELECT id FROM subjects WHERE name LIKE ? OR code LIKE ? LIMIT 1");
            $sStmt->execute(["%$term%", "%$term%"]);
            $subjectId = $sStmt->fetchColumn();
            if ($subjectId) break;
        }
        if (!$subjectId) {
            $subjectId = $db->query("SELECT id FROM subjects ORDER BY id ASC LIMIT 1")->fetchColumn() ?: 1;
        }

        // 3. Resolve Class ID
        preg_match('/\d+/', $gradeName, $classMatches);
        $classNum = !empty($classMatches[0]) ? $classMatches[0] : '6';
        $cStmt = $db->prepare("SELECT id FROM academic_classes WHERE name LIKE ? OR code LIKE ? LIMIT 1");
        $cStmt->execute(["%Class $classNum%", "%CLASS-$classNum%"]);
        $classId = $cStmt->fetchColumn();
        if (!$classId) {
            $classId = !empty($user['class_id']) ? (int)$user['class_id'] : ($db->query("SELECT id FROM academic_classes ORDER BY id ASC LIMIT 1")->fetchColumn() ?: 1);
        }

        // 3. Create or Reuse Exam Record
        if ($existingExamId && $existingExamId > 0) {
            $examId = $existingExamId;
            $chk = $db->prepare("SELECT title FROM exams WHERE id = ?");
            $chk->execute([$examId]);
            $examTitle = $chk->fetchColumn() ?: "Olympiad Test Generator Pro - $gradeName";
        } else {
            $subjectTitle = ucfirst($subjectKey);
            if ($subjectKey === 'math') $subjectTitle = 'Mathematics';
            if ($subjectKey === 'reasoning') $subjectTitle = 'Reasoning';
            $examTitle = "$subjectTitle - $gradeName ($level $difficulty)";
            $examCode = 'GEN-' . strtoupper(substr($subjectKey, 0, 3)) . '-' . strtoupper(substr(uniqid(), -5));

            $insExam = $db->prepare("
                INSERT INTO exams (
                    title, exam_code, exam_type, subject_id, class_id, duration_minutes,
                    total_questions, total_marks, passing_percentage, randomize_questions, shuffle_options,
                    negative_marking, default_negative_marks, attempt_limit, result_visibility,
                    solution_visibility, certificate_eligibility, min_certificate_percentage,
                    status, created_by, created_at
                ) VALUES (
                    ?, ?, 'generated', ?, ?, ?,
                    ?, ?, 40.00, 0, 0,
                    0, 0.00, 10, 'immediate',
                    'always', 1, 50.00,
                    'published', 1, NOW()
                )
            ");
            $insExam->execute([
                $examTitle,
                $examCode,
                $subjectId,
                $classId,
                $durationMinutes,
                $totalQuestions,
                $totalMarks
            ]);
            $examId = (int)$db->lastInsertId();
        }

        // 4. Save Questions & Question links
        $letters = ['A', 'B', 'C', 'D'];
        $createdQIds = [];

        foreach ($questions as $idx => $qData) {
            $qText = trim($qData['q'] ?? ('Question ' . ($idx + 1)));
            $opts = $qData['options'] ?? ['Option A', 'Option B', 'Option C', 'Option D'];
            $optA = $opts[0] ?? 'A';
            $optB = $opts[1] ?? 'B';
            $optC = $opts[2] ?? 'C';
            $optD = $opts[3] ?? 'D';
            
            $correctIdx = isset($qData['correct']) ? (int)$qData['correct'] : 0;
            $correctLetter = $letters[$correctIdx] ?? 'A';
            $explanation = $qData['explanation'] ?? '';

            // Check if question exists
            $chkQ = $db->prepare("SELECT id FROM questions WHERE question_text = ? AND subject_id = ? LIMIT 1");
            $chkQ->execute([$qText, $subjectId]);
            $existingQId = $chkQ->fetchColumn();

            if ($existingQId) {
                $qId = (int)$existingQId;
            } else {
                $insQ = $db->prepare("
                    INSERT INTO questions (
                        subject_id, class_id, question_text, option_a, option_b, option_c, option_d,
                        correct_option, explanation, difficulty, marks, negative_marks, status, created_by, created_at
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, 1.00, 0.00, 'active', 1, NOW()
                    )
                ");
                $insQ->execute([
                    $subjectId,
                    $classId,
                    $qText,
                    $optA,
                    $optB,
                    $optC,
                    $optD,
                    $correctLetter,
                    $explanation,
                    strtolower($difficulty)
                ]);
                $qId = (int)$db->lastInsertId();
            }

            $createdQIds[] = [
                'qId' => $qId,
                'qData' => $qData,
                'correctLetter' => $correctLetter
            ];

            // Link in exam_questions safely
            $chkEQ = $db->prepare("SELECT id FROM exam_questions WHERE exam_id = ? AND question_id = ? LIMIT 1");
            $chkEQ->execute([$examId, $qId]);
            if (!$chkEQ->fetchColumn()) {
                $insEQ = $db->prepare("INSERT INTO exam_questions (exam_id, question_id, question_order) VALUES (?, ?, ?)");
                $insEQ->execute([$examId, $qId, $idx + 1]);
            }
        }

        // 5. Create attempt record in `exam_attempts`
        $submittedAt = date('Y-m-d H:i:s');
        $startTime = date('Y-m-d H:i:s', time() - $timeSpentSeconds);
        $expectedEndTime = date('Y-m-d H:i:s', time() + ($durationMinutes * 60));

        $insAttempt = $db->prepare("
            INSERT INTO exam_attempts (
                exam_id, student_id, start_time, expected_end_time, submitted_at,
                status, time_spent_seconds, total_questions, answered_count,
                correct_count, wrong_count, unanswered_count, score, percentage, passed, ip_address
            ) VALUES (
                ?, ?, ?, ?, ?,
                'submitted', ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?
            )
        ");
        $insAttempt->execute([
            $examId,
            $studentId,
            $startTime,
            $expectedEndTime,
            $submittedAt,
            $timeSpentSeconds,
            $totalQuestions,
            $correctCount + $wrongCount,
            $correctCount,
            $wrongCount,
            $unansweredCount,
            $score,
            $percentage,
            $passed,
            $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
        ]);
        $attemptId = (int)$db->lastInsertId();

        // 6. Record student answers
        $insAnswer = $db->prepare("
            INSERT INTO student_answers (
                attempt_id, question_id, selected_option, is_correct, is_marked_for_review,
                marks_awarded, time_spent_seconds
            ) VALUES (?, ?, ?, ?, 0, ?, 1)
        ");

        foreach ($createdQIds as $item) {
            $qId = $item['qId'];
            $qData = $item['qData'];
            $correctLetter = $item['correctLetter'];

            $userSelectedIdx = $qData['userSelected'] ?? null;
            $userSelectedLetter = ($userSelectedIdx !== null && isset($letters[$userSelectedIdx])) ? $letters[$userSelectedIdx] : null;
            
            $isCorrect = ($userSelectedLetter !== null && $userSelectedLetter === $correctLetter) ? 1 : 0;
            $marksAwarded = $isCorrect ? 1.00 : 0.00;

            $insAnswer->execute([
                $attemptId,
                $qId,
                $userSelectedLetter,
                $isCorrect,
                $marksAwarded
            ]);
        }

        // 7. Calculate Ranks
        $this->calculateRanks($examId, (int)$classId);

        // 8. Generate Certificate if passed
        $cert = null;
        if ($percentage >= 50.0) {
            $cert = CertificateGenerator::generateCertificateForAttempt($attemptId);
        }

        // 9. Activity Log
        Logger::log("Student Completed Generated Test: $examTitle [Score: $score/$totalQuestions, $percentage%]", 'TestGenerator', [
            'attempt_id' => $attemptId,
            'exam_id' => $examId,
            'student_name' => $user['full_name'] ?? 'Student',
            'score' => $score,
            'percentage' => $percentage
        ], $studentId, 'student');

        Response::success([
            'attempt_id' => $attemptId,
            'exam_id' => $examId,
            'exam_title' => $examTitle,
            'student_name' => $user['full_name'] ?? 'Student',
            'score' => $score,
            'total_questions' => $totalQuestions,
            'percentage' => $percentage,
            'passed' => (bool)$passed,
            'certificate_number' => $cert['certificate_number'] ?? null,
            'synced' => true
        ], 'Test submission saved. Details are now visible in Super Admin & Teacher Admin portals.');
    }

    public function getGeneratorAdminPapers(): void {
        $db = Database::getConnection();
        $classFilter = trim($_GET['class'] ?? '');
        $subjectFilter = trim($_GET['subject'] ?? '');
        $categoryFilter = trim($_GET['paper_category'] ?? '');
        $yearFilter = trim($_GET['exam_year'] ?? '');

        $sql = "
            SELECT e.*, ac.name as class_name, s.name as subject_name, s.code as subject_code
            FROM exams e
            LEFT JOIN academic_classes ac ON e.class_id = ac.id
            LEFT JOIN subjects s ON e.subject_id = s.id
            WHERE (e.exam_type IN ('generated', 'practice', 'sample_paper', 'previous_year') OR e.paper_category IS NOT NULL)
        ";
        $params = [];

        if ($categoryFilter !== '' && $categoryFilter !== 'all') {
            if ($categoryFilter === 'sample_paper' || $categoryFilter === 'sample') {
                $sql .= " AND (e.paper_category = 'sample_paper' OR e.exam_type = 'sample_paper' OR e.title LIKE '%Sample Paper%')";
            } elseif ($categoryFilter === 'previous_year' || $categoryFilter === 'past_paper' || $categoryFilter === 'previous') {
                $sql .= " AND (e.paper_category = 'previous_year' OR e.exam_type = 'previous_year' OR e.title LIKE '%Previous Year%' OR e.title LIKE '%Past Paper%')";
            } elseif ($categoryFilter === 'generator') {
                $sql .= " AND (e.paper_category = 'generator' OR e.exam_type = 'generated' OR (e.paper_category IS NULL AND e.title NOT LIKE '%Sample%' AND e.title NOT LIKE '%Previous%'))";
            } else {
                $sql .= " AND e.paper_category = ?";
                $params[] = $categoryFilter;
            }
        }

        if ($yearFilter !== '' && $yearFilter !== 'all') {
            $sql .= " AND (e.exam_year = ? OR e.title LIKE ?)";
            $params[] = $yearFilter;
            $params[] = "%$yearFilter%";
        }

        if ($classFilter !== '' && $classFilter !== 'All') {
            preg_match('/\d+/', $classFilter, $matches);
            if (!empty($matches[0])) {
                $classNum = $matches[0];
                $sql .= " AND (ac.name LIKE ? OR ac.name LIKE ? OR ac.code LIKE ? OR e.title LIKE ?)";
                $params[] = "%Class $classNum%";
                $params[] = "%Grade $classNum%";
                $params[] = "%CLASS-$classNum%";
                $params[] = "%Class $classNum%";
            } else {
                $sql .= " AND (ac.name LIKE ? OR ac.code LIKE ? OR e.title LIKE ?)";
                $params[] = "%$classFilter%";
                $params[] = "%$classFilter%";
                $params[] = "%$classFilter%";
            }
        }

        if ($subjectFilter !== '' && $subjectFilter !== 'All') {
            $subMap = [
                'math' => 'IMO',
                'science' => 'ISO',
                'cyber' => 'ICSO',
                'english' => 'IEO',
                'gk' => 'IGKO',
                'reasoning' => 'ISSO'
            ];
            $subCode = $subMap[strtolower($subjectFilter)] ?? $subjectFilter;
            $sql .= " AND (s.code LIKE ? OR s.name LIKE ? OR e.title LIKE ? OR e.exam_code LIKE ?)";
            $params[] = "%$subCode%";
            $params[] = "%$subjectFilter%";
            $params[] = "%$subjectFilter%";
            $params[] = "%$subCode%";
        }

        $sql .= " ORDER BY e.id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $papers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch questions for each paper
        foreach ($papers as &$p) {
            $qStmt = $db->prepare("
                SELECT q.*, eq.question_order
                FROM exam_questions eq
                JOIN questions q ON eq.question_id = q.id
                WHERE eq.exam_id = ?
                ORDER BY eq.question_order ASC
            ");
            $qStmt->execute([$p['id']]);
            $rawQs = $qStmt->fetchAll(PDO::FETCH_ASSOC);
            
            $formattedQs = [];
            foreach ($rawQs as $rq) {
                $correctLetter = strtoupper(trim($rq['correct_option'] ?? 'A'));
                $correctIdx = 0;
                if ($correctLetter === 'B') $correctIdx = 1;
                elseif ($correctLetter === 'C') $correctIdx = 2;
                elseif ($correctLetter === 'D') $correctIdx = 3;

                $formattedQs[] = [
                    'id' => (int)$rq['id'],
                    'q' => $rq['question_text'],
                    'options' => [
                        $rq['option_a'],
                        $rq['option_b'],
                        $rq['option_c'],
                        $rq['option_d']
                    ],
                    'correct' => $correctIdx,
                    'explanation' => $rq['explanation'] ?? '',
                    'marks' => (float)($rq['marks'] ?? 1.0)
                ];
            }
            $p['questions'] = $formattedQs;
        }

        Response::success($papers, 'Exam papers retrieved successfully.');
    }

    public function createGeneratorAdminPaper(): void {
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $title = trim($data['title'] ?? '');
        $subjectKey = trim($data['subject'] ?? 'math');
        $className = trim($data['class'] ?? 'Class 6');
        $paperCategory = trim($data['paper_category'] ?? 'generator');
        $examYear = trim($data['exam_year'] ?? '2024');
        $durationMinutes = (int)($data['duration_minutes'] ?? 15);
        $totalQuestions = (int)($data['total_questions'] ?? 10);
        $totalMarks = (float)($data['total_marks'] ?? $totalQuestions);
        $difficulty = trim($data['difficulty'] ?? 'Standard');
        $questions = is_array($data['questions'] ?? null) ? $data['questions'] : [];

        if (empty($title)) {
            if ($paperCategory === 'previous_year') {
                $title = "$className " . strtoupper($subjectKey) . " Previous Year Question Paper ($examYear)";
            } elseif ($paperCategory === 'sample_paper') {
                $title = "$className " . strtoupper($subjectKey) . " Official Free Sample Paper";
            } else {
                $title = "Olympiad Intelligent Test Generator Pro - $className (" . strtoupper($subjectKey) . ")";
            }
        }

        // 1. Resolve Subject
        $subMap = [
            'math' => ['IMO', 'Mathematics'],
            'science' => ['ISO', 'Science', 'NSO'],
            'cyber' => ['ICSO', 'Cyber', 'Computers', 'ICO'],
            'english' => ['IEO', 'English'],
            'gk' => ['IGKO', 'General Knowledge', 'GK'],
            'reasoning' => ['ISSO', 'Reasoning', 'Social Studies', 'LRO']
        ];
        $searchTerms = $subMap[strtolower($subjectKey)] ?? [$subjectKey];
        $subjectId = null;
        foreach ($searchTerms as $term) {
            $sStmt = $db->prepare("SELECT id FROM subjects WHERE code LIKE ? OR name LIKE ? LIMIT 1");
            $sStmt->execute(["%$term%", "%$term%"]);
            $subjectId = $sStmt->fetchColumn();
            if ($subjectId) break;
        }
        if (!$subjectId) {
            $subjectId = $db->query("SELECT id FROM subjects ORDER BY id ASC LIMIT 1")->fetchColumn() ?: 1;
        }

        // 2. Resolve Exact Class
        preg_match('/\d+/', $className, $classMatches);
        $classNum = !empty($classMatches[0]) ? $classMatches[0] : '6';
        $cStmt = $db->prepare("SELECT id FROM academic_classes WHERE name LIKE ? OR name LIKE ? OR code LIKE ? LIMIT 1");
        $cStmt->execute(["%Class $classNum%", "%$className%", "%CLASS-$classNum%"]);
        $classId = $cStmt->fetchColumn();
        if (!$classId) {
            $classId = $db->query("SELECT id FROM academic_classes ORDER BY id ASC LIMIT 1")->fetchColumn() ?: 1;
        }

        // 3. Create Exam
        $typePrefix = ($paperCategory === 'previous_year') ? 'PYP' : (($paperCategory === 'sample_paper') ? 'SMP' : 'TGP');
        $examCode = $typePrefix . '-' . strtoupper(substr($subjectKey, 0, 3)) . '-' . strtoupper(substr(uniqid(), -5));
        $examType = ($paperCategory === 'previous_year') ? 'previous_year' : (($paperCategory === 'sample_paper') ? 'sample_paper' : 'generated');

        $insExam = $db->prepare("
            INSERT INTO exams (
                title, exam_code, exam_type, exam_year, paper_category, subject_id, class_id, duration_minutes,
                total_questions, total_marks, passing_percentage, randomize_questions, shuffle_options,
                negative_marking, default_negative_marks, attempt_limit, result_visibility,
                solution_visibility, certificate_eligibility, min_certificate_percentage,
                status, created_by, created_at
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, 40.00, 0, 0,
                0, 0.00, 10, 'immediate',
                'always', 1, 50.00,
                'published', 1, NOW()
            )
        ");
        $insExam->execute([
            $title,
            $examCode,
            $examType,
            $examYear,
            $paperCategory,
            $subjectId,
            $classId,
            $durationMinutes,
            count($questions) > 0 ? count($questions) : $totalQuestions,
            $totalMarks
        ]);
        $examId = (int)$db->lastInsertId();

        // 4. Save Questions
        $letters = ['A', 'B', 'C', 'D'];
        foreach ($questions as $idx => $q) {
            $qText = trim($q['q'] ?? '');
            if (empty($qText)) continue;
            $opts = $q['options'] ?? ['Option A', 'Option B', 'Option C', 'Option D'];
            $optA = $opts[0] ?? 'Option A';
            $optB = $opts[1] ?? 'Option B';
            $optC = $opts[2] ?? 'Option C';
            $optD = $opts[3] ?? 'Option D';
            $corrIdx = isset($q['correct']) ? (int)$q['correct'] : 0;
            $corrLetter = $letters[$corrIdx] ?? 'A';
            $explanation = trim($q['explanation'] ?? '');
            $qMarks = (float)($q['marks'] ?? 1.0);

            $insQ = $db->prepare("
                INSERT INTO questions (
                    subject_id, class_id, question_text, option_a, option_b, option_c, option_d,
                    correct_option, explanation, difficulty, marks, negative_marks, status, created_by, created_at
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, 0.00, 'active', 1, NOW()
                )
            ");
            $insQ->execute([
                $subjectId,
                $classId,
                $qText,
                $optA,
                $optB,
                $optC,
                $optD,
                $corrLetter,
                $explanation,
                strtolower($difficulty),
                $qMarks
            ]);
            $qId = (int)$db->lastInsertId();

            $insEQ = $db->prepare("INSERT INTO exam_questions (exam_id, question_id, question_order) VALUES (?, ?, ?)");
            $insEQ->execute([$examId, $qId, $idx + 1]);
        }

        Response::success([
            'id' => $examId,
            'title' => $title,
            'exam_code' => $examCode,
            'paper_category' => $paperCategory,
            'exam_year' => $examYear,
            'class_name' => $className,
            'subject_id' => $subjectId,
            'total_questions' => count($questions)
        ], 'Exam paper created and published successfully by Super Admin.');
    }

    public function deleteGeneratorAdminPaper(int $examId): void {
        $db = Database::getConnection();
        $del = $db->prepare("DELETE FROM exams WHERE id = ?");
        $del->execute([$examId]);
        Response::success(['id' => $examId], 'Exam paper deleted successfully.');
    }
}
