<?php
// OlympiadHub - Real-Time MySQL ⇄ Cloud ⇄ Vercel Two-Way Synchronization Bridge
declare(strict_types=1);

require_once __DIR__ . '/../config/Database.php';

const CLOUD_SYNC_URL = 'https://kvdb.io/NpN11X2B7WSSTib7UTAT5n/olympiadhub_data';

function getPdo(): PDO {
    return App\Config\Database::getConnection();
}

/**
 * 1. Read all tables from local MySQL and convert to frontend storage keys
 */
function exportMysqlData(): array {
    $db = getPdo();
    $data = [];

    // 1. Users
    try {
        $users = $db->query("SELECT * FROM users ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
        $formattedUsers = array_map(function($u) {
            return [
                'id' => (int)$u['id'],
                'login_id' => $u['login_id'] ?? 'USER' . $u['id'],
                'student_id' => $u['login_id'] ?? 'USER' . $u['id'],
                'name' => $u['full_name'] ?? 'User',
                'full_name' => $u['full_name'] ?? 'User',
                'email' => $u['email'] ?? '',
                'phone' => $u['phone'] ?? '',
                'role' => $u['role'] ?? 'student',
                'status' => $u['status'] ?? 'active',
                'school' => $u['school_name'] ?? '',
                'school_name' => $u['school_name'] ?? '',
                'class' => isset($u['class_id']) ? 'Class ' . $u['class_id'] : 'Class 6',
                'class_name' => isset($u['class_id']) ? 'Class ' . $u['class_id'] : 'Class 6',
                'section' => $u['section'] ?? 'A',
                'roll_number' => $u['roll_number'] ?? '',
                'academic_year' => $u['academic_year'] ?? '2026-2027',
                'gender' => $u['gender'] ?? 'Other',
                'dob' => $u['dob'] ?? '',
                'father_name' => $u['father_name'] ?? '',
                'mother_name' => $u['mother_name'] ?? '',
                'parent_name' => $u['parent_name'] ?? $u['father_name'] ?? '',
                'parent_phone' => $u['parent_phone'] ?? $u['phone'] ?? '',
                'parent_email' => $u['parent_email'] ?? '',
                'created_at' => $u['created_at'] ?? date('Y-m-d H:i:s')
            ];
        }, $users);
        $data['olympiadhub_db_users'] = json_encode($formattedUsers);
    } catch (\Exception $e) {
        echo "Error fetching users: " . $e->getMessage() . "\n";
    }

    // 2. Questions
    try {
        $questions = $db->query("SELECT * FROM questions ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
        $formattedQuestions = array_map(function($q) {
            $opts = [$q['option_a'] ?? '', $q['option_b'] ?? '', $q['option_c'] ?? '', $q['option_d'] ?? ''];
            $corr = ['A' => 0, 'B' => 1, 'C' => 2, 'D' => 3][$q['correct_option'] ?? 'A'] ?? 0;
            return [
                'id' => (int)$q['id'],
                'question_text' => $q['question_text'] ?? '',
                'q' => $q['question_text'] ?? '',
                'option_a' => $q['option_a'] ?? '',
                'option_b' => $q['option_b'] ?? '',
                'option_c' => $q['option_c'] ?? '',
                'option_d' => $q['option_d'] ?? '',
                'options' => $opts,
                'correct_option' => $q['correct_option'] ?? 'A',
                'correct' => $corr,
                'explanation' => $q['explanation'] ?? '',
                'difficulty' => $q['difficulty'] ?? 'medium',
                'marks' => (float)($q['marks'] ?? 1.0),
                'status' => $q['status'] ?? 'active'
            ];
        }, $questions);
        $data['olympiadhub_db_questions'] = json_encode($formattedQuestions);
    } catch (\Exception $e) {
        echo "Error fetching questions: " . $e->getMessage() . "\n";
    }

    // 3. Exams & Papers
    try {
        $exams = $db->query("SELECT * FROM exams ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
        
        // Fetch all exam_questions
        $examQsStmt = $db->query("
            SELECT eq.exam_id, q.* 
            FROM exam_questions eq 
            JOIN questions q ON eq.question_id = q.id 
            ORDER BY eq.question_order ASC
        ");
        $examQsMap = [];
        while ($row = $examQsStmt->fetch(PDO::FETCH_ASSOC)) {
            $eId = $row['exam_id'];
            if (!isset($examQsMap[$eId])) $examQsMap[$eId] = [];
            $corr = ['A' => 0, 'B' => 1, 'C' => 2, 'D' => 3][$row['correct_option'] ?? 'A'] ?? 0;
            $examQsMap[$eId][] = [
                'id' => (int)$row['id'],
                'q' => $row['question_text'] ?? '',
                'question_text' => $row['question_text'] ?? '',
                'options' => [$row['option_a'], $row['option_b'], $row['option_c'], $row['option_d']],
                'correct' => $corr,
                'correct_option' => $row['correct_option'] ?? 'A',
                'explanation' => $row['explanation'] ?? '',
                'marks' => (float)($row['marks'] ?? 1.0)
            ];
        }

        $formattedExams = array_map(function($ex) use ($examQsMap) {
            $qList = $examQsMap[$ex['id']] ?? [];
            return [
                'id' => (int)$ex['id'],
                'title' => $ex['title'] ?? 'Exam Paper',
                'exam_code' => $ex['exam_code'] ?? 'EXAM-' . $ex['id'],
                'exam_type' => $ex['exam_type'] ?? 'generated',
                'exam_year' => $ex['exam_year'] ?? '2024',
                'paper_category' => $ex['paper_category'] ?? 'generator',
                'class' => isset($ex['class_id']) ? 'Class ' . $ex['class_id'] : 'Class 6',
                'class_name' => isset($ex['class_id']) ? 'Class ' . $ex['class_id'] : 'Class 6',
                'duration_minutes' => (int)($ex['duration_minutes'] ?? 60),
                'total_questions' => count($qList) > 0 ? count($qList) : (int)($ex['total_questions'] ?? 0),
                'total_marks' => (float)($ex['total_marks'] ?? 0),
                'questions' => $qList,
                'status' => $ex['status'] ?? 'published',
                'created_at' => $ex['created_at'] ?? date('Y-m-d H:i:s')
            ];
        }, $exams);

        $data['olympiadhub_db_exams'] = json_encode($formattedExams);
        $data['admin_generator_papers'] = json_encode($formattedExams);
        $data['mock_db_exam_papers'] = json_encode($formattedExams);
    } catch (\Exception $e) {
        echo "Error fetching exams: " . $e->getMessage() . "\n";
    }

    // 4. Applicant Leads
    try {
        $leads = $db->query("SELECT * FROM new_applicant_leads ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
        $data['olympiadhub_db_applicant_leads'] = json_encode($leads);
    } catch (\Exception $e) {
        echo "Error fetching leads: " . $e->getMessage() . "\n";
    }

    // 5. Packages
    try {
        $packages = $db->query("SELECT * FROM study_packages ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
        $data['olympiadhub_db_packages'] = json_encode($packages);
    } catch (\Exception $e) {}

    return $data;
}

/**
 * 2. Push MySQL Data into Central Cloud DB (so Vercel gets it immediately)
 */
function pushMysqlToCloud(): bool {
    $mysqlData = exportMysqlData();
    if (empty($mysqlData)) {
        echo "No data found in MySQL to push.\n";
        return false;
    }

    // Pull current cloud data to merge
    $cloudData = [];
    $ch = curl_init(CLOUD_SYNC_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    $res = curl_exec($ch);
    curl_close($ch);
    if ($res) {
        $json = json_decode($res, true);
        if (isset($json['data']) && is_array($json['data'])) {
            $cloudData = $json['data'];
        }
    }

    // Merge: MySQL overwrites/enhances cloud data
    $merged = array_merge($cloudData, $mysqlData);

    $payload = json_encode([
        'name' => 'olympiadhub_global_sync',
        'data' => $merged
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init(CLOUD_SYNC_URL);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $putRes = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        echo "✓ Successfully pushed " . count($mysqlData) . " tables from local MySQL to Cloud/Vercel!\n";
        return true;
    } else {
        echo "Failed to push to Cloud: HTTP $httpCode - $putRes\n";
        return false;
    }
}

/**
 * 3. Pull from Cloud and insert any new records into MySQL
 */
function pullCloudToMysql(): bool {
    $ch = curl_init(CLOUD_SYNC_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    $res = curl_exec($ch);
    curl_close($ch);

    if (!$res) return false;
    $json = json_decode($res, true);
    $cloudData = $json['data'] ?? $json;
    if (!is_array($cloudData) || empty($cloudData)) return false;

    $db = getPdo();

    // Import Users from Cloud to MySQL
    if (!empty($cloudData['olympiadhub_db_users'])) {
        $users = json_decode($cloudData['olympiadhub_db_users'], true);
        if (is_array($users)) {
            $checkUserStmt = $db->prepare("SELECT id FROM users WHERE login_id = ? OR email = ?");
            $insertUserStmt = $db->prepare("
                INSERT INTO users (login_id, full_name, email, phone, role, status, school_name, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($users as $u) {
                $loginId = $u['login_id'] ?? $u['student_id'] ?? '';
                $email = $u['email'] ?? '';
                if (!$loginId && !$email) continue;

                $checkUserStmt->execute([$loginId, $email]);
                if (!$checkUserStmt->fetch()) {
                    $insertUserStmt->execute([
                        $loginId,
                        $u['full_name'] ?? $u['name'] ?? 'Student',
                        $email,
                        $u['phone'] ?? '',
                        $u['role'] ?? 'student',
                        $u['status'] ?? 'active',
                        $u['school_name'] ?? $u['school'] ?? '',
                        date('Y-m-d H:i:s')
                    ]);
                    echo "Inserted new user from Cloud into MySQL: {$loginId}\n";
                }
            }
        }
    }

    // Import Questions from Cloud to MySQL
    if (!empty($cloudData['olympiadhub_db_questions'])) {
        $questions = json_decode($cloudData['olympiadhub_db_questions'], true);
        if (is_array($questions)) {
            $checkQStmt = $db->prepare("SELECT id FROM questions WHERE question_text = ?");
            $insertQStmt = $db->prepare("
                INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_option, explanation, marks, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
            ");
            foreach ($questions as $q) {
                $qText = $q['question_text'] ?? $q['q'] ?? '';
                if (strlen(trim($qText)) < 5) continue;

                $checkQStmt->execute([$qText]);
                if (!$checkQStmt->fetch()) {
                    $insertQStmt->execute([
                        $qText,
                        $q['option_a'] ?? $q['options'][0] ?? 'Option A',
                        $q['option_b'] ?? $q['options'][1] ?? 'Option B',
                        $q['option_c'] ?? $q['options'][2] ?? 'Option C',
                        $q['option_d'] ?? $q['options'][3] ?? 'Option D',
                        $q['correct_option'] ?? 'A',
                        $q['explanation'] ?? '',
                        $q['marks'] ?? 1.0
                    ]);
                    echo "Inserted new question from Cloud into MySQL.\n";
                }
            }
        }
    }

    // Import Exams from Cloud to MySQL
    $examsJson = $cloudData['olympiadhub_db_exams'] ?? $cloudData['mock_db_exam_papers'] ?? $cloudData['admin_generator_papers'] ?? null;
    if (!empty($examsJson)) {
        $exams = is_string($examsJson) ? json_decode($examsJson, true) : $examsJson;
        if (is_array($exams)) {
            $checkExamStmt = $db->prepare("SELECT id FROM exams WHERE exam_code = ? OR title = ?");
            $insertExamStmt = $db->prepare("
                INSERT INTO exams (title, exam_code, exam_type, exam_year, paper_category, duration_minutes, total_questions, total_marks, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($exams as $ex) {
                $eCode = $ex['exam_code'] ?? ('EXAM-' . ($ex['id'] ?? uniqid()));
                $title = $ex['title'] ?? 'Generated Paper';
                $checkExamStmt->execute([$eCode, $title]);
                if (!$checkExamStmt->fetch()) {
                    $insertExamStmt->execute([
                        $title,
                        $eCode,
                        $ex['exam_type'] ?? 'generated',
                        $ex['exam_year'] ?? '2024',
                        $ex['paper_category'] ?? 'generator',
                        (int)($ex['duration_minutes'] ?? 60),
                        (int)($ex['total_questions'] ?? count($ex['questions'] ?? [])),
                        (float)($ex['total_marks'] ?? 100),
                        $ex['status'] ?? 'published',
                        $ex['created_at'] ?? date('Y-m-d H:i:s')
                    ]);
                    echo "Inserted new exam from Cloud into MySQL: {$title}\n";
                }
            }
        }
    }

    // Import Leads from Cloud to MySQL
    if (!empty($cloudData['olympiadhub_db_applicant_leads'])) {
        $leads = is_string($cloudData['olympiadhub_db_applicant_leads']) ? json_decode($cloudData['olympiadhub_db_applicant_leads'], true) : $cloudData['olympiadhub_db_applicant_leads'];
        if (is_array($leads)) {
            $checkLeadStmt = $db->prepare("SELECT id FROM new_applicant_leads WHERE email = ? OR applicant_id = ?");
            $insertLeadStmt = $db->prepare("
                INSERT INTO new_applicant_leads (applicant_id, candidate_name, class_name, email, mobile, school_name, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($leads as $l) {
                $email = $l['email'] ?? '';
                $appId = $l['applicant_id'] ?? ('APP-' . uniqid());
                if (!$email && !$appId) continue;
                $checkLeadStmt->execute([$email, $appId]);
                if (!$checkLeadStmt->fetch()) {
                    $insertLeadStmt->execute([
                        $appId,
                        $l['candidate_name'] ?? $l['name'] ?? 'Applicant',
                        $l['class_name'] ?? 'Class 6',
                        $email,
                        $l['mobile'] ?? $l['phone'] ?? '',
                        $l['school_name'] ?? '',
                        $l['status'] ?? 'new',
                        $l['created_at'] ?? date('Y-m-d H:i:s')
                    ]);
                    echo "Inserted new lead from Cloud into MySQL: {$email}\n";
                }
            }
        }
    }

    return true;
}

// Command-line execution
$action = $argv[1] ?? 'push';
if ($action === 'push') {
    pushMysqlToCloud();
} elseif ($action === 'pull') {
    pullCloudToMysql();
} elseif ($action === 'sync') {
    pullCloudToMysql();
    pushMysqlToCloud();
} elseif ($action === 'watch' || $action === 'daemon') {
    echo "=========================================================\n";
    echo "  OlympiadHub Real-Time MySQL ⇄ Cloud Sync Bridge Active\n";
    echo "  Polling every 12 seconds. Press Ctrl+C to exit.\n";
    echo "=========================================================\n";
    while (true) {
        pullCloudToMysql();
        pushMysqlToCloud();
        sleep(12);
    }
}
