<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include("db.php");

$title = $_POST['title'];
$audience = $_POST['audience'];
$content = $_POST['content'];
$priority = $_POST['priority'];

$attachmentName = "";
$originalName = "";
$fileType = "";

if (isset($_FILES['attachment']) && $_FILES['attachment']['name'] != "") {

    $file = $_FILES['attachment'];

    $originalName = $file['name'];
    $tmpName = $file['tmp_name'];

    $ext = pathinfo($originalName, PATHINFO_EXTENSION);

    $attachmentName = time() . "_" . rand(1000,9999) . "." . $ext;

    $uploadPath = "uploads/" . $attachmentName;

    move_uploaded_file($tmpName, $uploadPath);

    $fileType = $file['type'];
}

$stmt = $conn->prepare("INSERT INTO teacher_notices
(title, audience, content, priority, attachment_name, original_name, file_type)
VALUES (?, ?, ?, ?, ?, ?, ?)");

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
        "message" => "Notice posted successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}

?>