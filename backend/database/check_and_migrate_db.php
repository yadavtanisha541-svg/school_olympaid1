<?php
// OlympiadHub - MySQL Database Migration & Setup Script

require_once __DIR__ . '/../config/database.php';

use App\Config\Database;

try {
    // 1. Ensure database exists
    $rawPdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    $rawPdo->exec("CREATE DATABASE IF NOT EXISTS olympiadhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database 'olympiadhub' verified.\n";

    $pdo = Database::getConnection();

    // 2. Create online_classes_packages table
    $pdo->exec("
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
    ");
    echo "Table 'online_class_packages' created/verified.\n";

    // 3. Create online_classes_hero_banner table
    $pdo->exec("
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
    ");
    echo "Table 'online_class_hero' created/verified.\n";

    // 4. Create online_classes_batches table
    $pdo->exec("
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
    ");
    echo "Table 'online_class_batches' created/verified.\n";

    // 5. Create online_classes_lectures table
    $pdo->exec("
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
    echo "Table 'online_class_lectures' created/verified.\n";

    // List all tables in DB
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "\nTotal tables in 'olympiadhub' database: " . count($tables) . "\n";
    foreach ($tables as $tbl) {
        echo " - " . $tbl . "\n";
    }

} catch (Exception $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
