<?php
require_once __DIR__ . '/../config/Database.php';
$db = App\Config\Database::getConnection();

$users = $db->query("SELECT id, full_name, login_id, role, school_name, city FROM users WHERE role='student'")->fetchAll(PDO::FETCH_ASSOC);
print_r($users);
