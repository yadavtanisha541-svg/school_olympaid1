<?php
require_once __DIR__ . '/config/database.php';
$db = \App\Config\Database::getConnection();

echo "=== EXAM ATTEMPTS ===\n";
$attempts = $db->query('
    SELECT ea.*, u.full_name as student_name, e.title as exam_title, e.created_by as exam_created_by
    FROM exam_attempts ea
    LEFT JOIN users u ON ea.student_id = u.id
    LEFT JOIN exams e ON ea.exam_id = e.id
')->fetchAll(PDO::FETCH_ASSOC);
print_r($attempts);
