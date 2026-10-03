<?php
require_once __DIR__ . '/../config/database.php';
$pdo = App\Config\Database::getConnection();

$pdo->exec("
CREATE TABLE IF NOT EXISTS coordinator_inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

echo "coordinator_inquiries table is ready in MySQL!\n";
