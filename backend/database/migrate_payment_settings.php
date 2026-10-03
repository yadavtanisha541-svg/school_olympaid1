<?php
// OlympiadHub - Payment & Bank Settings Migration

require_once __DIR__ . '/../config/database.php';

use App\Config\Database;

try {
    $pdo = Database::getConnection();

    // 1. Create payment_bank_settings table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS payment_bank_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            bank_name VARCHAR(150) NOT NULL DEFAULT 'State Bank of India',
            account_holder_name VARCHAR(200) NOT NULL DEFAULT 'OlympiadHub Education Pvt Ltd',
            account_number VARCHAR(100) NOT NULL DEFAULT '98765432109876',
            ifsc_code VARCHAR(50) NOT NULL DEFAULT 'SBIN0001234',
            branch_name VARCHAR(150) NOT NULL DEFAULT 'Main Branch, Connaught Place',
            account_type VARCHAR(50) NOT NULL DEFAULT 'Current Account',
            upi_id VARCHAR(100) NOT NULL DEFAULT 'olympiadhub@upi',
            upi_phone VARCHAR(50) NOT NULL DEFAULT '+91 9876543210',
            upi_qr_url VARCHAR(500) NULL,
            instructions TEXT NULL,
            is_active TINYINT(1) NOT NULL DEFAULT 1,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "Table 'payment_bank_settings' created/verified.\n";

    // Seed default bank details if empty
    $check = $pdo->query("SELECT COUNT(*) FROM payment_bank_settings")->fetchColumn();
    if ((int)$check === 0) {
        $ins = $pdo->prepare("
            INSERT INTO payment_bank_settings (
                bank_name, account_holder_name, account_number, ifsc_code, branch_name,
                account_type, upi_id, upi_phone, instructions, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        ");
        $ins->execute([
            'State Bank of India',
            'OlympiadHub Official Organization',
            '398450123984',
            'SBIN0005432',
            'Central Hub Branch, New Delhi',
            'Current Account',
            'olympiadhub.edu@okaxis',
            '+91 98765 43210',
            'Please transfer the exact total payable amount via UPI / IMPS / NEFT. After completing payment, enter your 12-digit UTR / Transaction Reference Number below to confirm and activate your package immediately.'
        ]);
        echo "Default bank & UPI settings seeded in MySQL.\n";
    }

    // 2. Enhance package_purchases table with billing fields
    $cols = $pdo->query("SHOW COLUMNS FROM package_purchases")->fetchAll(PDO::FETCH_COLUMN);
    
    $neededCols = [
        'billing_name' => "VARCHAR(255) NULL",
        'billing_address' => "TEXT NULL",
        'zip_code' => "VARCHAR(32) NULL",
        'city' => "VARCHAR(100) NULL",
        'state' => "VARCHAR(100) NULL",
        'country' => "VARCHAR(100) DEFAULT 'India'",
        'currency' => "VARCHAR(32) DEFAULT 'Indian Rupee'",
        'gst_amount' => "DECIMAL(10,2) DEFAULT 0.00",
        'subtotal' => "DECIMAL(10,2) DEFAULT 0.00",
        'total_amount' => "DECIMAL(10,2) DEFAULT 0.00",
        'coupon_code' => "VARCHAR(64) NULL",
        'coupon_discount' => "DECIMAL(10,2) DEFAULT 0.00",
        'payer_name' => "VARCHAR(255) NULL",
        'payer_bank_name' => "VARCHAR(150) NULL",
        'payer_remarks' => "TEXT NULL",
        'order_items_json' => "JSON NULL"
    ];

    foreach ($neededCols as $colName => $colDef) {
        if (!in_array($colName, $cols)) {
            $pdo->exec("ALTER TABLE package_purchases ADD COLUMN $colName $colDef");
            echo "Added column '$colName' to package_purchases.\n";
        }
    }

    echo "Payment migration completed successfully!\n";

} catch (Exception $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
