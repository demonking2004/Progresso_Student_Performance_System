<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Content-Type: application/json");

include("db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];

$stmt = $conn->prepare("SELECT file_name FROM teacher_notes WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    $fileData = $result->fetch_assoc();

    $filePath = "uploads/" . $fileData['file_name'];

    if (file_exists($filePath)) {
        unlink($filePath);
    }

    $deleteStmt = $conn->prepare("DELETE FROM teacher_notes WHERE id=?");
    $deleteStmt->bind_param("i", $id);

    if ($deleteStmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Note deleted successfully"
        ]);
    }
}

?>