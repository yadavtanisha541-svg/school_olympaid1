<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/Auth.php';

use App\Config\Database;
use App\Helpers\Auth;

$db = Database::getConnection();

// Teacher 1 (TEACH001 & TCH101)
$teachHash = Auth::hashPassword('Teacher@123');
foreach ([['TEACH001', 'Senior Teacher'], ['TCH101', 'Dr. Ramesh Verma']] as [$tid, $tname]) {
    $db->prepare("
        INSERT INTO users (login_id, password_hash, full_name, email, phone, role, role_id, status, must_change_password)
        VALUES (?, ?, ?, ?, '+91 9876543211', 'teacher', 2, 'active', 0)
        ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), status = 'active'
    ")->execute([$tid, $teachHash, $tname, strtolower($tid) . '@olympiadhub.com']);
    
    $uid = $db->query("SELECT id FROM users WHERE login_id = '$tid'")->fetchColumn();
    $allPerms = $db->query("SELECT id FROM permissions")->fetchAll(PDO::FETCH_COLUMN);
    $permStmt = $db->prepare("INSERT IGNORE INTO user_permissions (user_id, permission_id) VALUES (?, ?)");
    foreach ($allPerms as $pId) {
        $permStmt->execute([$uid, $pId]);
    }
}

// Student 1 (STUD001 & STU1001)
$class10Id = $db->query("SELECT id FROM academic_classes WHERE code = 'CLASS10' OR order_no = 10 LIMIT 1")->fetchColumn() ?: 1;
$studHash = Auth::hashPassword('Student@123');
foreach ([['STUD001', 'Aarav Sharma'], ['STU1001', 'Aarav Sharma']] as [$sid, $sname]) {
    $db->prepare("
        INSERT INTO users (login_id, password_hash, full_name, email, phone, role, role_id, class_id, status, must_change_password)
        VALUES (?, ?, ?, ?, '+91 9876543212', 'student', 3, ?, 'active', 0)
        ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), status = 'active'
    ")->execute([$sid, $studHash, $sname, strtolower($sid) . '@olympiadhub.com', $class10Id]);
}

echo "Created default credentials successfully!\n";
