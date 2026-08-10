<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

$conn = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Handle assignment creation
    $data = getJsonInput();

    $title = trim($data['title'] ?? '');
    $subject = trim($data['subject'] ?? '');
    $description = trim($data['description'] ?? '');
    $dueDate = trim($data['dueDate'] ?? '');

    // Validation
    if (empty($title) || empty($subject) || empty($dueDate)) {
        sendJson(400, [
            'success' => false,
            'message' => 'Title, subject, and due date are required.'
        ]);
    }

    // Determine status based on due date
    $status = (strtotime($dueDate) < time()) ? "due" : "assigned";

    // Prepare and execute query
    $stmt = $conn->prepare("INSERT INTO assignments (title, subject, description, due_date, status, marks, feedback) 
                            VALUES (?, ?, ?, ?, ?, '-', '-')");

    if (!$stmt) {
        sendJson(500, [
            'success' => false,
            'message' => 'Database error: ' . $conn->error
        ]);
    }

    $stmt->bind_param("sssss", $title, $subject, $description, $dueDate, $status);

    if ($stmt->execute()) {
        sendJson(200, [
            'success' => true,
            'message' => 'Assignment created successfully!',
            'assignment_id' => $conn->insert_id
        ]);
    } else {
        sendJson(500, [
            'success' => false,
            'message' => 'Error creating assignment: ' . $stmt->error
        ]);
    }

    $stmt->close();
} elseif ($method === 'GET') {
    // Handle fetching all assignments
    $result = $conn->query("SELECT * FROM assignments ORDER BY due_date DESC");

    if (!$result) {
        sendJson(500, [
            'success' => false,
            'message' => 'Error fetching assignments: ' . $conn->error
        ]);
    }

    $assignments = [];
    while ($row = $result->fetch_assoc()) {
        $assignments[] = $row;
    }

    sendJson(200, [
        'success' => true,
        'assignments' => $assignments
    ]);
} else {
    sendJson(405, [
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}

$conn->close();
?>
