<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use PDO;

class ResultController {
    public function getResult(int $attemptId): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();

        $stmt = $db->prepare("
            SELECT ea.*, e.title as exam_title, e.exam_code, e.total_marks as exam_total_marks,
                   e.passing_percentage, e.result_visibility, e.solution_visibility, e.certificate_eligibility,
                   u.full_name as student_name, u.login_id as student_login_id, ac.name as class_name,
                   c.certificate_number, c.id as certificate_id
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            JOIN users u ON ea.student_id = u.id
            LEFT JOIN academic_classes ac ON u.class_id = ac.id
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
                   c.certificate_number, c.id as certificate_id
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            LEFT JOIN certificates c ON ea.id = c.attempt_id
            WHERE ea.student_id = ? AND ea.status IN ('submitted', 'timed_out', 'terminated')
            ORDER BY ea.submitted_at DESC
        ");
        $stmt->execute([$studentId]);
        $history = $stmt->fetchAll();

        Response::success($history, 'Student exam history retrieved.');
    }
}
