<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;

class AcademicController {
    // Public disciplines list (for mega-menus & public landing)
    public function getPublicDisciplines(): void {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT s.*, 
                   (SELECT COUNT(*) FROM chapters ch WHERE ch.subject_id = s.id) as chapter_count,
                   (SELECT COUNT(*) FROM questions q WHERE q.subject_id = s.id) as question_count
            FROM subjects s
            WHERE s.status = 'active'
            ORDER BY s.id ASC
        ");
        Response::success($stmt->fetchAll(PDO::FETCH_ASSOC), 'Active disciplines retrieved.');
    }

    // Public classes list
    public function getPublicClasses(): void {
        $db = Database::getConnection();
        $stmt = $db->query("
            SELECT * FROM academic_classes 
            WHERE status = 'active' 
            ORDER BY order_no ASC
        ");
        Response::success($stmt->fetchAll(PDO::FETCH_ASSOC), 'Active classes retrieved.');
    }

    // Classes Management (Admin)
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
        Response::success($stmt->fetchAll(PDO::FETCH_ASSOC), 'Classes retrieved.');
    }

    public function createClass(): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $name = trim($input['name'] ?? '');
        $code = trim($input['code'] ?? '');
        $orderNo = (int)($input['order_no'] ?? 0);
        $category = trim($input['category'] ?? 'Primary');
        $description = trim($input['description'] ?? '');
        $ageGroup = trim($input['age_group'] ?? '');

        if (empty($name) || empty($code)) {
            Response::error('Class name and code are required.', 422);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO academic_classes (name, code, order_no, category, description, age_group, status) 
            VALUES (?, ?, ?, ?, ?, ?, 'active')
        ");
        $stmt->execute([$name, $code, $orderNo, $category, $description, $ageGroup]);
        $newId = (int)$db->lastInsertId();

        // Map all subjects to this new class automatically
        $subjects = $db->query("SELECT id FROM subjects")->fetchAll(PDO::FETCH_COLUMN);
        $mapStmt = $db->prepare("INSERT IGNORE INTO class_subjects (class_id, subject_id, status) VALUES (?, ?, 'active')");
        foreach ($subjects as $sId) {
            $mapStmt->execute([$newId, $sId]);
        }

        Logger::log('CLASS_CREATED', 'Academic', ['name' => $name, 'code' => $code]);
        Response::success(['id' => $newId], 'Class created successfully in MySQL database.', 201);
    }

    public function updateClass(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $name = trim($input['name'] ?? '');
        $code = trim($input['code'] ?? '');
        $orderNo = (int)($input['order_no'] ?? 0);
        $category = trim($input['category'] ?? 'Primary');
        $description = trim($input['description'] ?? '');
        $ageGroup = trim($input['age_group'] ?? '');
        $status = in_array($input['status'] ?? '', ['active', 'inactive']) ? $input['status'] : 'active';

        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE academic_classes 
            SET name = ?, code = ?, order_no = ?, category = ?, description = ?, age_group = ?, status = ? 
            WHERE id = ?
        ");
        $stmt->execute([$name, $code, $orderNo, $category, $description, $ageGroup, $status, $id]);

        Logger::log('CLASS_UPDATED', 'Academic', ['id' => $id, 'name' => $name]);
        Response::success(null, 'Class details updated in MySQL successfully.');
    }

    public function deleteClass(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $db = Database::getConnection();
        
        $db->prepare("DELETE FROM class_subjects WHERE class_id = ?")->execute([$id]);
        $db->prepare("DELETE FROM class_subject_content WHERE class_id = ?")->execute([$id]);
        $stmt = $db->prepare("DELETE FROM academic_classes WHERE id = ?");
        $stmt->execute([$id]);

        Logger::log('CLASS_DELETED', 'Academic', ['id' => $id]);
        Response::success(null, 'Class deleted successfully.');
    }

