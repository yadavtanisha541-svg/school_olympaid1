<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use App\Helpers\Validator;
use PDO;

class CertificateController {
    public function getCertificates(): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();

        if ($user['role'] === 'student') {
            $stmt = $db->prepare("
                SELECT c.*, e.total_marks, ea.time_spent_seconds, ac.name as class_name
                FROM certificates c
                JOIN exams e ON c.exam_id = e.id
                JOIN exam_attempts ea ON c.attempt_id = ea.id
                JOIN users u ON c.student_id = u.id
                LEFT JOIN academic_classes ac ON u.class_id = ac.id
                WHERE c.student_id = ? AND c.status = 'valid'
                ORDER BY c.issue_date DESC
            ");
            $stmt->execute([$user['id']]);
        } else {
            $stmt = $db->query("
                SELECT c.*, e.total_marks, ea.time_spent_seconds, ac.name as class_name, u.login_id as student_login_id
                FROM certificates c
                JOIN exams e ON c.exam_id = e.id
                JOIN exam_attempts ea ON c.attempt_id = ea.id
                JOIN users u ON c.student_id = u.id
                LEFT JOIN academic_classes ac ON u.class_id = ac.id
                ORDER BY c.id DESC
            ");
        }

        Response::success($stmt->fetchAll(), 'Certificates retrieved.');
    }

    public function getCertificate(int $id): void {
        Auth::authenticate();
        $db = Database::getConnection();

        $stmt = $db->prepare("
            SELECT c.*, e.total_marks, e.exam_code, ea.time_spent_seconds, ac.name as class_name,
                   u.login_id as student_login_id, u.email as student_email
            FROM certificates c
            JOIN exams e ON c.exam_id = e.id
            JOIN exam_attempts ea ON c.attempt_id = ea.id
            JOIN users u ON c.student_id = u.id
            LEFT JOIN academic_classes ac ON u.class_id = ac.id
            WHERE c.id = ?
        ");
        $stmt->execute([$id]);
        $cert = $stmt->fetch();

        if (!$cert) {
            Response::notFound('Certificate not found.');
        }

        Response::success($cert, 'Certificate details retrieved.');
    }

    public function verify(): void {
        $code = trim($_GET['code'] ?? $_GET['id'] ?? '');
        if (empty($code)) {
            $input = Validator::getJsonInput();
            $code = trim($input['certificate_number'] ?? $input['code'] ?? '');
        }

        if (empty($code)) {
            Response::error('Certificate ID / Number is required for verification.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("
            SELECT c.id, c.certificate_number, c.student_name, c.exam_name, c.score, c.percentage,
                   c.rank_exam, c.issue_date, c.verification_hash, c.status,
                   e.total_marks, ac.name as class_name
            FROM certificates c
            JOIN exams e ON c.exam_id = e.id
            JOIN users u ON c.student_id = u.id
            LEFT JOIN academic_classes ac ON u.class_id = ac.id
            WHERE c.certificate_number = ? OR c.verification_hash = ?
        ");
        $stmt->execute([$code, $code]);
        $cert = $stmt->fetch();

        if (!$cert) {
            Response::error('Invalid or Unrecognized Certificate ID. No matching examination credential found.', 404);
        }

        Response::success([
            'is_valid' => $cert['status'] === 'valid',
            'certificate' => $cert
        ], 'Certificate verified successfully.');
    }
}
