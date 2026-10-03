<?php
require_once 'C:/Users/HP/.gemini/antigravity/scratch/olympiadhub/backend/config/database.php';
$pdo = App\Config\Database::getConnection();

// Add rich profile fields to users table if they don't exist
$columnsToAdd = [
    "gender" => "VARCHAR(20) NULL AFTER class_id",
    "dob" => "DATE NULL AFTER gender",
    "parent_name" => "VARCHAR(120) NULL AFTER dob",
    "school_name" => "VARCHAR(200) NULL AFTER parent_name",
    "school_board" => "VARCHAR(100) NULL AFTER school_name",
    "school_code" => "VARCHAR(50) NULL AFTER school_board",
    "designation" => "VARCHAR(100) NULL AFTER school_code",
    "principal_name" => "VARCHAR(120) NULL AFTER designation",
    "address" => "TEXT NULL AFTER principal_name",
    "city" => "VARCHAR(100) NULL AFTER address",
    "state" => "VARCHAR(100) NULL AFTER city",
    "pincode" => "VARCHAR(20) NULL AFTER state",
    "registration_number" => "VARCHAR(100) NULL AFTER login_id",
    "extra_data" => "LONGTEXT NULL AFTER avatar"
];

$existingCols = $pdo->query("SHOW COLUMNS FROM users")->fetchAll(PDO::FETCH_COLUMN);

foreach ($columnsToAdd as $col => $def) {
    if (!in_array($col, $existingCols)) {
        $pdo->exec("ALTER TABLE users ADD COLUMN $col $def");
        echo "Added column $col to users table.\n";
    } else {
        echo "Column $col already exists.\n";
    }
}

// Ensure registration table or registrations log table exists
$pdo->exec("
CREATE TABLE IF NOT EXISTS student_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    student_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NULL,
    dob DATE NULL,
    parent_name VARCHAR(150) NULL,
    school_name VARCHAR(200) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    pincode VARCHAR(20) NULL,
    school_pincode VARCHAR(20) NULL,
    selected_olympiads LONGTEXT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (user_id),
    INDEX (registration_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$pdo->exec("
CREATE TABLE IF NOT EXISTS school_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    teacher_name VARCHAR(150) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    school_name VARCHAR(200) NOT NULL,
    school_board VARCHAR(100) NOT NULL,
    school_code VARCHAR(50) NULL,
    principal_name VARCHAR(150) NOT NULL,
    student_count VARCHAR(50) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    pincode VARCHAR(20) NULL,
    selected_subjects LONGTEXT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (user_id),
    INDEX (registration_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

echo "Database migration completed successfully!\n";
