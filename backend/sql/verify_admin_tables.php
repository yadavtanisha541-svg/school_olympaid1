<?php
require_once __DIR__ . '/../config/database.php';

try {
    $pdo = \App\Config\Database::getConnection();

    // Verify coordinator_inquiries table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `coordinator_inquiries` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `phone` VARCHAR(30) NOT NULL,
        `city` VARCHAR(100) NULL,
        `school_name` VARCHAR(255) NULL,
        `experience` VARCHAR(100) NULL,
        `message` TEXT NULL,
        `status` ENUM('pending', 'contacted', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // Verify school_registrations table status column
    $cols = $pdo->query("SHOW COLUMNS FROM `school_registrations` LIKE 'status'")->fetchAll();
    if (empty($cols)) {
        $pdo->exec("ALTER TABLE `school_registrations` ADD COLUMN `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved' AFTER `selected_subjects`");
    }

    echo "Tables & columns verified for Admin Applicant Management!\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
