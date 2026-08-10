<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Content-Type: application/json");

include("db.php");

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];

$stmt = $conn->prepare("SELECT attachment_name FROM teacher_notices WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    $notice = $result->fetch_assoc();

    if ($notice['attachment_name']) {

        $filePath = "uploads/" . $notice['attachment_name'];

        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    $deleteStmt = $conn->prepare("DELETE FROM teacher_notices WHERE id=?");
    $deleteStmt->bind_param("i", $id);

    if ($deleteStmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Notice deleted successfully"
        ]);
    }
}

?>