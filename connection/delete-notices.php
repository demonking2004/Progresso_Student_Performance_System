<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Content-Type: application/json");

include("db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Notice ID is required"
    ]);
    exit;
}

$id = $data['id'];

$stmt = $conn->prepare("SELECT attachment_name FROM teacher_notices WHERE id=?");
if (!$stmt) {
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
            unlink($filePath);
        }
    }

    $deleteStmt = $conn->prepare("DELETE FROM teacher_notices WHERE id=?");
    if (!$deleteStmt) {
        echo json_encode([
            "success" => false,
            "message" => "Prepare failed: " . $conn->error
        ]);
        exit;
    }

    $deleteStmt->bind_param("i", $id);

    if ($deleteStmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Notice deleted successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Delete failed: " . $deleteStmt->error
        ]);
    }
    $deleteStmt->close();
} else {
    echo json_encode([
        "success" => false,
        "message" => "Notice not found"
    ]);
}

$stmt->close();

?>
