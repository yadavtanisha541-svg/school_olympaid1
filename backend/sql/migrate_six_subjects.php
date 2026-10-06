<?php
// OlympiadHub - Database Migration for 6 Core Subjects Only
// Exact subjects: Mathematics, Science, Digital Literacy, English, General Knowledge, Hindi

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

$db = Database::getConnection();

echo "Starting 6 Core Subjects Database Migration...\n";

// 1. Ensure columns exist on subjects table
try {
    $cols = $db->query("DESCRIBE subjects")->fetchAll(PDO::FETCH_COLUMN);
    $neededCols = [
        'full_name' => "VARCHAR(150) NULL AFTER name",
        'slug' => "VARCHAR(100) NULL AFTER code",
        'category' => "VARCHAR(80) DEFAULT 'STEM' AFTER color",
        'tagline' => "VARCHAR(255) NULL AFTER category",
        'description' => "TEXT NULL AFTER tagline",
        'quote' => "TEXT NULL AFTER description",
        'questions_count' => "INT DEFAULT 50 AFTER quote",
        'duration_minutes' => "INT DEFAULT 60 AFTER questions_count",
        'syllabus_overview' => "TEXT NULL AFTER duration_minutes"
    ];

    foreach ($neededCols as $col => $def) {
        if (!in_array($col, $cols)) {
            echo "Adding column {$col} to subjects table...\n";
            $db->exec("ALTER TABLE subjects ADD COLUMN {$col} {$def}");
        }
    }
} catch (Exception $e) {
    echo "Notice on schema check: " . $e->getMessage() . "\n";
}

// 2. Exact 6 Subjects Data Definition
$sixSubjects = [
    [
        'id' => 1,
        'name' => 'Mathematics',
        'full_name' => 'International Mathematics Olympiad',
        'code' => 'IMO',
        'slug' => 'math',
        'icon' => 'Calculator',
        'color' => '#ec4899',
        'category' => 'STEM',
        'tagline' => 'Classes 1 to 12 • 50 Questions • 60 Minutes',
        'description' => 'The premier national and international mathematical contest designed to challenge analytical thinking, spatial reasoning, and numerical precision.',
        'quote' => 'Mathematics is the language with which God has written the universe.',
        'questions_count' => 50,
        'duration_minutes' => 60,
        'syllabus_overview' => 'Number Sense, Computation Operations, Fractions & Decimals, Everyday Mathematics, Geometry & Mensuration, Achievers HOTS Section.',
        'status' => 'active'
    ],
    [
        'id' => 2,
        'name' => 'Science',
        'full_name' => 'International Science Olympiad',
        'code' => 'ISO',
        'slug' => 'science',
        'icon' => 'Atom',
        'color' => '#8b5cf6',
        'category' => 'STEM',
        'tagline' => 'Classes 1 to 12 • 50 Questions • 60 Minutes',
        'description' => 'A comprehensive science assessment evaluating physics, chemistry, biology, and scientific inquiry for young innovators and researchers.',
        'quote' => 'Curiosity is the engine of achievement and scientific breakthrough.',
        'questions_count' => 50,
        'duration_minutes' => 60,
        'syllabus_overview' => 'Physical Sciences & Mechanics, Chemical Substances & Reactions, Life Sciences & Ecology, Experimental Science & Achievers Hotspot.',
        'status' => 'active'
    ],
    [
        'id' => 3,
        'name' => 'Digital Literacy',
        'full_name' => 'International Digital Literacy Olympiad',
        'code' => 'IDLO',
        'slug' => 'digital-literacy',
        'icon' => 'Cpu',
        'color' => '#3b82f6',
        'category' => 'Computer & IT',
        'tagline' => 'Classes 1 to 12 • 50 Questions • 60 Minutes',
        'description' => 'Computational thinking, algorithms, modern AI awareness, cyber safety, coding fundamentals, and digital ethics for future technologists.',
        'quote' => 'Digital literacy and computational thinking are essential superpowers for modern innovators.',
        'questions_count' => 50,
        'duration_minutes' => 60,
        'syllabus_overview' => 'Computer Hardware & Networking, Algorithms & Computational Logic, Cybersecurity & Digital Ethics, AI Literacy & Emerging Tech.',
        'status' => 'active'
    ],
    [
        'id' => 4,
        'name' => 'English',
        'full_name' => 'International English Olympiad',
        'code' => 'IEO',
        'slug' => 'english',
        'icon' => 'BookOpen',
        'color' => '#06b6d4',
        'category' => 'Languages',
        'tagline' => 'Classes 1 to 12 • 50 Questions • 60 Minutes',
        'description' => 'An international benchmark assessment for English language proficiency, assessing grammar mastery, lexical depth, syntax, and verbal nuance.',
        'quote' => 'Every new word makes you smarter and broadens your perspective.',
        'questions_count' => 50,
        'duration_minutes' => 60,
        'syllabus_overview' => 'Word and Structure Knowledge, Reading Comprehension, Spoken & Written Expression, Achievers Verbal Aptitude.',
        'status' => 'active'
    ],
    [
        'id' => 5,
        'name' => 'General Knowledge',
        'full_name' => 'International General Knowledge Olympiad',
        'code' => 'IGKO',
        'slug' => 'gk',
        'icon' => 'Globe',
        'color' => '#f59e0b',
        'category' => 'General Awareness',
        'tagline' => 'Classes 1 to 12 • 50 Questions • 60 Minutes',
        'description' => 'Global benchmarking assessment evaluating world geography, history, scientific discoveries, sports, civics, and international current affairs.',
        'quote' => 'Knowledge is the greatest currency of modern leadership.',
        'questions_count' => 50,
        'duration_minutes' => 60,
        'syllabus_overview' => 'Our Environment & World, Science & Technology, India and the World, Social Studies & History, Current Affairs, Life Skills & Achievers Section.',
        'status' => 'active'
    ],
    [
        'id' => 6,
        'name' => 'Hindi',
        'full_name' => 'International Hindi Olympiad',
        'code' => 'IHO',
        'slug' => 'hindi',
        'icon' => 'Languages',
        'color' => '#10b981',
        'category' => 'Languages',
        'tagline' => 'Classes 1 to 12 • 50 Questions • 60 Minutes',
        'description' => 'Comprehensive assessment of Hindi grammar (Vyakaran), vocabulary (Shabd Bhandar), idioms (Muhavare), literature, and comprehension (Apatith Gadyansh).',
        'quote' => 'हिंदी हमारी संस्कृति और अभिव्यक्ति की अनमोल धरोहर है।',
        'questions_count' => 50,
        'duration_minutes' => 60,
        'syllabus_overview' => 'वर्ण विचार एवं वर्तनी, संज्ञा, सर्वनाम, विशेषण, क्रिया, काल, कारक, पर्यायवाची एवं विलोम शब्द, मुहावरे एवं लोकोक्तियाँ, अपठित गद्यांश, उच्च स्तरीय चिंतन (Achievers).',
        'status' => 'active'
    ]
];

