<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

include("db.php");

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo "No ID provided";
    exit;
}

$stmt = $conn->prepare("SELECT * FROM teacher_notes WHERE id=?");

if (!$stmt) {
    http_response_code(500);
    echo "Database error: " . $conn->error;
    exit;
}

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    $note = $result->fetch_assoc();

    $filePath = __DIR__ . "/uploads/" . $note['file_name'];

    if (file_exists($filePath)) {

        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . $note['original_name'] . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filePath));

        readfile($filePath);
        exit;
    } else {
        http_response_code(404);
        echo "File not found";
    }
} else {
    http_response_code(404);
    echo "Note not found";
}

$stmt->close();

?>
