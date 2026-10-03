<?php
require_once __DIR__ . '/config/database.php';
try {
    $pdo = \App\Config\Database::getConnection();
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "CONNECTED TO MYSQL!\nTotal Tables: " . count($tables) . "\n";
    foreach ($tables as $t) {
        $count = $pdo->query("SELECT COUNT(*) FROM `$t`")->fetchColumn();
        echo " - $t ($count rows)\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
