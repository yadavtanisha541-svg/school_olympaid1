<?php
namespace App\Helpers;

use App\Config\Database;
use PDO;

class CertificateGenerator {
    public static function generateCertificateForAttempt(int $attemptId): ?array {
        $db = Database::getConnection();

        // 1. Fetch attempt and exam data
        $stmt = $db->prepare("
            SELECT ea.*, e.title as exam_title, e.certificate_eligibility, e.min_certificate_percentage,
                   u.full_name as student_name, u.email as student_email, u.login_id as student_login_id
            FROM exam_attempts ea
            JOIN exams e ON ea.exam_id = e.id
            JOIN users u ON ea.student_id = u.id
            WHERE ea.id = ?
        ");
        $stmt->execute([$attemptId]);
        $attempt = $stmt->fetch();

        if (!$attempt) {
            return null;
        }

        // Check if certificate already exists
        $chk = $db->prepare("SELECT * FROM certificates WHERE attempt_id = ?");
        $chk->execute([$attemptId]);
        $existing = $chk->fetch();
        if ($existing) {
            return $existing;
        }

        // Check eligibility
        if (!$attempt['certificate_eligibility']) {
            return null;
        }

        $minReq = (float)$attempt['min_certificate_percentage'];
        $achieved = (float)$attempt['percentage'];
        if ($achieved < $minReq) {
            return null;
        }

        // Generate Certificate
        $certNumber = 'OLY-' . date('Y') . '-' . strtoupper(substr(md5(uniqid((string)$attemptId, true)), 0, 8));
        $issueDate = date('Y-m-d');
        $rawHashString = $certNumber . '|' . $attemptId . '|' . $attempt['student_id'] . '|' . $attempt['score'] . '|' . $issueDate . '|OLYMPIADHUB_SECRET_SALT_2026';
        $verifyHash = hash('sha256', $rawHashString);

        $ins = $db->prepare("
            INSERT INTO certificates (
                certificate_number, attempt_id, student_id, exam_id, student_name, exam_name,
                score, percentage, rank_exam, issue_date, verification_hash, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'valid')
        ");
        $ins->execute([
            $certNumber,
            $attemptId,
            $attempt['student_id'],
            $attempt['exam_id'],
            $attempt['student_name'],
            $attempt['exam_title'],
            $attempt['score'],
            $attempt['percentage'],
            $attempt['rank_exam'] ?? null,
            $issueDate,
            $verifyHash
        ]);

        $certId = (int)$db->lastInsertId();
        return [
            'id' => $certId,
            'certificate_number' => $certNumber,
            'student_name' => $attempt['student_name'],
            'exam_name' => $attempt['exam_title'],
            'score' => $attempt['score'],
            'percentage' => $attempt['percentage'],
            'rank_exam' => $attempt['rank_exam'] ?? null,
            'issue_date' => $issueDate,
            'verification_hash' => $verifyHash,
            'status' => 'valid'
        ];
    }
}
