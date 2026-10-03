<?php
require_once __DIR__ . '/../config/database.php';

try {
    $pdo = \App\Config\Database::getConnection();

    // 1. Workbook Orders Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `workbook_orders` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `order_id` VARCHAR(50) NOT NULL UNIQUE,
        `user_type` ENUM('student', 'teacher') NOT NULL DEFAULT 'student',
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `whatsapp` VARCHAR(30) NOT NULL,
        `class_level` VARCHAR(100) NOT NULL,
        `format` ENUM('digital', 'physical') NOT NULL DEFAULT 'digital',
        `books_json` LONGTEXT NOT NULL,
        `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `delivery_charge` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `grand_total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        `address_json` LONGTEXT NULL,
        `status` ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered') NOT NULL DEFAULT 'confirmed',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 2. Free Trial Attempts Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `free_trial_attempts` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `student_name` VARCHAR(255) NULL,
        `email` VARCHAR(255) NULL,
        `exam_id` VARCHAR(100) NOT NULL,
        `exam_title` VARCHAR(255) NOT NULL,
        `grade_level` VARCHAR(50) NOT NULL,
        `score` INT NOT NULL DEFAULT 0,
        `total_questions` INT NOT NULL DEFAULT 0,
        `correct` INT NOT NULL DEFAULT 0,
        `wrong` INT NOT NULL DEFAULT 0,
        `unattempted` INT NOT NULL DEFAULT 0,
        `accuracy` INT NOT NULL DEFAULT 0,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    echo "Tables workbook_orders and free_trial_attempts created/verified successfully!\n";
} catch (\Exception $e) {
    echo "MIGRATION ERROR: " . $e->getMessage() . "\n";
}
