<?php
// OlympiadHub - Database Connection Configuration
namespace App\Config;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    private static string $host = '';
    private static string $port = '3306';
    private static string $db   = '';
    private static string $user = '';
    private static string $pass = '';

    private static string $charset = 'utf8mb4';

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host    = getenv('DB_HOST')    ?: '127.0.0.1';
            $port    = getenv('DB_PORT')    ?: '3306';
            $db      = getenv('DB_NAME')    ?: 'olympiadhub';
            $user    = getenv('DB_USER')    ?: 'root';
            $pass    = getenv('DB_PASS')    ?: '';
            $charset = 'utf8mb4';
            $dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'Database connection error: ' . $e->getMessage()
                ]);
                exit;
            }
        }
        return self::$instance;
    }
}
