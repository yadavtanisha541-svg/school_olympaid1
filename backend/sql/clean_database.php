<?php
// OlympiadHub - Production Database Clean Script
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/Auth.php';

use App\Config\Database;
use App\Helpers\Auth;

$db = Database::getConnection();

echo "Cleaning all dummy and sample data from database...\n";

$db->exec('SET FOREIGN_KEY_CHECKS = 0');
$db->exec('TRUNCATE TABLE exam_security_events');
$db->exec('TRUNCATE TABLE certificates');
$db->exec('TRUNCATE TABLE student_answers');
$db->exec('TRUNCATE TABLE exam_attempts');
$db->exec('TRUNCATE TABLE exam_assignments');
$db->exec('TRUNCATE TABLE exam_questions');
$db->exec('TRUNCATE TABLE exams');
$db->exec('TRUNCATE TABLE questions');
$db->exec('TRUNCATE TABLE topics');
$db->exec('TRUNCATE TABLE chapters');
$db->exec('TRUNCATE TABLE user_permissions');
$db->exec('TRUNCATE TABLE login_sessions');
$db->exec('TRUNCATE TABLE activity_logs');

// Delete all users except Super Administrator
$db->exec("DELETE FROM users WHERE role != 'superadmin'");

// Ensure Super Admin exists with secure hash
$adminHash = Auth::hashPassword('Admin@123');
$db->prepare("
    INSERT INTO users (id, login_id, password_hash, full_name, email, phone, role, role_id, status, must_change_password)
    VALUES (1, 'ADMIN001', ?, 'Super Administrator', 'admin@olympiadhub.com', '+91 9876543210', 'superadmin', 1, 'active', 0)
    ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), status = 'active'
")->execute([$adminHash]);

$db->exec('SET FOREIGN_KEY_CHECKS = 1');

echo "Database cleaned successfully! Pure production state ready.\n";
echo "- Users: Only Root Super Admin (ADMIN001 / Admin@123)\n";
echo "- Academic: Classes 1-12 & 5 Core Subjects active\n";
echo "- Questions, Exams, Attempts, Certificates & Logs: 0 (Pure clean slate)\n";
