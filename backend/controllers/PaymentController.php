<?php
// OlympiadHub - Payment & Checkout Controller (Comprehensive Super Admin & Student Management)
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Response;
use App\Helpers\Auth;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;
use Exception;

class PaymentController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
        $this->ensureSchema();
    }

    private function ensureSchema(): void {
        try {
            $cols = $this->db->query("SHOW COLUMNS FROM payment_bank_settings")->fetchAll(PDO::FETCH_COLUMN);
            if (!in_array('upi_qr_url', $cols)) {
                $this->db->exec("ALTER TABLE payment_bank_settings ADD COLUMN upi_qr_url VARCHAR(500) NULL");
            }
            if (!in_array('payee_name', $cols)) {
                $this->db->exec("ALTER TABLE payment_bank_settings ADD COLUMN payee_name VARCHAR(150) NULL DEFAULT 'OlympiadHub'");
            }
        } catch (Exception $e) {
            // Ignore if already present
        }
    }

    /**
     * Get Admin's Official Bank & UPI Payment Details
     */
    public function getBankSettings(): void {
        try {
            $stmt = $this->db->query("SELECT * FROM payment_bank_settings ORDER BY id DESC LIMIT 1");
            $row = $stmt->fetch();

            if (!$row) {
                $row = [
                    'bank_name' => 'State Bank of India',
                    'account_holder_name' => 'OlympiadHub Official Organization',
                    'payee_name' => 'OlympiadHub Education',
                    'account_number' => '398450123984',
                    'ifsc_code' => 'SBIN0005432',
                    'branch_name' => 'Central Hub Branch, New Delhi',
                    'account_type' => 'Current Account',
                    'upi_id' => 'olympiadhub.edu@okaxis',
                    'upi_phone' => '+91 98765 43210',
                    'upi_qr_url' => '',
                    'instructions' => 'Please transfer the exact total payable amount via UPI / IMPS / NEFT. After completing payment, enter your 12-digit UTR / Transaction Reference Number below to confirm and activate your package immediately.',
                    'is_active' => 1
                ];
            }

            Response::success($row, 'Payment bank details retrieved successfully.');
        } catch (Exception $e) {
            Response::error('Failed to retrieve bank details: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Super Admin - Update Bank, UPI & QR Code Details
     */
    public function saveBankSettings(): void {
        try {
            $user = Auth::authenticate();
            if ($user['role'] !== 'superadmin' && $user['role'] !== 'admin') {
                Response::forbidden('Super Admin authorization required.');
            }

            $input = Validator::getJsonInput();

            $bankName = trim($input['bank_name'] ?? 'State Bank of India');
            $accountHolder = trim($input['account_holder_name'] ?? 'OlympiadHub Official Organization');
            $payeeName = trim($input['payee_name'] ?? 'OlympiadHub Education');
            $accountNumber = trim($input['account_number'] ?? '');
            $ifsc = strtoupper(trim($input['ifsc_code'] ?? ''));
            $branch = trim($input['branch_name'] ?? '');
            $accountType = trim($input['account_type'] ?? 'Current Account');
            $upiId = trim($input['upi_id'] ?? '');
            $upiPhone = trim($input['upi_phone'] ?? '');
            $upiQrUrl = trim($input['upi_qr_url'] ?? '');
            $instructions = trim($input['instructions'] ?? '');
            $isActive = !empty($input['is_active']) ? 1 : 0;

            $check = $this->db->query("SELECT id FROM payment_bank_settings ORDER BY id DESC LIMIT 1")->fetch();
            if ($check) {
                $stmt = $this->db->prepare("
                    UPDATE payment_bank_settings 
                    SET bank_name = ?, account_holder_name = ?, payee_name = ?, account_number = ?, ifsc_code = ?,
                        branch_name = ?, account_type = ?, upi_id = ?, upi_phone = ?, upi_qr_url = ?,
                        instructions = ?, is_active = ?, updated_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([
                    $bankName, $accountHolder, $payeeName, $accountNumber, $ifsc, $branch, $accountType,
                    $upiId, $upiPhone, $upiQrUrl, $instructions, $isActive, $check['id']
                ]);
            } else {
                $stmt = $this->db->prepare("
                    INSERT INTO payment_bank_settings (
                        bank_name, account_holder_name, payee_name, account_number, ifsc_code, branch_name,
                        account_type, upi_id, upi_phone, upi_qr_url, instructions, is_active
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $bankName, $accountHolder, $payeeName, $accountNumber, $ifsc, $branch, $accountType,
                    $upiId, $upiPhone, $upiQrUrl, $instructions, $isActive
                ]);
            }

            Logger::log("Super Admin updated Payment Bank & UPI Settings ($bankName / $upiId)", 'PaymentSettings', [
                'bank_name' => $bankName,
                'upi_id' => $upiId
            ], $user['id'] ?? null, $user['role'] ?? 'superadmin');

            Response::success([
                'bank_name' => $bankName,
                'account_holder_name' => $accountHolder,
                'payee_name' => $payeeName,
                'account_number' => $accountNumber,
                'ifsc_code' => $ifsc,
                'branch_name' => $branch,
                'account_type' => $accountType,
                'upi_id' => $upiId,
                'upi_phone' => $upiPhone,
                'upi_qr_url' => $upiQrUrl,
                'instructions' => $instructions,
                'is_active' => $isActive
            ], 'Payment bank details & QR Code updated in MySQL successfully.');
        } catch (Exception $e) {
            Response::error('Failed to save bank settings: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Student - Complete Checkout & Submit Payment Verification
     */
    public function processCheckout(): void {
        try {
            $user = Auth::getOptionalUser();
            $input = Validator::getJsonInput();

            // 1. Validate Billing Information
            $billingName = trim($input['billing_name'] ?? '');
            $address = trim($input['address'] ?? '');
            $zipCode = trim($input['zip_code'] ?? '');
            $city = trim($input['city'] ?? '');
            $state = trim($input['state'] ?? '');
            $country = trim($input['country'] ?? 'India');
            $currency = trim($input['currency'] ?? 'Indian Rupee');
            $mobileNumber = trim($input['mobile_number'] ?? '');
            $email = trim($input['email'] ?? '');

            if (empty($billingName)) {
                Response::error('Billing Name is required.', 422);
            }
            if (empty($address)) {
                Response::error('Address is required.', 422);
            }
            if (empty($zipCode)) {
                Response::error('Zip Code is required.', 422);
            }
            if (empty($city)) {
                Response::error('City is required.', 422);
            }
            if (empty($state)) {
                Response::error('State is required.', 422);
            }
            if (empty($mobileNumber)) {
                Response::error('Mobile Number is required.', 422);
            }
            if (empty($email)) {
                Response::error('Email is required.', 422);
            }

            // 2. Validate Payment & Verification Details
            $paymentMethod = trim($input['payment_method'] ?? 'UPI Transfer');
            $transactionId = trim($input['transaction_id'] ?? ($input['code'] ?? ($input['utr_number'] ?? '')));
            $payerName = trim($input['payer_name'] ?? $billingName);
            $payerBankName = trim($input['payer_bank_name'] ?? '');
            $payerRemarks = trim($input['payer_remarks'] ?? '');

            if (empty($transactionId)) {
                Response::error('Payment Transaction ID / UTR Code is required to confirm payment.', 422);
            }
            if (empty($payerName)) {
                Response::error('Payer / Account Holder Name is required to confirm payment.', 422);
            }

            // 3. Financial calculations
            $subtotal = (float)($input['subtotal'] ?? ($input['amount'] ?? 0));
            $gstAmount = (float)($input['gst_amount'] ?? ($subtotal * 0.18));
            $totalAmount = (float)($input['total_amount'] ?? ($subtotal + $gstAmount));
            $couponCode = trim($input['coupon_code'] ?? '');
            $couponDiscount = (float)($input['coupon_discount'] ?? 0);
            $items = is_array($input['items'] ?? null) ? $input['items'] : [];

            $packageTitle = !empty($items[0]['name']) ? $items[0]['name'] : 'Olympiad Concept Classes Package';
            if (count($items) > 1) {
                $packageTitle .= ' (+ ' . (count($items) - 1) . ' more items)';
            }
            $studentClass = trim($input['student_class'] ?? ($user['class'] ?? 'Class 6'));

            $orderId = 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4)) . rand(100, 999);

            $stmt = $this->db->prepare("
                INSERT INTO package_purchases (
                    order_id, student_id, student_name, student_email, student_phone, student_class,
                    package_id, package_title, subject_name, price, original_price,
                    payment_method, transaction_id, status,
                    billing_name, billing_address, zip_code, city, state, country, currency,
                    gst_amount, subtotal, total_amount, coupon_code, coupon_discount,
                    payer_name, payer_bank_name, payer_remarks, order_items_json,
                    created_at
                ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, 'completed',
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    NOW()
                )
            ");

            $packageId = !empty($items[0]['id']) ? (int)preg_replace('/\D/', '', (string)$items[0]['id']) : null;

            $stmt->execute([
                $orderId,
                $user['id'] ?? null,
                $billingName,
                $email,
                $mobileNumber,
                $studentClass,
                $packageId,
                $packageTitle,
                $studentClass . ' Olympiads',
                $totalAmount,
                $subtotal * 1.25,
                $paymentMethod,
                $transactionId,
                $billingName,
                $address,
                $zipCode,
                $city,
                $state,
                $country,
                $currency,
                $gstAmount,
                $subtotal,
                $totalAmount,
                $couponCode,
                $couponDiscount,
                $payerName,
                $payerBankName,
                $payerRemarks,
                json_encode($items, JSON_UNESCAPED_UNICODE)
            ]);

            $purchaseId = (int)$this->db->lastInsertId();

            Logger::log("Student Payment Order: $billingName placed $orderId for ₹$totalAmount (Txn: $transactionId)", 'Orders', [
                'order_id' => $orderId,
                'transaction_id' => $transactionId,
                'amount' => $totalAmount,
                'student_id' => $user['id'] ?? null
            ], $user['id'] ?? null, $user['role'] ?? 'student');

            Response::success([
                'purchase_id' => $purchaseId,
                'order_id' => $orderId,
                'transaction_id' => $transactionId,
                'billing_name' => $billingName,
                'email' => $email,
                'mobile_number' => $mobileNumber,
                'total_amount' => $totalAmount,
                'package_title' => $packageTitle,
                'date' => date('d M Y, h:i A'),
                'status' => 'completed',
                'message' => 'Payment verified & order confirmed successfully! Access unlocked.'
            ], 'Order placed and payment confirmed in MySQL successfully.', 201);

        } catch (Exception $e) {
            Response::error('Checkout processing error: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Super Admin - Get all orders & payments with stats
     */
    public function getOrders(): void {
        try {
            $user = Auth::authenticate();
            if ($user['role'] !== 'superadmin' && $user['role'] !== 'admin') {
                Response::forbidden('Super Admin authorization required.');
            }

            $search = trim($_GET['search'] ?? '');
            $status = trim($_GET['status'] ?? '');

            $sql = "SELECT * FROM package_purchases WHERE 1=1";
            $params = [];

            if (!empty($search)) {
                $sql .= " AND (order_id LIKE ? OR transaction_id LIKE ? OR billing_name LIKE ? OR student_name LIKE ? OR student_email LIKE ? OR mobile_number LIKE ? OR student_phone LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }

            if (!empty($status) && $status !== 'all') {
                $sql .= " AND status = ?";
                $params[] = $status;
            }

            $sql .= " ORDER BY id DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($orders as &$ord) {
                $ord['order_items'] = !empty($ord['order_items_json']) ? json_decode($ord['order_items_json'], true) : [];
            }

            // Summary Analytics
            $totalRevenue = (float)$this->db->query("SELECT COALESCE(SUM(total_amount), SUM(price), 0) FROM package_purchases WHERE status IN ('completed', 'approved')")->fetchColumn();
            $totalOrdersCount = (int)$this->db->query("SELECT COUNT(*) FROM package_purchases")->fetchColumn();
            $pendingCount = (int)$this->db->query("SELECT COUNT(*) FROM package_purchases WHERE status = 'pending'")->fetchColumn();

            Response::success([
                'orders' => $orders,
                'stats' => [
                    'total_revenue' => $totalRevenue,
                    'total_orders' => $totalOrdersCount,
                    'pending_orders' => $pendingCount
                ]
            ], 'Orders retrieved successfully.');
        } catch (Exception $e) {
            Response::error('Failed to get orders: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Super Admin - Update Order Status (Approve / Reject)
     */
    public function updateOrderStatus(int $id): void {
        try {
            $user = Auth::authenticate();
            if ($user['role'] !== 'superadmin' && $user['role'] !== 'admin') {
                Response::forbidden('Super Admin authorization required.');
            }

            $input = Validator::getJsonInput();
            $newStatus = trim($input['status'] ?? 'completed');

            $stmt = $this->db->prepare("UPDATE package_purchases SET status = ? WHERE id = ?");
            $stmt->execute([$newStatus, $id]);

            Response::success(['id' => $id, 'status' => $newStatus], "Order status updated to $newStatus.");
        } catch (Exception $e) {
            Response::error('Failed to update order status: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Super Admin - Delete an Order Entry
     */
    public function deleteOrder(int $id): void {
        try {
            $user = Auth::authenticate();
            if ($user['role'] !== 'superadmin' && $user['role'] !== 'admin') {
                Response::forbidden('Super Admin authorization required.');
            }

            $stmt = $this->db->prepare("DELETE FROM package_purchases WHERE id = ?");
            $stmt->execute([$id]);

            Response::success(['id' => $id], "Order deleted successfully.");
        } catch (Exception $e) {
            Response::error('Failed to delete order: ' . $e->getMessage(), 500);
        }
    }
}
