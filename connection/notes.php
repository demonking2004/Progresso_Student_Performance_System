<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include("db.php");

$title = $_POST['title'] ?? '';
$subject = $_POST['subject'] ?? '';
$batch = $_POST['batch'] ?? '';
$description = $_POST['description'] ?? '';

if (isset($_FILES['file'])) {

    $file = $_FILES['file'];

    $originalName = $file['name'];
    $tmpName = $file['tmp_name'];

    $ext = pathinfo($originalName, PATHINFO_EXTENSION);

    $newFileName = time() . "_" . rand(1000, 9999) . "." . $ext;

    $uploadDir = __DIR__ . "/uploads/";
    
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $uploadPath = $uploadDir . $newFileName;

    if (move_uploaded_file($tmpName, $uploadPath)) {

        $documentType = strtoupper($ext);

        $stmt = $conn->prepare("INSERT INTO teacher_notes 
        (title, subject, batch_name, description, file_name, original_name, document_type) 
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
            $subject,
            $batch,
            $description,
            $newFileName,
            $originalName,
            $documentType
        );

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Note uploaded successfully",
                "id" => $conn->insert_id
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Database error: " . $stmt->error
            ]);
        }

        $stmt->close();

    } else {
        echo json_encode([
            "success" => false,
            "message" => "File upload failed"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "No file provided"
    ]);
}

?>
