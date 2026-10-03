<?php
$db = new PDO('mysql:host=127.0.0.1;dbname=olympiadhub;charset=utf8mb4', 'root', '');
$cols = $db->query('DESCRIBE exam_attempts')->fetchAll(PDO::FETCH_ASSOC);
foreach ($cols as $col) {
    echo $col['Field'] . " (" . $col['Type'] . ")\n";
}
