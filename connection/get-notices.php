<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include("db.php");

$sql = "SELECT * FROM teacher_notices ORDER BY notice_date DESC";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Query error: " . $conn->error
    ]);
    exit;
}

$notices = [];

while ($row = $result->fetch_assoc()) {

    if ($row['attachment_name']) {
        // Update to use appropriate path based on your server setup
        $row['file_url'] = "/uploads/" . $row['attachment_name'];
    } else {
        $row['file_url'] = "";
    }

    $notices[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $notices
]);

?>
