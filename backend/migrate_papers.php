<?php
require_once __DIR__ . '/config/Database.php';

try {
    $db = App\Config\Database::getConnection();
    // Alter exam_type to VARCHAR(50) to allow any category (sample_paper, previous_year, generated, mock, etc.)
    $db->exec("ALTER TABLE `exams` MODIFY `exam_type` VARCHAR(50) NOT NULL DEFAULT 'practice'");
    
    // Add exam_year column if not exists
    $cols = $db->query("SHOW COLUMNS FROM `exams` LIKE 'exam_year'")->fetchAll();
    if (empty($cols)) {
        $db->exec("ALTER TABLE `exams` ADD COLUMN `exam_year` VARCHAR(20) NULL DEFAULT '2024' AFTER `exam_type`");
    }

    // Add paper_category column if not exists
    $cols = $db->query("SHOW COLUMNS FROM `exams` LIKE 'paper_category'")->fetchAll();
    if (empty($cols)) {
        $db->exec("ALTER TABLE `exams` ADD COLUMN `paper_category` VARCHAR(50) NULL DEFAULT 'generator' AFTER `exam_year`");
    }

    echo "Database updated successfully!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
