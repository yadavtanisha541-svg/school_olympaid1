<?php
namespace App\Helpers;

class Validator {
    public static function getJsonInput(): array {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    public static function sanitize(string $data): string {
        return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
    }

    public static function validateRequired(array $data, array $fields): array {
        $missing = [];
        foreach ($fields as $field) {
            if (!isset($data[$field]) || trim((string)$data[$field]) === '') {
                $missing[] = $field;
            }
        }
        return $missing;
    }
}
