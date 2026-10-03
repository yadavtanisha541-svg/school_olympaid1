<?php
require_once __DIR__ . '/../config/database.php';
use App\Config\Database;

$pdo = Database::getConnection();

echo "=== package_purchases ===\n";
$stmt = $pdo->query("DESCRIBE package_purchases");
foreach ($stmt->fetchAll() as $row) {
    echo " - " . $row['Field'] . " (" . $row['Type'] . ")\n";
}

echo "\n=== system_settings ===\n";
$stmt = $pdo->query("DESCRIBE system_settings");
foreach ($stmt->fetchAll() as $row) {
    echo " - " . $row['Field'] . " (" . $row['Type'] . ")\n";
}
