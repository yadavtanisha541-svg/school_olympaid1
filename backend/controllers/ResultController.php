<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use PDO;

class ResultController {
    public function getResults(): void {
        $user = Auth::getOptionalUser();
        $db = Database::getConnection();

        $examId = isset($_GET['exam_id']) && $_GET['exam_id'] !== '' ? (int)$_GET['exam_id'] : null;
        $status = trim($_GET['status'] ?? '');
        $search = trim($_GET['search'] ?? '');
        $classId = isset($_GET['class_id']) && $_GET['class_id'] !== '' ? (int)$_GET['class_id'] : null;
        $className = trim($_GET['class_name'] ?? '');
        $subject = trim($_GET['subject'] ?? '');
        $scope = trim($_GET['scope'] ?? '');

        $where = ["ea.status IN ('submitted', 'timed_out', 'terminated')"];
        $params = [];

        if ($user && $user['role'] === 'student' && in_array($scope, ['my', 'self', 'me'])) {
            $where[] = "ea.student_id = ?";
            $params[] = $user['id'];
        } elseif ($user && $user['role'] === 'teacher' && in_array($scope, ['my', 'self', 'me'])) {
            $where[] = "(e.created_by = ? OR e.created_by = 1 OR e.created_by IS NULL OR e.exam_type IN ('practice', 'mock', 'generated'))";
            $params[] = $user['id'];
        }

        if ($examId) {
            $where[] = "ea.exam_id = ?";
            $params[] = $examId;
        }

        if ($classId) {
            $where[] = "(u.class_id = ? OR e.class_id = ?)";
            $params[] = $classId;
            $params[] = $classId;
        } elseif (!empty($className) && $className !== 'ALL') {
            preg_match('/\d+/', $className, $m);
            if (!empty($m[0])) {
                $cNum = $m[0];
                $where[] = "(ac_user.name LIKE ? OR ac_exam.name LIKE ? OR e.title LIKE ?)";
                $params[] = "%Class $cNum%";
                $params[] = "%Class $cNum%";
                $params[] = "%Class $cNum%";
            } else {
                $where[] = "(ac_user.name LIKE ? OR ac_exam.name LIKE ?)";
                $params[] = "%$className%";
                $params[] = "%$className%";
            }
        }

        if (!empty($subject) && $subject !== 'ALL') {
            $where[] = "(s.code LIKE ? OR s.name LIKE ? OR e.title LIKE ?)";
            $params[] = "%$subject%";
            $params[] = "%$subject%";
            $params[] = "%$subject%";
        }

        if ($status === 'passed') {
            $where[] = "ea.passed = 1";
        } elseif ($status === 'failed') {
            $where[] = "ea.passed = 0";
        }

        if ($search !== '') {
            $where[] = "(u.full_name LIKE ? OR u.login_id LIKE ? OR e.title LIKE ? OR e.exam_code LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $whereClause = implode(" AND ", $where);

        $stmt = $db->prepare("
            SELECT ea.id, ea.exam_id, ea.student_id, ea.score, ea.percentage, ea.passed,
                   ea.submitted_at, ea.start_time, ea.rank_exam, ea.status, ea.time_spent_seconds,
                   ea.correct_count, ea.wrong_count, ea.unanswered_count,
                   u.full_name as student_name, u.login_id as student_login_id,
                   COALESCE(NULLIF(u.school_name, ''), 'Independent Candidate') as school_name,
                   COALESCE(NULLIF(u.city, ''), '') as city,
                   e.title as exam_title, e.exam_code, e.exam_type, e.total_marks as exam_total_marks, e.total_marks, e.passing_percentage,
                   e.created_by as exam_created_by, tu.full_name as teacher_author_name,
                   COALESCE(ac_exam.name, ac_user.name, 'Class 6') as class_name,
                   s.name as subject_name, s.code as subject_code,
                   c.certificate_number, c.id as certificate_id
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            JOIN users u ON ea.student_id = u.id
            LEFT JOIN users tu ON e.created_by = tu.id
            LEFT JOIN academic_classes ac_user ON u.class_id = ac_user.id
            LEFT JOIN academic_classes ac_exam ON e.class_id = ac_exam.id
            LEFT JOIN subjects s ON e.subject_id = s.id
            LEFT JOIN certificates c ON ea.id = c.attempt_id
            WHERE $whereClause
            ORDER BY ea.submitted_at DESC, ea.id DESC
        ");
        $stmt->execute($params);
        $results = $stmt->fetchAll();

        Response::success($results, 'Examination results retrieved.');
    }

    public function getResult(int $attemptId): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();

        $stmt = $db->prepare("
            SELECT ea.*, e.title as exam_title, e.exam_code, e.exam_type, e.total_marks as exam_total_marks,
                   e.passing_percentage, e.result_visibility, e.solution_visibility, e.certificate_eligibility,
                   e.created_by as exam_created_by, tu.full_name as teacher_author_name,
                   u.full_name as student_name, u.login_id as student_login_id,
                   COALESCE(ac_user.name, ac_exam.name, 'Class 6') as class_name,
                   s.name as subject_name, s.code as subject_code,
                   c.certificate_number, c.id as certificate_id
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            JOIN users u ON ea.student_id = u.id
            LEFT JOIN users tu ON e.created_by = tu.id
            LEFT JOIN academic_classes ac_user ON u.class_id = ac_user.id
            LEFT JOIN academic_classes ac_exam ON e.class_id = ac_exam.id
            LEFT JOIN subjects s ON e.subject_id = s.id
            LEFT JOIN certificates c ON ea.id = c.attempt_id
            WHERE ea.id = ?
        ");
        $stmt->execute([$attemptId]);
        $result = $stmt->fetch();

        if (!$result) {
            Response::notFound('Result record not found.');
        }

        // Student can only see their own result unless superadmin or teacher
        if ($user['role'] === 'student' && (int)$result['student_id'] !== (int)$user['id']) {
            Response::forbidden('Unauthorized access to this result.');
        }

        // Subject-wise performance breakdown
        $subjStmt = $db->prepare("
            SELECT s.id as subject_id, s.name as subject_name,
                   COUNT(sa.id) as total_questions,
                   SUM(CASE WHEN sa.is_correct = 1 THEN 1 ELSE 0 END) as correct_count,
                   SUM(CASE WHEN sa.is_correct = 0 AND sa.selected_option IS NOT NULL THEN 1 ELSE 0 END) as wrong_count,
                   SUM(CASE WHEN sa.selected_option IS NULL THEN 1 ELSE 0 END) as unanswered_count,
                   SUM(sa.marks_awarded) as score_obtained,
                   SUM(q.marks) as max_marks
            FROM student_answers sa
            JOIN questions q ON sa.question_id = q.id
            JOIN subjects s ON q.subject_id = s.id
            WHERE sa.attempt_id = ?
            GROUP BY s.id, s.name
        ");
        $subjStmt->execute([$attemptId]);
        $result['subject_breakdown'] = $subjStmt->fetchAll();

        // Calculate accuracy
        $answered = (int)$result['answered_count'];
        $correct = (int)$result['correct_count'];
        $result['accuracy'] = ($answered > 0) ? round(($correct / $answered) * 100, 1) : 0.0;

        Response::success($result, 'Result retrieved.');
    }

    public function getSolutions(int $attemptId): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();

        $stmt = $db->prepare("
            SELECT ea.id, ea.student_id, ea.status, e.solution_visibility
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            WHERE ea.id = ?
        ");
        $stmt->execute([$attemptId]);
        $attempt = $stmt->fetch();

        if (!$attempt) {
            Response::notFound('Attempt not found.');
        }

        if ($user['role'] === 'student') {
            if ((int)$attempt['student_id'] !== (int)$user['id']) {
                Response::forbidden('Access denied.');
            }
            if ($attempt['solution_visibility'] === 'never') {
                Response::error('Solutions are disabled for this exam.', 403);
            }
            if ($attempt['status'] !== 'submitted' && $attempt['status'] !== 'timed_out') {
                Response::error('Solutions are only available after submission.', 403);
            }
        }

        // Fetch detailed question-by-question solution
        $solStmt = $db->prepare("
            SELECT sa.id as answer_id, sa.selected_option, sa.is_correct, sa.marks_awarded, sa.is_marked_for_review,
                   q.id as question_id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d,
                   q.correct_option, q.explanation, q.difficulty, q.marks, q.negative_marks, q.question_image,
                   s.name as subject_name, ch.name as chapter_name
            FROM student_answers sa
            JOIN questions q ON sa.question_id = q.id
            JOIN subjects s ON q.subject_id = s.id
            LEFT JOIN chapters ch ON q.chapter_id = ch.id
            WHERE sa.attempt_id = ?
            ORDER BY sa.id ASC
        ");
        $solStmt->execute([$attemptId]);
        $solutions = $solStmt->fetchAll();

        Response::success($solutions, 'Detailed solutions retrieved.');
    }

    public function getStudentHistory(): void {
        $user = Auth::authenticate();
        $studentId = $user['id'];

        if (($user['role'] === 'superadmin' || $user['role'] === 'teacher') && isset($_GET['student_id'])) {
            $studentId = (int)$_GET['student_id'];
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT ea.*, e.title as exam_title, e.exam_code, e.exam_type, e.total_marks as exam_total_marks,
                   e.passing_percentage, e.solution_visibility, e.certificate_eligibility,
                   tu.full_name as teacher_author_name,
                   c.certificate_number, c.id as certificate_id
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            LEFT JOIN users tu ON e.created_by = tu.id
            LEFT JOIN certificates c ON ea.id = c.attempt_id
            WHERE ea.student_id = ? AND ea.status IN ('submitted', 'timed_out', 'terminated')
            ORDER BY ea.submitted_at DESC
        ");
        $stmt->execute([$studentId]);
        $history = $stmt->fetchAll();

        Response::success($history, 'Student exam history retrieved.');
    }
}
