<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("db.php");

$sql = "SELECT * FROM teacher_notices ORDER BY id DESC";

$result = $conn->query($sql);

$notices = [];

while ($row = $result->fetch_assoc()) {

    if ($row['attachment_name']) {

        $row['file_url'] =
            "http://localhost/uploads/" . $row['attachment_name'];

    } else {

        $row['file_url'] = "";
    }

    $notices[] = $row;
}

echo json_encode($notices);

?>