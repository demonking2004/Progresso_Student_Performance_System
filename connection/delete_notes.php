<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Content-Type: application/json");

include("db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode([
        "success" => false,
        "message" => "No ID provided"
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT file_name FROM teacher_notes WHERE id=?");

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

    $fileData = $result->fetch_assoc();

    $filePath = __DIR__ . "/uploads/" . $fileData['file_name'];

    if (file_exists($filePath)) {
        unlink($filePath);
    }

    $deleteStmt = $conn->prepare("DELETE FROM teacher_notes WHERE id=?");

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
            "message" => "Note deleted successfully"
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
        "message" => "Note not found"
    ]);
}

$stmt->close();

?>
