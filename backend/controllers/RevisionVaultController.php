<?php
// OlympiadHub - Revision Vault & Question Bookmarks Controller
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Response;
use App\Helpers\Auth;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;

class RevisionVaultController {

    /**
     * Ensure database table exists and seed initial data
     */
    private function ensureTable(PDO $db): void {
        $db->exec("
            CREATE TABLE IF NOT EXISTS revision_vault_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                class_id INT NULL,
                class_name VARCHAR(50) NOT NULL DEFAULT 'Class 1',
                subject VARCHAR(100) NOT NULL,
                subject_code VARCHAR(30) NOT NULL,
                question_text TEXT NOT NULL,
                correct_answer TEXT NOT NULL,
                explanation TEXT NULL,
                tags VARCHAR(255) NULL DEFAULT 'Tricky Question',
                difficulty VARCHAR(50) DEFAULT 'Intermediate',
                status ENUM('active', 'inactive') DEFAULT 'active',
                order_num INT DEFAULT 0,
                created_by INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        // Check if any items exist; if not, seed default items
        $cnt = (int)$db->query("SELECT COUNT(*) FROM revision_vault_items")->fetchColumn();
        if ($cnt === 0) {
            $this->seedInitialItems($db);
        }
    }

    /**
     * Seed initial curated revision questions across Classes and Subjects
     */
    private function seedInitialItems(PDO $db): void {
        $seeds = [
            // Class 1
            [
                'class_name' => 'Class 1',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'If 3 apples cost ₹45, what is the cost of 7 apples?',
                'correct_answer' => '₹105',
                'explanation' => 'Unit price = 45 / 3 = ₹15 per apple. For 7 apples = 7 × 15 = ₹105.',
                'tags' => 'Unitary Method, Tricky',
                'difficulty' => 'Intermediate'
            ],
            [
                'class_name' => 'Class 1',
                'subject' => 'Science (NSO)',
                'subject_code' => 'NSO',
                'question_text' => 'Which organ pumps blood throughout the human body?',
                'correct_answer' => 'Heart',
                'explanation' => 'The human heart pumps oxygenated blood continuously through the circulatory system.',
                'tags' => 'Human Body, High Yield',
                'difficulty' => 'Foundation'
            ],
            [
                'class_name' => 'Class 1',
                'subject' => 'English (IEO)',
                'subject_code' => 'IEO',
                'question_text' => 'Choose the correct synonym for "QUICK":',
                'correct_answer' => 'Fast / Rapid',
                'explanation' => '"Quick" means moving or able to move with high speed; synonym is Fast.',
                'tags' => 'Vocabulary, Synonyms',
                'difficulty' => 'Foundation'
            ],
            [
                'class_name' => 'Class 1',
                'subject' => 'Reasoning (ISSO)',
                'subject_code' => 'ISSO',
                'question_text' => 'What comes next in the pattern: 2, 4, 6, 8, __?',
                'correct_answer' => '10',
                'explanation' => 'The pattern adds +2 at each step. 8 + 2 = 10.',
                'tags' => 'Number Patterns',
                'difficulty' => 'Foundation'
            ],

            // Class 2
            [
                'class_name' => 'Class 2',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'How many tens are there in the number 350?',
                'correct_answer' => '35 tens',
                'explanation' => '350 / 10 = 35 tens (or 3 hundreds + 5 tens).',
                'tags' => 'Place Value',
                'difficulty' => 'Intermediate'
            ],
            [
                'class_name' => 'Class 2',
                'subject' => 'Science (NSO)',
                'subject_code' => 'NSO',
                'question_text' => 'Which part of the plant grows under the ground and absorbs water?',
                'correct_answer' => 'Root',
                'explanation' => 'Roots absorb water and nutrients from the soil to nourish the entire plant.',
                'tags' => 'Plants Life',
                'difficulty' => 'Foundation'
            ],

            // Class 3
            [
                'class_name' => 'Class 3',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'A box has 8 rows of crayons, each row has 12 crayons. If 15 crayons are broken, how many good crayons remain?',
                'correct_answer' => '81 crayons',
                'explanation' => 'Total crayons = 8 × 12 = 96. Good crayons = 96 - 15 = 81.',
                'tags' => 'Word Problems, HOTS',
                'difficulty' => 'Intermediate'
            ],
            [
                'class_name' => 'Class 3',
                'subject' => 'Cyber & AI (ICSO)',
                'subject_code' => 'ICSO',
                'question_text' => 'Which key on the keyboard is the longest key and is used to insert a blank space?',
                'correct_answer' => 'Spacebar',
                'explanation' => 'The Spacebar key located at the bottom of the keyboard inserts spaces between words.',
                'tags' => 'Computer Basics',
                'difficulty' => 'Foundation'
            ],

            // Class 4
            [
                'class_name' => 'Class 4',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'Find the perimeter of a rectangle having length 18 cm and breadth 12 cm.',
                'correct_answer' => '60 cm',
                'explanation' => 'Perimeter = 2 × (Length + Breadth) = 2 × (18 + 12) = 2 × 30 = 60 cm.',
                'tags' => 'Geometry, Formula Recall',
                'difficulty' => 'Intermediate'
            ],
            [
                'class_name' => 'Class 4',
                'subject' => 'General Knowledge (IGKO)',
                'subject_code' => 'IGKO',
                'question_text' => 'Which planet is known as the "Red Planet" in our solar system?',
                'correct_answer' => 'Mars',
                'explanation' => 'Mars appears reddish because of the large amounts of iron oxide (rust) on its surface.',
                'tags' => 'Space & Astronomy',
                'difficulty' => 'Foundation'
            ],

            // Class 5
            [
                'class_name' => 'Class 5',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'What is the LCM of 12, 18, and 24?',
                'correct_answer' => '72',
                'explanation' => '12 = 2² × 3, 18 = 2 × 3², 24 = 2³ × 3. LCM = 2³ × 3² = 8 × 9 = 72.',
                'tags' => 'Number Theory, LCM',
                'difficulty' => 'Intermediate'
            ],
            [
                'class_name' => 'Class 5',
                'subject' => 'Science (NSO)',
                'subject_code' => 'NSO',
                'question_text' => 'Which vitamin deficiency leads to Rickets and weak bones in children?',
                'correct_answer' => 'Vitamin D',
                'explanation' => 'Vitamin D helps our bones absorb calcium. Deficiency causes Rickets in growing children.',
                'tags' => 'Vitamins & Health',
                'difficulty' => 'Intermediate'
            ],

            // Class 6
            [
                'class_name' => 'Class 6',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'If 4x - 7 = 33, what is the value of 3x + 5?',
                'correct_answer' => '35',
                'explanation' => '4x = 33 + 7 = 40 => x = 10. Then 3(10) + 5 = 30 + 5 = 35.',
                'tags' => 'Algebra, Tricky',
                'difficulty' => 'Intermediate'
            ],
            [
                'class_name' => 'Class 6',
                'subject' => 'Science (NSO)',
                'subject_code' => 'NSO',
                'question_text' => 'Which component of blood is responsible for clotting at the site of a cut or wound?',
                'correct_answer' => 'Platelets (Thrombocytes)',
                'explanation' => 'Blood platelets form plugs and clot factors to prevent excessive bleeding from wounds.',
                'tags' => 'Circulation & Blood',
                'difficulty' => 'Intermediate'
            ],
            [
                'class_name' => 'Class 6',
                'subject' => 'English (IEO)',
                'subject_code' => 'IEO',
                'question_text' => 'Identify the figure of speech: "The trees danced joyfully in the storm."',
                'correct_answer' => 'Personification',
                'explanation' => 'Giving human attributes ("danced joyfully") to non-human objects (trees) is personification.',
                'tags' => 'Poetic Devices',
                'difficulty' => 'Advanced'
            ],
            [
                'class_name' => 'Class 6',
                'subject' => 'Reasoning (ISSO)',
                'subject_code' => 'ISSO',
                'question_text' => 'If CLOCK is coded as 3-12-15-3-11, what is the code for WATCH?',
                'correct_answer' => '23-1-20-3-8',
                'explanation' => 'Each letter corresponds to its alphabetical position (W=23, A=1, T=20, C=3, H=8).',
                'tags' => 'Coding-Decoding',
                'difficulty' => 'Intermediate'
            ],

            // Class 7 to 10
            [
                'class_name' => 'Class 7',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'The angles of a triangle are in the ratio 2:3:4. Find the measure of the largest angle.',
                'correct_answer' => '80°',
                'explanation' => 'Sum = 2x + 3x + 4x = 9x = 180° => x = 20°. Largest angle = 4 × 20° = 80°.',
                'tags' => 'Geometry, Triangles',
                'difficulty' => 'Intermediate'
            ],
            [
                'class_name' => 'Class 8',
                'subject' => 'Science (NSO)',
                'subject_code' => 'NSO',
                'question_text' => 'Which non-metal is a good conductor of electricity due to free delocalized electrons?',
                'correct_answer' => 'Graphite (Allotrope of Carbon)',
                'explanation' => 'Graphite has a layered hexagonal structure with delocalized pi electrons that conduct electricity.',
                'tags' => 'Materials & Non-Metals',
                'difficulty' => 'Advanced'
            ],
            [
                'class_name' => 'Class 9',
                'subject' => 'Mathematics (IMO)',
                'subject_code' => 'IMO',
                'question_text' => 'If x + (1/x) = 5, find the value of x² + (1/x²).',
                'correct_answer' => '23',
                'explanation' => 'Squaring both sides: (x + 1/x)² = x² + 2 + 1/x² = 25 => x² + 1/x² = 25 - 2 = 23.',
                'tags' => 'Algebra Identities, HOTS',
                'difficulty' => 'Advanced'
            ],
            [
                'class_name' => 'Class 10',
                'subject' => 'Science (NSO)',
                'subject_code' => 'NSO',
                'question_text' => 'What is the power of a convex lens having a focal length of +25 cm?',
                'correct_answer' => '+4.0 Dioptres (+4D)',
                'explanation' => 'Power P = 1 / f(in meters). f = 25 cm = 0.25 m. P = 1 / 0.25 = +4 D.',
                'tags' => 'Optics & Light',
                'difficulty' => 'Advanced'
            ]
        ];

        $ins = $db->prepare("
            INSERT INTO revision_vault_items (
                class_name, subject, subject_code, question_text, correct_answer, explanation, tags, difficulty, status, order_num
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 0)
        ");

        foreach ($seeds as $item) {
            $ins->execute([
                $item['class_name'],
                $item['subject'],
                $item['subject_code'],
                $item['question_text'],
                $item['correct_answer'],
                $item['explanation'],
                $item['tags'] ?? 'Tricky Question',
                $item['difficulty'] ?? 'Intermediate'
            ]);
        }
    }

    /**
     * GET /api/revision-vault
     * Get revision items with optional class, subject, status, search filtering
     */
    public function getRevisionItems(): void {
        $db = Database::getConnection();
        $this->ensureTable($db);

        $user = Auth::getOptionalUser();
        $classFilter = trim($_GET['class'] ?? '');
        $subjectFilter = trim($_GET['subject'] ?? '');
        $statusFilter = trim($_GET['status'] ?? '');
        $search = trim($_GET['search'] ?? '');

        $sql = "SELECT * FROM revision_vault_items WHERE 1=1";
        $params = [];

        // If regular student, show only active items
        if ($user && $user['role'] === 'student') {
            $sql .= " AND status = 'active'";
        } elseif ($statusFilter !== '' && $statusFilter !== 'All') {
            $sql .= " AND status = ?";
            $params[] = $statusFilter;
        }

        // Class Filter (e.g. 'Class 1', 'Class 6', 'All')
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
            $sql .= " AND (question_text LIKE ? OR correct_answer LIKE ? OR explanation LIKE ? OR tags LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $sql .= " ORDER BY id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::success($items, 'Revision Vault items retrieved.');
    }

    /**
     * POST /api/revision-vault
     * Create new revision vault item (Super Admin / Teacher)
     */
    public function createRevisionItem(): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();
        $this->ensureTable($db);

        $input = Validator::getJsonInput();

        $className = trim($input['class_name'] ?? ($input['grade'] ?? 'Class 1'));
        $subject = trim($input['subject'] ?? 'Mathematics (IMO)');
        $subjectCode = trim($input['subject_code'] ?? 'IMO');
        $questionText = trim($input['question_text'] ?? ($input['q'] ?? ''));
        $correctAnswer = trim($input['correct_answer'] ?? ($input['ans'] ?? ''));
        $explanation = trim($input['explanation'] ?? ($input['expl'] ?? ''));
        $tags = trim($input['tags'] ?? 'Tricky Question');
        $difficulty = trim($input['difficulty'] ?? 'Intermediate');
        $status = in_array(strtolower($input['status'] ?? 'active'), ['active', 'inactive']) ? strtolower($input['status']) : 'active';

        if (empty($questionText)) {
            Response::error('Question statement is required.', 400);
        }
        if (empty($correctAnswer)) {
            Response::error('Correct answer is required.', 400);
        }

        // Auto determine subject_code if missing
        if (empty($subjectCode) || $subjectCode === 'IMO') {
            if (stripos($subject, 'Science') !== false || stripos($subject, 'NSO') !== false || stripos($subject, 'ISO') !== false) $subjectCode = 'NSO';
            elseif (stripos($subject, 'English') !== false || stripos($subject, 'IEO') !== false) $subjectCode = 'IEO';
            elseif (stripos($subject, 'Cyber') !== false || stripos($subject, 'ICSO') !== false || stripos($subject, 'ICO') !== false) $subjectCode = 'ICSO';
            elseif (stripos($subject, 'GK') !== false || stripos($subject, 'General Knowledge') !== false || stripos($subject, 'IGKO') !== false) $subjectCode = 'IGKO';
            elseif (stripos($subject, 'Reasoning') !== false || stripos($subject, 'ISSO') !== false || stripos($subject, 'LRO') !== false) $subjectCode = 'ISSO';
            else $subjectCode = 'IMO';
        }

        $ins = $db->prepare("
            INSERT INTO revision_vault_items (
                class_name, subject, subject_code, question_text, correct_answer, explanation, tags, difficulty, status, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $ins->execute([
            $className,
            $subject,
            $subjectCode,
            $questionText,
            $correctAnswer,
            $explanation,
            $tags,
            $difficulty,
            $status,
            $user['id'] ?? 1
        ]);
        $newId = (int)$db->lastInsertId();

        Logger::log("Created Revision Vault Item #$newId ($className - $subject)", 'RevisionVault', [
            'item_id' => $newId,
            'class_name' => $className,
            'subject' => $subject
        ], $user['id'] ?? 1, $user['role'] ?? 'superadmin');

        $stmt = $db->prepare("SELECT * FROM revision_vault_items WHERE id = ?");
        $stmt->execute([$newId]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        Response::success($item, 'Revision vault item created successfully.');
    }

    /**
     * PUT /api/revision-vault/{id}
     * Update existing revision vault item
     */
    public function updateRevisionItem(int $id): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();
        $this->ensureTable($db);

        $input = Validator::getJsonInput();

        $stmt = $db->prepare("SELECT * FROM revision_vault_items WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$existing) {
            Response::notFound('Revision vault item not found.');
        }

        $className = trim($input['class_name'] ?? $existing['class_name']);
        $subject = trim($input['subject'] ?? $existing['subject']);
        $subjectCode = trim($input['subject_code'] ?? $existing['subject_code']);
        $questionText = trim($input['question_text'] ?? ($input['q'] ?? $existing['question_text']));
        $correctAnswer = trim($input['correct_answer'] ?? ($input['ans'] ?? $existing['correct_answer']));
        $explanation = trim($input['explanation'] ?? ($input['expl'] ?? $existing['explanation']));
        $tags = trim($input['tags'] ?? $existing['tags']);
        $difficulty = trim($input['difficulty'] ?? $existing['difficulty']);
        $status = isset($input['status']) && in_array(strtolower($input['status']), ['active', 'inactive']) 
            ? strtolower($input['status']) 
            : $existing['status'];

        $upd = $db->prepare("
            UPDATE revision_vault_items
            SET class_name = ?, subject = ?, subject_code = ?, question_text = ?,
                correct_answer = ?, explanation = ?, tags = ?, difficulty = ?, status = ?
            WHERE id = ?
        ");
        $upd->execute([
            $className,
            $subject,
            $subjectCode,
            $questionText,
            $correctAnswer,
            $explanation,
            $tags,
            $difficulty,
            $status,
            $id
        ]);

        Logger::log("Updated Revision Vault Item #$id ($className - $subject)", 'RevisionVault', [
            'item_id' => $id,
            'class_name' => $className,
            'subject' => $subject
        ], $user['id'] ?? 1, $user['role'] ?? 'superadmin');

        $stmt = $db->prepare("SELECT * FROM revision_vault_items WHERE id = ?");
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        Response::success($item, 'Revision vault item updated successfully.');
    }

    /**
     * DELETE /api/revision-vault/{id}
     * Delete revision vault item
     */
    public function deleteRevisionItem(int $id): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();
        $this->ensureTable($db);

        $stmt = $db->prepare("SELECT * FROM revision_vault_items WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$existing) {
            Response::notFound('Revision vault item not found.');
        }

        $del = $db->prepare("DELETE FROM revision_vault_items WHERE id = ?");
        $del->execute([$id]);

        Logger::log("Deleted Revision Vault Item #$id", 'RevisionVault', [
            'item_id' => $id,
            'class_name' => $existing['class_name'],
            'subject' => $existing['subject']
        ], $user['id'] ?? 1, $user['role'] ?? 'superadmin');

        Response::success(['deleted_id' => $id], 'Revision vault item deleted successfully.');
    }

    /**
     * POST /api/revision-vault/seed
     * Reset default seed revision items
     */
    public function resetSeedItems(): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();
        $this->ensureTable($db);

        $db->exec("TRUNCATE TABLE revision_vault_items");
        $this->seedInitialItems($db);

        $items = $db->query("SELECT * FROM revision_vault_items ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
        Response::success($items, 'Default Revision Vault questions seeded successfully.');
    }
}
