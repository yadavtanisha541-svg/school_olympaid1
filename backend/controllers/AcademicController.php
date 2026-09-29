<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;

class AcademicController {
    // Classes
    public function getClasses(): void {
        Auth::authenticate();
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT ac.*,
                   (SELECT COUNT(*) FROM users u WHERE u.class_id = ac.id AND u.role = 'student') as student_count,
                   (SELECT COUNT(*) FROM questions q WHERE q.class_id = ac.id) as question_count
            FROM academic_classes ac
            ORDER BY ac.order_no ASC
        ");
        Response::success($stmt->fetchAll(), 'Classes retrieved.');
    }

    public function createClass(): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $name = trim($input['name'] ?? '');
        $code = trim($input['code'] ?? '');
        $orderNo = (int)($input['order_no'] ?? 0);

        if (empty($name) || empty($code)) {
            Response::error('Class name and code are required.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO academic_classes (name, code, order_no, status) VALUES (?, ?, ?, 'active')");
        $stmt->execute([$name, $code, $orderNo]);
        $newId = (int)$db->lastInsertId();

        // Map all subjects to this new class automatically
        $subjects = $db->query("SELECT id FROM subjects")->fetchAll(PDO::FETCH_COLUMN);
        $mapStmt = $db->prepare("INSERT IGNORE INTO class_subjects (class_id, subject_id) VALUES (?, ?)");
        foreach ($subjects as $sId) {
            $mapStmt->execute([$newId, $sId]);
        }

        Logger::log("Created Class $name", 'Academic', ['class_id' => $newId], $admin['id'], 'superadmin');
        Response::success(['id' => $newId], 'Class created successfully.', 201);
    }

    public function updateClass(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $name = trim($input['name'] ?? '');
        $code = trim($input['code'] ?? '');
        $orderNo = (int)($input['order_no'] ?? 0);
        $status = in_array($input['status'] ?? '', ['active', 'inactive']) ? $input['status'] : 'active';

        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE academic_classes SET name = ?, code = ?, order_no = ?, status = ? WHERE id = ?");
        $stmt->execute([$name, $code, $orderNo, $status, $id]);

        Logger::log("Updated Class ID $id", 'Academic', ['class_id' => $id], $admin['id'], 'superadmin');
        Response::success(null, 'Class updated successfully.');
    }

    public function deleteClass(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM academic_classes WHERE id = ?");
        $stmt->execute([$id]);

        Logger::log("Deleted Class ID $id", 'Academic', ['class_id' => $id], $admin['id'], 'superadmin');
        Response::success(null, 'Class deleted successfully.');
    }

    // Subjects
    public function getSubjects(): void {
        Auth::authenticate();
        $db = Database::getConnection();
        $classId = isset($_GET['class_id']) && $_GET['class_id'] !== '' ? (int)$_GET['class_id'] : null;

        if ($classId) {
            $stmt = $db->prepare("
                SELECT s.*,
                       (SELECT COUNT(*) FROM questions q WHERE q.subject_id = s.id AND q.class_id = ?) as question_count,
                       (SELECT COUNT(*) FROM chapters ch WHERE ch.subject_id = s.id AND ch.class_id = ?) as chapter_count
                FROM subjects s
                JOIN class_subjects cs ON cs.subject_id = s.id
                WHERE cs.class_id = ? AND s.status = 'active'
                ORDER BY s.name ASC
            ");
            $stmt->execute([$classId, $classId, $classId]);
        } else {
            $stmt = $db->query("
                SELECT s.*,
                       (SELECT COUNT(*) FROM questions q WHERE q.subject_id = s.id) as question_count,
                       (SELECT COUNT(*) FROM chapters ch WHERE ch.subject_id = s.id) as chapter_count
                FROM subjects s
                ORDER BY s.name ASC
            ");
        }

        Response::success($stmt->fetchAll(), 'Subjects retrieved.');
    }

    public function createSubject(): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $name = trim($input['name'] ?? '');
        $code = trim($input['code'] ?? '');
        $icon = trim($input['icon'] ?? 'BookOpen');
        $color = trim($input['color'] ?? '#4F46E5');

        if (empty($name) || empty($code)) {
            Response::error('Subject name and code are required.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO subjects (name, code, icon, color, status) VALUES (?, ?, ?, ?, 'active')");
        $stmt->execute([$name, $code, $icon, $color]);
        $newId = (int)$db->lastInsertId();

        // Link with all classes
        $classes = $db->query("SELECT id FROM academic_classes")->fetchAll(PDO::FETCH_COLUMN);
        $mapStmt = $db->prepare("INSERT IGNORE INTO class_subjects (class_id, subject_id) VALUES (?, ?)");
        foreach ($classes as $cId) {
            $mapStmt->execute([$cId, $newId]);
        }

        Logger::log("Created Subject $name", 'Academic', ['subject_id' => $newId], $admin['id'], 'superadmin');
        Response::success(['id' => $newId], 'Subject created successfully.', 201);
    }

    public function updateSubject(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $name = trim($input['name'] ?? '');
        $code = trim($input['code'] ?? '');
        $icon = trim($input['icon'] ?? 'BookOpen');
        $color = trim($input['color'] ?? '#4F46E5');
        $status = in_array($input['status'] ?? '', ['active', 'inactive']) ? $input['status'] : 'active';

        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE subjects SET name = ?, code = ?, icon = ?, color = ?, status = ? WHERE id = ?");
        $stmt->execute([$name, $code, $icon, $color, $status, $id]);

        Logger::log("Updated Subject ID $id", 'Academic', ['subject_id' => $id], $admin['id'], 'superadmin');
        Response::success(null, 'Subject updated successfully.');
    }

    public function deleteSubject(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM subjects WHERE id = ?");
        $stmt->execute([$id]);

        Logger::log("Deleted Subject ID $id", 'Academic', ['subject_id' => $id], $admin['id'], 'superadmin');
        Response::success(null, 'Subject deleted successfully.');
    }

    // Chapters
    public function getChapters(): void {
        Auth::authenticate();
        $db = Database::getConnection();

        $classId = isset($_GET['class_id']) && $_GET['class_id'] !== '' ? (int)$_GET['class_id'] : null;
        $subjectId = isset($_GET['subject_id']) && $_GET['subject_id'] !== '' ? (int)$_GET['subject_id'] : null;

        $sql = "
            SELECT ch.*, ac.name as class_name, s.name as subject_name,
                   (SELECT COUNT(*) FROM topics t WHERE t.chapter_id = ch.id) as topic_count,
                   (SELECT COUNT(*) FROM questions q WHERE q.chapter_id = ch.id) as question_count
            FROM chapters ch
            JOIN academic_classes ac ON ch.class_id = ac.id
            JOIN subjects s ON ch.subject_id = s.id
            WHERE 1=1
        ";
        $params = [];

        if ($classId) {
            $sql .= " AND ch.class_id = ?";
            $params[] = $classId;
        }

        if ($subjectId) {
            $sql .= " AND ch.subject_id = ?";
            $params[] = $subjectId;
        }

        $sql .= " ORDER BY ch.class_id ASC, ch.subject_id ASC, ch.order_no ASC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        Response::success($stmt->fetchAll(), 'Chapters retrieved.');
    }

    public function createChapter(): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('manage_academic', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        $input = Validator::getJsonInput();
        $classId = (int)($input['class_id'] ?? 0);
        $subjectId = (int)($input['subject_id'] ?? 0);
        $name = trim($input['name'] ?? '');
        $code = trim($input['code'] ?? '');
        $orderNo = (int)($input['order_no'] ?? 1);

        if (!$classId || !$subjectId || empty($name)) {
            Response::error('Class, Subject and Chapter Name are required.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO chapters (class_id, subject_id, name, code, order_no) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$classId, $subjectId, $name, $code, $orderNo]);
        $newId = (int)$db->lastInsertId();

        Logger::log("Created Chapter $name", 'Academic', ['chapter_id' => $newId], $user['id'], $user['role']);
        Response::success(['id' => $newId], 'Chapter created successfully.', 201);
    }

    public function updateChapter(int $id): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('manage_academic', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        $input = Validator::getJsonInput();
        $name = trim($input['name'] ?? '');
        $code = trim($input['code'] ?? '');
        $orderNo = (int)($input['order_no'] ?? 1);

        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE chapters SET name = ?, code = ?, order_no = ? WHERE id = ?");
        $stmt->execute([$name, $code, $orderNo, $id]);

        Response::success(null, 'Chapter updated successfully.');
    }

    public function deleteChapter(int $id): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('manage_academic', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM chapters WHERE id = ?");
        $stmt->execute([$id]);

        Response::success(null, 'Chapter deleted successfully.');
    }

    // Topics
    public function getTopics(): void {
        Auth::authenticate();
        $db = Database::getConnection();

        $chapterId = isset($_GET['chapter_id']) && $_GET['chapter_id'] !== '' ? (int)$_GET['chapter_id'] : null;

        $sql = "
            SELECT t.*, ch.name as chapter_name,
                   (SELECT COUNT(*) FROM questions q WHERE q.topic_id = t.id) as question_count
            FROM topics t
            JOIN chapters ch ON t.chapter_id = ch.id
            WHERE 1=1
        ";
        $params = [];

        if ($chapterId) {
            $sql .= " AND t.chapter_id = ?";
            $params[] = $chapterId;
        }

        $sql .= " ORDER BY t.order_no ASC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        Response::success($stmt->fetchAll(), 'Topics retrieved.');
    }

    public function createTopic(): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && !in_array('manage_academic', $user['permissions'] ?? [])) {
            Response::forbidden('Access denied.');
        }

        $input = Validator::getJsonInput();
        $chapterId = (int)($input['chapter_id'] ?? 0);
        $name = trim($input['name'] ?? '');
        $description = trim($input['description'] ?? '');
        $orderNo = (int)($input['order_no'] ?? 1);

        if (!$chapterId || empty($name)) {
            Response::error('Chapter ID and Topic Name are required.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO topics (chapter_id, name, description, order_no) VALUES (?, ?, ?, ?)");
        $stmt->execute([$chapterId, $name, $description, $orderNo]);
        $newId = (int)$db->lastInsertId();

        Response::success(['id' => $newId], 'Topic created successfully.', 201);
    }
}
