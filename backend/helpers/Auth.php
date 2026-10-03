<?php
namespace App\Helpers;

use App\Config\Database;
use PDO;

class Auth {
    private static ?array $currentUser = null;

    public static function getBearerToken(): ?string {
        $headers = null;
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER['Authorization']);
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }

        if (!empty($headers) && preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
            return $matches[1];
        }

        return null;
    }

    public static function getOptionalUser(): ?array {
        if (self::$currentUser !== null) {
            return self::$currentUser;
        }

        $token = self::getBearerToken();
        if (!$token) {
            return null;
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT s.id as session_id, s.expires_at, s.is_active,
                   u.id, u.login_id, u.full_name, u.email, u.phone, u.role, u.role_id, u.class_id, u.status, u.must_change_password, u.avatar,
                   ac.name as class_name
            FROM login_sessions s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN academic_classes ac ON u.class_id = ac.id
            WHERE s.session_token = ? AND s.is_active = 1
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        if ($user && $user['status'] === 'active') {
            self::$currentUser = $user;
            return $user;
        }
        return null;
    }

    public static function authenticate(): array {
        if (self::$currentUser !== null) {
            return self::$currentUser;
        }

        $token = self::getBearerToken();
        if (!$token) {
            Response::unauthorized('Authentication token missing.');
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT s.id as session_id, s.expires_at, s.is_active,
                   u.id, u.login_id, u.full_name, u.email, u.phone, u.role, u.role_id, u.class_id, u.status, u.must_change_password, u.avatar,
                   ac.name as class_name
            FROM login_sessions s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN academic_classes ac ON u.class_id = ac.id
            WHERE s.session_token = ? AND s.is_active = 1
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch();

        if (!$user) {
            Response::unauthorized('Invalid or expired session. Please log in again.');
        }

        if ($user['status'] !== 'active') {
            Response::forbidden('Your account has been deactivated. Please contact the administrator.');
        }

        if (strtotime($user['expires_at']) < time()) {
            // Expire session
            $upd = $db->prepare("UPDATE login_sessions SET is_active = 0 WHERE session_token = ?");
            $upd->execute([$token]);
            Response::unauthorized('Session expired. Please log in again.');
        }

        // Touch last_activity
        $upd = $db->prepare("UPDATE login_sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_token = ?");
        $upd->execute([$token]);

        // Load permissions
        $user['permissions'] = self::getUserPermissions((int)$user['id'], (string)$user['role'], (int)($user['role_id'] ?? 0));
        self::$currentUser = $user;
        return $user;
    }

    public static function getUserPermissions(int $userId, string $role, int $roleId): array {
        if ($role === 'superadmin') {
            return ['all', 'manage_questions', 'import_questions', 'manage_exams', 'view_students', 'view_results', 'view_analytics', 'view_leaderboards', 'manage_academic', 'manage_users', 'manage_settings'];
        }

        $db = Database::getConnection();
        $perms = [];

        // 1. Role base permissions
        if ($roleId > 0) {
            $stmt = $db->prepare("
                SELECT p.code 
                FROM role_permissions rp
                JOIN permissions p ON rp.permission_id = p.id
                WHERE rp.role_id = ?
            ");
            $stmt->execute([$roleId]);
            $perms = $stmt->fetchAll(PDO::FETCH_COLUMN);
        }

        // 2. Custom User permissions overrides
        $stmt = $db->prepare("
            SELECT p.code, up.is_granted
            FROM user_permissions up
            JOIN permissions p ON up.permission_id = p.id
            WHERE up.user_id = ?
        ");
        $stmt->execute([$userId]);
        $overrides = $stmt->fetchAll();

        foreach ($overrides as $ov) {
            if ($ov['is_granted']) {
                if (!in_array($ov['code'], $perms)) {
                    $perms[] = $ov['code'];
                }
            } else {
                $perms = array_diff($perms, [$ov['code']]);
            }
        }

        return array_values($perms);
    }

    public static function requireRole(array $allowedRoles): array {
        $user = self::authenticate();
        if (!in_array($user['role'], $allowedRoles)) {
            Response::forbidden('Access denied. Insufficient role permissions.');
        }
        return $user;
    }

    public static function requirePermission(string $permissionCode): array {
        $user = self::authenticate();
        if ($user['role'] === 'superadmin') {
            return $user;
        }

        if (!in_array($permissionCode, $user['permissions'] ?? [])) {
            Response::forbidden("Permission denied: You require '$permissionCode' access.");
        }
        return $user;
    }

    public static function hashPassword(string $plain): string {
        return password_hash($plain, PASSWORD_BCRYPT, ['cost' => 10]);
    }

    public static function verifyPassword(string $plain, string $hash): bool {
        return password_verify($plain, $hash);
    }

    public static function createSession(int $userId, int $durationDays = 7): string {
        $db = Database::getConnection();
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime("+$durationDays days"));
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 500);

        $stmt = $db->prepare("
            INSERT INTO login_sessions (user_id, session_token, ip_address, user_agent, expires_at, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        ");
        $stmt->execute([$userId, $token, $ip, $ua, $expiresAt]);

        return $token;
    }
}
