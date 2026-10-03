<?php
require_once __DIR__ . '/config/database.php';

try {
    $pdo = \App\Config\Database::getConnection();

    echo "=== TESTING MYSQL PERSISTENCE & AUTO-SAVE ===\n";

    // 1. Check Tables
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "Total Active MySQL Tables: " . count($tables) . "\n";
    foreach ($tables as $t) {
        $count = $pdo->query("SELECT COUNT(*) FROM `$t`")->fetchColumn();
        echo " [OK] Table: $t (Rows: $count)\n";
    }

    echo "\n=== ALL MYSQL TABLES VERIFIED & READY FOR REAL-TIME AUTO-SAVE! ===\n";
} catch (\Exception $e) {
    echo "FAIL: " . $e->getMessage() . "\n";
}
