<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include("db.php");

$title = $_POST['title'] ?? '';
$audience = $_POST['audience'] ?? '';
$content = $_POST['content'] ?? '';
$priority = $_POST['priority'] ?? '';

$attachmentName = "";
$originalName = "";
$fileType = "";

if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK && $_FILES['attachment']['name'] != "") {

    $file = $_FILES['attachment'];

    $originalName = $file['name'];
    $tmpName = $file['tmp_name'];

    $ext = pathinfo($originalName, PATHINFO_EXTENSION);

    $attachmentName = time() . "_" . rand(1000, 9999) . "." . $ext;

    $uploadDir = __DIR__ . "/uploads/";
    
    // Create uploads directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $uploadPath = $uploadDir . $attachmentName;

    if (!move_uploaded_file($tmpName, $uploadPath)) {
        echo json_encode([
            "success" => false,
            "message" => "File upload failed"
        ]);
        exit;
    }

    $fileType = $file['type'];
}

$stmt = $conn->prepare("INSERT INTO teacher_notices
(title, audience, content, priority, attachment_name, original_name, file_type)
VALUES (?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param(
    "sssssss",
    $title,
    $audience,
    $content,
    $priority,
    $attachmentName,
    $originalName,
    $fileType
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Notice posted successfully",
        "id" => $stmt->insert_id
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $stmt->error
    ]);
}

$stmt->close();

?>
