<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

include("db.php");

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Notice ID is required"
    ]);
    exit;
}

$id = $_GET['id'];

$stmt = $conn->prepare("SELECT * FROM teacher_notices WHERE id=?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    $notice = $result->fetch_assoc();

    if ($notice['attachment_name']) {
        $uploadDir = __DIR__ . "/uploads/";
        $filePath = $uploadDir . $notice['attachment_name'];

        if (file_exists($filePath)) {

            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . $notice['original_name'] . '"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($filePath));

            readfile($filePath);
            exit;
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "File not found on server"
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "No attachment found for this notice"
        ]);
    }
} else {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Notice not found"
    ]);
}

$stmt->close();

?>
