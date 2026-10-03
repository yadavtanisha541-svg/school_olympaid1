<?php
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../backend/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) return;
    $relativeClass = substr($class, $len);
    $parts = explode('\\', $relativeClass);
    if (count($parts) > 1) $parts[0] = strtolower($parts[0]);
    $file = $baseDir . implode('/', $parts) . '.php';
    if (file_exists($file)) require_once $file;
});

use App\Config\Database;
use App\Helpers\Auth;

$db = Database::getConnection();
// Teacher ID 13
$teacher = $db->query("SELECT * FROM users WHERE id = 13")->fetch();
$token = Auth::createSession((int)$teacher['id']);

$ch = curl_init('http://127.0.0.1:8000/api/results');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $token"]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Teacher: {$teacher['full_name']} (ID: {$teacher['id']})\n";
echo "HTTP Code: $httpCode\n";
echo "Response: " . $response . "\n";
