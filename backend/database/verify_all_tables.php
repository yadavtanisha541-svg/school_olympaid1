<?php
require_once __DIR__ . '/../config/Database.php';

use App\Config\Database;

$db = Database::getConnection();
$stmt = $db->query("SHOW TABLES");
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

echo "Total tables in database: " . count($tables) . "\n";
echo "Tables list:\n";
foreach ($tables as $t) {
    $countStmt = $db->query("SELECT COUNT(*) FROM `$t`");
    $count = $countStmt->fetchColumn();
    echo " - $t ($count rows)\n";
}
