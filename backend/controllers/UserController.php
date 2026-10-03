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
            SELECT u.id, u.login_id, u.full_name, u.email, u.phone, u.class_id, u.status, u.avatar,
                   u.school_name, u.school_address, u.school_board, u.school_code,
                   u.father_name, u.mother_name, u.parent_name, u.parent_phone, u.parent_email,
                   u.section, u.roll_number, u.academic_year, u.dob, u.gender,
                   u.address, u.city, u.state, u.pincode, u.profile_data_json, u.created_at,
                   ac.name as class_name,
                   (SELECT COUNT(*) FROM exam_attempts ea WHERE ea.student_id = u.id AND ea.status = 'submitted') as attempts_count,
                   (SELECT AVG(ea.percentage) FROM exam_attempts ea WHERE ea.student_id = u.id AND ea.status = 'submitted') as avg_score,
                   (SELECT COALESCE(SUM(ea.correct_count), 0) FROM exam_attempts ea WHERE ea.student_id = u.id AND ea.status = 'submitted') as total_correct,
                   (SELECT COALESCE(SUM(ea.wrong_count), 0) FROM exam_attempts ea WHERE ea.student_id = u.id AND ea.status = 'submitted') as total_wrong,
                   (SELECT COUNT(*) FROM certificates c WHERE c.student_id = u.id) as certificates_count
            FROM users u
            LEFT JOIN academic_classes ac ON u.class_id = ac.id
            WHERE u.role = 'student'
        ";
        $params = [];

        if ($search !== '') {
            $sql .= " AND (u.full_name LIKE ? OR u.login_id LIKE ? OR u.email LIKE ? OR u.school_name LIKE ?)";
            $params[] = "%$search%";
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
        $avatar = $input['avatar'] ?? null;
        $classId = ($role === 'student' && !empty($input['class_id'])) ? (int)$input['class_id'] : null;
        $status = in_array($input['status'] ?? 'active', ['active', 'inactive']) ? $input['status'] : 'active';
        $roleId = ($role === 'teacher') ? 2 : 3;

        $schoolName = trim($input['school_name'] ?? '');
        $schoolAddress = trim($input['school_address'] ?? '');
        $schoolBoard = trim($input['school_board'] ?? '');
        $schoolCode = trim($input['school_code'] ?? '');
        $fatherName = trim($input['father_name'] ?? '');
        $motherName = trim($input['mother_name'] ?? '');
        $parentName = trim($input['parent_name'] ?? ($fatherName ?: $motherName));
        $parentPhone = trim($input['parent_phone'] ?? '');
        $parentEmail = trim($input['parent_email'] ?? '');
        $section = trim($input['section'] ?? 'A');
        $rollNumber = trim($input['roll_number'] ?? '');
        $academicYear = trim($input['academic_year'] ?? '2026-2027');
        $dob = !empty($input['dob']) ? trim($input['dob']) : null;
        $gender = trim($input['gender'] ?? 'Male');
        $address = trim($input['address'] ?? '');
        $city = trim($input['city'] ?? ($input['school_city'] ?? ''));
        $state = trim($input['state'] ?? ($input['school_state'] ?? ''));
        $pincode = trim($input['pincode'] ?? ($input['school_pincode'] ?? ''));

        $stmt = $db->prepare("
            INSERT INTO users (
                login_id, password_hash, full_name, email, phone, avatar, role, role_id, class_id, status,
                school_name, school_address, school_board, school_code,
                father_name, mother_name, parent_name, parent_phone, parent_email,
                section, roll_number, academic_year, dob, gender,
                address, city, state, pincode,
                must_change_password, created_by
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                1, ?
            )
        ");
        $stmt->execute([
            $loginId,
            $passwordHash,
            $fullName,
            $email,
            $phone,
            $avatar,
            $role,
            $roleId,
            $classId,
            $status,
            $schoolName,
            $schoolAddress,
            $schoolBoard,
            $schoolCode,
            $fatherName,
            $motherName,
            $parentName,
            $parentPhone,
            $parentEmail,
            $section,
            $rollNumber,
            $academicYear,
            $dob,
            $gender,
            $address,
            $city,
            $state,
            $pincode,
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
            'school_name' => $schoolName,
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

        // Check user existence by ID or login_id
        $stmtCheck = $db->prepare("SELECT id, login_id FROM users WHERE id = ?");
        $stmtCheck->execute([$id]);
        $existingUser = $stmtCheck->fetch();

        $loginId = trim($input['login_id'] ?? '');

        if (!$existingUser && !empty($loginId)) {
            $stmtCheck = $db->prepare("SELECT id, login_id FROM users WHERE login_id = ?");
            $stmtCheck->execute([$loginId]);
            $existingUser = $stmtCheck->fetch();
            if ($existingUser) {
                $id = (int)$existingUser['id'];
            }
        }

        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $avatar = $input['avatar'] ?? null;
        $classId = !empty($input['class_id']) ? (int)$input['class_id'] : null;
        $status = in_array($input['status'] ?? '', ['active', 'inactive']) ? $input['status'] : 'active';
        $password = trim($input['password'] ?? '');

        $schoolName = isset($input['school_name']) ? trim($input['school_name']) : null;
        $schoolAddress = isset($input['school_address']) ? trim($input['school_address']) : null;
        $schoolBoard = isset($input['school_board']) ? trim($input['school_board']) : null;
        $schoolCode = isset($input['school_code']) ? trim($input['school_code']) : null;
        $fatherName = isset($input['father_name']) ? trim($input['father_name']) : null;
        $motherName = isset($input['mother_name']) ? trim($input['mother_name']) : null;
        $parentName = isset($input['parent_name']) ? trim($input['parent_name']) : ($fatherName ?: $motherName);
        $parentPhone = isset($input['parent_phone']) ? trim($input['parent_phone']) : null;
        $parentEmail = isset($input['parent_email']) ? trim($input['parent_email']) : null;
        $section = isset($input['section']) ? trim($input['section']) : null;
        $rollNumber = isset($input['roll_number']) ? trim($input['roll_number']) : null;
        $academicYear = isset($input['academic_year']) ? trim($input['academic_year']) : null;
        $dob = !empty($input['dob']) ? trim($input['dob']) : null;
        $gender = isset($input['gender']) ? trim($input['gender']) : null;
        $address = isset($input['address']) ? trim($input['address']) : null;
        $city = isset($input['city']) ? trim($input['city']) : (isset($input['school_city']) ? trim($input['school_city']) : null);
        $state = isset($input['state']) ? trim($input['state']) : (isset($input['school_state']) ? trim($input['school_state']) : null);
        $pincode = isset($input['pincode']) ? trim($input['pincode']) : (isset($input['school_pincode']) ? trim($input['school_pincode']) : null);

        if (!$existingUser) {
            $role = trim($input['role'] ?? 'student');
            $roleId = ($role === 'teacher') ? 2 : 3;
            $pass = !empty($password) ? $password : 'Student@123';
            $pHash = Auth::hashPassword($pass);
            $ins = $db->prepare("
                INSERT INTO users (
                    login_id, password_hash, full_name, email, phone, avatar, role, role_id, class_id, status,
                    school_name, school_address, father_name, mother_name, parent_name, parent_phone, parent_email,
                    section, roll_number, academic_year, dob, gender, address, city, state, pincode,
                    must_change_password, created_by
                )
                VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    0, ?
                )
            ");
            $ins->execute([
                $loginId ?: ('STU' . rand(1000, 9999)),
                $pHash,
                $fullName,
                $email,
                $phone,
                $avatar,
                $role,
                $roleId,
                $classId,
                $status,
                $schoolName ?: '',
                $schoolAddress ?: '',
                $fatherName ?: '',
                $motherName ?: '',
                $parentName ?: '',
                $parentPhone ?: '',
                $parentEmail ?: '',
                $section ?: 'A',
                $rollNumber ?: '',
                $academicYear ?: '2026-2027',
                $dob,
                $gender ?: 'Male',
                $address ?: '',
                $city ?: '',
                $state ?: '',
                $pincode ?: '',
                $admin['id']
            ]);
            $id = (int)$db->lastInsertId();
            Response::success(['id' => $id, 'login_id' => $loginId, 'password' => $pass], 'Student created and details saved successfully.');
            return;
        }

        if (!empty($loginId) && $loginId !== $existingUser['login_id']) {
            $chk = $db->prepare("SELECT id FROM users WHERE login_id = ? AND id != ?");
            $chk->execute([$loginId, $id]);
            if ($chk->fetch()) {
                Response::error("Login ID '$loginId' is already in use by another account.", 422);
            }
        } else {
            $loginId = $existingUser['login_id'];
        }

        // Check optional password update
        $password = trim($input['password'] ?? '');

        // Dynamic update query building
        $updateFields = [
            "full_name = ?",
            "email = ?",
            "phone = ?",
            "class_id = ?",
            "status = ?",
            "login_id = ?"
        ];
        $updateParams = [$fullName, $email, $phone, $classId, $status, $loginId];

        if ($avatar !== null) {
            $updateFields[] = "avatar = ?";
            $updateParams[] = $avatar;
        }
        if (!empty($password)) {
            if (strlen($password) < 6) {
                Response::error('Password must be at least 6 characters.', 422);
            }
            $updateFields[] = "password_hash = ?";
            $updateParams[] = Auth::hashPassword($password);
        }
        if ($schoolName !== null) {
            $updateFields[] = "school_name = ?";
            $updateParams[] = $schoolName;
        }
        if ($schoolAddress !== null) {
            $updateFields[] = "school_address = ?";
            $updateParams[] = $schoolAddress;
        }
        if ($schoolBoard !== null) {
            $updateFields[] = "school_board = ?";
            $updateParams[] = $schoolBoard;
        }
        if ($schoolCode !== null) {
            $updateFields[] = "school_code = ?";
            $updateParams[] = $schoolCode;
        }
        if ($fatherName !== null) {
            $updateFields[] = "father_name = ?";
            $updateParams[] = $fatherName;
        }
        if ($motherName !== null) {
            $updateFields[] = "mother_name = ?";
            $updateParams[] = $motherName;
        }
        if ($parentName !== null) {
            $updateFields[] = "parent_name = ?";
            $updateParams[] = $parentName;
        }
        if ($parentPhone !== null) {
            $updateFields[] = "parent_phone = ?";
            $updateParams[] = $parentPhone;
        }
        if ($parentEmail !== null) {
            $updateFields[] = "parent_email = ?";
            $updateParams[] = $parentEmail;
        }
        if ($section !== null) {
            $updateFields[] = "section = ?";
            $updateParams[] = $section;
        }
        if ($rollNumber !== null) {
            $updateFields[] = "roll_number = ?";
            $updateParams[] = $rollNumber;
        }
        if ($academicYear !== null) {
            $updateFields[] = "academic_year = ?";
            $updateParams[] = $academicYear;
        }
        if ($dob !== null) {
            $updateFields[] = "dob = ?";
            $updateParams[] = $dob;
        }
        if ($gender !== null) {
            $updateFields[] = "gender = ?";
            $updateParams[] = $gender;
        }
        if ($address !== null) {
            $updateFields[] = "address = ?";
            $updateParams[] = $address;
        }
        if ($city !== null) {
            $updateFields[] = "city = ?";
            $updateParams[] = $city;
        }
        if ($state !== null) {
            $updateFields[] = "state = ?";
            $updateParams[] = $state;
        }
        if ($pincode !== null) {
            $updateFields[] = "pincode = ?";
            $updateParams[] = $pincode;
        }

        $updateParams[] = $id;
        $sql = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($updateParams);

        if (isset($input['permissions']) && is_array($input['permissions'])) {
            $this->saveUserPermissions($id, $input['permissions']);
        }

        Logger::log('Updated User Details', 'User', ['user_id' => $id, 'login_id' => $loginId], $admin['id'], 'superadmin');

        Response::success([
            'id' => $id,
            'login_id' => $loginId
        ], 'User updated successfully.');
    }

    public function resetPassword(int $id): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $newPassword = trim($input['new_password'] ?? 'ChangeMe@123');
        if (empty($newPassword)) {
            Response::error('New password is required.', 422);
        }

        if (strlen($newPassword) < 6) {
            Response::error('Password must be at least 6 characters.', 422);
        }

        $db = Database::getConnection();
        $hash = Auth::hashPassword($newPassword);

        $stmt = $db->prepare("UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?");
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

        $stmt = $db->prepare("SELECT id, role, full_name, email, login_id FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();

        if (!$user) {
            Response::notFound('User not found.');
        }

        if ($user['role'] === 'superadmin') {
            Response::error('Superadmin accounts cannot be deleted.', 403);
        }

        $db->beginTransaction();
        try {
            // 1. Delete user sessions & permissions
            $db->prepare("DELETE FROM login_sessions WHERE user_id = ?")->execute([$id]);
            $db->prepare("DELETE FROM user_permissions WHERE user_id = ?")->execute([$id]);
            $db->prepare("DELETE FROM exam_security_events WHERE student_id = ?")->execute([$id]);
            $db->prepare("DELETE FROM certificates WHERE student_id = ?")->execute([$id]);

            // 2. Delete student answers and exam attempts
            $db->prepare("
                DELETE sa FROM student_answers sa
                JOIN exam_attempts ea ON sa.attempt_id = ea.id
                WHERE ea.student_id = ?
            ")->execute([$id]);
            $db->prepare("DELETE FROM exam_attempts WHERE student_id = ?")->execute([$id]);

            // 3. Delete activity logs
            $db->prepare("DELETE FROM activity_logs WHERE user_id = ?")->execute([$id]);

            // 4. Reassign questions or exams if user is a teacher
            $db->prepare("UPDATE exams SET created_by = ? WHERE created_by = ?")->execute([$admin['id'], $id]);
            $db->prepare("UPDATE questions SET created_by = ? WHERE created_by = ?")->execute([$admin['id'], $id]);

            // 5. Delete from student/school registrations if exists
            $db->prepare("DELETE FROM student_registrations WHERE user_id = ?")->execute([$id]);
            $db->prepare("DELETE FROM school_registrations WHERE user_id = ?")->execute([$id]);

            // 6. Delete user
            $del = $db->prepare("DELETE FROM users WHERE id = ?");
            $del->execute([$id]);

            $db->commit();

            Logger::log('Deleted User', 'User', ['user_id' => $id, 'role' => $user['role'], 'name' => $user['full_name']], $admin['id'], 'superadmin');

            Response::success(null, 'User deleted successfully.');
        } catch (\Exception $e) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            Response::error('Failed to delete user: ' . $e->getMessage(), 500);
        }
    }

    public function bulkDeleteUsers(): void {
        $admin = Auth::requireRole(['superadmin']);
        $body = Validator::getJsonInput();
        $ids = $body['ids'] ?? [];

        if (empty($ids) || !is_array($ids)) {
            Response::error('No user IDs provided for deletion.', 422);
        }

        $db = Database::getConnection();
        $deletedCount = 0;

        foreach ($ids as $id) {
            $userId = (int)$id;
            if ($userId <= 1) continue; // Do not delete superadmin

            try {
                $db->beginTransaction();

                $db->prepare("DELETE FROM login_sessions WHERE user_id = ?")->execute([$userId]);
                $db->prepare("DELETE FROM user_permissions WHERE user_id = ?")->execute([$userId]);
                $db->prepare("DELETE FROM exam_security_events WHERE student_id = ?")->execute([$userId]);
                $db->prepare("DELETE FROM certificates WHERE student_id = ?")->execute([$userId]);

                $db->prepare("
                    DELETE sa FROM student_answers sa
                    JOIN exam_attempts ea ON sa.attempt_id = ea.id
                    WHERE ea.student_id = ?
                ")->execute([$userId]);
                $db->prepare("DELETE FROM exam_attempts WHERE student_id = ?")->execute([$userId]);
                $db->prepare("DELETE FROM activity_logs WHERE user_id = ?")->execute([$userId]);
                $db->prepare("DELETE FROM student_registrations WHERE user_id = ?")->execute([$userId]);
                $db->prepare("DELETE FROM school_registrations WHERE user_id = ?")->execute([$userId]);

                $db->prepare("UPDATE exams SET created_by = ? WHERE created_by = ?")->execute([$admin['id'], $userId]);
                $db->prepare("UPDATE questions SET created_by = ? WHERE created_by = ?")->execute([$admin['id'], $userId]);

                $del = $db->prepare("DELETE FROM users WHERE id = ? AND role != 'superadmin'");
                $del->execute([$userId]);

                $db->commit();
                $deletedCount++;
            } catch (\Exception $e) {
                if ($db->inTransaction()) {
                    $db->rollBack();
                }
            }
        }

        Response::success(['deleted_count' => $deletedCount], "$deletedCount users deleted successfully.");
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
