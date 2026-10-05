<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;

class PublicActionsController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Save Workbook Order automatically to MySQL
     */
    public function saveWorkbookOrder(): void {
        $input = Validator::getJsonInput();

        if (empty($input['name']) || empty($input['email']) || empty($input['whatsapp'])) {
            Response::error('Name, email, and WhatsApp number are required.', 422);
            return;
        }

        try {
            $orderId = !empty($input['orderId']) ? $input['orderId'] : 'SKL-WB-' . rand(100000, 999999);
            $userType = $input['userType'] ?? 'student';
            $name = trim($input['name']);
            $email = trim($input['email']);
            $whatsapp = trim($input['whatsapp']);
            $classLevel = $input['classLevel'] ?? 'Class 5';
            $format = $input['format'] ?? 'digital';
            $booksJson = json_encode($input['books'] ?? []);
            $subtotal = floatval($input['subtotal'] ?? 0);
            $deliveryCharge = floatval($input['deliveryCharge'] ?? 0);
            $grandTotal = floatval($input['grandTotal'] ?? 0);
            $addressJson = !empty($input['address']) ? json_encode($input['address']) : null;

            $stmt = $this->db->prepare("
                INSERT INTO `workbook_orders` 
                (`order_id`, `user_type`, `name`, `email`, `whatsapp`, `class_level`, `format`, `books_json`, `subtotal`, `delivery_charge`, `grand_total`, `address_json`, `status`, `created_at`)
                VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', NOW())
            ");

            $stmt->execute([
                $orderId,
                $userType,
                $name,
                $email,
                $whatsapp,
                $classLevel,
                $format,
                $booksJson,
                $subtotal,
                $deliveryCharge,
                $grandTotal,
                $addressJson
            ]);

            Logger::log('WORKBOOK_ORDER_CREATED', 'Orders', ['order_id' => $orderId, 'name' => $name, 'email' => $email]);

            Response::success([
                'orderId' => $orderId,
                'status' => 'confirmed',
                'name' => $name,
                'grandTotal' => $grandTotal,
                'message' => 'Workbook order recorded in database successfully.'
            ], 'Order placed and saved to MySQL database successfully.', 201);
        } catch (\PDOException $e) {
            Response::error('Failed to save workbook order: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get Workbook Orders List (Admin View)
     */
    public function getWorkbookOrders(): void {
        try {
            $stmt = $this->db->query("SELECT * FROM `workbook_orders` ORDER BY `created_at` DESC LIMIT 200");
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($orders as &$order) {
                $order['books'] = json_decode($order['books_json'], true);
                $order['address'] = json_decode($order['address_json'] ?? 'null', true);
            }

            Response::success($orders, 'Workbook orders retrieved successfully.');
        } catch (\PDOException $e) {
            Response::error('Database error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update Workbook Order Status
     */
    public function updateWorkbookOrderStatus(int $id): void {
        $input = Validator::getJsonInput();
        $status = $input['status'] ?? 'confirmed';

        try {
            $stmt = $this->db->prepare("UPDATE `workbook_orders` SET `status` = ? WHERE `id` = ?");
            $stmt->execute([$status, $id]);
            Response::success(null, "Workbook order status updated to $status.");
        } catch (\PDOException $e) {
            Response::error('Failed to update status: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete Workbook Order
     */
    public function deleteWorkbookOrder(int $id): void {
        try {
            $stmt = $this->db->prepare("DELETE FROM `workbook_orders` WHERE `id` = ?");
            $stmt->execute([$id]);
            Response::success(null, 'Workbook order deleted successfully.');
        } catch (\PDOException $e) {
            Response::error('Failed to delete workbook order: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get School Registrations (Admin View)
     */
    public function getSchoolRegistrations(): void {
        try {
            $stmt = $this->db->query("
                SELECT sr.*, u.status as user_status, u.avatar 
                FROM `school_registrations` sr
                LEFT JOIN `users` u ON sr.user_id = u.id
                ORDER BY sr.created_at DESC LIMIT 200
            ");
            $schools = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($schools as &$school) {
                $school['selected_subjects'] = json_decode($school['selected_subjects'] ?? '[]', true);
            }

            Response::success($schools, 'School registrations retrieved successfully.');
        } catch (\PDOException $e) {
            Response::error('Database error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update School Registration Status
     */
    public function updateSchoolRegistrationStatus(int $id): void {
        $input = Validator::getJsonInput();
        $status = $input['status'] ?? 'approved';

        try {
            $stmt = $this->db->prepare("UPDATE `school_registrations` SET `status` = ? WHERE `id` = ?");
            $stmt->execute([$status, $id]);

            // Also update user status if approved / rejected
            $userStatus = $status === 'approved' ? 'active' : ($status === 'rejected' ? 'inactive' : 'pending');
            $stmtUser = $this->db->prepare("UPDATE `users` SET `status` = ? WHERE `id` = (SELECT user_id FROM `school_registrations` WHERE id = ?)");
            $stmtUser->execute([$userStatus, $id]);

            Response::success(null, "School registration status updated to $status.");
        } catch (\PDOException $e) {
            Response::error('Failed to update status: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete School Registration
     */
    public function deleteSchoolRegistration(int $id): void {
        try {
            // Get user_id if attached
            $stmt = $this->db->prepare("SELECT user_id FROM `school_registrations` WHERE `id` = ?");
            $stmt->execute([$id]);
            $userId = $stmt->fetchColumn();

            $this->db->prepare("DELETE FROM `school_registrations` WHERE `id` = ?")->execute([$id]);

            if ($userId) {
                // Remove login sessions and teacher user
                $this->db->prepare("DELETE FROM `login_sessions` WHERE `user_id` = ?")->execute([$userId]);
                $this->db->prepare("DELETE FROM `user_permissions` WHERE `user_id` = ?")->execute([$userId]);
                $this->db->prepare("DELETE FROM `users` WHERE `id` = ?")->execute([$userId]);
            }

            Response::success(null, 'School registration and associated user record deleted permanently.');
        } catch (\PDOException $e) {
            Response::error('Failed to delete school registration: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get Coordinator Inquiries (Admin View)
     */
    public function getCoordinatorInquiries(): void {
        try {
            $stmt = $this->db->query("SELECT * FROM `coordinator_inquiries` ORDER BY `created_at` DESC LIMIT 200");
            $inquiries = $stmt->fetchAll(PDO::FETCH_ASSOC);
            Response::success($inquiries, 'Coordinator inquiries retrieved successfully.');
        } catch (\PDOException $e) {
            Response::error('Database error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update Coordinator Inquiry Status
     */
    public function updateCoordinatorInquiryStatus(int $id): void {
        $input = Validator::getJsonInput();
        $status = $input['status'] ?? 'contacted';

        try {
            $stmt = $this->db->prepare("UPDATE `coordinator_inquiries` SET `status` = ? WHERE `id` = ?");
            $stmt->execute([$status, $id]);
            Response::success(null, "Coordinator inquiry status updated to $status.");
        } catch (\PDOException $e) {
            Response::error('Failed to update status: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete Coordinator Inquiry
     */
    public function deleteCoordinatorInquiry(int $id): void {
        try {
            $stmt = $this->db->prepare("DELETE FROM `coordinator_inquiries` WHERE `id` = ?");
            $stmt->execute([$id]);
            Response::success(null, 'Coordinator inquiry deleted permanently.');
        } catch (\PDOException $e) {
            Response::error('Failed to delete inquiry: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Save Free Trial Attempt automatically to MySQL
     */
    public function saveFreeTrialAttempt(): void {
        $input = Validator::getJsonInput();

        try {
            $studentName = !empty($input['studentName']) ? trim($input['studentName']) : 'Guest Student';
            $email = !empty($input['email']) ? trim($input['email']) : null;
            $examId = $input['examId'] ?? 'trial-math-01';
            $examTitle = $input['examTitle'] ?? 'National Mathematics Olympiad Free Trial';
            $gradeLevel = $input['gradeLevel'] ?? 'Class 5';
            $score = intval($input['score'] ?? 0);
            $totalQuestions = intval($input['totalQuestions'] ?? 0);
            $correct = intval($input['correct'] ?? 0);
            $wrong = intval($input['wrong'] ?? 0);
            $unattempted = intval($input['unattempted'] ?? 0);
            $accuracy = intval($input['accuracy'] ?? 0);

            $stmt = $this->db->prepare("
                INSERT INTO `free_trial_attempts`
                (`student_name`, `email`, `exam_id`, `exam_title`, `grade_level`, `score`, `total_questions`, `correct`, `wrong`, `unattempted`, `accuracy`, `created_at`)
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");

            $stmt->execute([
                $studentName,
                $email,
                $examId,
                $examTitle,
                $gradeLevel,
                $score,
                $totalQuestions,
                $correct,
                $wrong,
                $unattempted,
                $accuracy
            ]);

            Logger::log('FREE_TRIAL_ATTEMPT', 'FreeTrial', ['exam_title' => $examTitle, 'student_name' => $studentName, 'score' => $score]);

            Response::success([
                'id' => $this->db->lastInsertId(),
                'status' => 'saved',
                'score' => $score,
                'message' => 'Free trial attempt saved to MySQL database.'
            ], 'Free trial attempt recorded successfully.');
        } catch (\PDOException $e) {
            Response::error('Failed to save free trial attempt: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get Free Trial Attempts (Admin View)
     */
    public function getFreeTrialAttempts(): void {
        try {
            $stmt = $this->db->query("SELECT * FROM `free_trial_attempts` ORDER BY `created_at` DESC LIMIT 200");
            $attempts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            Response::success($attempts, 'Free trial attempts retrieved successfully.');
        } catch (\PDOException $e) {
            Response::error('Database error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Save New Applicant Lead from Website Homepage Form
     */
    public function saveApplicantLead(): void {
        $input = Validator::getJsonInput();

        if (empty($input['candidateName']) || empty($input['email']) || empty($input['mobile'])) {
            Response::error('Candidate name, email address, and mobile number are required.', 422);
            return;
        }

        try {
            $candidateName = trim($input['candidateName']);
            $country = !empty($input['country']) ? trim($input['country']) : 'India';
            $className = !empty($input['className']) ? trim($input['className']) : 'Class 5';
            $schoolName = !empty($input['schoolName']) ? trim($input['schoolName']) : null;
            $email = strtolower(trim($input['email']));
            $mobile = trim($input['mobile']);
            $applicantId = 'APP-2026-' . rand(100000, 999999);

            $stmt = $this->db->prepare("
                INSERT INTO `new_applicant_leads`
                (`applicant_id`, `candidate_name`, `country`, `class_name`, `school_name`, `email`, `mobile`, `status`, `created_at`)
                VALUES
                (?, ?, ?, ?, ?, ?, ?, 'new', NOW())
            ");

            $stmt->execute([
                $applicantId,
                $candidateName,
                $country,
                $className,
                $schoolName,
                $email,
                $mobile
            ]);

            Logger::log('NEW_APPLICANT_LEAD_SUBMITTED', 'Applicants', [
                'applicant_id' => $applicantId,
                'candidate_name' => $candidateName,
                'email' => $email,
                'class_name' => $className
            ]);

            Response::success([
                'id' => $this->db->lastInsertId(),
                'applicantId' => $applicantId,
                'candidateName' => $candidateName,
                'email' => $email,
                'status' => 'new',
                'message' => 'Applicant lead registered successfully.'
            ], 'Application submitted successfully! Our admissions coordinator will reach out shortly.', 201);
        } catch (\PDOException $e) {
            Response::error('Failed to save applicant lead: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get All Applicant Leads (Admin View)
     */
    public function getApplicantLeads(): void {
        try {
            $stmt = $this->db->query("SELECT * FROM `new_applicant_leads` ORDER BY `created_at` DESC LIMIT 500");
            $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
            Response::success($leads, 'Applicant leads retrieved successfully.');
        } catch (\PDOException $e) {
            Response::error('Database error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update Applicant Lead Status / Notes
     */
    public function updateApplicantLeadStatus(int $id): void {
        $input = Validator::getJsonInput();
        $status = $input['status'] ?? 'new';
        $notes = $input['notes'] ?? null;

        try {
            if ($notes !== null) {
                $stmt = $this->db->prepare("UPDATE `new_applicant_leads` SET `status` = ?, `notes` = ? WHERE `id` = ?");
                $stmt->execute([$status, $notes, $id]);
            } else {
                $stmt = $this->db->prepare("UPDATE `new_applicant_leads` SET `status` = ? WHERE `id` = ?");
                $stmt->execute([$status, $id]);
            }

            Response::success(null, "Applicant lead status updated to $status.");
        } catch (\PDOException $e) {
            Response::error('Failed to update applicant lead: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete Applicant Lead
     */
    public function deleteApplicantLead(int $id): void {
        try {
            $stmt = $this->db->prepare("DELETE FROM `new_applicant_leads` WHERE `id` = ?");
            $stmt->execute([$id]);
            Response::success(null, 'Applicant lead deleted successfully.');
        } catch (\PDOException $e) {
            Response::error('Failed to delete applicant lead: ' . $e->getMessage(), 500);
        }
    }
}
