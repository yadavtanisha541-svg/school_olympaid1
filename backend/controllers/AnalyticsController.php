<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use PDO;

class AnalyticsController {
    public function getSuperAdminDashboard(): void {
        Auth::requireRole(['superadmin']);
        $db = Database::getConnection();

        // 1. Overall counts
        $totalStudents = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn();
        $totalTeachers = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'teacher'")->fetchColumn();
        $totalExams = (int)$db->query("SELECT COUNT(*) FROM exams")->fetchColumn();
        $activeExams = (int)$db->query("SELECT COUNT(*) FROM exams WHERE status = 'published'")->fetchColumn();
        $totalQuestions = (int)$db->query("SELECT COUNT(*) FROM questions")->fetchColumn();
        $totalAttempts = (int)$db->query("SELECT COUNT(*) FROM exam_attempts WHERE status = 'submitted'")->fetchColumn();
        
        $avgScoreStmt = $db->query("SELECT AVG(percentage) as avg_p, SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as pass_c FROM exam_attempts WHERE status = 'submitted'");
        $avgRow = $avgScoreStmt->fetch();
        $avgScore = round((float)($avgRow['avg_p'] ?? 0), 1);
        $passCount = (int)($avgRow['pass_c'] ?? 0);
        $passPercentage = ($totalAttempts > 0) ? round(($passCount / $totalAttempts) * 100, 1) : 0.0;

        // 2. Subject Performance
        $subjStmt = $db->query("
            SELECT s.name as subject_name, s.color,
                   COUNT(sa.id) as answers_count,
                   SUM(CASE WHEN sa.is_correct = 1 THEN 1 ELSE 0 END) as correct_count,
                   ROUND(SUM(CASE WHEN sa.is_correct = 1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(sa.id), 0), 1) as accuracy
            FROM student_answers sa
            JOIN questions q ON sa.question_id = q.id
            JOIN subjects s ON q.subject_id = s.id
            GROUP BY s.id, s.name, s.color
            ORDER BY accuracy DESC
        ");
        $subjectPerformance = $subjStmt->fetchAll();

        // 3. Class Performance
        $classStmt = $db->query("
            SELECT ac.name as class_name,
                   COUNT(ea.id) as attempts_count,
                   ROUND(AVG(ea.percentage), 1) as avg_score,
                   ROUND(SUM(CASE WHEN ea.passed = 1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(ea.id), 0), 1) as pass_rate
            FROM academic_classes ac
            LEFT JOIN users u ON u.class_id = ac.id AND u.role = 'student'
            LEFT JOIN exam_attempts ea ON ea.student_id = u.id AND ea.status = 'submitted'
            GROUP BY ac.id, ac.name, ac.order_no
            ORDER BY ac.order_no ASC
        ");
        $classPerformance = $classStmt->fetchAll();

        // 4. Recent Results
        $recentResults = $db->query("
            SELECT ea.id, ea.score, ea.percentage, ea.passed, ea.submitted_at,
                   u.full_name as student_name, u.login_id as student_login_id,
                   e.title as exam_title, ac.name as class_name
            FROM exam_attempts ea
            JOIN users u ON ea.student_id = u.id
            JOIN exams e ON ea.exam_id = e.id
            LEFT JOIN academic_classes ac ON u.class_id = ac.id
            WHERE ea.status = 'submitted'
            ORDER BY ea.submitted_at DESC
            LIMIT 6
        ")->fetchAll();

        // 5. Recent Activity Logs
        $recentLogs = $db->query("
            SELECT al.*, u.full_name as user_name
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.id DESC
            LIMIT 10
        ")->fetchAll();

        // 6. Exam participation trend (last 7 days or recent attempts)
        $trendStmt = $db->query("
            SELECT DATE(submitted_at) as attempt_date, COUNT(*) as count, ROUND(AVG(percentage), 1) as avg_score
            FROM exam_attempts
            WHERE status = 'submitted'
            GROUP BY DATE(submitted_at)
            ORDER BY attempt_date DESC
            LIMIT 7
        ");
        $participationTrend = array_reverse($trendStmt->fetchAll());

        Response::success([
            'metrics' => [
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_exams' => $totalExams,
                'active_exams' => $activeExams,
                'total_questions' => $totalQuestions,
                'total_attempts' => $totalAttempts,
                'avg_score' => $avgScore,
                'pass_percentage' => $passPercentage
            ],
            'subject_performance' => $subjectPerformance,
            'class_performance' => $classPerformance,
            'recent_results' => $recentResults,
            'recent_logs' => $recentLogs,
            'participation_trend' => $participationTrend
        ], 'Superadmin dashboard analytics retrieved.');
    }

    public function getTeacherDashboard(): void {
        $user = Auth::requireRole(['teacher', 'superadmin']);
        $db = Database::getConnection();

        $totalStudents = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn();
        
        $myQuestionsStmt = $db->prepare("SELECT COUNT(*) FROM questions WHERE created_by = ?");
        $myQuestionsStmt->execute([$user['id']]);
        $myQuestionsCount = (int)$myQuestionsStmt->fetchColumn();
        
        $myExamsStmt = $db->prepare("SELECT COUNT(*) FROM exams WHERE created_by = ?");
        $myExamsStmt->execute([$user['id']]);
        $myExamsCount = (int)$myExamsStmt->fetchColumn();

        $activeExamsStmt = $db->prepare("SELECT COUNT(*) FROM exams WHERE status = 'published' AND created_by = ?");
        $activeExamsStmt->execute([$user['id']]);
        $activeExams = (int)$activeExamsStmt->fetchColumn();

        // Recent exams created by this teacher
        $recentExamsStmt = $db->prepare("
            SELECT e.*, ac.name as class_name, s.name as subject_name, u.full_name as author_name,
                   (SELECT COUNT(*) FROM exam_attempts ea WHERE ea.exam_id = e.id) as attempts_count
            FROM exams e
            LEFT JOIN academic_classes ac ON e.class_id = ac.id
            LEFT JOIN subjects s ON e.subject_id = s.id
            LEFT JOIN users u ON e.created_by = u.id
            WHERE e.created_by = ?
            ORDER BY e.id DESC
            LIMIT 5
        ");
        $recentExamsStmt->execute([$user['id']]);
        $recentExams = $recentExamsStmt->fetchAll();

        // Recent results for exams created by this teacher
        $recentResultsStmt = $db->prepare("
            SELECT ea.id, ea.score, ea.percentage, ea.passed, ea.submitted_at,
                   u.full_name as student_name, e.title as exam_title, ac.name as class_name
            FROM exam_attempts ea
            JOIN users u ON ea.student_id = u.id
            JOIN exams e ON ea.exam_id = e.id
            LEFT JOIN academic_classes ac ON u.class_id = ac.id
            WHERE ea.status = 'submitted' AND (e.created_by = ? OR e.created_by = 1 OR e.created_by IS NULL OR e.exam_type IN ('practice', 'mock', 'generated'))
            ORDER BY ea.submitted_at DESC
            LIMIT 6
        ");
        $recentResultsStmt->execute([$user['id']]);
        $recentResults = $recentResultsStmt->fetchAll();

        // Subject Performance
        $subjStmt = $db->query("
            SELECT s.name as subject_name, s.color,
                   COUNT(sa.id) as answers_count,
                   SUM(CASE WHEN sa.is_correct = 1 THEN 1 ELSE 0 END) as correct_count,
                   ROUND(SUM(CASE WHEN sa.is_correct = 1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(sa.id), 0), 1) as accuracy
            FROM student_answers sa
            JOIN questions q ON sa.question_id = q.id
            JOIN subjects s ON q.subject_id = s.id
            GROUP BY s.id, s.name, s.color
            ORDER BY accuracy DESC
        ");
        $subjectPerformance = $subjStmt->fetchAll();

        Response::success([
            'metrics' => [
                'total_students' => $totalStudents,
                'total_exams' => $myExamsCount,
                'active_exams' => $activeExams,
                'question_bank_count' => $myQuestionsCount
            ],
            'recent_exams' => $recentExams,
            'recent_results' => $recentResults,
            'subject_performance' => $subjectPerformance
        ], 'Teacher dashboard data retrieved.');
    }

    public function getStudentDashboard(): void {
        $user = Auth::requireRole(['student', 'superadmin', 'teacher']);
        $db = Database::getConnection();
        $studentId = $user['id'];

        // Metrics
        $attStmt = $db->prepare("
            SELECT COUNT(*) as total_attempts,
                   SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) as total_passed,
                   AVG(percentage) as avg_percentage,
                   MAX(percentage) as best_score,
                   MIN(rank_exam) as best_rank
            FROM exam_attempts
            WHERE student_id = ? AND status = 'submitted'
        ");
        $attStmt->execute([$studentId]);
        $metricsRow = $attStmt->fetch();

        $totalAttempts = (int)($metricsRow['total_attempts'] ?? 0);
        $totalPassed = (int)($metricsRow['total_passed'] ?? 0);
        $avgScore = round((float)($metricsRow['avg_percentage'] ?? 0), 1);
        $bestScore = round((float)($metricsRow['best_score'] ?? 0), 1);
        $bestRank = $metricsRow['best_rank'] ? (int)$metricsRow['best_rank'] : null;

        // Total certificates count
        $certStmt = $db->prepare("SELECT COUNT(*) FROM certificates WHERE student_id = ? AND status = 'valid'");
        $certStmt->execute([$studentId]);
        $certCount = (int)$certStmt->fetchColumn();

        // Available exams count with strict class filter
        $availStmt = $db->prepare("
            SELECT COUNT(*) FROM exams e
            WHERE e.status = 'published' AND (
                e.class_id = ?
                OR (e.class_id IS NULL AND e.id IN (SELECT exam_id FROM exam_assignments WHERE target_type = 'all' OR (target_type = 'class' AND target_id = ?)))
                OR e.id IN (SELECT exam_id FROM exam_assignments WHERE target_type = 'individual' AND target_id = ?)
            )
        ");
        $availStmt->execute([$user['class_id'], $user['class_id'], $user['id']]);
        $availableExamsCount = (int)$availStmt->fetchColumn();

        // Recent attempts with complete fields
        $recentStmt = $db->prepare("
            SELECT ea.*, e.title as exam_title, e.exam_code, e.exam_type, e.total_marks as exam_total_marks,
                   u.full_name as student_name, u.login_id as student_login_id,
                   s.name as subject_name, s.code as subject_code,
                   c.certificate_number, c.id as certificate_id
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            JOIN users u ON ea.student_id = u.id
            LEFT JOIN subjects s ON e.subject_id = s.id
            LEFT JOIN certificates c ON ea.id = c.attempt_id
            WHERE ea.student_id = ? AND ea.status IN ('submitted', 'timed_out', 'terminated')
            ORDER BY ea.submitted_at DESC
            LIMIT 20
        ");
        $recentStmt->execute([$studentId]);
        $recentAttempts = $recentStmt->fetchAll();

        // Subject Progress for student
        $subjProgressStmt = $db->prepare("
            SELECT s.name as subject_name, s.color,
                   COUNT(sa.id) as total_answered,
                   SUM(CASE WHEN sa.is_correct = 1 THEN 1 ELSE 0 END) as correct_count,
                   ROUND(SUM(CASE WHEN sa.is_correct = 1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(sa.id), 0), 1) as accuracy
            FROM student_answers sa
            JOIN exam_attempts ea ON sa.attempt_id = ea.id
            JOIN questions q ON sa.question_id = q.id
            JOIN subjects s ON q.subject_id = s.id
            WHERE ea.student_id = ? AND ea.status IN ('submitted', 'timed_out', 'terminated')
            GROUP BY s.id, s.name, s.color
        ");
        $subjProgressStmt->execute([$studentId]);
        $subjectProgress = $subjProgressStmt->fetchAll();

        // Score History Trend (all submitted exams)
        $trendStmt = $db->prepare("
            SELECT ea.id, ea.percentage, ea.score, ea.total_questions, ea.submitted_at, e.title as exam_title
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            WHERE ea.student_id = ? AND ea.status IN ('submitted', 'timed_out', 'terminated')
            ORDER BY ea.submitted_at ASC
            LIMIT 20
        ");
        $trendStmt->execute([$studentId]);
        $scoreTrend = $trendStmt->fetchAll();

        Response::success([
            'metrics' => [
                'total_attempts' => $totalAttempts,
                'total_passed' => $totalPassed,
                'avg_score' => $avgScore,
                'best_score' => $bestScore,
                'best_rank' => $bestRank ?: 1,
                'certificates_count' => $certCount,
                'available_exams' => $availableExamsCount
            ],
            'recent_attempts' => $recentAttempts,
            'subject_progress' => $subjectProgress,
            'score_trend' => $scoreTrend
        ], 'Student dashboard analytics retrieved.');
    }

    public function getActivityLogs(): void {
        Auth::requireRole(['superadmin']);
        $db = Database::getConnection();

        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = max(10, min(100, (int)($_GET['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;

        $module = trim($_GET['module'] ?? '');
        $search = trim($_GET['search'] ?? '');

        $where = ["1=1"];
        $params = [];

        if ($module !== '') {
            $where[] = "al.module = ?";
            $params[] = $module;
        }

        if ($search !== '') {
            $where[] = "(al.action LIKE ? OR u.full_name LIKE ? OR al.ip_address LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $whereClause = implode(" AND ", $where);

        $cnt = $db->prepare("SELECT COUNT(*) FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id WHERE $whereClause");
        $cnt->execute($params);
        $total = (int)$cnt->fetchColumn();

        $stmt = $db->prepare("
            SELECT al.*, u.full_name as user_name, u.login_id
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE $whereClause
            ORDER BY al.id DESC
            LIMIT $limit OFFSET $offset
        ");
        $stmt->execute($params);
        $logs = $stmt->fetchAll();

        Response::success([
            'logs' => $logs,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'total_pages' => ceil($total / $limit)
            ]
        ], 'Activity logs retrieved.');
    }

    public function clearActivityLogs(): void {
        $user = Auth::requireRole(['superadmin']);
        $db = Database::getConnection();
        $db->exec("TRUNCATE TABLE activity_logs");
        Logger::log("Audit logs cleared", "Settings", [], $user['id'], 'superadmin');
        Response::success([], 'All activity logs cleared successfully.');
    }
}
