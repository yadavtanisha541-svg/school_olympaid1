<?php
// OlympiadHub - Central REST API Router
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');

// Set Timezone
date_default_timezone_set('Asia/Kolkata');

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = dirname(__DIR__) . '/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    // Convert namespace to path (e.g. App\Controllers\AuthController -> controllers/AuthController.php)
    $parts = explode('\\', $relativeClass);
    if (count($parts) > 1) {
        $parts[0] = strtolower($parts[0]);
    }
    $file = $baseDir . implode('/', $parts) . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

use App\Helpers\Response;

// Determine URL Path
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Strip script name or basePath if served under subdirectory
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName !== '/' && $scriptName !== '\\' && strpos($uri, $scriptName) === 0) {
    $uri = substr($uri, strlen($scriptName));
}

// Also support query param fallback: ?route=/api/...
if (isset($_GET['route'])) {
    $uri = '/' . ltrim($_GET['route'], '/');
}

$uri = '/' . trim($uri, '/');

// Router Logic
try {
    // Health Check
    if ($uri === '' || $uri === '/' || $uri === '/api' || $uri === '/api/health') {
        Response::success([
            'platform' => 'OlympiadHub Online Examination API',
            'version' => '2.0.0',
            'status' => 'operational',
            'timestamp' => date('Y-m-d H:i:s')
        ], 'OlympiadHub API is healthy and connected.');
    }

    // 1. Auth Routes
    if ($uri === '/api/auth/login' && $method === 'POST') {
        (new App\Controllers\AuthController())->login();
    }
    if ($uri === '/api/auth/register-student' && $method === 'POST') {
        (new App\Controllers\AuthController())->registerStudent();
    }
    if (($uri === '/api/auth/register-school' || $uri === '/api/auth/register-teacher') && $method === 'POST') {
        (new App\Controllers\AuthController())->registerSchool();
    }
    if (($uri === '/api/coordinator/inquire' || $uri === '/api/auth/coordinator-inquiry') && $method === 'POST') {
        (new App\Controllers\AuthController())->submitCoordinatorInquiry();
    }
    if ($uri === '/api/auth/me' && $method === 'GET') {
        (new App\Controllers\AuthController())->me();
    }
    if ($uri === '/api/auth/logout' && $method === 'POST') {
        (new App\Controllers\AuthController())->logout();
    }
    if ($uri === '/api/auth/update-profile' && $method === 'POST') {
        (new App\Controllers\AuthController())->updateProfile();
    }
    if ($uri === '/api/auth/change-password' && $method === 'POST') {
        (new App\Controllers\AuthController())->changePassword();
    }

    // Workbook Orders & Free Trials (Public & Auto-save)
    if ($uri === '/api/workbooks/order' && $method === 'POST') {
        (new App\Controllers\PublicActionsController())->saveWorkbookOrder();
    }
    if ($uri === '/api/workbooks/orders' && $method === 'GET') {
        (new App\Controllers\PublicActionsController())->getWorkbookOrders();
    }
    if (preg_match('#^/api/workbooks/orders/(\d+)$#', $uri, $m) && $method === 'DELETE') {
        (new App\Controllers\PublicActionsController())->deleteWorkbookOrder((int)$m[1]);
    }
    if (preg_match('#^/api/workbooks/orders/(\d+)/status$#', $uri, $m) && ($method === 'PUT' || $method === 'POST')) {
        (new App\Controllers\PublicActionsController())->updateWorkbookOrderStatus((int)$m[1]);
    }

    // School Registrations Management
    if ($uri === '/api/schools/registrations' && $method === 'GET') {
        (new App\Controllers\PublicActionsController())->getSchoolRegistrations();
    }
    if (preg_match('#^/api/schools/registrations/(\d+)$#', $uri, $m) && $method === 'DELETE') {
        (new App\Controllers\PublicActionsController())->deleteSchoolRegistration((int)$m[1]);
    }
    if (preg_match('#^/api/schools/registrations/(\d+)/status$#', $uri, $m) && ($method === 'PUT' || $method === 'POST')) {
        (new App\Controllers\PublicActionsController())->updateSchoolRegistrationStatus((int)$m[1]);
    }

    // Coordinator Inquiries Management
    if (($uri === '/api/coordinator/inquiries' || $uri === '/api/coordinators/inquiries') && $method === 'GET') {
        (new App\Controllers\PublicActionsController())->getCoordinatorInquiries();
    }
    if (preg_match('#^/api/coordinator/inquiries/(\d+)$#', $uri, $m) && $method === 'DELETE') {
        (new App\Controllers\PublicActionsController())->deleteCoordinatorInquiry((int)$m[1]);
    }
    if (preg_match('#^/api/coordinator/inquiries/(\d+)/status$#', $uri, $m) && ($method === 'PUT' || $method === 'POST')) {
        (new App\Controllers\PublicActionsController())->updateCoordinatorInquiryStatus((int)$m[1]);
    }

    if ($uri === '/api/free-trial/submit' && $method === 'POST') {
        (new App\Controllers\PublicActionsController())->saveFreeTrialAttempt();
    }
    if ($uri === '/api/free-trial/attempts' && $method === 'GET') {
        (new App\Controllers\PublicActionsController())->getFreeTrialAttempts();
    }

    // 2. User Routes
    if ($uri === '/api/users/teachers' && $method === 'GET') {
        (new App\Controllers\UserController())->getTeachers();
    }
    if ($uri === '/api/users/students' && $method === 'GET') {
        (new App\Controllers\UserController())->getStudents();
    }
    if ($uri === '/api/users/bulk-delete' && $method === 'POST') {
        (new App\Controllers\UserController())->bulkDeleteUsers();
    }
    if ($uri === '/api/users' && $method === 'POST') {
        (new App\Controllers\UserController())->createUser();
    }
    if (preg_match('#^/api/users/(\d+)$#', $uri, $m)) {
        if ($method === 'PUT' || $method === 'POST') {
            (new App\Controllers\UserController())->updateUser((int)$m[1]);
        } elseif ($method === 'DELETE') {
            (new App\Controllers\UserController())->deleteUser((int)$m[1]);
        }
    }
    if (preg_match('#^/api/users/(\d+)/reset-password$#', $uri, $m) && $method === 'POST') {
        (new App\Controllers\UserController())->resetPassword((int)$m[1]);
    }
    if (preg_match('#^/api/users/(\d+)/toggle-status$#', $uri, $m) && $method === 'POST') {
        (new App\Controllers\UserController())->toggleStatus((int)$m[1]);
    }
    if ($uri === '/api/permissions' && $method === 'GET') {
        (new App\Controllers\UserController())->getPermissionsList();
    }
    if (preg_match('#^/api/users/(\d+)/permissions$#', $uri, $m)) {
        if ($method === 'GET') {
            (new App\Controllers\UserController())->getTeacherPermissions((int)$m[1]);
        } elseif ($method === 'POST' || $method === 'PUT') {
            (new App\Controllers\UserController())->updateTeacherPermissions((int)$m[1]);
        }
    }

    // 3. Academic Structure & Public Directory Routes
    if ($uri === '/api/public/disciplines' && $method === 'GET') {
        (new App\Controllers\AcademicController())->getPublicDisciplines();
    }
    if ($uri === '/api/public/classes' && $method === 'GET') {
        (new App\Controllers\AcademicController())->getPublicClasses();
    }
    if ($uri === '/api/academic/classes') {
        if ($method === 'GET') {
            (new App\Controllers\AcademicController())->getClasses();
        } elseif ($method === 'POST') {
            (new App\Controllers\AcademicController())->createClass();
        }
    }
    if (preg_match('#^/api/academic/classes/(\d+)$#', $uri, $m)) {
        if ($method === 'PUT' || $method === 'POST') {
            (new App\Controllers\AcademicController())->updateClass((int)$m[1]);
        } elseif ($method === 'DELETE') {
            (new App\Controllers\AcademicController())->deleteClass((int)$m[1]);
        }
    }
    if ($uri === '/api/academic/subjects') {
        if ($method === 'GET') {
            (new App\Controllers\AcademicController())->getSubjects();
        } elseif ($method === 'POST') {
            (new App\Controllers\AcademicController())->createSubject();
        }
    }
    if (preg_match('#^/api/academic/subjects/(\d+)$#', $uri, $m)) {
        if ($method === 'PUT' || $method === 'POST') {
            (new App\Controllers\AcademicController())->updateSubject((int)$m[1]);
        } elseif ($method === 'DELETE') {
            (new App\Controllers\AcademicController())->deleteSubject((int)$m[1]);
        }
    }
    if ($uri === '/api/academic/chapters') {
        if ($method === 'GET') {
            (new App\Controllers\AcademicController())->getChapters();
        } elseif ($method === 'POST') {
            (new App\Controllers\AcademicController())->createChapter();
        }
    }
    if (preg_match('#^/api/academic/chapters/(\d+)$#', $uri, $m)) {
        if ($method === 'PUT' || $method === 'POST') {
            (new App\Controllers\AcademicController())->updateChapter((int)$m[1]);
        } elseif ($method === 'DELETE') {
            (new App\Controllers\AcademicController())->deleteChapter((int)$m[1]);
        }
    }
    if ($uri === '/api/academic/topics') {
        if ($method === 'GET') {
            (new App\Controllers\AcademicController())->getTopics();
        } elseif ($method === 'POST') {
            (new App\Controllers\AcademicController())->createTopic();
        }
    }
    if ($uri === '/api/academic/subject-class-content') {
        if ($method === 'GET') {
            (new App\Controllers\AcademicController())->getSubjectClassContent();
        } elseif ($method === 'POST' || $method === 'PUT') {
            (new App\Controllers\AcademicController())->saveSubjectClassContent();
        }
    }

    // 4. Question Bank Routes
    if ($uri === '/api/questions') {
        if ($method === 'GET') {
            (new App\Controllers\QuestionController())->getQuestions();
        } elseif ($method === 'POST') {
            (new App\Controllers\QuestionController())->createQuestion();
        }
    }
    if (preg_match('#^/api/questions/(\d+)$#', $uri, $m)) {
        if ($method === 'GET') {
            (new App\Controllers\QuestionController())->getQuestion((int)$m[1]);
        } elseif ($method === 'PUT' || $method === 'POST') {
            (new App\Controllers\QuestionController())->updateQuestion((int)$m[1]);
        } elseif ($method === 'DELETE') {
            (new App\Controllers\QuestionController())->deleteQuestion((int)$m[1]);
        }
    }
    if ($uri === '/api/questions-template' && $method === 'GET') {
        (new App\Controllers\QuestionController())->getImportTemplate();
    }
    if ($uri === '/api/questions-import' && $method === 'POST') {
        (new App\Controllers\QuestionController())->importQuestions();
    }

    // 5. Exam Routes
    if (($uri === '/api/exams' || $uri === '/api/exams/available')) {
        if ($method === 'GET') {
            (new App\Controllers\ExamController())->getExams();
        } elseif ($method === 'POST') {
            (new App\Controllers\ExamController())->createExam();
        }
    }
    if (preg_match('#^/api/exams/(\d+)$#', $uri, $m)) {
        if ($method === 'GET') {
            (new App\Controllers\ExamController())->getExam((int)$m[1]);
        } elseif ($method === 'PUT' || $method === 'POST') {
            (new App\Controllers\ExamController())->updateExam((int)$m[1]);
        } elseif ($method === 'DELETE') {
            (new App\Controllers\ExamController())->deleteExam((int)$m[1]);
        }
    }

    // 6. Exam Engine Routes (Live Exam Execution)
    if (preg_match('#^/api/exam-engine/(\d+)/start$#', $uri, $m) && $method === 'POST') {
        (new App\Controllers\ExamEngineController())->startExam((int)$m[1]);
    }
    if ($uri === '/api/exam-engine/save-answer' && $method === 'POST') {
        (new App\Controllers\ExamEngineController())->saveAnswer();
    }
    if ($uri === '/api/exam-engine/security-event' && $method === 'POST') {
        (new App\Controllers\ExamEngineController())->logSecurityEvent();
    }
    if ($uri === '/api/exam-engine/submit' && $method === 'POST') {
        (new App\Controllers\ExamEngineController())->submitExam();
    }
    if (($uri === '/api/test-generator/submit' || $uri === '/api/exam-engine/submit-generated') && $method === 'POST') {
        (new App\Controllers\ExamEngineController())->submitGeneratedTest();
    }
    if ($uri === '/api/test-generator/admin-papers' && $method === 'GET') {
        (new App\Controllers\ExamEngineController())->getGeneratorAdminPapers();
    }
    if ($uri === '/api/test-generator/admin-papers' && $method === 'POST') {
        (new App\Controllers\ExamEngineController())->createGeneratorAdminPaper();
    }
    if (preg_match('#^/api/test-generator/admin-papers/(\d+)$#', $uri, $m) && $method === 'DELETE') {
        (new App\Controllers\ExamEngineController())->deleteGeneratorAdminPaper((int)$m[1]);
    }

    // 7. Results & Solutions
    if ($uri === '/api/results' && $method === 'GET') {
        (new App\Controllers\ResultController())->getResults();
    }
    if (preg_match('#^/api/results/(\d+)$#', $uri, $m) && $method === 'GET') {
        (new App\Controllers\ResultController())->getResult((int)$m[1]);
    }
    if (preg_match('#^/api/results/(\d+)/solutions$#', $uri, $m) && $method === 'GET') {
        (new App\Controllers\ResultController())->getSolutions((int)$m[1]);
    }
    if ($uri === '/api/results/history' && $method === 'GET') {
        (new App\Controllers\ResultController())->getStudentHistory();
    }

    // 8. Leaderboard
    if ($uri === '/api/leaderboard' && $method === 'GET') {
        (new App\Controllers\LeaderboardController())->getLeaderboard();
    }

    // 9. Certificates
    if (($uri === '/api/certificates' || $uri === '/api/certificates/my') && $method === 'GET') {
        (new App\Controllers\CertificateController())->getCertificates();
    }
    if (preg_match('#^/api/certificates/(\d+)$#', $uri, $m) && $method === 'GET') {
        (new App\Controllers\CertificateController())->getCertificate((int)$m[1]);
    }
    if (($uri === '/api/certificates-verify' || $uri === '/api/certificates/verify') && ($method === 'GET' || $method === 'POST')) {
        (new App\Controllers\CertificateController())->verify();
    }

    // 10. Analytics
    if ($uri === '/api/analytics/superadmin' && $method === 'GET') {
        (new App\Controllers\AnalyticsController())->getSuperAdminDashboard();
    }
    if ($uri === '/api/analytics/teacher' && $method === 'GET') {
        (new App\Controllers\AnalyticsController())->getTeacherDashboard();
    }
    if ($uri === '/api/analytics/student' && $method === 'GET') {
        (new App\Controllers\AnalyticsController())->getStudentDashboard();
    }
    if ($uri === '/api/analytics/logs') {
        if ($method === 'GET') {
            (new App\Controllers\AnalyticsController())->getActivityLogs();
        } elseif ($method === 'DELETE') {
            (new App\Controllers\AnalyticsController())->clearActivityLogs();
        }
    }

    // 11. Study Packages & Student Purchases
    if ($uri === '/api/packages' && $method === 'GET') {
        (new App\Controllers\PackageController())->getPackages();
    }
    if ($uri === '/api/packages/create' && $method === 'POST') {
        (new App\Controllers\PackageController())->createPackage();
    }
    if (preg_match('#^/api/packages/(\d+)$#', $uri, $m)) {
        if ($method === 'PUT' || $method === 'POST') {
            (new App\Controllers\PackageController())->updatePackage((int)$m[1]);
        } elseif ($method === 'DELETE') {
            (new App\Controllers\PackageController())->deletePackage((int)$m[1]);
        }
    }
    if ($uri === '/api/packages/purchase' && $method === 'POST') {
        (new App\Controllers\PackageController())->purchasePackage();
    }
    if ($uri === '/api/packages/admin-orders' && $method === 'GET') {
        (new App\Controllers\PackageController())->getAdminPurchases();
    }
    if ($uri === '/api/packages/my-orders' && $method === 'GET') {
        (new App\Controllers\PackageController())->getMyPurchases();
    }

    // 11b. Online Classes Studio & Catalog API
    if ($uri === '/api/online-classes' && $method === 'GET') {
        (new App\Controllers\OnlineClassesController())->getOnlineClasses();
    }
    if ($uri === '/api/online-classes' && $method === 'POST') {
        (new App\Controllers\OnlineClassesController())->createPackage();
    }
    if ($uri === '/api/online-classes/hero' && $method === 'POST') {
        (new App\Controllers\OnlineClassesController())->saveHeroBanner();
    }
    if (preg_match('#^/api/online-classes/([^/]+)$#', $uri, $m)) {
        if ($method === 'PUT' || $method === 'POST') {
            (new App\Controllers\OnlineClassesController())->updatePackage($m[1]);
        } elseif ($method === 'DELETE') {
            (new App\Controllers\OnlineClassesController())->deletePackage($m[1]);
        }
    }
    if ($uri === '/api/online-classes/batches' && $method === 'POST') {
        (new App\Controllers\OnlineClassesController())->createBatch();
    }
    if (preg_match('#^/api/online-classes/batches/([^/]+)$#', $uri, $m) && $method === 'DELETE') {
        (new App\Controllers\OnlineClassesController())->deleteBatch($m[1]);
    }
    if ($uri === '/api/online-classes/lectures' && $method === 'POST') {
        (new App\Controllers\OnlineClassesController())->createLecture();
    }
    if (preg_match('#^/api/online-classes/lectures/([^/]+)$#', $uri, $m) && $method === 'DELETE') {
        (new App\Controllers\OnlineClassesController())->deleteLecture($m[1]);
    }

    // 11c. Payment & Bank Details & Checkout API
    if ($uri === '/api/payment/bank-settings') {
        if ($method === 'GET') {
            (new App\Controllers\PaymentController())->getBankSettings();
        } elseif ($method === 'POST' || $method === 'PUT') {
            (new App\Controllers\PaymentController())->saveBankSettings();
        }
    }
    if ($uri === '/api/payment/checkout' && $method === 'POST') {
        (new App\Controllers\PaymentController())->processCheckout();
    }
    if ($uri === '/api/payment/orders' && $method === 'GET') {
        (new App\Controllers\PaymentController())->getOrders();
    }
    if (preg_match('#^/api/payment/orders/(\d+)/status$#', $uri, $m) && ($method === 'PUT' || $method === 'POST')) {
        (new App\Controllers\PaymentController())->updateOrderStatus((int)$m[1]);
    }
    if (preg_match('#^/api/payment/orders/(\d+)$#', $uri, $m) && $method === 'DELETE') {
        (new App\Controllers\PaymentController())->deleteOrder((int)$m[1]);
    }

    // 12. System Settings
    if ($uri === '/api/settings') {
        if ($method === 'GET') {
            (new App\Controllers\SettingsController())->getSettings();
        } elseif ($method === 'POST' || $method === 'PUT') {
            (new App\Controllers\SettingsController())->updateSettings();
        }
    }

    // 13. Revision Vault & Bookmarked Questions API
    if ($uri === '/api/revision-vault' && $method === 'GET') {
        (new App\Controllers\RevisionVaultController())->getRevisionItems();
    }
    if ($uri === '/api/revision-vault' && $method === 'POST') {
        (new App\Controllers\RevisionVaultController())->createRevisionItem();
    }
    if (preg_match('#^/api/revision-vault/(\d+)$#', $uri, $m)) {
        if ($method === 'PUT' || $method === 'POST') {
            (new App\Controllers\RevisionVaultController())->updateRevisionItem((int)$m[1]);
        } elseif ($method === 'DELETE') {
            (new App\Controllers\RevisionVaultController())->deleteRevisionItem((int)$m[1]);
        }
    }
    if ($uri === '/api/revision-vault/seed' && $method === 'POST') {
        (new App\Controllers\RevisionVaultController())->resetSeedItems();
    }

    // 14. FREE Quizzes & Fun-Zone API
    if ($uri === '/api/free-quizzes' && $method === 'GET') {
        (new App\Controllers\FreeQuizController())->getQuizzes();
    }
    if ($uri === '/api/free-quizzes' && $method === 'POST') {
        (new App\Controllers\FreeQuizController())->createQuiz();
    }
    if (preg_match('#^/api/free-quizzes/(\d+)$#', $uri, $m)) {
        if ($method === 'PUT' || $method === 'POST') {
            (new App\Controllers\FreeQuizController())->updateQuiz((int)$m[1]);
        } elseif ($method === 'DELETE') {
            (new App\Controllers\FreeQuizController())->deleteQuiz((int)$m[1]);
        }
    }
    if ($uri === '/api/free-quizzes/seed' && $method === 'POST') {
        (new App\Controllers\FreeQuizController())->resetSeedQuizzes();
    }

    Response::notFound("Endpoint not found: $method $uri");
} catch (\Throwable $e) {
    Response::error('Server error: ' . $e->getMessage(), 500, [
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ]);
}
