<?php
require_once __DIR__ . '/../config/database.php';
use App\Config\Database;

$pdo = Database::getConnection();
$stmt = $pdo->query('SELECT id, order_id, billing_name, transaction_id, total_amount, status, created_at FROM package_purchases ORDER BY id DESC LIMIT 2');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
