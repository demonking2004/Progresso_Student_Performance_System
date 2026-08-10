<?php

include("db.php");

$id = $_GET['id'];

$stmt = $conn->prepare("SELECT * FROM teacher_notes WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    $note = $result->fetch_assoc();

    $filePath = "uploads/" . $note['file_name'];

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
    }
}

?>