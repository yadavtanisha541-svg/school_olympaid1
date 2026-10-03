<?php
$pdo = new PDO("mysql:host=127.0.0.1;dbname=olympiadhub", "root", "");

// Create Published Exam for Class 1
$stmt = $pdo->prepare("
    INSERT INTO exams (
        title, exam_code, exam_type, description, instructions,
        class_id, subject_id, duration_minutes, total_questions, total_marks,
        passing_percentage, negative_marking, default_negative_marks, attempt_limit,
        status, created_by, created_at
    ) VALUES (
        'Class 1 Computer Science Live Olympiad 2026', 'OLY-2026-CS1', 'mock',
        'National Computer Science Olympiad for Class 1 Students',
        'Read each question carefully. 60 minutes time limit.',
        1, 1, 60, 1, 1.0, 40.0, 1, 0.25, 3, 'published', 1, NOW()
    )
");
$stmt->execute();
$examId = $pdo->lastInsertId();

// Link question 4 to this exam
$stmt2 = $pdo->prepare("INSERT INTO exam_questions (exam_id, question_id, question_order, marks, negative_marks) VALUES (?, 4, 1, 1.0, 0.25)");
$stmt2->execute([$examId]);

echo "SUCCESS: Created Exam ID $examId with Question #4 for Class 1!\n";
