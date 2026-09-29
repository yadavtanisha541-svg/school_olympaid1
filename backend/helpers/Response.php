<?php
namespace App\Helpers;

class Response {
    public static function json($data, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success($data = null, string $message = 'Success', int $statusCode = 200, array $extra = []): void {
        $payload = array_merge([
            'success' => true,
            'message' => $message,
            'data'    => $data
        ], $extra);
        self::json($payload, $statusCode);
    }

    public static function error(string $message = 'An error occurred', int $statusCode = 400, $errors = null): void {
        $payload = [
            'success' => false,
            'message' => $message
        ];
        if ($errors !== null) {
            $payload['errors'] = $errors;
        }
        self::json($payload, $statusCode);
    }

    public static function unauthorized(string $message = 'Unauthorized access'): void {
        self::error($message, 401);
    }

    public static function forbidden(string $message = 'Access forbidden'): void {
        self::error($message, 403);
    }

    public static function notFound(string $message = 'Resource not found'): void {
        self::error($message, 404);
    }
}
