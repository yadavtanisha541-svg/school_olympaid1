<?php
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = dirname(__DIR__) . '/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) return;
    $relativeClass = substr($class, $len);
    $parts = explode('\\', $relativeClass);
    if (count($parts) > 1) $parts[0] = strtolower($parts[0]);
    $file = $baseDir . implode('/', $parts) . '.php';
    if (file_exists($file)) require_once $file;
});

use App\Config\Database;
use App\Helpers\Auth;

$db = Database::getConnection();

echo "Seeding users password hashes...\n";
$hash = Auth::hashPassword('Admin@123');
$teacherHash = Auth::hashPassword('Teacher@123');
$studentHash = Auth::hashPassword('Student@123');

$db->prepare("UPDATE users SET password_hash = ? WHERE login_id = 'ADMIN001'")->execute([$hash]);
$db->prepare("UPDATE users SET password_hash = ? WHERE login_id IN ('TCH101', 'TCH102')")->execute([$teacherHash]);
$db->prepare("UPDATE users SET password_hash = ? WHERE login_id IN ('STU1001', 'STU1002', 'STU1003', 'STU1004')")->execute([$studentHash]);

echo "Seeding comprehensive Question Bank...\n";
$questions = [
    // Class 10 Math
    [
        'class_id' => 10, 'subject_id' => 1, 'chapter_id' => 10, 'topic_id' => 6,
        'question_text' => 'If the HCF of 65 and 117 is expressible in the form 65m - 117, then what is the value of m?',
        'option_a' => '4', 'option_b' => '2', 'option_c' => '1', 'option_d' => '3',
        'correct_option' => 'B', 'difficulty' => 'medium', 'marks' => 2.00, 'negative_marks' => 0.50,
        'explanation' => 'HCF of 65 and 117 is 13. Given 65m - 117 = 13 => 65m = 130 => m = 2.'
    ],
    [
        'class_id' => 10, 'subject_id' => 1, 'chapter_id' => 11, 'topic_id' => 7,
        'question_text' => 'For what value of k will the quadratic equation 2x² + kx + 3 = 0 have two equal real roots?',
        'option_a' => '± 2√6', 'option_b' => '± √6', 'option_c' => '± 4√6', 'option_d' => '± 2',
        'correct_option' => 'A', 'difficulty' => 'medium', 'marks' => 2.00, 'negative_marks' => 0.50,
        'explanation' => 'For equal roots, Discriminant D = b² - 4ac = 0 => k² - 4(2)(3) = 0 => k² = 24 => k = ± 2√6.'
    ],
    [
        'class_id' => 10, 'subject_id' => 1, 'chapter_id' => 12, 'topic_id' => 8,
        'question_text' => 'If sin θ + sin² θ = 1, then the value of the expression (cos² θ + cos⁴ θ) is equal to:',
        'option_a' => '0', 'option_b' => '1', 'option_c' => '2', 'option_d' => '1/2',
        'correct_option' => 'B', 'difficulty' => 'hard', 'marks' => 3.00, 'negative_marks' => 0.75,
        'explanation' => 'sin θ = 1 - sin² θ = cos² θ. Therefore, cos² θ + cos⁴ θ = sin θ + sin² θ = 1.'
    ],
    [
        'class_id' => 10, 'subject_id' => 1, 'chapter_id' => 10, 'topic_id' => 6,
        'question_text' => 'The decimal expansion of the rational number 14587 / 1250 will terminate after how many decimal places?',
        'option_a' => 'One', 'option_b' => 'Two', 'option_c' => 'Three', 'option_d' => 'Four',
        'correct_option' => 'D', 'difficulty' => 'easy', 'marks' => 1.00, 'negative_marks' => 0.25,
        'explanation' => 'Denominator 1250 = 2¹ × 5⁴. Highest power of 2 or 5 is 4, so it terminates after 4 decimal places.'
    ],
    [
        'class_id' => 10, 'subject_id' => 1, 'chapter_id' => 12, 'topic_id' => 8,
        'question_text' => 'Evaluate: (sec A + tan A)(1 - sin A)',
        'option_a' => 'sec A', 'option_b' => 'sin A', 'option_c' => 'cosec A', 'option_d' => 'cos A',
        'correct_option' => 'D', 'difficulty' => 'medium', 'marks' => 2.00, 'negative_marks' => 0.50,
        'explanation' => '(1/cos A + sin A/cos A)(1 - sin A) = ((1 + sin A)(1 - sin A))/cos A = cos² A / cos A = cos A.'
    ],

    // Class 10 Science
    [
        'class_id' => 10, 'subject_id' => 2, 'chapter_id' => 13, 'topic_id' => 9,
        'question_text' => 'When Lead Nitrate powder is heated in a boiling tube, brown fumes are evolved. These brown fumes belong to which gas?',
        'option_a' => 'Lead Oxide', 'option_b' => 'Nitrogen Dioxide (NO₂)', 'option_c' => 'Oxygen (O₂)', 'option_d' => 'Nitric Oxide (NO)',
        'correct_option' => 'B', 'difficulty' => 'easy', 'marks' => 1.00, 'negative_marks' => 0.25,
        'explanation' => '2Pb(NO₃)₂ → 2PbO + 4NO₂ (brown fumes) + O₂.'
    ],
    [
        'class_id' => 10, 'subject_id' => 2, 'chapter_id' => 14, 'topic_id' => 10,
        'question_text' => 'A convex lens produces a magnification of -1 on a screen placed at a distance of 40 cm from the lens. What is its focal length?',
        'option_a' => '+10 cm', 'option_b' => '+20 cm', 'option_c' => '+40 cm', 'option_d' => '-20 cm',
        'correct_option' => 'B', 'difficulty' => 'hard', 'marks' => 3.00, 'negative_marks' => 0.75,
        'explanation' => 'm = -1 means object is at 2F and image is at 2F = 40 cm. Focal length f = 40 / 2 = +20 cm.'
    ],
    [
        'class_id' => 10, 'subject_id' => 2, 'chapter_id' => 15, 'topic_id' => 5,
        'question_text' => 'The kidneys in human beings are a part of the system for which physiological function?',
        'option_a' => 'Nutrition', 'option_b' => 'Respiration', 'option_c' => 'Excretion', 'option_d' => 'Transportation',
        'correct_option' => 'C', 'difficulty' => 'easy', 'marks' => 1.00, 'negative_marks' => 0.00,
        'explanation' => 'Kidneys filter nitrogenous wastes like urea from the bloodstream, constituting the human Excretory System.'
    ],
    [
        'class_id' => 10, 'subject_id' => 2, 'chapter_id' => 13, 'topic_id' => 9,
        'question_text' => 'Which of the following undergoes reduction in the reaction: CuO + H₂ → Cu + H₂O?',
        'option_a' => 'H₂', 'option_b' => 'Cu', 'option_c' => 'CuO', 'option_d' => 'H₂O',
        'correct_option' => 'C', 'difficulty' => 'medium', 'marks' => 2.00, 'negative_marks' => 0.50,
        'explanation' => 'CuO loses oxygen to form Cu, hence Copper(II) Oxide (CuO) is reduced.'
    ],

    // Class 10 Computer Science
    [
        'class_id' => 10, 'subject_id' => 5, 'chapter_id' => 16, 'topic_id' => 11,
        'question_text' => 'What is the output of the Python expression: print(3 * "Oly" + "Hub"[:2])?',
        'option_a' => 'OlyOlyOlyHu', 'option_b' => 'OlyOlyOlyHub', 'option_c' => '9OlyHu', 'option_d' => 'SyntaxError',
        'correct_option' => 'A', 'difficulty' => 'easy', 'marks' => 1.00, 'negative_marks' => 0.25,
        'explanation' => '3 * "Oly" results in "OlyOlyOly". "Hub"[:2] slices the first 2 characters "Hu". Concatenation gives "OlyOlyOlyHu".'
    ],
    [
        'class_id' => 10, 'subject_id' => 5, 'chapter_id' => 16, 'topic_id' => 11,
        'question_text' => 'Which data structure in Python is immutable and defined using round parentheses ()?',
        'option_a' => 'List', 'option_b' => 'Dictionary', 'option_c' => 'Tuple', 'option_d' => 'Set',
        'correct_option' => 'C', 'difficulty' => 'easy', 'marks' => 1.00, 'negative_marks' => 0.00,
        'explanation' => 'Tuples are immutable sequence types in Python represented with parentheses (e.g. (1, 2, 3)).'
    ],

    // English & GK
    [
        'class_id' => 10, 'subject_id' => 3, 'chapter_id' => NULL, 'topic_id' => NULL,
        'question_text' => 'Choose the correct synonym for the word "METICULOUS":',
        'option_a' => 'Careless', 'option_b' => 'Painstakingly precise', 'option_c' => 'Rapid', 'option_d' => 'Hesitant',
        'correct_option' => 'B', 'difficulty' => 'easy', 'marks' => 1.00, 'negative_marks' => 0.25,
        'explanation' => 'Meticulous means showing great attention to detail; very careful and precise.'
    ],
    [
        'class_id' => 10, 'subject_id' => 4, 'chapter_id' => NULL, 'topic_id' => NULL,
        'question_text' => 'Which international organization awards the prestigious Fields Medal in Mathematics every 4 years?',
        'option_a' => 'UNESCO', 'option_b' => 'International Mathematical Union (IMU)', 'option_c' => 'Royal Society', 'option_d' => 'Nobel Foundation',
        'correct_option' => 'B', 'difficulty' => 'medium', 'marks' => 1.00, 'negative_marks' => 0.25,
        'explanation' => 'The Fields Medal is awarded by the International Mathematical Union (IMU) to mathematicians under 40 years of age.'
    ]
];

