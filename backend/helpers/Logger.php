<?php
namespace App\Helpers;

use App\Config\Database;

class Logger {
    public static function log(string $action, string $module, ?array $details = null, ?int $userId = null, ?string $userRole = null): void {
        try {
            $db = Database::getConnection();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            
            if ($userId === null && isset($GLOBALS['currentUser'])) {
                $userId = $GLOBALS['currentUser']['id'] ?? null;
                $userRole = $GLOBALS['currentUser']['role'] ?? null;
            }

            $stmt = $db->prepare("
                INSERT INTO activity_logs (user_id, user_role, action, module, details_json, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $userId,
                $userRole,
                $action,
                $module,
                $details ? json_encode($details, JSON_UNESCAPED_UNICODE) : null,
                $ip
            ]);
        } catch (\Exception $e) {
            // Silently ignore logging errors to prevent blocking core operations
        }
    }
}
