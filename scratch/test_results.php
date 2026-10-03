<?php
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../backend/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) return;
    $relativeClass = substr($class, $len);
    $parts = explode('\\', $relativeClass);
    if (count($parts) > 1) {
        $parts[0] = strtolower($parts[0]);
    }
    $file = $baseDir . implode('/', $parts) . '.php';
    if (file_exists($file)) require_once $file;
});

use App\Config\Database;

$db = Database::getConnection();
$attempts = $db->query("
    SELECT ea.id, ea.exam_id, ea.student_id, ea.score, ea.percentage, ea.passed, ea.status,
           u.full_name as student_name, e.title as exam_title, e.created_by as exam_created_by
    FROM exam_attempts ea
    JOIN exams e ON ea.exam_id = e.id
    JOIN users u ON ea.student_id = u.id
    ORDER BY ea.id DESC
")->fetchAll();

echo "TOTAL ATTEMPTS: " . count($attempts) . "\n";
foreach ($attempts as $a) {
    echo "Attempt ID {$a['id']} | Student: {$a['student_name']} | Exam: {$a['exam_title']} | Score: {$a['score']} ({$a['percentage']}%) | Status: {$a['status']}\n";
}