// 3. Clean and reset subjects table to the exact 6 subjects
$db->exec("SET FOREIGN_KEY_CHECKS = 0;");

// Remove old subjects not in 1..6
$db->exec("DELETE FROM subjects WHERE id > 6 OR code NOT IN ('IMO', 'ISO', 'NSO', 'IDLO', 'ICSO', 'IEO', 'IGKO', 'IHO', 'HINDI')");
$db->exec("DELETE FROM class_subjects WHERE subject_id NOT IN (1, 2, 3, 4, 5, 6)");
$db->exec("DELETE FROM class_subject_content WHERE subject_id NOT IN (1, 2, 3, 4, 5, 6)");

// Upsert the 6 subjects
$upsertStmt = $db->prepare("
    INSERT INTO subjects (
        id, name, full_name, code, slug, icon, color, category, tagline, 
        description, quote, questions_count, duration_minutes, syllabus_overview, status
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?
    ) ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        full_name = VALUES(full_name),
        code = VALUES(code),
        slug = VALUES(slug),
        icon = VALUES(icon),
        color = VALUES(color),
        category = VALUES(category),
        tagline = VALUES(tagline),
        description = VALUES(description),
        quote = VALUES(quote),
        questions_count = VALUES(questions_count),
        duration_minutes = VALUES(duration_minutes),
        syllabus_overview = VALUES(syllabus_overview),
        status = VALUES(status)
");

foreach ($sixSubjects as $sub) {
    $upsertStmt->execute([
        $sub['id'],
        $sub['name'],
        $sub['full_name'],
        $sub['code'],
        $sub['slug'],
        $sub['icon'],
        $sub['color'],
        $sub['category'],
        $sub['tagline'],
        $sub['description'],
        $sub['quote'],
        $sub['questions_count'],
        $sub['duration_minutes'],
        $sub['syllabus_overview'],
        $sub['status']
    ]);
    echo "Saved subject [{$sub['id']}] {$sub['name']} ({$sub['code']})\n";
}

// 4. Map the 6 subjects to all academic classes
$classes = $db->query("SELECT id, name FROM academic_classes ORDER BY order_no ASC")->fetchAll(PDO::FETCH_ASSOC);
$linkStmt = $db->prepare("INSERT IGNORE INTO class_subjects (class_id, subject_id, status) VALUES (?, ?, 'active')");

foreach ($classes as $cls) {
    for ($sId = 1; $sId <= 6; $sId++) {
        $linkStmt->execute([$cls['id'], $sId]);
    }
}
echo "Mapped all 6 subjects to " . count($classes) . " academic classes.\n";

// 5. Seed sample questions for all 6 subjects if needed
$sampleQuestions = [
    // Subject 1: Math
    [
        'class_id' => 10, 'subject_id' => 1,
        'question_text' => 'If the roots of the quadratic equation px² + qx + r = 0 are real and equal, which relation holds true?',
        'option_a' => 'q² = 4pr', 'option_b' => 'q² > 4pr', 'option_c' => 'q² < 4pr', 'option_d' => 'q = 2pr',
        'correct_option' => 'A', 'difficulty' => 'easy', 'marks' => 1.00,
        'explanation' => 'For equal real roots, Discriminant D = b² - 4ac = q² - 4pr = 0 => q² = 4pr.'
    ],
    // Subject 2: Science
    [
        'class_id' => 10, 'subject_id' => 2,
        'question_text' => 'Which gas is released when dilute hydrochloric acid reacts with active metals like zinc?',
        'option_a' => 'Oxygen gas', 'option_b' => 'Hydrogen gas', 'option_c' => 'Carbon dioxide', 'option_d' => 'Nitrogen gas',
        'correct_option' => 'B', 'difficulty' => 'easy', 'marks' => 1.00,
        'explanation' => 'Zn + 2HCl → ZnCl₂ + H₂ (Hydrogen gas burns with a pop sound).'
    ],
    // Subject 3: Digital Literacy
    [
        'class_id' => 10, 'subject_id' => 3,
        'question_text' => 'What type of cyber attack involves tricking users into revealing sensitive credentials via fake emails or websites?',
        'option_a' => 'DDoS Attack', 'option_b' => 'Phishing', 'option_c' => 'Trojan Horse', 'option_d' => 'SQL Injection',
        'correct_option' => 'B', 'difficulty' => 'easy', 'marks' => 1.00,
        'explanation' => 'Phishing is a social engineering attack that deceives victims into providing confidential passwords or PINs.'
    ],
    // Subject 4: English
    [
        'class_id' => 10, 'subject_id' => 4,
        'question_text' => 'Identify the correct passive voice of: "The chef prepared a delectable dessert."',
        'option_a' => 'A delectable dessert is prepared by the chef.',
        'option_b' => 'A delectable dessert was prepared by the chef.',
        'option_c' => 'A delectable dessert had been prepared by the chef.',
        'option_d' => 'A delectable dessert will be prepared by the chef.',
        'correct_option' => 'B', 'difficulty' => 'easy', 'marks' => 1.00,
        'explanation' => 'Past simple passive structure is: object + was/were + past participle.'
    ],
    // Subject 5: General Knowledge
    [
        'class_id' => 10, 'subject_id' => 5,
        'question_text' => 'Which space agency successfully landed the Chandrayaan-3 lander near the lunar south pole in 2023?',
        'option_a' => 'NASA', 'option_b' => 'ISRO', 'option_c' => 'ESA', 'option_d' => 'JAXA',
        'correct_option' => 'B', 'difficulty' => 'easy', 'marks' => 1.00,
        'explanation' => 'ISRO (Indian Space Research Organisation) achieved the historic soft landing of Chandrayaan-3 on August 23, 2023.'
    ],
    // Subject 6: Hindi
    [
        'class_id' => 10, 'subject_id' => 6,
        'question_text' => 'निम्नलिखित में से "सूर्य" शब्द का उचित पर्यायवाची शब्द कौन सा है?',
        'option_a' => 'दिनकर', 'option_b' => 'निशाकर', 'option_c' => 'जलद', 'option_d' => 'पयोधि',
        'correct_option' => 'A', 'difficulty' => 'easy', 'marks' => 1.00,
        'explanation' => 'सूर्य के प्रमुख पर्यायवाची शब्द दिनकर, रवि, भास्कर, भानु, दिवाकर हैं। निशाकर चंद्रमा का पर्यायवाची है।'
    ]
];

$insQ = $db->prepare("
    INSERT INTO questions (
        class_id, subject_id, question_text,
        option_a, option_b, option_c, option_d, correct_option, explanation,
        difficulty, marks, negative_marks, status, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.00, 'active', 1)
");

foreach ($sampleQuestions as $q) {
    $chk = $db->prepare("SELECT id FROM questions WHERE question_text = ?");
    $chk->execute([$q['question_text']]);
    if (!$chk->fetch()) {
        $insQ->execute([
            $q['class_id'], $q['subject_id'], $q['question_text'],
            $q['option_a'], $q['option_b'], $q['option_c'], $q['option_d'],
            $q['correct_option'], $q['explanation'], $q['difficulty'], $q['marks']
        ]);
    }
}

$db->exec("SET FOREIGN_KEY_CHECKS = 1;");

echo "Migration completed successfully! Exact 6 subjects are active in MySQL database.\n";
