<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use PDO;

class LeaderboardController {
    public function getLeaderboard(): void {
        Auth::authenticate();
        $db = Database::getConnection();

        $examId = isset($_GET['exam_id']) && $_GET['exam_id'] !== '' ? (int)$_GET['exam_id'] : null;
        $classId = isset($_GET['class_id']) && $_GET['class_id'] !== '' ? (int)$_GET['class_id'] : null;
        $limit = max(10, min(100, (int)($_GET['limit'] ?? 50)));

        if ($examId) {
            // Exam Specific Leaderboard
            $sql = "
                SELECT ea.id as attempt_id, ea.score, ea.percentage, ea.time_spent_seconds, ea.rank_exam as rank_position,
                       ea.submitted_at, ea.correct_count, ea.total_questions,
                       u.id as student_id, u.full_name as student_name, u.login_id as student_login_id,
                       ac.name as class_name, e.title as exam_title, e.total_marks
                FROM exam_attempts ea
                JOIN users u ON ea.student_id = u.id
                JOIN exams e ON ea.exam_id = e.id
                LEFT JOIN academic_classes ac ON u.class_id = ac.id
                WHERE ea.exam_id = ? AND ea.status = 'submitted'
            ";
            $params = [$examId];

            if ($classId) {
                $sql .= " AND u.class_id = ?";
                $params[] = $classId;
            }

            $sql .= " ORDER BY ea.score DESC, ea.time_spent_seconds ASC, ea.submitted_at ASC LIMIT $limit";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $ranks = $stmt->fetchAll();

            // Format positions cleanly
            foreach ($ranks as $idx => &$r) {
                $r['rank'] = $idx + 1;
                $r['accuracy'] = ($r['total_questions'] > 0) ? round(($r['correct_count'] / $r['total_questions']) * 100, 1) : 0;
            }

            Response::success($ranks, 'Exam leaderboard retrieved.');
        } else {
            // Overall / All India Olympiad Leaderboard (Aggregated student performance)
            $sql = "
                SELECT u.id as student_id, u.full_name as student_name, u.login_id as student_login_id,
                       ac.name as class_name,
                       COUNT(ea.id) as total_exams_attempted,
                       SUM(ea.score) as total_points,
                       AVG(ea.percentage) as avg_percentage,
                       SUM(ea.correct_count) as total_correct,
                       SUM(ea.total_questions) as total_questions,
                       SUM(ea.time_spent_seconds) as total_time_spent
                FROM users u
                JOIN exam_attempts ea ON u.id = ea.student_id
                LEFT JOIN academic_classes ac ON u.class_id = ac.id
                WHERE u.role = 'student' AND ea.status = 'submitted'
            ";
            $params = [];

            if ($classId) {
                $sql .= " AND u.class_id = ?";
                $params[] = $classId;
            }

            $sql .= " GROUP BY u.id ORDER BY total_points DESC, avg_percentage DESC, total_time_spent ASC LIMIT $limit";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $ranks = $stmt->fetchAll();

            foreach ($ranks as $idx => &$r) {
                $r['rank'] = $idx + 1;
                $r['avg_percentage'] = round((float)$r['avg_percentage'], 1);
                $r['total_points'] = round((float)$r['total_points'], 2);
            }

            Response::success($ranks, 'Overall leaderboard retrieved.');
        }
    }
}
