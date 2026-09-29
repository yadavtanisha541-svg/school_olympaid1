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

    // 2. User Routes
    if ($uri === '/api/users/teachers' && $method === 'GET') {
        (new App\Controllers\UserController())->getTeachers();
    }
    if ($uri === '/api/users/students' && $method === 'GET') {
        (new App\Controllers\UserController())->getStudents();
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

    // 3. Academic Structure Routes
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
    if ($uri === '/api/exams') {
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

    // 7. Results & Solutions
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
    if ($uri === '/api/certificates' && $method === 'GET') {
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
    if ($uri === '/api/analytics/logs' && $method === 'GET') {
        (new App\Controllers\AnalyticsController())->getActivityLogs();
    }

    // 11. System Settings
    if ($uri === '/api/settings') {
        if ($method === 'GET') {
            (new App\Controllers\SettingsController())->getSettings();
        } elseif ($method === 'POST' || $method === 'PUT') {
            (new App\Controllers\SettingsController())->updateSettings();
        }
    }

    Response::notFound("Endpoint not found: $method $uri");
} catch (\Throwable $e) {
    Response::error('Server error: ' . $e->getMessage(), 500, [
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ]);
}
