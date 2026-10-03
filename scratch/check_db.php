<?php
$pdo = new PDO("mysql:host=127.0.0.1;dbname=olympiadhub", "root", "");
$exams = $pdo->query("SELECT id, title, exam_code, class_id, status FROM exams")->fetchAll(PDO::FETCH_ASSOC);
echo "EXAMS IN DB:\n";
print_r($exams);

$students = $pdo->query("SELECT id, login_id, class_id FROM users WHERE role = 'student'")->fetchAll(PDO::FETCH_ASSOC);
echo "STUDENTS IN DB:\n";
print_r($students);

$questions = $pdo->query("SELECT id, question_text, class_id FROM questions")->fetchAll(PDO::FETCH_ASSOC);
echo "QUESTIONS IN DB:\n";
print_r($questions);
