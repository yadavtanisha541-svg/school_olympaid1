<?php
require_once __DIR__ . '/../config/Database.php';
$db = App\Config\Database::getConnection();
$stmt = $db->query("SELECT id, class_name, subject, question_text, option_a, option_b, option_c, option_d, correct_option, status FROM free_quizzes");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows, JSON_PRETTY_PRINT);
