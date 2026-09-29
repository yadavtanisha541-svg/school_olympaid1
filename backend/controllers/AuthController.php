<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;

class AuthController {
    public function login(): void {
        $input = Validator::getJsonInput();
        $loginId = trim($input['login_id'] ?? '');
        $password = trim($input['password'] ?? '');

        if (empty($loginId) || empty($password)) {
            Response::error('Please enter both Login ID and Password.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT u.*, ac.name as class_name, r.display_name as role_display_name
            FROM users u
            LEFT JOIN academic_classes ac ON u.class_id = ac.id
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.login_id = ?
        ");
        $stmt->execute([$loginId]);
        $user = $stmt->fetch();

        if (!$user || !Auth::verifyPassword($password, $user['password_hash'])) {
            Response::error('Invalid Login ID or Password.', 401);
        }

        if ($user['status'] !== 'active') {
            Response::error('Your account is inactive. Please contact the administrator.', 403);
        }

        // Create active session
        $token = Auth::createSession((int)$user['id'], 7);

        // Fetch user permissions
        $permissions = Auth::getUserPermissions((int)$user['id'], (string)$user['role'], (int)($user['role_id'] ?? 0));

        // Log login activity
        Logger::log('User Login', 'Auth', [
            'login_id' => $user['login_id'],
            'role' => $user['role']
        ], (int)$user['id'], (string)$user['role']);

        unset($user['password_hash']);
        $user['permissions'] = $permissions;

        Response::success([
            'token' => $token,
            'user' => $user
        ], 'Login successful.');
    }

    public function me(): void {
        $user = Auth::authenticate();
        unset($user['password_hash']);
        Response::success($user, 'Authenticated user profile retrieved.');
    }

    public function logout(): void {
        $token = Auth::getBearerToken();
        if ($token) {
            $db = Database::getConnection();
            $stmt = $db->prepare("UPDATE login_sessions SET is_active = 0 WHERE session_token = ?");
            $stmt->execute([$token]);
        }
        Response::success(null, 'Logged out successfully.');
    }

    public function updateProfile(): void {
        $user = Auth::authenticate();
        $input = Validator::getJsonInput();

        $fullName = trim($input['full_name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');

        if (empty($fullName)) {
            Response::error('Full Name is required.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE users SET full_name = ?, email = ?, phone = ? WHERE id = ?
        ");
        $stmt->execute([$fullName, $email, $phone, $user['id']]);

        Logger::log('Profile Updated', 'User', ['user_id' => $user['id']], $user['id'], $user['role']);

        Response::success(null, 'Profile updated successfully.');
    }

    public function changePassword(): void {
        $user = Auth::authenticate();
        $input = Validator::getJsonInput();

        $currentPassword = trim($input['current_password'] ?? '');
        $newPassword = trim($input['new_password'] ?? '');

        if (strlen($newPassword) < 6) {
            Response::error('New password must be at least 6 characters long.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT password_hash FROM users WHERE id = ?");
        $stmt->execute([$user['id']]);
        $row = $stmt->fetch();

        // If user is required to change password on first login, current password verification can be relaxed or verified if provided
        if (!empty($currentPassword) && !Auth::verifyPassword($currentPassword, $row['password_hash'])) {
            Response::error('Current password does not match.', 422);
        }

        $newHash = Auth::hashPassword($newPassword);
        $upd = $db->prepare("UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?");
        $upd->execute([$newHash, $user['id']]);

        Logger::log('Password Changed', 'User', ['user_id' => $user['id']], $user['id'], $user['role']);

        Response::success(null, 'Password updated successfully.');
    }
}
