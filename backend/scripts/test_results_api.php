<?php
require_once __DIR__ . '/../config/Database.php';
$db = App\Config\Database::getConnection();

// Let's test the exact query from ResultController
$where = ["ea.status IN ('submitted', 'timed_out', 'terminated')"];
$params = [];

$whereClause = implode(" AND ", $where);
$sql = "
    SELECT ea.id, ea.exam_id, ea.student_id, ea.score, ea.percentage, ea.passed,
           ea.submitted_at, ea.start_time, ea.rank_exam, ea.status, ea.time_spent_seconds,
           ea.correct_count, ea.wrong_count, ea.unanswered_count,
           u.full_name as student_name, u.login_id as student_login_id,
           e.title as exam_title, e.exam_code, e.exam_type, e.total_marks as exam_total_marks, e.total_marks, e.passing_percentage,
           e.created_by as exam_created_by, tu.full_name as teacher_author_name,
           COALESCE(ac_user.name, ac_exam.name, 'Class 6') as class_name,
           s.name as subject_name, s.code as subject_code
    FROM exam_attempts ea
    JOIN exams e ON ea.exam_id = e.id
    JOIN users u ON ea.student_id = u.id
    LEFT JOIN users tu ON e.created_by = tu.id
    LEFT JOIN academic_classes ac_user ON u.class_id = ac_user.id
    LEFT JOIN academic_classes ac_exam ON e.class_id = ac_exam.id
    LEFT JOIN subjects s ON e.subject_id = s.id
    WHERE $whereClause
    ORDER BY ea.submitted_at DESC, ea.id DESC
";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Total rows returned without student filter: " . count($rows) . "\n";
foreach ($rows as $r) {
    echo "ID: {$r['id']} | Student: {$r['student_name']} ({$r['student_login_id']}) | Exam: {$r['exam_title']} | Score: {$r['score']} | Pct: {$r['percentage']}%\n";
}
