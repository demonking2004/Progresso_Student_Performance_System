<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("db.php");

$sql = "SELECT * FROM teacher_notes ORDER BY id DESC";

$result = $conn->query($sql);

$notes = [];

while ($row = $result->fetch_assoc()) {
    $notes[] = $row;
}

echo json_encode($notes);

?>