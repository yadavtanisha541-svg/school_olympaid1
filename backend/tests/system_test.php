<?php
// OlympiadHub Deep Automated System Test Suite
declare(strict_types=1);

$baseUrl = 'http://127.0.0.1:8000/api';

function testRequest(string $method, string $endpoint, $data = null, ?string $token = null) {
    global $baseUrl;
    $url = $baseUrl . $endpoint;
    $ch = curl_init($url);
    
    $headers = ['Accept: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    
    if ($data !== null) {
        $headers[] = 'Content-Type: application/json';
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return ['success' => false, 'error' => $error, 'http_code' => $httpCode];
    }
    
    $json = json_decode($response, true);
    return [
        'http_code' => $httpCode,
        'json' => $json,
        'raw' => $response
    ];
}

$testsPassed = 0;
$testsFailed = 0;

function assertTest(string $name, bool $condition, string $detail = '') {
    global $testsPassed, $testsFailed;
    if ($condition) {
        echo "[PASS] $name\n";
        $testsPassed++;
    } else {
        echo "[FAIL] $name: $detail\n";
        $testsFailed++;
    }
}

echo "========================================================\n";
echo "OLYMPIADHUB DEEP SYSTEM & API TEST SUITE\n";
echo "========================================================\n\n";

// 1. Health check
$health = testRequest('GET', '/health');
assertTest('API Health Check', $health['http_code'] === 200 && ($health['json']['success'] ?? false) === true);

// 2. Authentication: Super Admin
$adminLogin = testRequest('POST', '/auth/login', ['login_id' => 'ADMIN001', 'password' => 'Admin@123']);
assertTest('Super Admin Login', $adminLogin['http_code'] === 200 && !empty($adminLogin['json']['data']['token']));
$adminToken = $adminLogin['json']['data']['token'] ?? null;

// 3. Authentication: Teacher
$tchLogin = testRequest('POST', '/auth/login', ['login_id' => 'TCH101', 'password' => 'Teacher@123']);
assertTest('Teacher Login', $tchLogin['http_code'] === 200 && $tchLogin['json']['data']['user']['role'] === 'teacher');
$tchToken = $tchLogin['json']['data']['token'] ?? null;

// 4. Authentication: Student
$stuLogin = testRequest('POST', '/auth/login', ['login_id' => 'STU1001', 'password' => 'Student@123']);
assertTest('Student Login', $stuLogin['http_code'] === 200 && $stuLogin['json']['data']['user']['role'] === 'student');
$stuToken = $stuLogin['json']['data']['token'] ?? null;

// 5. Academic API: Get Classes
$classesRes = testRequest('GET', '/academic/classes', null, $adminToken);
assertTest('Get Academic Classes 1-12', $classesRes['http_code'] === 200 && count($classesRes['json']['data']) >= 12);

// 6. Academic API: Get Subjects
$subjRes = testRequest('GET', '/academic/subjects', null, $adminToken);
assertTest('Get Academic Subjects', $subjRes['http_code'] === 200 && count($subjRes['json']['data']) >= 5);

// 7. Academic API: Get Chapters
$chapRes = testRequest('GET', '/academic/chapters', null, $adminToken);
assertTest('Get Chapters', $chapRes['http_code'] === 200 && count($chapRes['json']['data']) >= 10);

// 8. Question Bank: List & Filters
$qRes = testRequest('GET', '/questions?class_id=10&subject_id=1', null, $adminToken);
assertTest('Filter Questions by Class & Subject', $qRes['http_code'] === 200 && isset($qRes['json']['data']['questions']));

// 9. Question Bank: Create MCQ
$newQData = [
    'class_id' => 10,
    'subject_id' => 1,
    'question_text' => 'System Test: What is the derivative of x^2 + 5x with respect to x?',
    'option_a' => '2x + 5',
    'option_b' => 'x + 5',
    'option_c' => '2x',
    'option_d' => 'x^2',
    'correct_option' => 'A',
    'difficulty' => 'easy',
    'marks' => 2.00,
    'negative_marks' => 0.50,
    'explanation' => 'd/dx(x^2 + 5x) = 2x + 5.'
];
$createQ = testRequest('POST', '/questions', $newQData, $adminToken);
assertTest('Create MCQ Question with 4 Options', $createQ['http_code'] === 201 && !empty($createQ['json']['data']['id']));
$createdQId = $createQ['json']['data']['id'] ?? null;

// 10. Question Bank: CSV Import Validation Test
$csvData = [
    'csv_content' => "class_id,subject_id,question_text,option_a,option_b,option_c,option_d,correct_option,difficulty,marks,negative_marks,explanation\n10,1,\"What is value of pi to 2 decimals?\",3.14,3.12,3.16,3.18,A,easy,1.00,0.00,\"Pi is approx 3.14\""
];
$importRes = testRequest('POST', '/questions-import', $csvData, $adminToken);
assertTest('Bulk CSV Question Import Engine', $importRes['http_code'] === 200 && ($importRes['json']['data']['imported_questions'] ?? 0) >= 1);

// 11. Exam Builder: Create & Publish Exam
$newExamData = [
    'title' => 'Automated Live Test Olympiad',
    'exam_code' => 'AUTO-' . rand(1000, 9999),
    'exam_type' => 'practice',
    'description' => 'End-to-end automated test exam verification.',
    'instructions' => 'Follow standard examination instructions.',
    'class_id' => 10,
    'subject_id' => 1,
    'duration_minutes' => 30,
    'passing_percentage' => 50.00,
    'negative_marking' => 1,
    'default_negative_marks' => 0.50,
    'attempt_limit' => 5,
    'result_visibility' => 'immediate',
    'solution_visibility' => 'after_result',
    'certificate_eligibility' => 1,
    'min_certificate_percentage' => 50.00,
    'randomize_questions' => 1,
    'shuffle_options' => 1,
    'tab_switch_limit' => 3,
    'status' => 'published',
    'question_ids' => [$createdQId]
];
$examCreateRes = testRequest('POST', '/exams', $newExamData, $adminToken);
assertTest('Create & Publish Exam', $examCreateRes['http_code'] === 201 && !empty($examCreateRes['json']['data']['id']));
$testExamId = $examCreateRes['json']['data']['id'] ?? null;

// 12. Student Flow: Start Live Exam Session
$startExamRes = testRequest('POST', "/exam-engine/$testExamId/start", null, $stuToken);
assertTest('Student Start Exam Engine Session', $startExamRes['http_code'] === 200 && !empty($startExamRes['json']['data']['attempt_id']));
$attemptId = $startExamRes['json']['data']['attempt_id'] ?? null;

// 13. Student Flow: Auto-Save Answer
$saveAnsRes = testRequest('POST', '/exam-engine/save-answer', [
    'attempt_id' => $attemptId,
    'question_id' => $createdQId,
    'selected_option' => 'A',
    'is_marked_for_review' => 0,
    'is_visited' => 1
], $stuToken);
assertTest('Live Auto-Save Student Response', $saveAnsRes['http_code'] === 200 && ($saveAnsRes['json']['data']['saved'] ?? false) === true);

// 14. Student Flow: Security Event (Tab Switch)
$secRes = testRequest('POST', '/exam-engine/security-event', [
    'attempt_id' => $attemptId,
    'event_type' => 'tab_switch',
    'event_data' => 'Tab switch simulated in system test'
], $stuToken);
assertTest('Security Proctoring Warning Counter', $secRes['http_code'] === 200 && ($secRes['json']['data']['tab_switch_count'] ?? 0) >= 1);

// 15. Student Flow: Submit Exam & Automated Lock
$submitRes = testRequest('POST', '/exam-engine/submit', ['attempt_id' => $attemptId], $stuToken);
assertTest('Submit Exam & Automated Evaluation', $submitRes['http_code'] === 200 && ($submitRes['json']['data']['passed'] ?? false) === true);

// 16. Results & Detailed Solutions
$resView = testRequest('GET', "/results/$attemptId", null, $stuToken);
assertTest('Result Scorecard & Accuracy Analytics', $resView['http_code'] === 200 && isset($resView['json']['data']['score']));

$solView = testRequest('GET', "/results/$attemptId/solutions", null, $stuToken);
assertTest('Step-by-Step Detailed Solutions', $solView['http_code'] === 200 && count($solView['json']['data']) >= 1);

// 17. Leaderboard & Deterministic Tie-Breaking
$leadRes = testRequest('GET', "/leaderboard?exam_id=$testExamId", null, $stuToken);
assertTest('Leaderboard & Rankings Computation', $leadRes['http_code'] === 200 && count($leadRes['json']['data']) >= 1);

// 18. Certificate Generation & Public Verification
$certRes = testRequest('GET', '/certificates', null, $stuToken);
assertTest('Certificate Issued for Qualifying Score', $certRes['http_code'] === 200 && count($certRes['json']['data']) >= 1);
$issuedCert = $certRes['json']['data'][0] ?? null;
if ($issuedCert) {
    $verifyRes = testRequest('GET', '/certificates-verify?code=' . urlencode($issuedCert['certificate_number']));
    assertTest('Public Certificate Cryptographic Verification', $verifyRes['http_code'] === 200 && ($verifyRes['json']['data']['is_valid'] ?? false) === true);
}

// 19. Super Admin Analytics & Dashboard
$analyticsRes = testRequest('GET', '/analytics/superadmin', null, $adminToken);
assertTest('Superadmin Platform Analytics Calculation', $analyticsRes['http_code'] === 200 && isset($analyticsRes['json']['data']['metrics']));

// 20. Audit Trail Logs
$logsRes = testRequest('GET', '/analytics/logs', null, $adminToken);
assertTest('Audit & Security Activity Trail', $logsRes['http_code'] === 200 && count($logsRes['json']['data']['logs']) >= 1);

echo "\n========================================================\n";
echo "SUMMARY: $testsPassed PASSED, $testsFailed FAILED\n";
echo "========================================================\n";
