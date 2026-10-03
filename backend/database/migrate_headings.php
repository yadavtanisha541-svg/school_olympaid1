<?php
require_once __DIR__ . '/../config/database.php';
use App\Config\Database;

$db = Database::getConnection();

try {
    $db->exec("ALTER TABLE class_subject_content ADD COLUMN custom_title VARCHAR(255) NULL AFTER class_name");
    echo "custom_title added\n";
} catch (Exception $e) {
    echo "custom_title info: " . $e->getMessage() . "\n";
}

try {
    $db->exec("ALTER TABLE class_subject_content ADD COLUMN headings_json LONGTEXT NULL AFTER custom_title");
    echo "headings_json added\n";
} catch (Exception $e) {
    echo "headings_json info: " . $e->getMessage() . "\n";
}
echo "Migration complete.\n";