    // Subjects & Disciplines Management
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
                ORDER BY s.id ASC
            ");
            $stmt->execute([$classId, $classId, $classId]);
        } else {
            $stmt = $db->query("
                SELECT s.*,
                       (SELECT COUNT(*) FROM questions q WHERE q.subject_id = s.id) as question_count,
                       (SELECT COUNT(*) FROM chapters ch WHERE ch.subject_id = s.id) as chapter_count
                FROM subjects s
                ORDER BY s.id ASC
            ");
        }

        Response::success($stmt->fetchAll(PDO::FETCH_ASSOC), 'Subjects & Disciplines retrieved.');
    }

    public function createSubject(): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $name = trim($input['name'] ?? '');
        $fullName = trim($input['full_name'] ?? $name);
        $code = trim($input['code'] ?? '');
        $slug = trim($input['slug'] ?? strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name)));
        $icon = trim($input['icon'] ?? 'BookOpen');
        $color = trim($input['color'] ?? '#6d3a68');
        $category = trim($input['category'] ?? 'STEM');
        $tagline = trim($input['tagline'] ?? 'Classes 1 to 12 • 50 Questions');
        $description = trim($input['description'] ?? '');
        $quote = trim($input['quote'] ?? '');
        $questionsCount = (int)($input['questions_count'] ?? 50);
        $durationMinutes = (int)($input['duration_minutes'] ?? 60);
        $syllabusOverview = trim($input['syllabus_overview'] ?? '');

        if (empty($name) || empty($code)) {
            Response::error('Subject name and code are required.', 422);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO subjects 
            (name, full_name, code, slug, icon, color, category, tagline, description, quote, questions_count, duration_minutes, syllabus_overview, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        ");
        $stmt->execute([
            $name, $fullName, $code, $slug, $icon, $color, $category, $tagline, 
            $description, $quote, $questionsCount, $durationMinutes, $syllabusOverview
        ]);
        $newId = (int)$db->lastInsertId();

        // Link with all classes
        $classes = $db->query("SELECT id FROM academic_classes")->fetchAll(PDO::FETCH_COLUMN);
        $mapStmt = $db->prepare("INSERT IGNORE INTO class_subjects (class_id, subject_id, status) VALUES (?, ?, 'active')");
        foreach ($classes as $cId) {
            $mapStmt->execute([$cId, $newId]);
        }

        Logger::log('SUBJECT_CREATED', 'Academic', ['name' => $name, 'code' => $code]);
        Response::success(['id' => $newId], 'Subject created successfully and saved in MySQL database.', 201);
    }

    public function updateSubject(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $name = trim($input['name'] ?? '');
        $fullName = trim($input['full_name'] ?? $name);
        $code = trim($input['code'] ?? '');
        $slug = trim($input['slug'] ?? '');
        $icon = trim($input['icon'] ?? 'BookOpen');
        $color = trim($input['color'] ?? '#6d3a68');
        $category = trim($input['category'] ?? 'STEM');
        $tagline = trim($input['tagline'] ?? '');
        $description = trim($input['description'] ?? '');
        $quote = trim($input['quote'] ?? '');
        $questionsCount = (int)($input['questions_count'] ?? 50);
        $durationMinutes = (int)($input['duration_minutes'] ?? 60);
        $syllabusOverview = trim($input['syllabus_overview'] ?? '');
        $status = in_array($input['status'] ?? '', ['active', 'inactive']) ? $input['status'] : 'active';

        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE subjects 
            SET name = ?, full_name = ?, code = ?, slug = ?, icon = ?, color = ?, category = ?, 
                tagline = ?, description = ?, quote = ?, questions_count = ?, duration_minutes = ?, 
                syllabus_overview = ?, status = ? 
            WHERE id = ?
        ");
        $stmt->execute([
            $name, $fullName, $code, $slug, $icon, $color, $category, $tagline, 
            $description, $quote, $questionsCount, $durationMinutes, $syllabusOverview, $status, $id
        ]);

        Logger::log('SUBJECT_UPDATED', 'Academic', ['id' => $id, 'name' => $name]);
        Response::success(null, 'Subject & Discipline content updated in MySQL database successfully.');
    }

    public function deleteSubject(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $db = Database::getConnection();
        
        $db->prepare("DELETE FROM class_subjects WHERE subject_id = ?")->execute([$id]);
        $db->prepare("DELETE FROM class_subject_content WHERE subject_id = ?")->execute([$id]);
        $stmt = $db->prepare("DELETE FROM subjects WHERE id = ?");
        $stmt->execute([$id]);

        Logger::log('SUBJECT_DELETED', 'Academic', ['id' => $id]);
        Response::success(null, 'Subject deleted successfully.');
    }

    // Chapters Management
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
        Response::success($stmt->fetchAll(PDO::FETCH_ASSOC), 'Chapters retrieved.');
    }

    public function createChapter(): void {
        $user = Auth::authenticate();
        $input = Validator::getJsonInput();
        $classId = (int)($input['class_id'] ?? 0);
        $subjectId = (int)($input['subject_id'] ?? 0);
        $name = trim($input['name'] ?? '');
        $code = trim($input['code'] ?? '');
        $orderNo = (int)($input['order_no'] ?? 1);

        if (!$classId || !$subjectId || empty($name)) {
            Response::error('Class, Subject and Chapter Name are required.', 422);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO chapters (class_id, subject_id, name, code, order_no) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$classId, $subjectId, $name, $code, $orderNo]);
        $newId = (int)$db->lastInsertId();

        Logger::log('CHAPTER_CREATED', 'Academic', ['name' => $name, 'subject_id' => $subjectId]);
        Response::success(['id' => $newId], 'Chapter created successfully.', 201);
    }

    public function updateChapter(int $id): void {
        Auth::authenticate();
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
        Auth::authenticate();
        $db = Database::getConnection();
        $db->prepare("DELETE FROM topics WHERE chapter_id = ?")->execute([$id]);
        $stmt = $db->prepare("DELETE FROM chapters WHERE id = ?");
        $stmt->execute([$id]);

        Response::success(null, 'Chapter deleted successfully.');
    }

    // Topics Management
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
        Response::success($stmt->fetchAll(PDO::FETCH_ASSOC), 'Topics retrieved.');
    }

    public function createTopic(): void {
        Auth::authenticate();
        $input = Validator::getJsonInput();
        $chapterId = (int)($input['chapter_id'] ?? 0);
        $name = trim($input['name'] ?? '');
        $description = trim($input['description'] ?? '');
        $orderNo = (int)($input['order_no'] ?? 1);

        if (!$chapterId || empty($name)) {
            Response::error('Chapter ID and Topic Name are required.', 422);
            return;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO topics (chapter_id, name, description, order_no) VALUES (?, ?, ?, ?)");
        $stmt->execute([$chapterId, $name, $description, $orderNo]);
        $newId = (int)$db->lastInsertId();

        Response::success(['id' => $newId], 'Topic created successfully.', 201);
    }

    // Get Subject & Class Specific Content
    public function getSubjectClassContent(): void {
        $db = Database::getConnection();
        $subjectSlug = $_GET['subject_slug'] ?? ($_GET['subject_id'] ?? 'english');
        $className = $_GET['class_name'] ?? ($_GET['class'] ?? 'Class 1');

        $stmt = $db->prepare("
            SELECT csc.*, s.name as subject_name, s.full_name as subject_full_name, s.code as subject_code
            FROM class_subject_content csc
            LEFT JOIN subjects s ON csc.subject_id = s.id OR s.slug = csc.subject_slug
            WHERE (csc.subject_slug = ? OR s.slug = ? OR s.code = ?) 
              AND csc.class_name = ?
            LIMIT 1
        ");
        $stmt->execute([$subjectSlug, $subjectSlug, strtoupper($subjectSlug), $className]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $row['headings'] = json_decode($row['headings_json'] ?? '{}', true);
            $row['eligibility'] = json_decode($row['eligibility_json'] ?? '[]', true);
            $row['benefits'] = json_decode($row['benefits_json'] ?? '[]', true);
            $row['how_to_apply'] = json_decode($row['how_to_apply_json'] ?? '{}', true);
            $row['syllabus_modules'] = json_decode($row['syllabus_modules_json'] ?? '[]', true);
            $row['dates_fees'] = json_decode($row['dates_fees_json'] ?? '{}', true);
            $row['how_to_prepare'] = json_decode($row['how_to_prepare_json'] ?? '{}', true);
            $row['awards'] = json_decode($row['awards_json'] ?? '{}', true);
            $row['faqs'] = json_decode($row['faqs_json'] ?? '[]', true);
            Response::success($row, 'Subject class content retrieved.');
        } else {
            Response::success(null, 'No custom content found, using default metadata.');
        }
    }

    // Save or Update Subject & Class Specific Content (Super Admin)
    public function saveSubjectClassContent(): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $subjectSlug = trim($input['subject_slug'] ?? 'english');
        $className = trim($input['class_name'] ?? 'Class 1');
        $customTitle = trim($input['custom_title'] ?? '');
        $headingsJson = json_encode($input['headings'] ?? []);
        $quote = trim($input['quote'] ?? '');
        $introText = trim($input['intro_text'] ?? '');
        $eligibilityJson = json_encode($input['eligibility'] ?? []);
        $benefitsJson = json_encode($input['benefits'] ?? []);
        $howToApplyJson = json_encode($input['how_to_apply'] ?? []);
        $syllabusModulesJson = json_encode($input['syllabus_modules'] ?? []);
        $datesFeesJson = json_encode($input['dates_fees'] ?? []);
        $howToPrepareJson = json_encode($input['how_to_prepare'] ?? []);
        $awardsJson = json_encode($input['awards'] ?? []);
        $faqsJson = json_encode($input['faqs'] ?? []);

        $db = Database::getConnection();

        // Get subject_id and class_id
        $subStmt = $db->prepare("SELECT id FROM subjects WHERE slug = ? OR code = ? LIMIT 1");
        $subStmt->execute([$subjectSlug, strtoupper($subjectSlug)]);
        $subjectId = (int)$subStmt->fetchColumn() ?: 1;

        $clsStmt = $db->prepare("SELECT id FROM academic_classes WHERE name = ? LIMIT 1");
        $clsStmt->execute([$className]);
        $classId = (int)$clsStmt->fetchColumn() ?: 1;

        $stmt = $db->prepare("
            INSERT INTO class_subject_content 
            (subject_id, class_id, subject_slug, class_name, custom_title, headings_json, intro_text, quote, eligibility_json, benefits_json, how_to_apply_json, syllabus_modules_json, dates_fees_json, how_to_prepare_json, awards_json, faqs_json, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
            ON DUPLICATE KEY UPDATE
                `subject_slug` = VALUES(`subject_slug`),
                `class_name` = VALUES(`class_name`),
                `custom_title` = VALUES(`custom_title`),
                `headings_json` = VALUES(`headings_json`),
                `intro_text` = VALUES(`intro_text`),
                `quote` = VALUES(`quote`),
                `eligibility_json` = VALUES(`eligibility_json`),
                `benefits_json` = VALUES(`benefits_json`),
                `how_to_apply_json` = VALUES(`how_to_apply_json`),
                `syllabus_modules_json` = VALUES(`syllabus_modules_json`),
                `dates_fees_json` = VALUES(`dates_fees_json`),
                `how_to_prepare_json` = VALUES(`how_to_prepare_json`),
                `awards_json` = VALUES(`awards_json`),
                `faqs_json` = VALUES(`faqs_json`),
                `status` = 'active',
                `updated_at` = NOW()
        ");

        $stmt->execute([
            $subjectId, $classId, $subjectSlug, $className, $customTitle, $headingsJson,
            $introText, $quote, $eligibilityJson, $benefitsJson, $howToApplyJson, $syllabusModulesJson,
            $datesFeesJson, $howToPrepareJson, $awardsJson, $faqsJson
        ]);

        Logger::log('SUBJECT_CLASS_CONTENT_SAVED', 'Academic', ['subject_slug' => $subjectSlug, 'class_name' => $className]);
        Response::success(null, "Content for $subjectSlug ($className) saved to MySQL database successfully.");
    }
}
