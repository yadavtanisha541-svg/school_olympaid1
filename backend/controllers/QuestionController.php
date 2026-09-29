<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;

class QuestionController {
    public function getQuestions(): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('manage_questions', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        $db = Database::getConnection();

        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = max(1, min(100, (int)($_GET['limit'] ?? 15)));
        $offset = ($page - 1) * $limit;

        $classId = isset($_GET['class_id']) && $_GET['class_id'] !== '' ? (int)$_GET['class_id'] : null;
        $subjectId = isset($_GET['subject_id']) && $_GET['subject_id'] !== '' ? (int)$_GET['subject_id'] : null;
        $chapterId = isset($_GET['chapter_id']) && $_GET['chapter_id'] !== '' ? (int)$_GET['chapter_id'] : null;
        $topicId = isset($_GET['topic_id']) && $_GET['topic_id'] !== '' ? (int)$_GET['topic_id'] : null;
        $difficulty = trim($_GET['difficulty'] ?? '');
        $status = trim($_GET['status'] ?? '');
        $search = trim($_GET['search'] ?? '');

        $where = ["1=1"];
        $params = [];

        if ($classId) {
            $where[] = "q.class_id = ?";
            $params[] = $classId;
        }
        if ($subjectId) {
            $where[] = "q.subject_id = ?";
            $params[] = $subjectId;
        }
        if ($chapterId) {
            $where[] = "q.chapter_id = ?";
            $params[] = $chapterId;
        }
        if ($topicId) {
            $where[] = "q.topic_id = ?";
            $params[] = $topicId;
        }
        if ($difficulty !== '' && in_array($difficulty, ['easy', 'medium', 'hard'])) {
            $where[] = "q.difficulty = ?";
            $params[] = $difficulty;
        }
        if ($status !== '' && in_array($status, ['active', 'inactive'])) {
            $where[] = "q.status = ?";
            $params[] = $status;
        }
        if ($search !== '') {
            $where[] = "(q.question_text LIKE ? OR q.explanation LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $whereClause = implode(" AND ", $where);

        // Count query
        $countStmt = $db->prepare("SELECT COUNT(*) FROM questions q WHERE $whereClause");
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        // Data query
        $sql = "
            SELECT q.*, ac.name as class_name, s.name as subject_name, ch.name as chapter_name, t.name as topic_name,
                   u.full_name as author_name
            FROM questions q
            JOIN academic_classes ac ON q.class_id = ac.id
            JOIN subjects s ON q.subject_id = s.id
            LEFT JOIN chapters ch ON q.chapter_id = ch.id
            LEFT JOIN topics t ON q.topic_id = t.id
            LEFT JOIN users u ON q.created_by = u.id
            WHERE $whereClause
            ORDER BY q.id DESC
            LIMIT $limit OFFSET $offset
        ";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $questions = $stmt->fetchAll();

        Response::success([
            'questions' => $questions,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'total_pages' => ceil($total / $limit)
            ]
        ], 'Questions retrieved.');
    }

