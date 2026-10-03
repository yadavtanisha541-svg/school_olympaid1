<?php
// OlympiadHub - Study Packages & Purchases Controller
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Response;
use App\Helpers\Auth;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;

class PackageController {

    /**
     * Get published study packages (with optional class and subject filters)
     */
    public function getPackages(): void {
        $db = Database::getConnection();
        $this->ensureSeedPackages($db);

        $classFilter = trim($_GET['class'] ?? '');
        $subjectFilter = trim($_GET['subject'] ?? '');

        $sql = "SELECT * FROM study_packages WHERE status = 'active'";
        $params = [];

        if ($classFilter !== '' && $classFilter !== 'All') {
            preg_match('/\d+/', $classFilter, $matches);
            if (!empty($matches[0])) {
                $cNum = $matches[0];
                $sql .= " AND (class_name LIKE ? OR class_name LIKE ?)";
                $params[] = "%Class $cNum%";
                $params[] = "%Grade $cNum%";
            } else {
                $sql .= " AND class_name LIKE ?";
                $params[] = "%$classFilter%";
            }
        }

        if ($subjectFilter !== '' && $subjectFilter !== 'All') {
            $sql .= " AND (subject_code LIKE ? OR subject_name LIKE ? OR title LIKE ?)";
            $params[] = "%$subjectFilter%";
            $params[] = "%$subjectFilter%";
            $params[] = "%$subjectFilter%";
        }

        $sql .= " ORDER BY price DESC, id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($packages as &$pkg) {
            $pkg['price'] = (float)$pkg['price'];
            $pkg['original_price'] = (float)$pkg['original_price'];
            $pkg['points'] = json_decode($pkg['points_json'] ?? '[]', true) ?: [];
            $parsedSubItems = json_decode($pkg['sub_items_json'] ?? '[]', true) ?: [];
            
            $cls = $pkg['class_name'] ?: 'Class 6';
            if (empty($parsedSubItems)) {
                $parsedSubItems = [
                    [
                        'id' => 'mock_igko',
                        'title' => "Mock Test Series - IGKO $cls",
                        'subject' => 'IGKO',
                        'original_price' => 600.00,
                        'price' => 400.00,
                        'offer_text' => 'Special Offer: 600.00 - 400.00',
                        'points' => [
                            "10 IGKO Online Mock Tests",
                            "Aligned with the SOF Exam Pattern - 2026",
                            "Same Test Duration as the SOF IGKO Exam",
                            "Same Number of Questions and Pattern",
                            "Matching Syllabus & Difficulty Level",
                            "Interactive and Downloadable"
                        ],
                        'is_default_selected' => true
                    ],
                    [
                        'id' => 'pyp_ieo_l1',
                        'title' => "Previous Years Papers with Solutions - Level-1 - IEO $cls",
                        'subject' => 'IEO',
                        'original_price' => 899.00,
                        'price' => 600.00,
                        'offer_text' => 'Special Offer: 899.00 - 600.00',
                        'points' => [
                            "6 IEO Previous Years Papers",
                            "Answer keys of all questions",
                            "Explanation of all questions",
                            "Identify Important Topics",
                            "Prepare for Different Difficulty Levels",
                            "Interactive and Downloadable"
                        ],
                        'is_default_selected' => true
                    ],
                    [
                        'id' => 'pyp_icso',
                        'title' => "Previous Years Papers with Solutions - ICSO $cls",
                        'subject' => 'ICSO',
                        'original_price' => 899.00,
                        'price' => 600.00,
                        'offer_text' => 'Special Offer: 899.00 - 600.00',
                        'points' => [
                            "6 ICSO Previous Years Papers",
                            "Answer keys of all questions",
                            "Explanation of all questions",
                            "Identify Important Topics",
                            "Prepare for Different Difficulty Levels",
                            "Interactive and Downloadable"
                        ],
                        'is_default_selected' => false
                    ],
                    [
                        'id' => 'mock_ieo_l1',
                        'title' => "Mock Test Series - Level-1 - IEO $cls",
                        'subject' => 'IEO',
                        'original_price' => 899.00,
                        'price' => 600.00,
                        'offer_text' => 'Special Offer: 899.00 - 600.00',
                        'points' => [
                            "6 IEO Online Mock Tests",
                            "Aligned with the SOF Exam Pattern - 2026",
                            "Same Test Duration as the SOF IEO Exam",
                            "Same Number of Questions and Pattern",
                            "Matching Syllabus & Difficulty Level",
                            "Interactive and Downloadable"
                        ],
                        'is_default_selected' => false
                    ],
                    [
                        'id' => 'pyp_imo',
                        'title' => "Previous Years Papers with Solutions - IMO $cls",
                        'subject' => 'IMO',
                        'original_price' => 899.00,
                        'price' => 600.00,
                        'offer_text' => 'Special Offer: 899.00 - 600.00',
                        'points' => [
                            "6 IMO Previous Years Papers",
                            "Step-by-step Mathematical Explanations",
                            "Answer keys of all questions",
                            "Achievers HOTS Math Section Included",
                            "Interactive and Downloadable"
                        ],
                        'is_default_selected' => false
                    ],
                    [
                        'id' => 'mock_imo',
                        'title' => "Mock Test Series - IMO $cls",
                        'subject' => 'IMO',
                        'original_price' => 899.00,
                        'price' => 600.00,
                        'offer_text' => 'Special Offer: 899.00 - 600.00',
                        'points' => [
                            "10 IMO Full Length Online Mock Tests",
                            "Real Exam Countdown Clock and Scoring",
                            "Detailed Speed & Accuracy Analysis",
                            "Interactive and Downloadable"
                        ],
                        'is_default_selected' => false
                    ],
                    [
                        'id' => 'pyp_iso',
                        'title' => "Previous Years Papers with Solutions - ISO (NSO) $cls",
                        'subject' => 'ISO',
                        'original_price' => 899.00,
                        'price' => 600.00,
                        'offer_text' => 'Special Offer: 899.00 - 600.00',
                        'points' => [
                            "6 ISO (NSO) Previous Years Papers",
                            "Answer keys and scientific reasoning",
                            "Interactive and Downloadable"
                        ],
                        'is_default_selected' => false
                    ],
                    [
                        'id' => 'mock_iso',
                        'title' => "Mock Test Series - ISO (NSO) $cls",
                        'subject' => 'ISO',
                        'original_price' => 899.00,
                        'price' => 600.00,
                        'offer_text' => 'Special Offer: 899.00 - 600.00',
                        'points' => [
                            "10 ISO (NSO) Online Mock Tests",
                            "Aligned with the SOF Exam Pattern - 2026",
                            "Interactive and Downloadable"
                        ],
                        'is_default_selected' => false
                    ]
                ];
            }
            $pkg['sub_items'] = $parsedSubItems;
            $pkg['discount_tiers'] = json_decode($pkg['discount_tiers_json'] ?? '[]', true) ?: [
                ['count' => 2, 'discount_pct' => 5],
                ['count' => 3, 'discount_pct' => 10],
                ['count' => 4, 'discount_pct' => 15],
                ['count' => 5, 'discount_pct' => 20]
            ];
            if (empty($pkg['bundle_offers_text'])) {
                $pkg['bundle_offers_text'] = 'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2';
            }
        }

