<?php
// OlympiadHub - Seed Online Classes in MySQL

require_once __DIR__ . '/../config/database.php';

use App\Config\Database;

try {
    $pdo = Database::getConnection();

    $jsonFile = __DIR__ . '/online_classes_data.json';
    if (!file_exists($jsonFile)) {
        die("online_classes_data.json not found.\n");
    }

    $data = json_decode(file_get_contents($jsonFile), true);

    // 1. Seed Hero Banner
    $hero = $data['hero_banner'] ?? null;
    if ($hero) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM online_class_hero");
        if ((int)$stmt->fetchColumn() === 0) {
            $ins = $pdo->prepare("
                INSERT INTO online_class_hero (badge, title, subtitle, button_text, button_action, is_active)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $ins->execute([
                $hero['badge'] ?? 'FEATURED',
                $hero['title'] ?? 'Reasoning Online Classes for IMO, ISO(NSO) & IEO',
                $hero['subtitle'] ?? 'Master logical reasoning and critical thinking with live interactive sessions.',
                $hero['button_text'] ?? 'ENROLL NOW →',
                $hero['button_action'] ?? 'packages',
                !empty($hero['is_active']) ? 1 : 0
            ]);
            echo "Hero banner seeded in MySQL.\n";
        }
    }

    // 2. Seed Packages
    $packages = $data['packages'] ?? [];
    if (!empty($packages)) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM online_class_packages");
        if ((int)$stmt->fetchColumn() === 0) {
            $ins = $pdo->prepare("
                INSERT INTO online_class_packages 
                (id, title, class_name, subject, subject_code, package_type, price, original_price, badge_text, special_offer_text, header_color, status, features, sections)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($packages as $pkg) {
                $ins->execute([
                    $pkg['id'],
                    $pkg['title'],
                    $pkg['class_name'] ?? 'Class 6',
                    $pkg['subject'] ?? 'All Olympiads',
                    $pkg['subject_code'] ?? 'ALL',
                    $pkg['package_type'] ?? 'self_paced',
                    $pkg['price'] ?? 2499.00,
                    $pkg['original_price'] ?? 3499.00,
                    $pkg['badge_text'] ?? 'Special Offer',
                    $pkg['special_offer_text'] ?? '',
                    $pkg['header_color'] ?? '#d49b28',
                    $pkg['status'] ?? 'active',
                    json_encode($pkg['features'] ?? []),
                    json_encode($pkg['sections'] ?? [])
                ]);
            }
            echo "Seeded " . count($packages) . " packages into MySQL.\n";
        }
    }

    // 3. Seed Batches
    $batches = $data['batches'] ?? [];
    if (!empty($batches)) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM online_class_batches");
        if ((int)$stmt->fetchColumn() === 0) {
            $ins = $pdo->prepare("
                INSERT INTO online_class_batches 
                (id, batch_name, subject, class_name, faculty_name, schedule_text, timing, max_seats, enrolled_count, meeting_url, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($batches as $b) {
                $ins->execute([
                    $b['id'],
                    $b['name'] ?? $b['batch_name'] ?? 'Batch',
                    $b['subject'] ?? 'Mathematics',
                    $b['class_name'] ?? 'Class 6',
                    $b['faculty_name'] ?? 'Faculty',
                    $b['schedule'] ?? $b['schedule_text'] ?? 'Mon, Wed, Fri',
                    $b['timing'] ?? '5:00 PM - 6:30 PM',
                    $b['max_capacity'] ?? $b['max_seats'] ?? 50,
                    $b['enrolled_count'] ?? 0,
                    $b['meeting_link'] ?? $b['meeting_url'] ?? '',
                    $b['status'] ?? 'active'
                ]);
            }
            echo "Seeded " . count($batches) . " batches into MySQL.\n";
        }
    }

    // 4. Seed Lectures
    $lectures = $data['lectures'] ?? [];
    if (!empty($lectures)) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM online_class_lectures");
        if ((int)$stmt->fetchColumn() === 0) {
            $ins = $pdo->prepare("
                INSERT INTO online_class_lectures 
                (id, title, subject, class_name, duration, video_url, description, category, thumbnail_text, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            foreach ($lectures as $lec) {
                $ins->execute([
                    $lec['id'],
                    $lec['title'],
                    $lec['subject'] ?? 'General',
                    $lec['class_name'] ?? 'Class 6',
                    $lec['duration'] ?? '45 mins',
                    $lec['video_url'] ?? '',
                    $lec['desc'] ?? $lec['description'] ?? '',
                    $lec['category'] ?? 'PREPARATION',
                    $lec['thumbnail_text'] ?? '',
                    $lec['status'] ?? 'active'
                ]);
            }
            echo "Seeded " . count($lectures) . " lectures into MySQL.\n";
        }
    }

    echo "MySQL Online Classes seed finished successfully!\n";

} catch (Exception $e) {
    echo "Seed Error: " . $e->getMessage() . "\n";
}
