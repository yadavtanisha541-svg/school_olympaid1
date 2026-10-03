<?php
require_once __DIR__ . '/config/database.php';
use App\Config\Database;

$db = Database::getConnection();

// 1. Create study_packages table
$db->exec("
    CREATE TABLE IF NOT EXISTS study_packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        package_key VARCHAR(100) NULL,
        class_id INT NULL,
        class_name VARCHAR(100) NOT NULL DEFAULT 'Class 6',
        subject_id INT NULL,
        subject_code VARCHAR(50) NOT NULL DEFAULT 'ALL',
        subject_name VARCHAR(150) NOT NULL DEFAULT 'All Olympiads',
        price DECIMAL(10,2) NOT NULL DEFAULT 499.00,
        original_price DECIMAL(10,2) NOT NULL DEFAULT 999.00,
        description TEXT NULL,
        points_json LONGTEXT NOT NULL,
        badge_text VARCHAR(100) NULL DEFAULT 'Popular',
        header_color VARCHAR(50) NOT NULL DEFAULT '#4895d9',
        status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// 2. Create package_purchases table
$db->exec("
    CREATE TABLE IF NOT EXISTS package_purchases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE NOT NULL,
        student_id INT NULL,
        student_name VARCHAR(255) NOT NULL,
        student_email VARCHAR(255) NOT NULL,
        student_phone VARCHAR(50) NULL,
        student_class VARCHAR(100) NOT NULL DEFAULT 'Class 6',
        package_id INT NULL,
        package_title VARCHAR(255) NOT NULL,
        subject_name VARCHAR(150) NOT NULL DEFAULT 'All Olympiads',
        price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        original_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        payment_method VARCHAR(50) NOT NULL DEFAULT 'Online UPI / Card',
        transaction_id VARCHAR(100) NOT NULL,
        status ENUM('completed', 'active', 'pending', 'refunded') NOT NULL DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// 3. Seed initial default packages if empty
$chk = $db->query("SELECT COUNT(*) FROM study_packages")->fetchColumn();
if ($chk == 0) {
    $ins = $db->prepare("
        INSERT INTO study_packages (title, package_key, class_name, subject_code, subject_name, price, original_price, points_json, badge_text, header_color, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    ");

    $initialPkgs = [
        [
            'Olympiads Level-2 Champs Package - Class 6',
            'l2_champs',
            'Class 6',
            'IMO',
            'Mathematics & Science Olympiads',
            1999.00,
            2500.00,
            json_encode([
                '5 Grand Level-2 National Mock Tests',
                'Advanced HOTS & Tie-Breaker Problem Sets',
                'Detailed Video Solutions & Step-by-Step Analysis',
                'National Benchmark Percentile & AIR Ranking',
                'Unlimited Test Retake Attempts for 365 Days'
            ]),
            'Level 2 Champs',
            '#4895d9'
        ],
        [
            'Comprehensive Practice Test Pack - Class 6',
            'comp_pack',
            'Class 6',
            'ALL',
            'IMO, ISO & IEO Olympiads',
            1499.00,
            1999.00,
            json_encode([
                '50+ Chapter-wise Diagnostic Tests with Instant Scoring',
                'Previous 5 Years Solved Official Papers (2020-2024)',
                '10 Full-Length Timed Model Examination Papers',
                'Performance Weakness Diagnostic Heatmap',
                'Full Validity for Academic Year 2026-27'
            ]),
            'Best Value',
            '#0284c7'
        ],
        [
            'Chapter-wise Synopsis & Worksheets Kit - Class 6',
            'synopsis_kit',
            'Class 6',
            'ISO',
            'Science Olympiad (ISO/NSO)',
            499.00,
            999.00,
            json_encode([
                'High-Yield Quick Revision Formula & Concept Sheets',
                'Downloadable Printable PDF Question Worksheets',
                'Key Olympiad Shortcuts & Speed Arithmetic Tips',
                'Instant Access on Web and Mobile App'
            ]),
            'Popular Starter',
            '#059669'
        ],
        [
            'Olympiads Level-2 Champs Package - Class 8',
            'l2_champs_c8',
            'Class 8',
            'ALL',
            'All Olympiad Disciplines (IMO, ISO, ICSO)',
            1999.00,
            2500.00,
            json_encode([
                '5 Grand Level-2 National Mock Tests',
                'Higher Order Thinking Skills (HOTS) Achievers Vault',
                'Detailed Video Solutions & Mentor Notes',
                'National AIR Benchmark & Certificate of Merit',
                '365 Days Full Interactive Access'
            ]),
            'Level 2 Champs',
            '#4895d9'
        ],
        [
            'Comprehensive Diagnostic Package - Class 8',
            'comp_pack_c8',
            'Class 8',
            'IMO',
            'Mathematics Olympiad (IMO)',
            1499.00,
            1999.00,
            json_encode([
                '40 Chapter-wise Mathematical Practice Modules',
                'Previous 6 Years Solved Past Papers with Key',
                '8 Full Mock Tests under Exam Hall Timer',
                'AI Topic Strength & Weakness Analytics'
            ]),
            'Recommended',
            '#0284c7'
        ]
    ];

    foreach ($initialPkgs as $p) {
        $ins->execute($p);
    }
}

// 4. Seed initial realistic student purchases if empty
$chkPurchases = $db->query("SELECT COUNT(*) FROM package_purchases")->fetchColumn();
if ($chkPurchases == 0) {
    $insPurchase = $db->prepare("
        INSERT INTO package_purchases (order_id, student_id, student_name, student_email, student_phone, student_class, package_id, package_title, subject_name, price, original_price, payment_method, transaction_id, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?)
    ");

    $samplePurchases = [
        ['PKG-ORD-90214', 1, 'Aarav Sharma', 'aarav.sharma@example.com', '+91 98765 43210', 'Class 6', 1, 'Olympiads Level-2 Champs Package - Class 6', 'Mathematics & Science Olympiads', 1999.00, 2500.00, 'UPI (Google Pay)', 'TXN_UPI_884920194', date('Y-m-d H:i:s', strtotime('-1 days'))],
        ['PKG-ORD-90215', 2, 'Priya Patel', 'priya.patel@example.com', '+91 98123 45678', 'Class 6', 2, 'Comprehensive Practice Test Pack - Class 6', 'IMO, ISO & IEO Olympiads', 1499.00, 1999.00, 'Debit Card (HDFC)', 'TXN_CARD_773910294', date('Y-m-d H:i:s', strtotime('-2 days'))],
        ['PKG-ORD-90216', 3, 'Rohan Verma', 'rohan.v@example.com', '+91 99887 76655', 'Class 6', 3, 'Chapter-wise Synopsis & Worksheets Kit - Class 6', 'Science Olympiad (ISO/NSO)', 499.00, 999.00, 'Paytm Wallet', 'TXN_WLT_662819028', date('Y-m-d H:i:s', strtotime('-3 days'))],
        ['PKG-ORD-90217', 4, 'Ananya Sen', 'ananya.sen@example.com', '+91 97766 55443', 'Class 8', 4, 'Olympiads Level-2 Champs Package - Class 8', 'All Olympiad Disciplines (IMO, ISO, ICSO)', 1999.00, 2500.00, 'Net Banking (SBI)', 'TXN_NET_551920391', date('Y-m-d H:i:s', strtotime('-4 hours'))],
        ['PKG-ORD-90218', 5, 'Vivaan Gupta', 'vivaan.g@example.com', '+91 96655 44332', 'Class 8', 5, 'Comprehensive Diagnostic Package - Class 8', 'Mathematics Olympiad (IMO)', 1499.00, 1999.00, 'UPI (PhonePe)', 'TXN_UPI_440918273', date('Y-m-d H:i:s', strtotime('-10 mins'))]
    ];

    foreach ($samplePurchases as $sp) {
        $insPurchase->execute($sp);
    }
}

echo json_encode(['success' => true, 'message' => 'Package tables migrated and initialized successfully!']);
