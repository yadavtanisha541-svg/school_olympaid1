<?php
namespace App\Helpers;

use App\Config\Database;

class Logger {
    public static function log(?string $action = 'ACTION', ?string $module = 'GENERAL', mixed $details = null, ?int $userId = null, ?string $userRole = null): void {
        try {
            $action = $action ?: 'ACTION';
            $module = $module ?: 'GENERAL';
            $db = Database::getConnection();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            
            if ($userId === null && isset($GLOBALS['currentUser'])) {
                $userId = $GLOBALS['currentUser']['id'] ?? null;
                $userRole = $GLOBALS['currentUser']['role'] ?? null;
            }

            $detailsJson = null;
            if (is_array($details)) {
                $detailsJson = json_encode($details, JSON_UNESCAPED_UNICODE);
            } elseif (is_string($details)) {
                $detailsJson = json_encode(['info' => $details], JSON_UNESCAPED_UNICODE);
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
                $detailsJson,
                $ip
            ]);
        } catch (\Throwable $e) {
            // Silently ignore logging errors to prevent blocking core operations
        }
    }
}
