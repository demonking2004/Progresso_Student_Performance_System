<?php

$conn = new mysqli("localhost", "root", "", "student_admin");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"));

$roll = $data->roll_number;
$name = $data->student_name;

$sql = "INSERT INTO students (roll_number, student_name)
        VALUES (?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $roll, $name);

if ($stmt->execute()) {
    echo json_encode([
        "message" => "Student added successfully"
    ]);
} else {
    echo json_encode([
        "message" => "Error: Roll number may already exist"
    ]);
}

$stmt->close();
$conn->close();

?>