<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;

class UserController {
    public function getTeachers(): void {
        Auth::requireRole(['superadmin']);
        $db = Database::getConnection();

        $search = trim($_GET['search'] ?? '');
        $status = trim($_GET['status'] ?? '');

        $sql = "
            SELECT u.id, u.login_id, u.full_name, u.email, u.phone, u.status, u.created_at,
                   (SELECT COUNT(*) FROM questions q WHERE q.created_by = u.id) as questions_count,
                   (SELECT COUNT(*) FROM exams e WHERE e.created_by = u.id) as exams_count
            FROM users u
            WHERE u.role = 'teacher'
        ";
        $params = [];

        if ($search !== '') {
            $sql .= " AND (u.full_name LIKE ? OR u.login_id LIKE ? OR u.email LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        if ($status !== '' && in_array($status, ['active', 'inactive'])) {
            $sql .= " AND u.status = ?";
            $params[] = $status;
        }

        $sql .= " ORDER BY u.created_at DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $teachers = $stmt->fetchAll();

        // Attach permissions to each teacher
        foreach ($teachers as &$t) {
            $t['permissions'] = Auth::getUserPermissions((int)$t['id'], 'teacher', 2);
        }

        Response::success($teachers, 'Teachers list retrieved.');
    }

    public function getStudents(): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'superadmin' && $user['role'] !== 'teacher') {
            Response::forbidden('Access denied.');
        }

        $db = Database::getConnection();
        $search = trim($_GET['search'] ?? '');
        $classId = trim($_GET['class_id'] ?? '');
        $status = trim($_GET['status'] ?? '');

        $sql = "
            SELECT u.id, u.login_id, u.full_name, u.email, u.phone, u.class_id, u.status, u.created_at,
                   ac.name as class_name,
                   (SELECT COUNT(*) FROM exam_attempts ea WHERE ea.student_id = u.id AND ea.status = 'submitted') as attempts_count,
                   (SELECT AVG(ea.percentage) FROM exam_attempts ea WHERE ea.student_id = u.id AND ea.status = 'submitted') as avg_score
            FROM users u
            LEFT JOIN academic_classes ac ON u.class_id = ac.id
            WHERE u.role = 'student'
        ";
        $params = [];

        if ($search !== '') {
            $sql .= " AND (u.full_name LIKE ? OR u.login_id LIKE ? OR u.email LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        if ($classId !== '') {
            $sql .= " AND u.class_id = ?";
            $params[] = $classId;
        }

        if ($status !== '' && in_array($status, ['active', 'inactive'])) {
            $sql .= " AND u.status = ?";
            $params[] = $status;
        }

        $sql .= " ORDER BY u.created_at DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $students = $stmt->fetchAll();

        Response::success($students, 'Students list retrieved.');
    }

    public function createUser(): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $role = trim($input['role'] ?? '');
        if (!in_array($role, ['teacher', 'student'])) {
            Response::error('Role must be either teacher or student.', 422);
        }

        $fullName = trim($input['full_name'] ?? '');
        if (empty($fullName)) {
            Response::error('Full Name is required.', 422);
        }

        $db = Database::getConnection();

        // Generate or validate Login ID
        $loginId = trim($input['login_id'] ?? '');
        if (empty($loginId)) {
            $prefix = ($role === 'teacher') ? 'TCH' : 'STU';
            $randomNum = rand(1000, 9999);
            $loginId = $prefix . $randomNum;

            // Ensure uniqueness
            while (true) {
                $chk = $db->prepare("SELECT id FROM users WHERE login_id = ?");
                $chk->execute([$loginId]);
                if (!$chk->fetch()) {
                    break;
                }
                $loginId = $prefix . rand(1000, 9999);
            }
        } else {
            $chk = $db->prepare("SELECT id FROM users WHERE login_id = ?");
            $chk->execute([$loginId]);
            if ($chk->fetch()) {
                Response::error("Login ID '$loginId' is already in use.", 422);
            }
        }

        $password = trim($input['password'] ?? '');
        if (empty($password)) {
            $password = ($role === 'teacher') ? 'Teacher@123' : 'Student@123';
        }

        $passwordHash = Auth::hashPassword($password);
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $classId = ($role === 'student' && !empty($input['class_id'])) ? (int)$input['class_id'] : null;
        $status = in_array($input['status'] ?? 'active', ['active', 'inactive']) ? $input['status'] : 'active';
        $roleId = ($role === 'teacher') ? 2 : 3;

        $stmt = $db->prepare("
            INSERT INTO users (login_id, password_hash, full_name, email, phone, role, role_id, class_id, status, must_change_password, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        ");
        $stmt->execute([
            $loginId,
            $passwordHash,
            $fullName,
            $email,
            $phone,
            $role,
            $roleId,
            $classId,
            $status,
            $admin['id']
        ]);

        $newUserId = (int)$db->lastInsertId();

        // If teacher, assign custom permissions if provided
        if ($role === 'teacher' && isset($input['permissions']) && is_array($input['permissions'])) {
            $this->saveUserPermissions($newUserId, $input['permissions']);
        }

        Logger::log("Created $role user", 'User', [
            'user_id' => $newUserId,
            'login_id' => $loginId,
            'role' => $role
        ], $admin['id'], 'superadmin');

        Response::success([
            'id' => $newUserId,
            'login_id' => $loginId,
            'generated_password' => $password,
            'full_name' => $fullName,
            'role' => $role
        ], ucfirst($role) . ' created successfully.', 201);
    }

    public function updateUser(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $fullName = trim($input['full_name'] ?? '');
        if (empty($fullName)) {
            Response::error('Full Name is required.', 422);
        }

        $db = Database::getConnection();
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $classId = !empty($input['class_id']) ? (int)$input['class_id'] : null;
        $status = in_array($input['status'] ?? '', ['active', 'inactive']) ? $input['status'] : 'active';

        $stmt = $db->prepare("
            UPDATE users SET full_name = ?, email = ?, phone = ?, class_id = ?, status = ?
            WHERE id = ?
        ");
        $stmt->execute([$fullName, $email, $phone, $classId, $status, $id]);

        if (isset($input['permissions']) && is_array($input['permissions'])) {
            $this->saveUserPermissions($id, $input['permissions']);
        }

        Logger::log('Updated User Details', 'User', ['user_id' => $id], $admin['id'], 'superadmin');

        Response::success(null, 'User updated successfully.');
    }

    public function resetPassword(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $newPassword = trim($input['new_password'] ?? 'ChangeMe@123');
        if (strlen($newPassword) < 6) {
            Response::error('Password must be at least 6 characters.', 422);
        }

        $db = Database::getConnection();
        $hash = Auth::hashPassword($newPassword);

        $stmt = $db->prepare("UPDATE users SET password_hash = ?, must_change_password = 1 WHERE id = ?");
        $stmt->execute([$hash, $id]);

        Logger::log('Reset User Password', 'User', ['user_id' => $id], $admin['id'], 'superadmin');

        Response::success(['new_password' => $newPassword], 'Password reset successfully.');
    }

    public function toggleStatus(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $db = Database::getConnection();

        $stmt = $db->prepare("SELECT status FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        if (!$user) {
            Response::notFound('User not found.');
        }

        $newStatus = ($user['status'] === 'active') ? 'inactive' : 'active';
        $upd = $db->prepare("UPDATE users SET status = ? WHERE id = ?");
        $upd->execute([$newStatus, $id]);

        Logger::log("User Status toggled to $newStatus", 'User', ['user_id' => $id, 'status' => $newStatus], $admin['id'], 'superadmin');

        Response::success(['status' => $newStatus], 'User status updated.');
    }

    public function deleteUser(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $db = Database::getConnection();

        $stmt = $db->prepare("SELECT id, role FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        if (!$user) {
            Response::notFound('User not found.');
        }

        if ($user['role'] === 'superadmin') {
            Response::error('Superadmin accounts cannot be deleted.', 403);
        }

        $del = $db->prepare("DELETE FROM users WHERE id = ?");
        $del->execute([$id]);

        Logger::log('Deleted User', 'User', ['user_id' => $id, 'role' => $user['role']], $admin['id'], 'superadmin');

        Response::success(null, 'User deleted successfully.');
    }

    public function getPermissionsList(): void {
        Auth::requireRole(['superadmin', 'teacher']);
        $db = Database::getConnection();
        $stmt = $db->query("SELECT * FROM permissions ORDER BY category, name");
        $permissions = $stmt->fetchAll();
        Response::success($permissions, 'Permissions list retrieved.');
    }

    public function getTeacherPermissions(int $teacherId): void {
        Auth::requireRole(['superadmin']);
        $perms = Auth::getUserPermissions($teacherId, 'teacher', 2);
        Response::success($perms, 'Teacher permissions retrieved.');
    }

    public function updateTeacherPermissions(int $teacherId): void {
        Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();
        $permissions = $input['permissions'] ?? [];

        $this->saveUserPermissions($teacherId, $permissions);
        Response::success(null, 'Teacher permissions updated successfully.');
    }

    private function saveUserPermissions(int $userId, array $grantedCodes): void {
        $db = Database::getConnection();

        // Delete existing custom overrides
        $del = $db->prepare("DELETE FROM user_permissions WHERE user_id = ?");
        $del->execute([$userId]);

        // Get all permissions map
        $allPerms = $db->query("SELECT id, code FROM permissions")->fetchAll(PDO::FETCH_KEY_PAIR);

        $stmt = $db->prepare("INSERT INTO user_permissions (user_id, permission_id, is_granted) VALUES (?, ?, ?)");
        foreach ($allPerms as $pId => $code) {
            $isGranted = in_array($code, $grantedCodes) ? 1 : 0;
            $stmt->execute([$userId, $pId, $isGranted]);
        }
    }
}
