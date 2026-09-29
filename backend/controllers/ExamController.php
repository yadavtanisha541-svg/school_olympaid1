<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;

class ExamController {
    public function getExams(): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();

        $examType = trim($_GET['exam_type'] ?? '');
        $classId = isset($_GET['class_id']) && $_GET['class_id'] !== '' ? (int)$_GET['class_id'] : null;
        $status = trim($_GET['status'] ?? '');
        $search = trim($_GET['search'] ?? '');

        if ($user['role'] === 'student') {
            // Student view: show exams available to this student
            $sql = "
                SELECT e.*, ac.name as class_name, s.name as subject_name,
                       (SELECT COUNT(*) FROM exam_attempts ea WHERE ea.exam_id = e.id AND ea.student_id = ? AND ea.status = 'submitted') as user_attempt_count,
                       (SELECT ea.id FROM exam_attempts ea WHERE ea.exam_id = e.id AND ea.student_id = ? AND ea.status = 'in_progress' ORDER BY ea.id DESC LIMIT 1) as active_attempt_id,
                       (SELECT ea.score FROM exam_attempts ea WHERE ea.exam_id = e.id AND ea.student_id = ? AND ea.status = 'submitted' ORDER BY ea.score DESC LIMIT 1) as best_score
                FROM exams e
                LEFT JOIN academic_classes ac ON e.class_id = ac.id
                LEFT JOIN subjects s ON e.subject_id = s.id
                WHERE e.status = 'published'
            ";
            $params = [$user['id'], $user['id'], $user['id']];

            // Filter access
            if ($user['class_id']) {
                $sql .= " AND (
                    e.id IN (SELECT exam_id FROM exam_assignments WHERE target_type = 'all' OR (target_type = 'class' AND target_id = ?) OR (target_type = 'individual' AND target_id = ?))
                    OR e.class_id = ? OR e.class_id IS NULL
                )";
                $params[] = $user['class_id'];
                $params[] = $user['id'];
                $params[] = $user['class_id'];
            }

            if ($examType !== '') {
                $sql .= " AND e.exam_type = ?";
                $params[] = $examType;
            }

            if ($search !== '') {
                $sql .= " AND (e.title LIKE ? OR e.exam_code LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }

            $sql .= " ORDER BY e.id DESC";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $exams = $stmt->fetchAll();

            Response::success($exams, 'Available exams retrieved.');
        } else {
            // Super Admin or Teacher view
            $sql = "
                SELECT e.*, ac.name as class_name, s.name as subject_name, u.full_name as author_name,
                       (SELECT COUNT(*) FROM exam_attempts ea WHERE ea.exam_id = e.id) as total_attempts_count,
                       (SELECT AVG(ea.percentage) FROM exam_attempts ea WHERE ea.exam_id = e.id AND ea.status = 'submitted') as avg_percentage
                FROM exams e
                LEFT JOIN academic_classes ac ON e.class_id = ac.id
                LEFT JOIN subjects s ON e.subject_id = s.id
                LEFT JOIN users u ON e.created_by = u.id
                WHERE 1=1
            ";
            $params = [];

            if ($classId) {
                $sql .= " AND e.class_id = ?";
                $params[] = $classId;
            }

            if ($examType !== '') {
                $sql .= " AND e.exam_type = ?";
                $params[] = $examType;
            }

            if ($status !== '') {
                $sql .= " AND e.status = ?";
                $params[] = $status;
            }

            if ($search !== '') {
                $sql .= " AND (e.title LIKE ? OR e.exam_code LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }

            $sql .= " ORDER BY e.id DESC";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $exams = $stmt->fetchAll();

            Response::success($exams, 'Exams list retrieved.');
        }
    }

    public function getExam(int $id): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();

