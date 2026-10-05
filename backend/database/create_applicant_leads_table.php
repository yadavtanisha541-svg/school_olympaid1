<?php
require_once __DIR__ . '/../config/Database.php';

use App\Config\Database;

$db = Database::getConnection();

$sql = "
CREATE TABLE IF NOT EXISTS `new_applicant_leads` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `applicant_id` VARCHAR(50) NOT NULL UNIQUE,
    `candidate_name` VARCHAR(255) NOT NULL,
    `country` VARCHAR(100) DEFAULT 'India',
    `class_name` VARCHAR(50) NOT NULL,
    `school_name` VARCHAR(255) DEFAULT NULL,
    `email` VARCHAR(255) NOT NULL,
    `mobile` VARCHAR(50) NOT NULL,
    `status` VARCHAR(50) DEFAULT 'new',
    `notes` TEXT DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_status` (`status`),
    INDEX `idx_class` (`class_name`),
    INDEX `idx_email` (`email`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";

$db->exec($sql);
echo "Table new_applicant_leads created/verified successfully!\n";
