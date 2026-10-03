<?php
require_once __DIR__ . '/../config/Database.php';
$db = App\Config\Database::getConnection();

echo "=== USERS ===\n";
$users = $db->query("SELECT id, full_name, login_id, role, class_id FROM users WHERE role='student'")->fetchAll(PDO::FETCH_ASSOC);
print_r($users);

echo "=== EXAM ATTEMPTS ===\n";
$attempts = $db->query("
    SELECT ea.id, ea.student_id, u.full_name as student_name, u.login_id, ea.exam_id, e.title, ea.score, ea.percentage, ea.status, ea.submitted_at 
    FROM exam_attempts ea 
    JOIN users u ON ea.student_id = u.id 
    JOIN exams e ON ea.exam_id = e.id 
    ORDER BY ea.id DESC
")->fetchAll(PDO::FETCH_ASSOC);
print_r($attempts);