        Response::success($packages, 'Packages retrieved successfully.');
    }

    /**
     * Super Admin - Create a new study package
     */
    public function createPackage(): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'super_admin' && $user['role'] !== 'admin' && $user['role'] !== 'superadmin') {
            Response::forbidden('Super Admin access required.');
        }

        $data = Validator::getJsonInput();
        $title = trim($data['title'] ?? '');
        $className = trim($data['class_name'] ?? 'Class 6');
        $subjectCode = strtoupper(trim($data['subject_code'] ?? 'ALL'));
        $subjectName = trim($data['subject_name'] ?? 'All Olympiads Combined');
        $price = (float)($data['price'] ?? 1499.00);
        $originalPrice = (float)($data['original_price'] ?? ($price * 1.3));
        $points = is_array($data['points'] ?? null) ? $data['points'] : [];
        $subItems = is_array($data['sub_items'] ?? null) ? $data['sub_items'] : [];
        $bundleOffersText = trim($data['bundle_offers_text'] ?? 'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2');
        $discountTiers = is_array($data['discount_tiers'] ?? null) ? $data['discount_tiers'] : [
            ['count' => 2, 'discount_pct' => 5],
            ['count' => 3, 'discount_pct' => 10],
            ['count' => 4, 'discount_pct' => 15],
            ['count' => 5, 'discount_pct' => 20]
        ];
        $badgeText = trim($data['badge_text'] ?? 'Popular');
        $headerColor = trim($data['header_color'] ?? '#4895d9');
        $status = trim($data['status'] ?? 'active');

        if (empty($title)) {
            Response::error('Package title is required.', 422);
        }

        if (empty($points)) {
            $points = [
                'Full Comprehensive Mock Tests with Solutions',
                'Chapter-wise Practice Question Bank & Hot Problems',
                'Downloadable Printable PDF Worksheets',
                'National AIR Benchmark & Performance Heatmap'
            ];
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO study_packages (
                title, class_name, subject_code, subject_name, price, original_price,
                points_json, sub_items_json, bundle_offers_text, discount_tiers_json,
                badge_text, header_color, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $title,
            $className,
            $subjectCode,
            $subjectName,
            $price,
            $originalPrice,
            json_encode($points),
            json_encode($subItems),
            $bundleOffersText,
            json_encode($discountTiers),
            $badgeText,
            $headerColor,
            $status
        ]);
        $pkgId = (int)$db->lastInsertId();

        Logger::log("Created Package: $title (₹$price)", 'PackageManager', ['package_id' => $pkgId], $user['id'], $user['role']);

        Response::success([
            'id' => $pkgId,
            'title' => $title,
            'price' => $price,
            'original_price' => $originalPrice
        ], 'Study package created successfully!');
    }

    /**
     * Super Admin - Update an existing study package
     */
    public function updatePackage(int $id): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'super_admin' && $user['role'] !== 'admin' && $user['role'] !== 'superadmin') {
            Response::forbidden('Super Admin access required.');
        }

        $data = Validator::getJsonInput();
        $title = trim($data['title'] ?? '');
        $className = trim($data['class_name'] ?? 'Class 6');
        $subjectCode = strtoupper(trim($data['subject_code'] ?? 'ALL'));
        $subjectName = trim($data['subject_name'] ?? 'All Olympiads Combined');
        $price = (float)($data['price'] ?? 1499.00);
        $originalPrice = (float)($data['original_price'] ?? ($price * 1.3));
        $points = is_array($data['points'] ?? null) ? $data['points'] : [];
        $subItems = is_array($data['sub_items'] ?? null) ? $data['sub_items'] : [];
        $bundleOffersText = trim($data['bundle_offers_text'] ?? 'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2');
        $discountTiers = is_array($data['discount_tiers'] ?? null) ? $data['discount_tiers'] : [];
        $badgeText = trim($data['badge_text'] ?? 'Popular');
        $headerColor = trim($data['header_color'] ?? '#4895d9');
        $status = trim($data['status'] ?? 'active');

        $db = Database::getConnection();
        $stmt = $db->prepare("
            UPDATE study_packages
            SET title = ?, class_name = ?, subject_code = ?, subject_name = ?, price = ?, original_price = ?,
                points_json = ?, sub_items_json = ?, bundle_offers_text = ?, discount_tiers_json = ?,
                badge_text = ?, header_color = ?, status = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $title,
            $className,
            $subjectCode,
            $subjectName,
            $price,
            $originalPrice,
            json_encode($points),
            json_encode($subItems),
            $bundleOffersText,
            json_encode($discountTiers),
            $badgeText,
            $headerColor,
            $status,
            $id
        ]);

        Response::success(['id' => $id], 'Study package updated successfully!');
    }

    /**
     * Super Admin - Delete a study package
     */
    public function deletePackage(int $id): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'super_admin' && $user['role'] !== 'admin' && $user['role'] !== 'superadmin') {
            Response::forbidden('Super Admin access required.');
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM study_packages WHERE id = ?");
        $stmt->execute([$id]);

        Response::success(['id' => $id], 'Study package deleted successfully.');
    }

    /**
     * Student - Purchase a package (stores purchase in DB & notifies Super Admin)
     */
    public function purchasePackage(): void {
        $user = Auth::authenticate();
        $data = Validator::getJsonInput();

        $packageId = (int)($data['package_id'] ?? 0);
        $packageTitle = trim($data['package_title'] ?? ($data['title'] ?? 'Olympiad Study Package'));
        $subjectName = trim($data['subject_name'] ?? ($data['subject'] ?? 'All Olympiads'));
        $studentClass = trim($data['student_class'] ?? ($user['class'] ?? 'Class 6'));
        $price = (float)($data['price'] ?? 1499.00);
        $originalPrice = (float)($data['original_price'] ?? ($price * 1.3));
        $paymentMethod = trim($data['payment_method'] ?? 'Online UPI / Card');

        $studentName = trim($data['student_name'] ?? ($user['name'] ?? 'Candidate'));
        $studentEmail = trim($data['student_email'] ?? ($user['email'] ?? 'student@olympiadhub.in'));
        $studentPhone = trim($data['student_phone'] ?? ($user['phone'] ?? '+91 98765 43210'));

        $orderId = 'PKG-ORD-' . strtoupper(substr(uniqid(), -5)) . rand(100, 999);
        $txnId = 'TXN_' . strtoupper(substr(uniqid(), -6)) . rand(1000, 9999);

        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO package_purchases (
                order_id, student_id, student_name, student_email, student_phone,
                student_class, package_id, package_title, subject_name, price,
                original_price, payment_method, transaction_id, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', NOW())
        ");
        $stmt->execute([
            $orderId,
            $user['id'] ?? null,
            $studentName,
            $studentEmail,
            $studentPhone,
            $studentClass,
            $packageId > 0 ? $packageId : null,
            $packageTitle,
            $subjectName,
            $price,
            $originalPrice,
            $paymentMethod,
            $txnId
        ]);
        $purchaseId = (int)$db->lastInsertId();

        Logger::log("Student Purchase: $studentName bought $packageTitle (₹$price)", 'PackageOrders', [
            'order_id' => $orderId,
            'amount' => $price,
            'student_id' => $user['id'] ?? null
        ], $user['id'] ?? null, $user['role'] ?? 'student');

        Response::success([
            'purchase_id' => $purchaseId,
            'order_id' => $orderId,
            'transaction_id' => $txnId,
            'package_title' => $packageTitle,
            'student_name' => $studentName,
            'student_class' => $studentClass,
            'amount_paid' => $price,
            'date' => date('d M Y, h:i A'),
            'status' => 'completed'
        ], 'Package purchased successfully! Access unlocked.');
    }

    /**
     * Super Admin - Get all student package orders & sales analytics
     */
    public function getAdminPurchases(): void {
        $user = Auth::authenticate();
        if ($user['role'] !== 'super_admin' && $user['role'] !== 'admin' && $user['role'] !== 'superadmin') {
            Response::forbidden('Super Admin access required.');
        }

        $db = Database::getConnection();
        $classFilter = trim($_GET['class'] ?? '');
        $search = trim($_GET['search'] ?? '');

        $sql = "SELECT * FROM package_purchases WHERE 1=1";
        $params = [];

        if ($classFilter !== '' && $classFilter !== 'All') {
            preg_match('/\d+/', $classFilter, $matches);
            if (!empty($matches[0])) {
                $cNum = $matches[0];
                $sql .= " AND (student_class LIKE ? OR student_class LIKE ?)";
                $params[] = "%Class $cNum%";
                $params[] = "%Grade $cNum%";
            } else {
                $sql .= " AND student_class LIKE ?";
                $params[] = "%$classFilter%";
            }
        }

        if ($search !== '') {
            $sql .= " AND (student_name LIKE ? OR student_email LIKE ? OR order_id LIKE ? OR transaction_id LIKE ? OR package_title LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }

        $sql .= " ORDER BY id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate Revenue Analytics
        $totalRevenue = (float)$db->query("SELECT COALESCE(SUM(price), 0) FROM package_purchases WHERE status = 'completed'")->fetchColumn();
        $totalOrdersCount = (int)$db->query("SELECT COUNT(*) FROM package_purchases")->fetchColumn();
        $todayRevenue = (float)$db->query("SELECT COALESCE(SUM(price), 0) FROM package_purchases WHERE status = 'completed' AND DATE(created_at) = CURDATE()")->fetchColumn();
        $activePackagesCount = (int)$db->query("SELECT COUNT(*) FROM study_packages WHERE status = 'active'")->fetchColumn();

        Response::success([
            'orders' => $orders,
            'analytics' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrdersCount,
                'today_revenue' => $todayRevenue,
                'active_packages' => $activePackagesCount
            ]
        ], 'Package purchases and analytics retrieved successfully.');
    }

    /**
     * Student - Get own purchases
     */
    public function getMyPurchases(): void {
        $user = Auth::authenticate();
        $db = Database::getConnection();

        $stmt = $db->prepare("SELECT * FROM package_purchases WHERE student_id = ? OR student_email = ? ORDER BY id DESC");
        $stmt->execute([$user['id'], $user['email']]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::success($orders, 'My orders retrieved successfully.');
    }

    /**
     * Ensure standard default packages with sub-items (Image 1, 2, 3) exist in DB
     */
    private function ensureSeedPackages(PDO $db): void {
        $count = (int)$db->query("SELECT COUNT(*) FROM study_packages")->fetchColumn();
        if ($count > 0) return;

        $classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

        foreach ($classes as $cls) {
            $subItems = [
                [
                    'id' => 'mock_igko',
                    'title' => "Mock Test Series - IGKO $cls",
                    'subject' => 'IGKO',
                    'original_price' => 600.00,
                    'price' => 400.00,
                    'offer_text' => 'Special Offer: 600.00 - 400.00',
                    'points' => [
                        "10 IGKO Online Mock Tests",
                        "Aligned with the SOF Exam Pattern - 2026",
                        "Same Test Duration as the SOF IGKO Exam",
                        "Same Number of Questions and Pattern",
                        "Matching Syllabus & Difficulty Level",
                        "Interactive and Downloadable"
                    ],
                    'is_default_selected' => true
                ],
                [
                    'id' => 'pyp_ieo_l1',
                    'title' => "Previous Years Papers with Solutions - Level-1 - IEO $cls",
                    'subject' => 'IEO',
                    'original_price' => 899.00,
                    'price' => 600.00,
                    'offer_text' => 'Special Offer: 899.00 - 600.00',
                    'points' => [
                        "6 IEO Previous Years Papers",
                        "Answer keys of all questions",
                        "Explanation of all questions",
                        "Identify Important Topics",
                        "Prepare for Different Difficulty Levels",
                        "Interactive and Downloadable"
                    ],
                    'is_default_selected' => true
                ],
                [
                    'id' => 'pyp_icso',
                    'title' => "Previous Years Papers with Solutions - ICSO $cls",
                    'subject' => 'ICSO',
                    'original_price' => 899.00,
                    'price' => 600.00,
                    'offer_text' => 'Special Offer: 899.00 - 600.00',
                    'points' => [
                        "6 ICSO Previous Years Papers",
                        "Answer keys of all questions",
                        "Explanation of all questions",
                        "Identify Important Topics",
                        "Prepare for Different Difficulty Levels",
                        "Interactive and Downloadable"
                    ],
                    'is_default_selected' => false
                ],
                [
                    'id' => 'mock_ieo_l1',
                    'title' => "Mock Test Series - Level-1 - IEO $cls",
                    'subject' => 'IEO',
                    'original_price' => 899.00,
                    'price' => 600.00,
                    'offer_text' => 'Special Offer: 899.00 - 600.00',
                    'points' => [
                        "6 IEO Online Mock Tests",
                        "Aligned with the SOF Exam Pattern - 2026",
                        "Same Test Duration as the SOF IEO Exam",
                        "Same Number of Questions and Pattern",
                        "Matching Syllabus & Difficulty Level",
                        "Interactive and Downloadable"
                    ],
                    'is_default_selected' => false
                ],
                [
                    'id' => 'pyp_imo',
                    'title' => "Previous Years Papers with Solutions - IMO $cls",
                    'subject' => 'IMO',
                    'original_price' => 899.00,
                    'price' => 600.00,
                    'offer_text' => 'Special Offer: 899.00 - 600.00',
                    'points' => [
                        "6 IMO Previous Years Papers",
                        "Step-by-step Mathematical Explanations",
                        "Answer keys of all questions",
                        "Achievers HOTS Math Section Included",
                        "Interactive and Downloadable"
                    ],
                    'is_default_selected' => false
                ],
                [
                    'id' => 'mock_imo',
                    'title' => "Mock Test Series - IMO $cls",
                    'subject' => 'IMO',
                    'original_price' => 899.00,
                    'price' => 600.00,
                    'offer_text' => 'Special Offer: 899.00 - 600.00',
                    'points' => [
                        "10 IMO Full Length Online Mock Tests",
                        "Real Exam Countdown Clock and Scoring",
                        "Detailed Speed & Accuracy Analysis",
                        "Interactive and Downloadable"
                    ],
                    'is_default_selected' => false
                ]
            ];

            // Package 1: Power Prep Package (Image 1 & 3)
            $stmt = $db->prepare("
                INSERT INTO study_packages (
                    title, class_name, subject_code, subject_name, price, original_price,
                    points_json, sub_items_json, bundle_offers_text, discount_tiers_json,
                    badge_text, header_color, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())
            ");
            $stmt->execute([
                "Olympiads Power Prep Package - $cls",
                $cls,
                'ALL',
                'All Olympiads Combined',
                1499.00,
                1999.00,
                json_encode([
                    "Short on time? Make your last-minute Olympiad preparation focused and flexible",
                    "Choose What You Need - Previous Years Papers, Mock Test Papers or Both",
                    "Practise with Previous Year Papers",
                    "Attempt Exam-Style Mock Tests",
                    "Practise Real Olympiad Questions",
                    "Boost Speed, Accuracy & Confidence",
                    "Identify & Improve Weak Areas",
                    "More Practice = Better Preparation = Better Performance!"
                ]),
                json_encode($subItems),
                'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2',
                json_encode([
                    ['count' => 2, 'discount_pct' => 5],
                    ['count' => 3, 'discount_pct' => 10],
                    ['count' => 4, 'discount_pct' => 15],
                    ['count' => 5, 'discount_pct' => 20]
                ]),
                'Bestseller',
                '#0284c7'
            ]);

            // Package 2: Level-2 Champs Package (Image 3)
            $stmt->execute([
                "Olympiads Level-2 Champs Package - $cls",
                $cls,
                'ALL',
                'All Olympiads Combined',
                1999.00,
                2500.00,
                json_encode([
                    "5 Grand Level-2 National Mock Tests",
                    "Advanced HOTS & Tie-Breaker Problem Sets",
                    "Detailed Video Solutions & Step-by-Step Analysis",
                    "National Benchmark Percentile & AIR Ranking",
                    "Unlimited Test Retake Attempts for 365 Days"
                ]),
                json_encode($subItems),
                'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2',
                json_encode([
                    ['count' => 2, 'discount_pct' => 5],
                    ['count' => 3, 'discount_pct' => 10],
                    ['count' => 4, 'discount_pct' => 15],
                    ['count' => 5, 'discount_pct' => 20]
                ]),
                'Advanced Tier',
                '#4895d9'
            ]);

            // Package 3: Comprehensive Practice Test Pack (Image 3)
            $stmt->execute([
                "Comprehensive Practice Test Pack - $cls",
                $cls,
                'ALL',
                'All Olympiads Combined',
                1499.00,
                1999.00,
                json_encode([
                    "50+ Chapter-wise Diagnostic Tests with Instant Scoring",
                    "Previous 5 Years Solved Official Papers (2020-2024)",
                    "10 Full-Length Timed Model Examination Papers",
                    "Performance Weakness Diagnostic Heatmap",
                    "Full Validity for Academic Year 2026-27"
                ]),
                json_encode($subItems),
                'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2',
                json_encode([
                    ['count' => 2, 'discount_pct' => 5],
                    ['count' => 3, 'discount_pct' => 10],
                    ['count' => 4, 'discount_pct' => 15],
                    ['count' => 5, 'discount_pct' => 20]
                ]),
                'Complete Prep',
                '#0284c7'
            ]);

            // Package 4: Chapter-wise Synopsis & Worksheets Kit (Image 3)
            $stmt->execute([
                "Chapter-wise Synopsis & Worksheets Kit - $cls",
                $cls,
                'ALL',
                'All Olympiads Combined',
                499.00,
                999.00,
                json_encode([
                    "High-Yield Quick Revision Formula & Concept Sheets",
                    "Downloadable Printable PDF Question Worksheets",
                    "Key Olympiad Shortcuts & Speed Arithmetic Tips",
                    "Instant Access on Web and Mobile App"
                ]),
                json_encode($subItems),
                'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2',
                json_encode([
                    ['count' => 2, 'discount_pct' => 5],
                    ['count' => 3, 'discount_pct' => 10],
                    ['count' => 4, 'discount_pct' => 15],
                    ['count' => 5, 'discount_pct' => 20]
                ]),
                'Quick Revision',
                '#059669'
            ]);
        }
    }
}
