<?php
require_once __DIR__ . '/../config/Database.php';
$db = App\Config\Database::getConnection();

echo "=== USERS COLUMNS ===\n";
$cols = $db->query("SHOW COLUMNS FROM users")->fetchAll(PDO::FETCH_ASSOC);
foreach ($cols as $c) {
    echo $c["Field"] . " (" . $c["Type"] . ")\n";
}

echo "\n=== ALL TABLES ===\n";
$tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_NUM);
foreach ($tables as $t) {
    echo $t[0] . "\n";
}

echo "\n=== SCHOOL DATA IN USERS ===\n";
$userData = $db->query("SELECT id, full_name, login_id, school_id FROM users LIMIT 10")->fetchAll(PDO::FETCH_ASSOC);
print_r($userData);
