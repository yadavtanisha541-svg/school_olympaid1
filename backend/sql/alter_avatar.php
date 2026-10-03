<?php
require_once __DIR__ . '/../config/database.php';
use App\Config\Database;

try {
    $db = Database::getConnection();
    $db->exec("ALTER TABLE `users` MODIFY COLUMN `avatar` LONGTEXT NULL");
    echo "Column avatar modified successfully.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
