<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

$conn = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Handle submission creation
    $data = getJsonInput();

    $assignment_id = (int)($data['assignment_id'] ?? 0);
    $student_name = trim($data['student_name'] ?? '');
    $assignment_title = trim($data['assignment_title'] ?? '');
    $file_name = trim($data['file_name'] ?? '');
    $notes = trim($data['notes'] ?? '');

    // Validation
    if ($assignment_id === 0 || empty($student_name) || empty($assignment_title)) {
        sendJson(400, [
            'success' => false,
            'message' => 'Assignment ID, student name, and assignment title are required.'
        ]);
    }

    // Set default file_name if not provided
    if (empty($file_name)) {
        $file_name = 'No file uploaded';
    }

    // Verify assignment exists
    $checkStmt = $conn->prepare("SELECT id FROM assignments WHERE id = ?");
    $checkStmt->bind_param("i", $assignment_id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows === 0) {
        sendJson(404, [
            'success' => false,
            'message' => 'Assignment not found.'
        ]);
    }

    $checkStmt->close();

    // Get current date
    $submitted_at = date('Y-m-d');

    // Prepare and execute insert query
    $stmt = $conn->prepare("INSERT INTO submissions (assignment_id, student_name, assignment_title, file_name, notes, submitted_at) 
                            VALUES (?, ?, ?, ?, ?, ?)");

    if (!$stmt) {
        sendJson(500, [
            'success' => false,
            'message' => 'Database error: ' . $conn->error
        ]);
    }

    $stmt->bind_param("isssss", $assignment_id, $student_name, $assignment_title, $file_name, $notes, $submitted_at);

    if ($stmt->execute()) {
        sendJson(200, [
            'success' => true,
            'message' => 'Assignment submitted successfully!',
            'submission_id' => $conn->insert_id
        ]);
    } else {
        sendJson(500, [
            'success' => false,
            'message' => 'Error submitting assignment: ' . $stmt->error
        ]);
    }

    $stmt->close();
} elseif ($method === 'GET') {
    // Handle fetching submissions
    $assignmentId = (int)($_GET['assignment_id'] ?? 0);

    if ($assignmentId > 0) {
        // Fetch submissions for a specific assignment
        $stmt = $conn->prepare("SELECT * FROM submissions WHERE assignment_id = ? ORDER BY submitted_at DESC");
        $stmt->bind_param("i", $assignmentId);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        // Fetch all submissions
        $result = $conn->query("SELECT * FROM submissions ORDER BY submitted_at DESC");
    }

    if (!$result) {
        sendJson(500, [
            'success' => false,
            'message' => 'Error fetching submissions: ' . $conn->error
        ]);
    }

    $submissions = [];
    while ($row = $result->fetch_assoc()) {
        $submissions[] = $row;
    }

    sendJson(200, [
        'success' => true,
        'submissions' => $submissions
    ]);
} else {
    sendJson(405, [
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}

$conn->close();
?>