        $stmt = $db->prepare("
            SELECT e.*, ac.name as class_name, s.name as subject_name, ch.name as chapter_name,
                   u.full_name as author_name
            FROM exams e
            LEFT JOIN academic_classes ac ON e.class_id = ac.id
            LEFT JOIN subjects s ON e.subject_id = s.id
            LEFT JOIN chapters ch ON e.chapter_id = ch.id
            LEFT JOIN users u ON e.created_by = u.id
            WHERE e.id = ?
        ");
        $stmt->execute([$id]);
        $exam = $stmt->fetch();

        if (!$exam) {
            Response::notFound('Exam not found.');
        }

        // Fetch assigned question IDs
        $qStmt = $db->prepare("
            SELECT eq.question_id, eq.question_order, eq.marks, eq.negative_marks,
                   q.question_text, q.difficulty, q.correct_option, s.name as subject_name
            FROM exam_questions eq
            JOIN questions q ON eq.question_id = q.id
            JOIN subjects s ON q.subject_id = s.id
            WHERE eq.exam_id = ?
            ORDER BY eq.question_order ASC
        ");
        $qStmt->execute([$id]);
        $exam['questions'] = $qStmt->fetchAll();

        // Fetch assignments
        $aStmt = $db->prepare("SELECT * FROM exam_assignments WHERE exam_id = ?");
        $aStmt->execute([$id]);
        $exam['assignments'] = $aStmt->fetchAll();

        // If student, do not leak correct options or answers in exam metadata!
        if ($user['role'] === 'student') {
            foreach ($exam['questions'] as &$q) {
                unset($q['correct_option']);
            }
        }

        Response::success($exam, 'Exam details retrieved.');
    }

    public function createExam(): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('manage_exams', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        $input = Validator::getJsonInput();
        $missing = Validator::validateRequired($input, ['title', 'exam_type', 'duration_minutes']);
        if (!empty($missing)) {
            Response::error('Missing required fields: ' . implode(', ', $missing), 422);
        }

        $db = Database::getConnection();

        // Generate or sanitize exam_code
        $examCode = trim($input['exam_code'] ?? '');
        if (empty($examCode)) {
            $examCode = 'EXAM-' . strtoupper(substr(md5(uniqid('', true)), 0, 6));
        }

        $chk = $db->prepare("SELECT id FROM exams WHERE exam_code = ?");
        $chk->execute([$examCode]);
        if ($chk->fetch()) {
            $examCode .= '-' . rand(10, 99);
        }

        $questionIds = $input['question_ids'] ?? [];
        $totalQuestions = count($questionIds);
        $totalMarks = 0.00;

        // Calculate total marks from question list
        if ($totalQuestions > 0) {
            $placeholders = str_repeat('?,', count($questionIds) - 1) . '?';
            $mStmt = $db->prepare("SELECT SUM(marks) as total FROM questions WHERE id IN ($placeholders)");
            $mStmt->execute($questionIds);
            $totalMarks = (float)($mStmt->fetchColumn() ?? 0.00);
        }

        $stmt = $db->prepare("
            INSERT INTO exams (
                title, exam_code, exam_type, description, instructions,
                class_id, subject_id, chapter_id, total_questions, total_marks,
                duration_minutes, passing_percentage, negative_marking, default_negative_marks,
                attempt_limit, start_datetime, end_datetime, result_visibility,
                solution_visibility, certificate_eligibility, min_certificate_percentage,
                randomize_questions, shuffle_options, tab_switch_limit, status, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            trim($input['title']),
            $examCode,
            in_array($input['exam_type'] ?? '', ['free_trial', 'practice', 'mock', 'paid']) ? $input['exam_type'] : 'practice',
            trim($input['description'] ?? ''),
            trim($input['instructions'] ?? 'Read all questions carefully. Choose the single best answer for each question.'),
            !empty($input['class_id']) ? (int)$input['class_id'] : null,
            !empty($input['subject_id']) ? (int)$input['subject_id'] : null,
            !empty($input['chapter_id']) ? (int)$input['chapter_id'] : null,
            $totalQuestions,
            $totalMarks,
            (int)($input['duration_minutes'] ?? 60),
            isset($input['passing_percentage']) ? (float)$input['passing_percentage'] : 40.00,
            !empty($input['negative_marking']) ? 1 : 0,
            isset($input['default_negative_marks']) ? (float)$input['default_negative_marks'] : 0.25,
            isset($input['attempt_limit']) ? (int)$input['attempt_limit'] : 1,
            !empty($input['start_datetime']) ? $input['start_datetime'] : null,
            !empty($input['end_datetime']) ? $input['end_datetime'] : null,
            in_array($input['result_visibility'] ?? '', ['immediate', 'after_end_date', 'manual']) ? $input['result_visibility'] : 'immediate',
            in_array($input['solution_visibility'] ?? '', ['always', 'after_result', 'never']) ? $input['solution_visibility'] : 'after_result',
            isset($input['certificate_eligibility']) ? (int)$input['certificate_eligibility'] : 1,
            isset($input['min_certificate_percentage']) ? (float)$input['min_certificate_percentage'] : 60.00,
            isset($input['randomize_questions']) ? (int)$input['randomize_questions'] : 1,
            isset($input['shuffle_options']) ? (int)$input['shuffle_options'] : 1,
            isset($input['tab_switch_limit']) ? (int)$input['tab_switch_limit'] : 3,
            in_array($input['status'] ?? '', ['draft', 'published', 'archived']) ? $input['status'] : 'published',
            $user['id']
        ]);

        $examId = (int)$db->lastInsertId();

        // Insert mapped questions
        if (!empty($questionIds)) {
            $qIns = $db->prepare("
                INSERT INTO exam_questions (exam_id, question_id, question_order, marks, negative_marks)
                SELECT ?, q.id, ?, q.marks, q.negative_marks FROM questions q WHERE q.id = ?
            ");
            foreach ($questionIds as $idx => $qId) {
                $qIns->execute([$examId, $idx + 1, $qId]);
            }
        }

        // Insert assignment
        $targetType = in_array($input['target_type'] ?? '', ['all', 'class', 'individual']) ? $input['target_type'] : 'all';
        $targetId = !empty($input['target_id']) ? (int)$input['target_id'] : null;
        $aIns = $db->prepare("INSERT INTO exam_assignments (exam_id, target_type, target_id) VALUES (?, ?, ?)");
        $aIns->execute([$examId, $targetType, $targetId]);

        Logger::log("Created Exam: {$input['title']}", 'Exams', ['exam_id' => $examId], $user['id'], $user['role']);

        Response::success(['id' => $examId, 'exam_code' => $examCode], 'Exam created successfully.', 201);
    }

    public function updateExam(int $id): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('manage_exams', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        $input = Validator::getJsonInput();
        $db = Database::getConnection();

        $questionIds = $input['question_ids'] ?? null;
        $totalQuestions = $questionIds ? count($questionIds) : 0;
        $totalMarks = 0.00;

        if ($questionIds && count($questionIds) > 0) {
            $placeholders = str_repeat('?,', count($questionIds) - 1) . '?';
            $mStmt = $db->prepare("SELECT SUM(marks) as total FROM questions WHERE id IN ($placeholders)");
            $mStmt->execute($questionIds);
            $totalMarks = (float)($mStmt->fetchColumn() ?? 0.00);
        }

        $stmt = $db->prepare("
            UPDATE exams SET
                title = ?, exam_type = ?, description = ?, instructions = ?,
                class_id = ?, subject_id = ?, chapter_id = ?,
                duration_minutes = ?, passing_percentage = ?, negative_marking = ?, default_negative_marks = ?,
                attempt_limit = ?, start_datetime = ?, end_datetime = ?, result_visibility = ?,
                solution_visibility = ?, certificate_eligibility = ?, min_certificate_percentage = ?,
                randomize_questions = ?, shuffle_options = ?, tab_switch_limit = ?, status = ?
            WHERE id = ?
        ");

        $stmt->execute([
            trim($input['title']),
            in_array($input['exam_type'] ?? '', ['free_trial', 'practice', 'mock', 'paid']) ? $input['exam_type'] : 'practice',
            trim($input['description'] ?? ''),
            trim($input['instructions'] ?? ''),
            !empty($input['class_id']) ? (int)$input['class_id'] : null,
            !empty($input['subject_id']) ? (int)$input['subject_id'] : null,
            !empty($input['chapter_id']) ? (int)$input['chapter_id'] : null,
            (int)($input['duration_minutes'] ?? 60),
            isset($input['passing_percentage']) ? (float)$input['passing_percentage'] : 40.00,
            !empty($input['negative_marking']) ? 1 : 0,
            isset($input['default_negative_marks']) ? (float)$input['default_negative_marks'] : 0.25,
            isset($input['attempt_limit']) ? (int)$input['attempt_limit'] : 1,
            !empty($input['start_datetime']) ? $input['start_datetime'] : null,
            !empty($input['end_datetime']) ? $input['end_datetime'] : null,
            in_array($input['result_visibility'] ?? '', ['immediate', 'after_end_date', 'manual']) ? $input['result_visibility'] : 'immediate',
            in_array($input['solution_visibility'] ?? '', ['always', 'after_result', 'never']) ? $input['solution_visibility'] : 'after_result',
            isset($input['certificate_eligibility']) ? (int)$input['certificate_eligibility'] : 1,
            isset($input['min_certificate_percentage']) ? (float)$input['min_certificate_percentage'] : 60.00,
            isset($input['randomize_questions']) ? (int)$input['randomize_questions'] : 1,
            isset($input['shuffle_options']) ? (int)$input['shuffle_options'] : 1,
            isset($input['tab_switch_limit']) ? (int)$input['tab_switch_limit'] : 3,
            in_array($input['status'] ?? '', ['draft', 'published', 'archived']) ? $input['status'] : 'published',
            $id
        ]);

        // If question list provided, update mapping
        if ($questionIds !== null) {
            $del = $db->prepare("DELETE FROM exam_questions WHERE exam_id = ?");
            $del->execute([$id]);

            if (!empty($questionIds)) {
                $qIns = $db->prepare("
                    INSERT INTO exam_questions (exam_id, question_id, question_order, marks, negative_marks)
                    SELECT ?, q.id, ?, q.marks, q.negative_marks FROM questions q WHERE q.id = ?
                ");
                foreach ($questionIds as $idx => $qId) {
                    $qIns->execute([$id, $idx + 1, $qId]);
                }
            }

            $updTotals = $db->prepare("UPDATE exams SET total_questions = ?, total_marks = ? WHERE id = ?");
            $updTotals->execute([$totalQuestions, $totalMarks, $id]);
        }

        Logger::log("Updated Exam ID: $id", 'Exams', ['exam_id' => $id], $user['id'], $user['role']);
        Response::success(null, 'Exam updated successfully.');
    }

    public function deleteExam(int $id): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('manage_exams', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM exams WHERE id = ?");
        $stmt->execute([$id]);

        Logger::log("Deleted Exam ID: $id", 'Exams', ['exam_id' => $id], $user['id'], $user['role']);
        Response::success(null, 'Exam deleted successfully.');
    }
}
