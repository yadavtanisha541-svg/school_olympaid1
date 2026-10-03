<?php
// OlympiadHub - Online Classes Controller (Powered by MySQL PDO)
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Response;
use App\Helpers\Auth;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;
use Exception;

class OnlineClassesController {
    private PDO $db;
    private string $storageFile;

    public function __construct() {
        $this->db = Database::getConnection();
        $this->storageFile = __DIR__ . '/../database/online_classes_data.json';
        $this->ensureTablesExist();
    }

    private function ensureTablesExist(): void {
        try {
            $this->db->exec("
                CREATE TABLE IF NOT EXISTS online_class_packages (
                    id VARCHAR(64) PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    class_name VARCHAR(64) NOT NULL DEFAULT 'Class 6',
                    subject VARCHAR(100) NOT NULL DEFAULT 'All Olympiads',
                    subject_code VARCHAR(32) NOT NULL DEFAULT 'ALL',
                    package_type VARCHAR(64) NOT NULL DEFAULT 'self_paced',
                    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                    original_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                    badge_text VARCHAR(100) NULL,
                    special_offer_text VARCHAR(255) NULL,
                    header_color VARCHAR(32) NOT NULL DEFAULT '#d49b28',
                    status VARCHAR(32) NOT NULL DEFAULT 'active',
                    features JSON NULL,
                    sections JSON NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

                CREATE TABLE IF NOT EXISTS online_class_hero (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    badge VARCHAR(64) NOT NULL DEFAULT 'FEATURED',
                    title VARCHAR(255) NOT NULL,
                    subtitle TEXT NULL,
                    button_text VARCHAR(64) NOT NULL DEFAULT 'ENROLL NOW →',
                    button_action VARCHAR(64) NOT NULL DEFAULT 'packages',
                    is_active TINYINT(1) NOT NULL DEFAULT 1,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

                CREATE TABLE IF NOT EXISTS online_class_batches (
                    id VARCHAR(64) PRIMARY KEY,
                    batch_name VARCHAR(255) NOT NULL,
                    subject VARCHAR(100) NOT NULL,
                    class_name VARCHAR(64) NOT NULL DEFAULT 'Class 6',
                    faculty_name VARCHAR(150) NOT NULL,
                    schedule_text VARCHAR(255) NOT NULL,
                    timing VARCHAR(100) NOT NULL,
                    max_seats INT NOT NULL DEFAULT 50,
                    enrolled_count INT NOT NULL DEFAULT 0,
                    meeting_url VARCHAR(500) NULL,
                    status VARCHAR(32) NOT NULL DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

                CREATE TABLE IF NOT EXISTS online_class_lectures (
                    id VARCHAR(64) PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    subject VARCHAR(100) NOT NULL,
                    class_name VARCHAR(64) NOT NULL DEFAULT 'Class 6',
                    duration VARCHAR(64) NOT NULL DEFAULT '45 mins',
                    video_url VARCHAR(500) NULL,
                    description TEXT NULL,
                    category VARCHAR(100) NULL,
                    thumbnail_text VARCHAR(100) NULL,
                    status VARCHAR(32) NOT NULL DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");
        } catch (Exception $e) {
            // Fail silently or log
            error_log('OnlineClasses DB Table Init Error: ' . $e->getMessage());
        }
    }

    // 1. Get All Online Classes Data from MySQL
    public function getOnlineClasses(): void {
        try {
            $classFilter = trim($_GET['class'] ?? '');
            $subjectFilter = trim($_GET['subject'] ?? '');

            // 1. Fetch Hero Banner from MySQL
            $heroStmt = $this->db->query("SELECT * FROM online_class_hero ORDER BY id DESC LIMIT 1");
            $heroRow = $heroStmt->fetch();
            $heroBanner = $heroRow ? [
                'badge' => $heroRow['badge'],
                'title' => $heroRow['title'],
                'subtitle' => $heroRow['subtitle'],
                'button_text' => $heroRow['button_text'],
                'button_action' => $heroRow['button_action'],
                'is_active' => (bool)$heroRow['is_active']
            ] : [
                'badge' => 'FEATURED',
                'title' => 'Reasoning Online Classes for IMO, ISO(NSO) & IEO',
                'subtitle' => 'Get expert guidance and improve your problem-solving skills.',
                'button_text' => 'ENROLL NOW →',
                'button_action' => 'packages',
                'is_active' => true
            ];

            // 2. Fetch Packages from MySQL
            $pkgSql = "SELECT * FROM online_class_packages WHERE 1=1";
            $pkgParams = [];

            if (!empty($classFilter) && $classFilter !== 'All') {
                preg_match('/\d+/', $classFilter, $m);
                $cNum = $m[0] ?? '';
                if (!empty($cNum)) {
                    $pkgSql .= " AND (class_name = ? OR class_name LIKE ?)";
                    $pkgParams[] = $classFilter;
                    $pkgParams[] = "%$cNum%";
                } else {
                    $pkgSql .= " AND class_name = ?";
                    $pkgParams[] = $classFilter;
                }
            }

            if (!empty($subjectFilter) && $subjectFilter !== 'All') {
                $pkgSql .= " AND (subject LIKE ? OR subject_code LIKE ? OR title LIKE ?)";
                $pkgParams[] = "%$subjectFilter%";
                $pkgParams[] = "%$subjectFilter%";
                $pkgParams[] = "%$subjectFilter%";
            }

            $pkgSql .= " ORDER BY created_at DESC";
            $pkgStmt = $this->db->prepare($pkgSql);
            $pkgStmt->execute($pkgParams);
            $rawPackages = $pkgStmt->fetchAll();

            $packages = array_map(function($row) {
                return [
                    'id' => $row['id'],
                    'title' => $row['title'],
                    'class_name' => $row['class_name'],
                    'subject' => $row['subject'],
                    'subject_code' => $row['subject_code'],
                    'package_type' => $row['package_type'],
                    'price' => (float)$row['price'],
                    'original_price' => (float)$row['original_price'],
                    'badge_text' => $row['badge_text'] ?? '',
                    'special_offer_text' => $row['special_offer_text'] ?? '',
                    'header_color' => $row['header_color'] ?? '#d49b28',
                    'status' => $row['status'] ?? 'active',
                    'features' => !empty($row['features']) ? json_decode($row['features'], true) : [],
                    'sections' => !empty($row['sections']) ? json_decode($row['sections'], true) : [],
                    'created_at' => $row['created_at'] ?? date('Y-m-d H:i:s')
                ];
            }, $rawPackages);

            // 3. Fetch Batches from MySQL
            $batchStmt = $this->db->query("SELECT * FROM online_class_batches ORDER BY created_at DESC");
            $rawBatches = $batchStmt->fetchAll();
            $batches = array_map(function($row) {
                return [
                    'id' => $row['id'],
                    'name' => $row['batch_name'],
                    'batch_name' => $row['batch_name'],
                    'subject' => $row['subject'],
                    'class_name' => $row['class_name'],
                    'faculty_name' => $row['faculty_name'],
                    'schedule' => $row['schedule_text'],
                    'schedule_text' => $row['schedule_text'],
                    'timing' => $row['timing'],
                    'max_capacity' => (int)$row['max_seats'],
                    'max_seats' => (int)$row['max_seats'],
                    'enrolled_count' => (int)$row['enrolled_count'],
                    'meeting_link' => $row['meeting_url'],
                    'meeting_url' => $row['meeting_url'],
                    'status' => $row['status']
                ];
            }, $rawBatches);

            // 4. Fetch Lectures from MySQL
            $lecStmt = $this->db->query("SELECT * FROM online_class_lectures ORDER BY created_at DESC");
            $rawLectures = $lecStmt->fetchAll();
            $lectures = array_map(function($row) {
                return [
                    'id' => $row['id'],
                    'title' => $row['title'],
                    'subject' => $row['subject'],
                    'class_name' => $row['class_name'],
                    'duration' => $row['duration'],
                    'video_url' => $row['video_url'],
                    'desc' => $row['description'],
                    'description' => $row['description'],
                    'category' => $row['category'],
                    'thumbnail_text' => $row['thumbnail_text'],
                    'status' => $row['status']
                ];
            }, $rawLectures);

            Response::success([
                'hero_banner' => $heroBanner,
                'packages' => $packages,
                'all_packages_count' => count($packages),
                'batches' => $batches,
                'lectures' => $lectures
            ], 'Online classes catalog loaded from MySQL successfully.');

        } catch (Exception $e) {
            Response::error('Failed to load online classes: ' . $e->getMessage(), 500);
        }
    }

    // 2. Super Admin - Save / Update Hero Banner in MySQL
    public function saveHeroBanner(): void {
        try {
            $input = Validator::getJsonInput();
            $badge = trim($input['badge'] ?? 'FEATURED');
            $title = trim($input['title'] ?? 'Reasoning Online Classes for IMO, ISO(NSO) & IEO');
            $subtitle = trim($input['subtitle'] ?? 'Get expert guidance and improve your problem-solving skills.');
            $button_text = trim($input['button_text'] ?? 'ENROLL NOW →');
            $button_action = trim($input['button_action'] ?? 'packages');
            $is_active = !empty($input['is_active']) ? 1 : 0;

            $check = $this->db->query("SELECT id FROM online_class_hero ORDER BY id DESC LIMIT 1")->fetch();
            if ($check) {
                $stmt = $this->db->prepare("
                    UPDATE online_class_hero
                    SET badge = ?, title = ?, subtitle = ?, button_text = ?, button_action = ?, is_active = ?, updated_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$badge, $title, $subtitle, $button_text, $button_action, $is_active, $check['id']]);
            } else {
                $stmt = $this->db->prepare("
                    INSERT INTO online_class_hero (badge, title, subtitle, button_text, button_action, is_active)
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([$badge, $title, $subtitle, $button_text, $button_action, $is_active]);
            }

            Response::success([
                'badge' => $badge,
                'title' => $title,
                'subtitle' => $subtitle,
                'button_text' => $button_text,
                'button_action' => $button_action,
                'is_active' => (bool)$is_active
            ], 'Hero banner updated in MySQL successfully.');
        } catch (Exception $e) {
            Response::error('Failed to save hero banner in MySQL: ' . $e->getMessage(), 500);
        }
    }

    // 3. Super Admin - Create Online Class Package in MySQL
    public function createPackage(): void {
        try {
            $input = Validator::getJsonInput();
            $title = trim($input['title'] ?? '');
            if (empty($title)) {
                Response::error('Package title is required.', 422);
            }

            $id = 'oc_pkg_' . time() . '_' . rand(100, 999);
            $className = trim($input['class_name'] ?? 'Class 6');
            $subject = trim($input['subject'] ?? 'All Olympiads');
            $subjectCode = strtoupper(trim($input['subject_code'] ?? 'ALL'));
            $pkgType = trim($input['package_type'] ?? 'self_paced');
            $price = (float)($input['price'] ?? 2499.00);
            $originalPrice = (float)($input['original_price'] ?? 3499.00);
            $badgeText = trim($input['badge_text'] ?? 'Special Offer');
            $specialOfferText = trim($input['special_offer_text'] ?? '');
            $headerColor = trim($input['header_color'] ?? '#d49b28');
            $status = in_array($input['status'] ?? 'active', ['active', 'inactive']) ? $input['status'] : 'active';
            $features = is_array($input['features'] ?? null) ? $input['features'] : [];
            $sections = is_array($input['sections'] ?? null) ? $input['sections'] : [];

            $stmt = $this->db->prepare("
                INSERT INTO online_class_packages 
                (id, title, class_name, subject, subject_code, package_type, price, original_price, badge_text, special_offer_text, header_color, status, features, sections)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $id, $title, $className, $subject, $subjectCode, $pkgType, $price, $originalPrice,
                $badgeText, $specialOfferText, $headerColor, $status,
                json_encode($features, JSON_UNESCAPED_UNICODE),
                json_encode($sections, JSON_UNESCAPED_UNICODE)
            ]);

            $newPkg = [
                'id' => $id,
                'title' => $title,
                'class_name' => $className,
                'subject' => $subject,
                'subject_code' => $subjectCode,
                'package_type' => $pkgType,
                'price' => $price,
                'original_price' => $originalPrice,
                'badge_text' => $badgeText,
                'special_offer_text' => $specialOfferText,
                'header_color' => $headerColor,
                'status' => $status,
                'features' => $features,
                'sections' => $sections,
                'created_at' => date('Y-m-d H:i:s')
            ];

            Response::success($newPkg, 'Online class package created in MySQL successfully.', 201);
        } catch (Exception $e) {
            Response::error('Failed to create package in MySQL: ' . $e->getMessage(), 500);
        }
    }

    // 4. Super Admin - Update Online Class Package in MySQL
    public function updatePackage(string $id): void {
        try {
            $input = Validator::getJsonInput();
            $stmt = $this->db->prepare("SELECT * FROM online_class_packages WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();

            if (!$existing) {
                Response::error('Package not found.', 404);
            }

            $title = trim($input['title'] ?? $existing['title']);
            $className = trim($input['class_name'] ?? $existing['class_name']);
            $subject = trim($input['subject'] ?? $existing['subject']);
            $subjectCode = strtoupper(trim($input['subject_code'] ?? $existing['subject_code']));
            $pkgType = trim($input['package_type'] ?? $existing['package_type']);
            $price = isset($input['price']) ? (float)$input['price'] : (float)$existing['price'];
            $originalPrice = isset($input['original_price']) ? (float)$input['original_price'] : (float)$existing['original_price'];
            $badgeText = trim($input['badge_text'] ?? ($existing['badge_text'] ?? ''));
            $specialOfferText = trim($input['special_offer_text'] ?? ($existing['special_offer_text'] ?? ''));
            $headerColor = trim($input['header_color'] ?? ($existing['header_color'] ?? '#d49b28'));
            $status = in_array($input['status'] ?? '', ['active', 'inactive']) ? $input['status'] : $existing['status'];
            
            $features = isset($input['features']) && is_array($input['features']) 
                ? $input['features'] 
                : json_decode($existing['features'] ?? '[]', true);
            $sections = isset($input['sections']) && is_array($input['sections']) 
                ? $input['sections'] 
                : json_decode($existing['sections'] ?? '[]', true);

            $upd = $this->db->prepare("
                UPDATE online_class_packages 
                SET title = ?, class_name = ?, subject = ?, subject_code = ?, package_type = ?, 
                    price = ?, original_price = ?, badge_text = ?, special_offer_text = ?, 
                    header_color = ?, status = ?, features = ?, sections = ?, updated_at = NOW()
                WHERE id = ?
            ");
            $upd->execute([
                $title, $className, $subject, $subjectCode, $pkgType,
                $price, $originalPrice, $badgeText, $specialOfferText,
                $headerColor, $status,
                json_encode($features, JSON_UNESCAPED_UNICODE),
                json_encode($sections, JSON_UNESCAPED_UNICODE),
                $id
            ]);

            Response::success([
                'id' => $id,
                'title' => $title,
                'class_name' => $className,
                'subject' => $subject,
                'subject_code' => $subjectCode,
                'package_type' => $pkgType,
                'price' => $price,
                'original_price' => $originalPrice,
                'badge_text' => $badgeText,
                'special_offer_text' => $specialOfferText,
                'header_color' => $headerColor,
                'status' => $status,
                'features' => $features,
                'sections' => $sections
            ], 'Online class package updated in MySQL successfully.');
        } catch (Exception $e) {
            Response::error('Failed to update package in MySQL: ' . $e->getMessage(), 500);
        }
    }

    // 5. Super Admin - Delete Online Class Package from MySQL
    public function deletePackage(string $id): void {
        try {
            $stmt = $this->db->prepare("DELETE FROM online_class_packages WHERE id = ?");
            $stmt->execute([$id]);
            Response::success(['deleted_id' => $id], 'Package deleted from MySQL successfully.');
        } catch (Exception $e) {
            Response::error('Failed to delete package from MySQL: ' . $e->getMessage(), 500);
        }
    }

    // 6. Super Admin - Create Live Batch in MySQL
    public function createBatch(): void {
        try {
            $input = Validator::getJsonInput();
            $batchName = trim($input['name'] ?? $input['batch_name'] ?? '');
            if (empty($batchName)) {
                Response::error('Batch name is required.', 422);
            }

            $id = 'batch_' . time() . '_' . rand(100, 999);
            $subject = trim($input['subject'] ?? 'General');
            $className = trim($input['class_name'] ?? 'Class 6');
            $facultyName = trim($input['faculty_name'] ?? 'Senior Faculty');
            $scheduleText = trim($input['schedule'] ?? $input['schedule_text'] ?? 'Mon, Wed, Fri • 5:00 PM - 6:30 PM');
            $timing = trim($input['timing'] ?? '5:00 PM - 6:30 PM');
            $maxSeats = (int)($input['max_capacity'] ?? $input['max_seats'] ?? 50);
            $meetingUrl = trim($input['meeting_link'] ?? $input['meeting_url'] ?? '');
            $status = in_array($input['status'] ?? 'active', ['active', 'inactive']) ? $input['status'] : 'active';

            $stmt = $this->db->prepare("
                INSERT INTO online_class_batches 
                (id, batch_name, subject, class_name, faculty_name, schedule_text, timing, max_seats, enrolled_count, meeting_url, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
            ");
            $stmt->execute([
                $id, $batchName, $subject, $className, $facultyName, $scheduleText, $timing, $maxSeats, $meetingUrl, $status
            ]);

            $newBatch = [
                'id' => $id,
                'name' => $batchName,
                'batch_name' => $batchName,
                'subject' => $subject,
                'class_name' => $className,
                'faculty_name' => $facultyName,
                'schedule' => $scheduleText,
                'schedule_text' => $scheduleText,
                'timing' => $timing,
                'max_capacity' => $maxSeats,
                'max_seats' => $maxSeats,
                'enrolled_count' => 0,
                'meeting_link' => $meetingUrl,
                'meeting_url' => $meetingUrl,
                'status' => $status
            ];

            Response::success($newBatch, 'Live batch created in MySQL successfully.', 201);
        } catch (Exception $e) {
            Response::error('Failed to create batch in MySQL: ' . $e->getMessage(), 500);
        }
    }

    // 7. Super Admin - Delete Live Batch from MySQL
    public function deleteBatch(string $id): void {
        try {
            $stmt = $this->db->prepare("DELETE FROM online_class_batches WHERE id = ?");
            $stmt->execute([$id]);
            Response::success(['deleted_id' => $id], 'Live batch deleted from MySQL successfully.');
        } catch (Exception $e) {
            Response::error('Failed to delete batch from MySQL: ' . $e->getMessage(), 500);
        }
    }

    // 8. Super Admin - Create Video Lecture in MySQL
    public function createLecture(): void {
        try {
            $input = Validator::getJsonInput();
            $title = trim($input['title'] ?? '');
            if (empty($title)) {
                Response::error('Lecture title is required.', 422);
            }

            $id = 'lec_' . time() . '_' . rand(100, 999);
            $subject = trim($input['subject'] ?? 'General');
            $className = trim($input['class_name'] ?? 'Class 6');
            $duration = trim($input['duration'] ?? '45 mins');
            $videoUrl = trim($input['video_url'] ?? '');
            $desc = trim($input['desc'] ?? $input['description'] ?? '');
            $category = trim($input['category'] ?? 'PREPARATION');
            $thumbnailText = trim($input['thumbnail_text'] ?? '');
            $status = in_array($input['status'] ?? 'active', ['active', 'inactive']) ? $input['status'] : 'active';

            $stmt = $this->db->prepare("
                INSERT INTO online_class_lectures 
                (id, title, subject, class_name, duration, video_url, description, category, thumbnail_text, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $id, $title, $subject, $className, $duration, $videoUrl, $desc, $category, $thumbnailText, $status
            ]);

            $newLec = [
                'id' => $id,
                'title' => $title,
                'subject' => $subject,
                'class_name' => $className,
                'duration' => $duration,
                'video_url' => $videoUrl,
                'desc' => $desc,
                'description' => $desc,
                'category' => $category,
                'thumbnail_text' => $thumbnailText,
                'status' => $status
            ];

            Response::success($newLec, 'Video lecture added to MySQL successfully.', 201);
        } catch (Exception $e) {
            Response::error('Failed to create video lecture in MySQL: ' . $e->getMessage(), 500);
        }
    }

    // 9. Super Admin - Delete Video Lecture from MySQL
    public function deleteLecture(string $id): void {
        try {
            $stmt = $this->db->prepare("DELETE FROM online_class_lectures WHERE id = ?");
            $stmt->execute([$id]);
            Response::success(['deleted_id' => $id], 'Video lecture deleted from MySQL successfully.');
        } catch (Exception $e) {
            Response::error('Failed to delete video lecture from MySQL: ' . $e->getMessage(), 500);
        }
    }
}