$insQ = $db->prepare("
    INSERT INTO questions (
        class_id, subject_id, chapter_id, topic_id, question_text,
        option_a, option_b, option_c, option_d, correct_option, explanation,
        difficulty, marks, negative_marks, status, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 1)
");

foreach ($questions as $q) {
    // Check if exists
    $chk = $db->prepare("SELECT id FROM questions WHERE question_text = ?");
    $chk->execute([$q['question_text']]);
    if (!$chk->fetch()) {
        $insQ->execute([
            $q['class_id'], $q['subject_id'], $q['chapter_id'], $q['topic_id'],
            $q['question_text'], $q['option_a'], $q['option_b'], $q['option_c'], $q['option_d'],
            $q['correct_option'], $q['explanation'], $q['difficulty'], $q['marks'], $q['negative_marks']
        ]);
    }
}

echo "Seeding Exams...\n";
$exams = [
    [
        'title' => 'National Mathematics & Science Grand Olympiad 2026',
        'exam_code' => 'NMSO-2026-X1',
        'exam_type' => 'mock',
        'description' => 'Comprehensive national mock olympiad covering Class 10 advanced Mathematics, Physics, Chemistry, and Logic.',
        'instructions' => '1. The exam contains 10 objective MCQ questions.\n2. Each question has 4 options with only ONE correct answer.\n3. Negative marking of 0.25 to 0.75 applies for incorrect answers.\n4. Switching browser tabs will issue a security warning. Exceeding 3 warnings terminates the exam.',
        'class_id' => 10, 'subject_id' => 1, 'duration_minutes' => 45, 'passing_percentage' => 50.00,
        'negative_marking' => 1, 'attempt_limit' => 2, 'certificate_eligibility' => 1, 'min_certificate_percentage' => 60.00
    ],
    [
        'title' => 'Class 10 All India Science Talent Challenge',
        'exam_code' => 'NSTO-2026-SCI',
        'exam_type' => 'practice',
        'description' => 'Practice test covering chemical equations, optics, human physiology and mechanics.',
        'instructions' => 'Practice without time pressure. Solutions and explanations will be unlocked immediately after submission.',
        'class_id' => 10, 'subject_id' => 2, 'duration_minutes' => 30, 'passing_percentage' => 40.00,
        'negative_marking' => 0, 'attempt_limit' => 5, 'certificate_eligibility' => 1, 'min_certificate_percentage' => 50.00
    ],
    [
        'title' => 'Cyber & Computer Science Logic Quest',
        'exam_code' => 'CS-QUEST-10',
        'exam_type' => 'free_trial',
        'description' => 'Free trial exam on algorithmic problem solving, Python programming fundamentals and web logic.',
        'instructions' => 'Open trial challenge for all registered students.',
        'class_id' => 10, 'subject_id' => 5, 'duration_minutes' => 20, 'passing_percentage' => 40.00,
        'negative_marking' => 1, 'attempt_limit' => 3, 'certificate_eligibility' => 1, 'min_certificate_percentage' => 70.00
    ]
];

$insExam = $db->prepare("
    INSERT INTO exams (
        title, exam_code, exam_type, description, instructions, class_id, subject_id,
        duration_minutes, passing_percentage, negative_marking, attempt_limit,
        result_visibility, solution_visibility, certificate_eligibility, min_certificate_percentage,
        randomize_questions, shuffle_options, tab_switch_limit, status, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'immediate', 'after_result', ?, ?, 1, 1, 3, 'published', 1)
");

foreach ($exams as $ex) {
    $chk = $db->prepare("SELECT id FROM exams WHERE exam_code = ?");
    $chk->execute([$ex['exam_code']]);
    $exist = $chk->fetch();
    if (!$exist) {
        $insExam->execute([
            $ex['title'], $ex['exam_code'], $ex['exam_type'], $ex['description'], $ex['instructions'],
            $ex['class_id'], $ex['subject_id'], $ex['duration_minutes'], $ex['passing_percentage'],
            $ex['negative_marking'], $ex['attempt_limit'], $ex['certificate_eligibility'], $ex['min_certificate_percentage']
        ]);
        $examId = (int)$db->lastInsertId();

        // Attach questions to exam
        $allQ = $db->query("SELECT id, marks, negative_marks FROM questions WHERE class_id = {$ex['class_id']} LIMIT 8")->fetchAll();
        $qMap = $db->prepare("INSERT INTO exam_questions (exam_id, question_id, question_order, marks, negative_marks) VALUES (?, ?, ?, ?, ?)");
        $totMarks = 0;
        foreach ($allQ as $idx => $q) {
            $qMap->execute([$examId, $q['id'], $idx + 1, $q['marks'], $q['negative_marks']]);
            $totMarks += (float)$q['marks'];
        }

        $db->prepare("UPDATE exams SET total_questions = ?, total_marks = ? WHERE id = ?")->execute([count($allQ), $totMarks, $examId]);
        $db->prepare("INSERT INTO exam_assignments (exam_id, target_type) VALUES (?, 'all')")->execute([$examId]);
    }
}

echo "Seeding realistic completed student attempts & certificates...\n";
// Let's seed an attempt for STU1001 (Aarav Mehta) and STU1002 (Priya Deshmukh)
$examRow = $db->query("SELECT id, total_questions, total_marks FROM exams WHERE exam_code = 'NMSO-2026-X1'")->fetch();
if ($examRow) {
    $examId = (int)$examRow['id'];
    $stu1 = 4; // Aarav
    $stu2 = 5; // Priya

    // Fetch exam questions
    $eqs = $db->query("SELECT q.id, q.correct_option, q.marks, q.negative_marks FROM exam_questions eq JOIN questions q ON eq.question_id = q.id WHERE eq.exam_id = $examId")->fetchAll();

    if (!empty($eqs)) {
        // Aarav's Attempt (High score: 90%)
        $chkAtt = $db->prepare("SELECT id FROM exam_attempts WHERE exam_id = ? AND student_id = ?");
        $chkAtt->execute([$examId, $stu1]);
        if (!$chkAtt->fetch()) {
            $startTime = date('Y-m-d 10:00:00', strtotime('-2 days'));
            $submitTime = date('Y-m-d 10:28:15', strtotime('-2 days'));
            $timeSpent = 1695;

            $insAtt = $db->prepare("
                INSERT INTO exam_attempts (
                    exam_id, student_id, attempt_number, start_time, expected_end_time, submitted_at,
                    time_spent_seconds, total_questions, status, ip_address
                ) VALUES (?, ?, 1, ?, ?, ?, ?, ?, 'in_progress', '127.0.0.1')
            ");
            $insAtt->execute([$examId, $stu1, $startTime, date('Y-m-d 10:45:00', strtotime('-2 days')), $submitTime, $timeSpent, count($eqs)]);
            $attId = (int)$db->lastInsertId();

            $saIns = $db->prepare("INSERT INTO student_answers (attempt_id, question_id, selected_option, is_visited) VALUES (?, ?, ?, 1)");
            foreach ($eqs as $idx => $q) {
                // Aarav answers almost all correctly
                $opt = ($idx === 2) ? 'C' : $q['correct_option']; // 1 wrong
                $saIns->execute([$attId, $q['id'], $opt]);
            }

            require_once __DIR__ . '/../controllers/ExamEngineController.php';
            $engine = new App\Controllers\ExamEngineController();
            $engine->finalizeAttempt($attId, 'submitted');
        }

        // Priya's Attempt (Top score: 100%)
        $chkAtt->execute([$examId, $stu2]);
        if (!$chkAtt->fetch()) {
            $startTime = date('Y-m-d 11:00:00', strtotime('-1 days'));
            $submitTime = date('Y-m-d 11:22:40', strtotime('-1 days'));
            $timeSpent = 1360;

            $insAtt = $db->prepare("
                INSERT INTO exam_attempts (
                    exam_id, student_id, attempt_number, start_time, expected_end_time, submitted_at,
                    time_spent_seconds, total_questions, status, ip_address
                ) VALUES (?, ?, 1, ?, ?, ?, ?, ?, 'in_progress', '127.0.0.1')
            ");
            $insAtt->execute([$examId, $stu2, $startTime, date('Y-m-d 11:45:00', strtotime('-1 days')), $submitTime, $timeSpent, count($eqs)]);
            $attId = (int)$db->lastInsertId();

            $saIns = $db->prepare("INSERT INTO student_answers (attempt_id, question_id, selected_option, is_visited) VALUES (?, ?, ?, 1)");
            foreach ($eqs as $q) {
                $saIns->execute([$attId, $q['id'], $q['correct_option']]); // All correct
            }

            require_once __DIR__ . '/../controllers/ExamEngineController.php';
            $engine = new App\Controllers\ExamEngineController();
            $engine->finalizeAttempt($attId, 'submitted');
        }
    }
}

echo "Database successfully seeded with realistic questions, exams, student attempts, rankings, and certificates!\n";
