<?php
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Auth;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Logger;
use PDO;

class SettingsController {
    public function getSettings(): void {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT setting_key, setting_value, setting_group, description FROM system_settings");
        $rows = $stmt->fetchAll();

        $settings = [];
        foreach ($rows as $r) {
            $settings[$r['setting_key']] = $r['setting_value'];
        }

        Response::success([
            'settings' => $settings,
            'raw' => $rows
        ], 'System settings retrieved.');
    }

    public function updateSettings(): void {
        $admin = Auth::requireRole(['superadmin']);
        $input = Validator::getJsonInput();

        $db = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO system_settings (setting_key, setting_value)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        ");

        foreach ($input as $key => $val) {
            if (is_scalar($val)) {
                $stmt->execute([$key, (string)$val]);
            }
        }

        Logger::log('Updated System Settings', 'Settings', $input, $admin['id'], 'superadmin');

        Response::success(null, 'Settings updated successfully.');
    }
}