    public function getQuestion(int $id): void {
        Auth::authenticate();
        $db = Database::getConnection();

        $stmt = $db->prepare("
            SELECT q.*, ac.name as class_name, s.name as subject_name, ch.name as chapter_name, t.name as topic_name
            FROM questions q
            JOIN academic_classes ac ON q.class_id = ac.id
            JOIN subjects s ON q.subject_id = s.id
            LEFT JOIN chapters ch ON q.chapter_id = ch.id
            LEFT JOIN topics t ON q.topic_id = t.id
            WHERE q.id = ?
        ");
        $stmt->execute([$id]);
        $question = $stmt->fetch();

        if (!$question) {
            Response::notFound('Question not found.');
        }

        Response::success($question, 'Question details retrieved.');
    }

    public function createQuestion(): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('manage_questions', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        $input = Validator::getJsonInput();
        $missing = Validator::validateRequired($input, ['class_id', 'subject_id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option']);
        if (!empty($missing)) {
            Response::error('Missing required fields: ' . implode(', ', $missing), 422);
        }

        $correctOption = strtoupper(trim($input['correct_option']));
        if (!in_array($correctOption, ['A', 'B', 'C', 'D'])) {
            Response::error('Correct option must be one of A, B, C, or D.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO questions (
                class_id, subject_id, chapter_id, topic_id, question_text,
                option_a, option_b, option_c, option_d, correct_option, explanation,
                difficulty, marks, negative_marks, question_image, status, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            (int)$input['class_id'],
            (int)$input['subject_id'],
            !empty($input['chapter_id']) ? (int)$input['chapter_id'] : null,
            !empty($input['topic_id']) ? (int)$input['topic_id'] : null,
            trim($input['question_text']),
            trim($input['option_a']),
            trim($input['option_b']),
            trim($input['option_c']),
            trim($input['option_d']),
            $correctOption,
            trim($input['explanation'] ?? ''),
            in_array($input['difficulty'] ?? '', ['easy', 'medium', 'hard']) ? $input['difficulty'] : 'medium',
            isset($input['marks']) ? (float)$input['marks'] : 1.00,
            isset($input['negative_marks']) ? (float)$input['negative_marks'] : 0.00,
            !empty($input['question_image']) ? trim($input['question_image']) : null,
            in_array($input['status'] ?? '', ['active', 'inactive']) ? $input['status'] : 'active',
            $user['id']
        ]);

        $newId = (int)$db->lastInsertId();

        Logger::log('Created Question', 'QuestionBank', ['question_id' => $newId], $user['id'], $user['role']);
        Response::success(['id' => $newId], 'Question created successfully.', 201);
    }

    public function updateQuestion(int $id): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('manage_questions', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        $input = Validator::getJsonInput();
        $correctOption = strtoupper(trim($input['correct_option'] ?? ''));
        if (!in_array($correctOption, ['A', 'B', 'C', 'D'])) {
            Response::error('Correct option must be one of A, B, C, or D.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE questions SET
                class_id = ?, subject_id = ?, chapter_id = ?, topic_id = ?,
                question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?,
                correct_option = ?, explanation = ?, difficulty = ?, marks = ?,
                negative_marks = ?, question_image = ?, status = ?
            WHERE id = ?
        ");

        $stmt->execute([
            (int)$input['class_id'],
            (int)$input['subject_id'],
            !empty($input['chapter_id']) ? (int)$input['chapter_id'] : null,
            !empty($input['topic_id']) ? (int)$input['topic_id'] : null,
            trim($input['question_text']),
            trim($input['option_a']),
            trim($input['option_b']),
            trim($input['option_c']),
            trim($input['option_d']),
            $correctOption,
            trim($input['explanation'] ?? ''),
            in_array($input['difficulty'] ?? '', ['easy', 'medium', 'hard']) ? $input['difficulty'] : 'medium',
            isset($input['marks']) ? (float)$input['marks'] : 1.00,
            isset($input['negative_marks']) ? (float)$input['negative_marks'] : 0.00,
            !empty($input['question_image']) ? trim($input['question_image']) : null,
            in_array($input['status'] ?? '', ['active', 'inactive']) ? $input['status'] : 'active',
            $id
        ]);

        Logger::log('Updated Question', 'QuestionBank', ['question_id' => $id], $user['id'], $user['role']);
        Response::success(null, 'Question updated successfully.');
    }

    public function deleteQuestion(int $id): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('manage_questions', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM questions WHERE id = ?");
        $stmt->execute([$id]);

        Logger::log('Deleted Question', 'QuestionBank', ['question_id' => $id], $user['id'], $user['role']);
        Response::success(null, 'Question deleted successfully.');
    }

    public function getImportTemplate(): void {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=olympiadhub_question_import_template.csv');

        $output = fopen('php://output', 'w');
        fputcsv($output, [
            'class_id',
            'subject_id',
            'question_text',
            'option_a',
            'option_b',
            'option_c',
            'option_d',
            'correct_option',
            'difficulty',
            'marks',
            'negative_marks',
            'explanation'
        ]);

        // Sample rows
        fputcsv($output, [
            '10',
            '1',
            'What is the HCF of 96 and 404?',
            '2',
            '4',
            '8',
            '12',
            'B',
            'medium',
            '1.00',
            '0.25',
            'By Euclid division algorithm, 404 = 96 * 4 + 20; 96 = 20 * 4 + 16; 20 = 16 * 1 + 4; 16 = 4 * 4 + 0. Hence HCF is 4.'
        ]);
        fputcsv($output, [
            '10',
            '2',
            'Which metal is liquid at room temperature?',
            'Iron',
            'Mercury',
            'Aluminium',
            'Gold',
            'B',
            'easy',
            '1.00',
            '0.00',
            'Mercury (Hg) is the only metal that is liquid under standard temperature and pressure.'
        ]);

        fclose($output);
        exit;
    }

    public function importQuestions(): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('import_questions', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            // Check if CSV data sent as JSON string in body
            $input = Validator::getJsonInput();
            if (isset($input['csv_content'])) {
                $content = $input['csv_content'];
            } else {
                Response::error('Please upload a valid CSV file.', 422);
            }
        } else {
            $content = file_get_contents($_FILES['file']['tmp_name']);
        }

        $lines = preg_split('/\r\n|\r|\n/', trim($content));
        if (count($lines) < 2) {
            Response::error('The CSV file is empty or missing data rows.', 422);
        }

        $header = str_getcsv(array_shift($lines));
        $header = array_map('trim', array_map('strtolower', $header));

        $requiredCols = ['question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_option'];
        foreach ($requiredCols as $req) {
            if (!in_array($req, $header)) {
                Response::error("CSV is missing required column: '$req'", 422);
            }
        }

        $db = Database::getConnection();

        $totalRows = 0;
        $validQuestions = 0;
        $invalidQuestions = 0;
        $importedQuestions = 0;
        $failedQuestions = 0;
        $rowErrors = [];

        $insertStmt = $db->prepare("
            INSERT INTO questions (
                class_id, subject_id, question_text, option_a, option_b, option_c, option_d,
                correct_option, difficulty, marks, negative_marks, explanation, status, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
        ");

        $dupCheckStmt = $db->prepare("SELECT id FROM questions WHERE question_text = ? AND class_id = ? AND subject_id = ?");

        foreach ($lines as $lineIdx => $line) {
            if (trim($line) === '') continue;
            $totalRows++;
            $rowNum = $lineIdx + 2; // account for header + 1-based index

            $row = str_getcsv($line);
            if (count($row) < count($header)) {
                $invalidQuestions++;
                $rowErrors[] = ["row" => $rowNum, "error" => "Incomplete columns (expected " . count($header) . ", got " . count($row) . ")"];
                continue;
            }

            $rowData = [];
            foreach ($header as $idx => $colName) {
                $rowData[$colName] = trim($row[$idx] ?? '');
            }

            // Validation
            $qText = $rowData['question_text'] ?? '';
            $optA = $rowData['option_a'] ?? '';
            $optB = $rowData['option_b'] ?? '';
            $optC = $rowData['option_c'] ?? '';
            $optD = $rowData['option_d'] ?? '';
            $corr = strtoupper($rowData['correct_option'] ?? '');
            $classId = !empty($rowData['class_id']) ? (int)$rowData['class_id'] : 10;
            $subjectId = !empty($rowData['subject_id']) ? (int)$rowData['subject_id'] : 1;
            $diff = in_array(strtolower($rowData['difficulty'] ?? ''), ['easy', 'medium', 'hard']) ? strtolower($rowData['difficulty']) : 'medium';
            $marks = !empty($rowData['marks']) ? (float)$rowData['marks'] : 1.00;
            $negMarks = !empty($rowData['negative_marks']) ? (float)$rowData['negative_marks'] : 0.00;
            $explanation = $rowData['explanation'] ?? '';

            if (empty($qText) || empty($optA) || empty($optB) || empty($optC) || empty($optD)) {
                $invalidQuestions++;
                $rowErrors[] = ["row" => $rowNum, "error" => "Question text and all 4 options must be non-empty."];
                continue;
            }

            if (!in_array($corr, ['A', 'B', 'C', 'D'])) {
                $invalidQuestions++;
                $rowErrors[] = ["row" => $rowNum, "error" => "Correct option must be A, B, C, or D (got '$corr')."];
                continue;
            }

            // Duplicate detection
            $dupCheckStmt->execute([$qText, $classId, $subjectId]);
            if ($dupCheckStmt->fetch()) {
                $invalidQuestions++;
                $rowErrors[] = ["row" => $rowNum, "error" => "Duplicate question already exists in this class and subject."];
                continue;
            }

            $validQuestions++;

            try {
                $insertStmt->execute([
                    $classId,
                    $subjectId,
                    $qText,
                    $optA,
                    $optB,
                    $optC,
                    $optD,
                    $corr,
                    $diff,
                    $marks,
                    $negMarks,
                    $explanation,
                    $user['id']
                ]);
                $importedQuestions++;
            } catch (\Exception $e) {
                $failedQuestions++;
                $rowErrors[] = ["row" => $rowNum, "error" => "Database insertion error: " . $e->getMessage()];
            }
        }

        Logger::log("Imported Questions via CSV", 'QuestionBank', [
            'total_rows' => $totalRows,
            'imported' => $importedQuestions,
            'invalid' => $invalidQuestions
        ], $user['id'], $user['role']);

        Response::success([
            'total_rows' => $totalRows,
            'valid_questions' => $validQuestions,
            'invalid_questions' => $invalidQuestions,
            'imported_questions' => $importedQuestions,
            'failed_questions' => $failedQuestions,
            'errors' => $rowErrors
        ], "Import finished: $importedQuestions questions successfully imported.");
    }
}
