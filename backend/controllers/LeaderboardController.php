<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use PDO;

class LeaderboardController {
    public function getLeaderboard(): void {
        Auth::getOptionalUser();
        $db = Database::getConnection();

        $examId = isset($_GET['exam_id']) && $_GET['exam_id'] !== '' ? (int)$_GET['exam_id'] : null;
        $classId = isset($_GET['class_id']) && $_GET['class_id'] !== '' ? (int)$_GET['class_id'] : null;
        $className = trim($_GET['class_name'] ?? $_GET['class'] ?? '');
        $subject = strtoupper(trim($_GET['subject'] ?? ''));
        $limit = max(10, min(100, (int)($_GET['limit'] ?? 10)));

        if ($examId) {
            // Exam Specific Leaderboard
            $sql = "
                SELECT ea.id as attempt_id, ea.score, ea.percentage, ea.time_spent_seconds, ea.rank_exam as rank_position,
                       ea.submitted_at, ea.correct_count, ea.total_questions,
                       u.id as student_id, u.full_name as student_name, u.login_id as student_login_id,
                       COALESCE(ac_user.name, ac_exam.name, 'Class 6') as class_name, e.title as exam_title, e.total_marks
                FROM exam_attempts ea
                JOIN users u ON ea.student_id = u.id
                JOIN exams e ON ea.exam_id = e.id
                LEFT JOIN academic_classes ac_user ON u.class_id = ac_user.id
                LEFT JOIN academic_classes ac_exam ON e.class_id = ac_exam.id
                WHERE ea.exam_id = ? AND ea.status = 'submitted'
            ";
            $params = [$examId];

            if ($classId) {
                $sql .= " AND (u.class_id = ? OR e.class_id = ?)";
                $params[] = $classId;
                $params[] = $classId;
            }

            $sql .= " ORDER BY ea.score DESC, ea.time_spent_seconds ASC, ea.submitted_at ASC LIMIT $limit";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $ranks = $stmt->fetchAll();

            foreach ($ranks as $idx => &$r) {
                $r['rank'] = $idx + 1;
                $r['accuracy'] = ($r['total_questions'] > 0) ? round(($r['correct_count'] / $r['total_questions']) * 100, 1) : 0;
            }

            Response::success($ranks, 'Exam leaderboard retrieved.');
            return;
        }

        // 1. Filter Real Exam Submissions by Class and Subject
        $where = ["ea.status IN ('submitted', 'timed_out')"];
        $params = [];

        if (!empty($className)) {
            preg_match('/\d+/', $className, $m);
            if (!empty($m[0])) {
                $cNum = $m[0];
                $where[] = "(ac_user.name LIKE ? OR ac_exam.name LIKE ? OR e.title LIKE ?)";
                $params[] = "%Class $cNum%";
                $params[] = "%Class $cNum%";
                $params[] = "%Class $cNum%";
            }
        } elseif ($classId) {
            $where[] = "(u.class_id = ? OR e.class_id = ?)";
            $params[] = $classId;
            $params[] = $classId;
        }

        if (!empty($subject) && $subject !== 'ALL') {
            $subMap = [
                'IMO' => ['IMO', 'Mathematics', 'MATH'],
                'NSO' => ['NSO', 'ISO', 'Science'],
                'ISO' => ['ISO', 'NSO', 'Science'],
                'IEO' => ['IEO', 'English'],
                'ICSO' => ['ICSO', 'ICO', 'Cyber'],
                'ICO' => ['ICO', 'ICSO', 'Cyber'],
                'IGKO' => ['IGKO', 'GK', 'General Knowledge'],
                'ISSO' => ['ISSO', 'LRO', 'Reasoning']
            ];
            $searchTerms = $subMap[$subject] ?? [$subject];
            $subOr = [];
            foreach ($searchTerms as $term) {
                $subOr[] = "(s.code LIKE ? OR s.name LIKE ? OR e.title LIKE ?)";
                $params[] = "%$term%";
                $params[] = "%$term%";
                $params[] = "%$term%";
            }
            $where[] = "(" . implode(" OR ", $subOr) . ")";
        }

        $whereClause = implode(" AND ", $where);

        $sql = "
            SELECT 
                u.id as student_id,
                u.full_name as name,
                u.login_id,
                COALESCE(NULLIF(u.school_name, ''), 'Olympiad Academy') as school,
                COALESCE(NULLIF(u.city, ''), 'India') as city,
                COALESCE(ac_user.name, ac_exam.name, 'Class 6') as class_name,
                COALESCE(s.code, 'IMO') as subject,
                MAX(ea.percentage) as percentage_num,
                MAX(ea.score) as score,
                MAX(ea.submitted_at) as submitted_at
            FROM exam_attempts ea
            JOIN users u ON ea.student_id = u.id
            JOIN exams e ON ea.exam_id = e.id
            LEFT JOIN academic_classes ac_user ON u.class_id = ac_user.id
            LEFT JOIN academic_classes ac_exam ON e.class_id = ac_exam.id
            LEFT JOIN subjects s ON e.subject_id = s.id
            WHERE $whereClause
            GROUP BY u.id
            ORDER BY percentage_num DESC, score DESC, submitted_at DESC
            LIMIT $limit
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $rawRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Format leaderboard rows
        $results = [];
        foreach ($rawRows as $idx => $r) {
            $pct = round((float)($r['percentage_num'] ?? 0));
            $results[] = [
                'rank' => $idx + 1,
                'student_id' => (int)$r['student_id'],
                'name' => ucwords(trim($r['name'])),
                'school' => $r['school'],
                'city' => $r['city'],
                'class_name' => $r['class_name'],
                'subject' => $r['subject'],
                'percentage' => $pct . '%',
                'percentage_num' => $pct,
                'score' => (float)$r['score'],
                'submitted_at' => $r['submitted_at']
            ];
        }

        Response::success($results, 'Leaderboard data retrieved.');
    }
}
