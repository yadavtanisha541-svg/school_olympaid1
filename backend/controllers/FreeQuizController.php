<?php
// OlympiadHub - FREE Quizzes & Fun-Zone Questions Controller
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Response;
use App\Helpers\Auth;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;

class FreeQuizController {

    /**
     * Ensure database table exists and seed initial data
     */
    private function ensureTable(PDO $db): void {
        $db->exec("
            CREATE TABLE IF NOT EXISTS free_quizzes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                class_name VARCHAR(50) NOT NULL DEFAULT 'All',
                subject VARCHAR(100) NOT NULL DEFAULT 'Mathematics (IMO)',
                subject_code VARCHAR(30) NOT NULL DEFAULT 'IMO',
                question_text TEXT NOT NULL,
                option_a TEXT NOT NULL,
                option_b TEXT NOT NULL,
                option_c TEXT NOT NULL,
                option_d TEXT NOT NULL,
                correct_option INT NOT NULL DEFAULT 0,
                hint TEXT NULL,
                explanation TEXT NULL,
                difficulty VARCHAR(50) DEFAULT 'Foundation',
                points INT DEFAULT 10,
                status ENUM('active', 'inactive') DEFAULT 'active',
                order_num INT DEFAULT 0,
                created_by INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        // Check if table is empty; if so, seed initial quiz questions
        $cnt = (int)$db->query("SELECT COUNT(*) FROM free_quizzes")->fetchColumn();
        if ($cnt === 0) {
            $this->seedInitialQuizzes($db);
        }
    }

    /**
     * Seed initial curated Free Quiz questions
     */
    private function seedInitialQuizzes(PDO $db): void {
        $seeds = [
            // Math
            [
                'class_name' => 'All',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'Which geometric shape has 3 sides and the sum of its interior angles is always 180°?',
                'option_a' => 'Square',
                'option_b' => 'Triangle',
                'option_c' => 'Hexagon',
                'option_d' => 'Circle',
                'correct_option' => 1,
                'hint' => 'Think of equilateral, isosceles, and scalene shapes.',
                'explanation' => 'A triangle always has 3 straight sides and interior angles adding up to 180°.',
                'difficulty' => 'Foundation'
            ],
            [
                'class_name' => 'All',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'Complete the pattern: 2, 6, 12, 20, 30, ___ ?',
                'option_a' => '38',
                'option_b' => '40',
                'option_c' => '42',
                'option_d' => '44',
                'correct_option' => 2,
                'hint' => 'Differences between consecutive terms are +4, +6, +8, +10, +12.',
                'explanation' => '30 + 12 = 42. (Pattern is 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42).',
                'difficulty' => 'Intermediate'
            ],
            [
                'class_name' => 'Class 1',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'What is the sum of 14 + 18?',
                'option_a' => '28',
                'option_b' => '32',
                'option_c' => '30',
                'option_d' => '34',
                'correct_option' => 1,
                'hint' => '14 + 18 = (14 + 10) + 8 = 24 + 8.',
                'explanation' => '14 + 18 = 32.',
                'difficulty' => 'Foundation'
            ],
            [
                'class_name' => 'Class 6',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'If a pizza is divided into 8 equal slices and Rohan ate 3 slices, what fraction remains?',
                'option_a' => '3/8',
                'option_b' => '5/8',
                'option_c' => '1/2',
                'option_d' => '1/4',
                'correct_option' => 1,
                'hint' => 'Total is 8/8. Subtract 3/8 from 8/8.',
                'explanation' => '8/8 - 3/8 = 5/8 remaining.',
                'difficulty' => 'Foundation'
            ],

            // Science
            [
                'class_name' => 'All',
                'subject' => 'Science (NSO)',
                'subject_code' => 'NSO',
                'question_text' => 'Which planet is known as the "Red Planet" in our Solar System?',
                'option_a' => 'Venus',
                'option_b' => 'Mars',
                'option_c' => 'Jupiter',
                'option_d' => 'Mercury',
                'correct_option' => 1,
                'hint' => 'Its reddish appearance is due to iron oxide on its surface.',
                'explanation' => 'Mars appears reddish because of extensive iron oxide across its soil and rocks.',
                'difficulty' => 'Foundation'
            ],
            [
                'class_name' => 'All',
                'subject' => 'Science (NSO)',
                'subject_code' => 'NSO',
                'question_text' => 'Which process do green plants use to synthesize food using sunlight, water, and CO2?',
                'option_a' => 'Respiration',
                'option_b' => 'Photosynthesis',
                'option_c' => 'Transpiration',
                'option_d' => 'Germination',
                'correct_option' => 1,
                'hint' => 'Chlorophyll captures light energy to produce glucose.',
                'explanation' => 'Photosynthesis converts solar energy into chemical energy in green plant leaves.',
                'difficulty' => 'Foundation'
            ],

            // English
            [
                'class_name' => 'All',
                'subject' => 'English (IEO)',
                'subject_code' => 'IEO',
                'question_text' => 'In English grammar, what is the superlative form of the adjective "GOOD"?',
                'option_a' => 'Gooder',
                'option_b' => 'Better',
                'option_c' => 'Best',
                'option_d' => 'Most Good',
                'correct_option' => 2,
                'hint' => 'Good -> Better (comparative) -> Best (superlative).',
                'explanation' => 'The irregular degrees of comparison are Good, Better, Best.',
                'difficulty' => 'Foundation'
            ],
            [
                'class_name' => 'All',
                'subject' => 'English (IEO)',
                'subject_code' => 'IEO',
                'question_text' => 'Choose the correctly spelled word:',
                'option_a' => 'Accomodate',
                'option_b' => 'Accommodate',
                'option_c' => 'Acomodate',
                'option_d' => 'Acommodate',
                'correct_option' => 1,
                'hint' => 'It has double "c" and double "m".',
                'explanation' => 'The correct spelling is ACCOMMODATE (double c, double m).',
                'difficulty' => 'Intermediate'
            ],

            // Cyber
            [
                'class_name' => 'All',
                'subject' => 'Cyber & AI (ICSO)',
                'subject_code' => 'ICSO',
                'question_text' => 'Which component is considered the "Brain" of a computer?',
                'option_a' => 'RAM',
                'option_b' => 'Hard Drive',
                'option_c' => 'CPU (Central Processing Unit)',
                'option_d' => 'Monitor',
                'correct_option' => 2,
                'hint' => 'It performs all computational instructions and logical operations.',
                'explanation' => 'The CPU (Central Processing Unit) processes all computer commands and data operations.',
                'difficulty' => 'Foundation'
            ],
            [
                'class_name' => 'All',
                'subject' => 'Cyber & AI (ICSO)',
                'subject_code' => 'ICSO',
                'question_text' => 'What does "WWW" stand for in website addresses?',
                'option_a' => 'World Wide Web',
                'option_b' => 'Wide World Web',
                'option_c' => 'World Web Wide',
                'option_d' => 'Web World Wide',
                'correct_option' => 0,
                'hint' => 'Invented by Sir Tim Berners-Lee in 1989.',
                'explanation' => 'WWW stands for World Wide Web.',
                'difficulty' => 'Foundation'
            ],

            // GK
            [
                'class_name' => 'All',
                'subject' => 'General Knowledge (IGKO)',
                'subject_code' => 'IGKO',
                'question_text' => 'Which is the largest ocean on Earth covering more than 30% of the planet surface?',
                'option_a' => 'Atlantic Ocean',
                'option_b' => 'Indian Ocean',
                'option_c' => 'Pacific Ocean',
                'option_d' => 'Arctic Ocean',
                'correct_option' => 2,
                'hint' => 'It is named after the Latin word for "peaceful".',
                'explanation' => 'The Pacific Ocean is the largest and deepest ocean on Earth.',
                'difficulty' => 'Foundation'
            ],

            // Reasoning
            [
                'class_name' => 'All',
                'subject' => 'Reasoning (ISSO)',
                'subject_code' => 'ISSO',
                'question_text' => 'If DOCTOR is related to HOSPITAL, then TEACHER is related to:',
                'option_a' => 'Court',
                'option_b' => 'School',
                'option_c' => 'Factory',
                'option_d' => 'Hospital',
                'correct_option' => 1,
                'hint' => 'Think of the primary workplace.',
                'explanation' => 'A doctor works in a hospital; a teacher works in a school (Analogy).',
                'difficulty' => 'Foundation'
            ]
        ];

        $ins = $db->prepare("
            INSERT INTO free_quizzes (
                class_name, subject, subject_code, question_text, option_a, option_b, option_c, option_d,
                correct_option, hint, explanation, difficulty, points, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 10, 'active')
        ");

        foreach ($seeds as $q) {
            $ins->execute([
                $q['class_name'],
                $q['subject'],
                $q['subject_code'],
                $q['question_text'],
                $q['option_a'],
                $q['option_b'],
                $q['option_c'],
                $q['option_d'],
                $q['correct_option'],
                $q['hint'] ?? '',
                $q['explanation'] ?? '',
                $q['difficulty'] ?? 'Foundation'
            ]);
        }
    }

    /**
     * GET /api/free-quizzes
     */
    public function getQuizzes(): void {
        $db = Database::getConnection();
        $this->ensureTable($db);

        $user = Auth::getOptionalUser();
        $classFilter = trim($_GET['class'] ?? '');
        $subjectFilter = trim($_GET['subject'] ?? '');
        $statusFilter = trim($_GET['status'] ?? '');
        $search = trim($_GET['search'] ?? '');

        $sql = "SELECT * FROM free_quizzes WHERE 1=1";
        $params = [];

        // If regular student, show only active quizzes
        if ($user && $user['role'] === 'student') {
            $sql .= " AND status = 'active'";
        } elseif ($statusFilter !== '' && $statusFilter !== 'All') {
            $sql .= " AND status = ?";
            $params[] = $statusFilter;
        }

        // Class Filter
        if ($classFilter !== '' && $classFilter !== 'All') {
            preg_match('/\d+/', $classFilter, $matches);
            if (!empty($matches[0])) {
                $cNum = $matches[0];
                $sql .= " AND (class_name LIKE ? OR class_name = 'All' OR class_name = '')";
                $params[] = "%Class $cNum%";
            } else {
                $sql .= " AND (class_name LIKE ? OR class_name = 'All')";
                $params[] = "%$classFilter%";
            }
        }

        // Subject Filter
        if ($subjectFilter !== '' && $subjectFilter !== 'All') {
            $sql .= " AND (subject LIKE ? OR subject_code LIKE ?)";
            $params[] = "%$subjectFilter%";
            $params[] = "%$subjectFilter%";
        }

        // Search Filter
        if ($search !== '') {
            $sql .= " AND (question_text LIKE ? OR option_a LIKE ? OR option_b LIKE ? OR option_c LIKE ? OR option_d LIKE ? OR hint LIKE ? OR explanation LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $sql .= " ORDER BY id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Normalize options array for frontend convenience
        foreach ($quizzes as &$qz) {
            $qz['correct_option'] = (int)$qz['correct_option'];
            $qz['options'] = [
                $qz['option_a'],
                $qz['option_b'],
                $qz['option_c'],
                $qz['option_d']
            ];
            $qz['q'] = $qz['question_text'];
            $qz['correct'] = $qz['correct_option'];
        }

        Response::success($quizzes, 'Free Quiz questions retrieved.');
    }

    /**
     * POST /api/free-quizzes
     */
    public function createQuiz(): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();
        $this->ensureTable($db);

        $input = Validator::getJsonInput();

        $className = trim($input['class_name'] ?? ($input['grade'] ?? 'All'));
        $subject = trim($input['subject'] ?? 'Mathematics (IMO)');
        $subjectCode = trim($input['subject_code'] ?? 'IMO');
        $questionText = trim($input['question_text'] ?? ($input['q'] ?? ''));
        
        $options = is_array($input['options'] ?? null) ? $input['options'] : [];
        $optionA = trim($input['option_a'] ?? ($options[0] ?? ''));
        $optionB = trim($input['option_b'] ?? ($options[1] ?? ''));
        $optionC = trim($input['option_c'] ?? ($options[2] ?? ''));
        $optionD = trim($input['option_d'] ?? ($options[3] ?? ''));

        $correctOption = isset($input['correct_option']) ? (int)$input['correct_option'] : (isset($input['correct']) ? (int)$input['correct'] : 0);
        $hint = trim($input['hint'] ?? '');
        $explanation = trim($input['explanation'] ?? '');
        $difficulty = trim($input['difficulty'] ?? 'Foundation');
        $status = in_array(strtolower($input['status'] ?? 'active'), ['active', 'inactive']) ? strtolower($input['status']) : 'active';

        if (empty($questionText)) {
            Response::error('Question statement is required.', 400);
        }
        if (empty($optionA) || empty($optionB)) {
            Response::error('At least Option A and Option B are required.', 400);
        }
        if (empty($optionC)) $optionC = 'Option C';
        if (empty($optionD)) $optionD = 'Option D';

        // Subject code detection
        if (empty($subjectCode) || $subjectCode === 'IMO') {
            if (stripos($subject, 'Science') !== false || stripos($subject, 'NSO') !== false) $subjectCode = 'NSO';
            elseif (stripos($subject, 'English') !== false || stripos($subject, 'IEO') !== false) $subjectCode = 'IEO';
            elseif (stripos($subject, 'Cyber') !== false || stripos($subject, 'ICSO') !== false) $subjectCode = 'ICSO';
            elseif (stripos($subject, 'GK') !== false || stripos($subject, 'IGKO') !== false) $subjectCode = 'IGKO';
            elseif (stripos($subject, 'Reasoning') !== false || stripos($subject, 'ISSO') !== false) $subjectCode = 'ISSO';
            else $subjectCode = 'IMO';
        }

        $ins = $db->prepare("
            INSERT INTO free_quizzes (
                class_name, subject, subject_code, question_text, option_a, option_b, option_c, option_d,
                correct_option, hint, explanation, difficulty, points, status, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 10, ?, ?)
        ");
        $ins->execute([
            $className,
            $subject,
            $subjectCode,
            $questionText,
            $optionA,
            $optionB,
            $optionC,
            $optionD,
            $correctOption,
            $hint,
            $explanation,
            $difficulty,
            $status,
            $user['id'] ?? 1
        ]);
        $newId = (int)$db->lastInsertId();

        Logger::log("Created Free Quiz Question #$newId ($className - $subject)", 'FreeQuizzes', [
            'quiz_id' => $newId,
            'question_text' => $questionText
        ], $user['id'] ?? 1, $user['role'] ?? 'superadmin');

        $stmt = $db->prepare("SELECT * FROM free_quizzes WHERE id = ?");
        $stmt->execute([$newId]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        Response::success($item, 'Free Quiz question created successfully.');
    }

    /**
     * PUT /api/free-quizzes/{id}
     */
    public function updateQuiz(int $id): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();
        $this->ensureTable($db);

        $stmt = $db->prepare("SELECT * FROM free_quizzes WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$existing) {
            Response::notFound('Quiz question not found.');
        }

        $input = Validator::getJsonInput();

        $className = trim($input['class_name'] ?? $existing['class_name']);
        $subject = trim($input['subject'] ?? $existing['subject']);
        $subjectCode = trim($input['subject_code'] ?? $existing['subject_code']);
        $questionText = trim($input['question_text'] ?? ($input['q'] ?? $existing['question_text']));
        
        $options = is_array($input['options'] ?? null) ? $input['options'] : [];
        $optionA = trim($input['option_a'] ?? ($options[0] ?? $existing['option_a']));
        $optionB = trim($input['option_b'] ?? ($options[1] ?? $existing['option_b']));
        $optionC = trim($input['option_c'] ?? ($options[2] ?? $existing['option_c']));
        $optionD = trim($input['option_d'] ?? ($options[3] ?? $existing['option_d']));

        $correctOption = isset($input['correct_option']) ? (int)$input['correct_option'] : (isset($input['correct']) ? (int)$input['correct'] : (int)$existing['correct_option']);
        $hint = trim($input['hint'] ?? $existing['hint']);
        $explanation = trim($input['explanation'] ?? $existing['explanation']);
        $difficulty = trim($input['difficulty'] ?? $existing['difficulty']);
        $status = isset($input['status']) && in_array(strtolower($input['status']), ['active', 'inactive']) 
            ? strtolower($input['status']) 
            : $existing['status'];

        $upd = $db->prepare("
            UPDATE free_quizzes
            SET class_name = ?, subject = ?, subject_code = ?, question_text = ?,
                option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ?,
                hint = ?, explanation = ?, difficulty = ?, status = ?
            WHERE id = ?
        ");
        $upd->execute([
            $className,
            $subject,
            $subjectCode,
            $questionText,
            $optionA,
            $optionB,
            $optionC,
            $optionD,
            $correctOption,
            $hint,
            $explanation,
            $difficulty,
            $status,
            $id
        ]);

        Logger::log("Updated Free Quiz Question #$id", 'FreeQuizzes', [
            'quiz_id' => $id,
            'question_text' => $questionText
        ], $user['id'] ?? 1, $user['role'] ?? 'superadmin');

        $stmt = $db->prepare("SELECT * FROM free_quizzes WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        Response::success($item, 'Free Quiz question updated successfully.');
    }

    /**
     * DELETE /api/free-quizzes/{id}
     */
    public function deleteQuiz(int $id): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();
        $this->ensureTable($db);

        $stmt = $db->prepare("SELECT * FROM free_quizzes WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$existing) {
            Response::notFound('Quiz question not found.');
        }

        $del = $db->prepare("DELETE FROM free_quizzes WHERE id = ?");
        $del->execute([$id]);

        Logger::log("Deleted Free Quiz Question #$id", 'FreeQuizzes', ['quiz_id' => $id], $user['id'] ?? 1, $user['role'] ?? 'superadmin');

        Response::success(['deleted_id' => $id], 'Quiz question deleted successfully.');
    }

    /**
     * POST /api/free-quizzes/seed
     */
    public function resetSeedQuizzes(): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();
        $this->ensureTable($db);

        $db->exec("TRUNCATE TABLE free_quizzes");
        $this->seedInitialQuizzes($db);

        $items = $db->query("SELECT * FROM free_quizzes ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
        Response::success($items, 'Default Free Quizzes reset and re-seeded successfully.');
    }
}
