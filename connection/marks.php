<?php
require_once 'db.php';
require_once 'helpers.php';

$conn = getDbConnection();

// Get the request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Get teacher ID from auth (assuming teacher_id is passed in request or session)
$teacher_id = $_GET['teacher_id'] ?? '';

if (!$teacher_id) {
    sendJson(400, ['success' => false, 'message' => 'Teacher ID is required']);
}

switch ($method) {
    case 'GET':
        handleGetMarks($conn, $teacher_id, $action);
        break;
    case 'POST':
        handlePostMarks($conn, $teacher_id);
        break;
    case 'PUT':
        handleUpdateMarks($conn, $teacher_id);
        break;
    case 'DELETE':
        handleDeleteMarks($conn);
        break;
    default:
        sendJson(405, ['success' => false, 'message' => 'Method not allowed']);
}

function handleGetMarks($conn, $teacher_id, $action) {
    if ($action === 'all') {
        // Get all marks entered by this teacher
        $query = "SELECT m.*, u.name as student_name 
                  FROM marks m
                  INNER JOIN users u ON m.student_id = u.id
                  WHERE m.teacher_id = ?
                  ORDER BY m.created_at DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $teacher_id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $marks = [];
        
        while ($row = $result->fetch_assoc()) {
            $marks[] = [
                'id' => $row['id'],
                'studentId' => $row['student_id'],
                'studentName' => $row['student_name'],
                'subject' => $row['subject'],
                'examType' => $row['exam_type'],
                'marksObtained' => floatval($row['marks_obtained']),
                'totalMarks' => floatval($row['total_marks']),
                'percentage' => floatval($row['percentage']),
                'grade' => $row['grade'],
                'createdAt' => $row['created_at']
            ];
        }
        
        sendJson(200, ['success' => true, 'data' => $marks]);
        
    } else if ($action === 'student') {
        // Get marks for a specific student
        $student_id = $_GET['student_id'] ?? '';
        
        if (!$student_id) {
            sendJson(400, ['success' => false, 'message' => 'Student ID is required']);
        }
        
        $query = "SELECT m.*, u.name as student_name 
                  FROM marks m
                  INNER JOIN users u ON m.student_id = u.id
                  WHERE m.teacher_id = ? AND m.student_id = ?
                  ORDER BY m.created_at DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ii', $teacher_id, $student_id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $marks = [];
        
        while ($row = $result->fetch_assoc()) {
            $marks[] = [
                'id' => $row['id'],
                'studentId' => $row['student_id'],
                'studentName' => $row['student_name'],
                'subject' => $row['subject'],
                'examType' => $row['exam_type'],
                'marksObtained' => floatval($row['marks_obtained']),
                'totalMarks' => floatval($row['total_marks']),
                'percentage' => floatval($row['percentage']),
                'grade' => $row['grade'],
                'createdAt' => $row['created_at']
            ];
        }
        
        sendJson(200, ['success' => true, 'data' => $marks]);
    } else {
        sendJson(400, ['success' => false, 'message' => 'Invalid action']);
    }
}

function handlePostMarks($conn, $teacher_id) {
    $data = getJsonInput();
    
    // Validate required fields
    if (empty($data['studentId']) || empty($data['subject']) || 
        !isset($data['examType']) || !isset($data['marksObtained'])) {
        sendJson(400, ['success' => false, 'message' => 'Missing required fields']);
    }
    
    $student_id = intval($data['studentId']);
    $subject = $conn->real_escape_string($data['subject']);
    $exam_type = $conn->real_escape_string($data['examType']);
    $marks_obtained = floatval($data['marksObtained']);
    $total_marks = floatval($data['totalMarks'] ?? 100);
    
    // Calculate percentage and grade
    $percentage = ($marks_obtained / $total_marks) * 100;
    $grade = calculateGrade($percentage);
    
    // Insert marks
    $query = "INSERT INTO marks (student_id, teacher_id, subject, exam_type, marks_obtained, total_marks, percentage, grade)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        sendJson(500, ['success' => false, 'message' => 'Database error: ' . $conn->error]);
    }
    
    $stmt->bind_param('iissdds', 
        $student_id, 
        $teacher_id, 
        $subject, 
        $exam_type, 
        $marks_obtained, 
        $total_marks, 
        $percentage, 
        $grade
    );
    
    if ($stmt->execute()) {
        sendJson(201, [
            'success' => true,
            'message' => 'Marks added successfully',
            'id' => $stmt->insert_id,
            'data' => [
                'percentage' => round($percentage, 2),
                'grade' => $grade
            ]
        ]);
    } else {
        sendJson(500, ['success' => false, 'message' => 'Error adding marks: ' . $stmt->error]);
    }
}

function handleUpdateMarks($conn, $teacher_id) {
    $data = getJsonInput();
    
    if (empty($data['id'])) {
        sendJson(400, ['success' => false, 'message' => 'Mark ID is required']);
    }
    
    $id = intval($data['id']);
    $marks_obtained = floatval($data['marksObtained']);
    $total_marks = floatval($data['totalMarks'] ?? 100);
    
    // Calculate percentage and grade
    $percentage = ($marks_obtained / $total_marks) * 100;
    $grade = calculateGrade($percentage);
    
    $query = "UPDATE marks 
              SET marks_obtained = ?, total_marks = ?, percentage = ?, grade = ?
              WHERE id = ? AND teacher_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('dddiii', $marks_obtained, $total_marks, $percentage, $grade, $id, $teacher_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            sendJson(200, [
                'success' => true,
                'message' => 'Marks updated successfully',
                'data' => [
                    'percentage' => round($percentage, 2),
                    'grade' => $grade
                ]
            ]);
        } else {
            sendJson(404, ['success' => false, 'message' => 'Mark not found or not authorized']);
        }
    } else {
        sendJson(500, ['success' => false, 'message' => 'Error updating marks: ' . $stmt->error]);
    }
}

function handleDeleteMarks($conn) {
    $data = getJsonInput();
    
    if (empty($data['id'])) {
        sendJson(400, ['success' => false, 'message' => 'Mark ID is required']);
    }
    
    $id = intval($data['id']);
    
    $query = "DELETE FROM marks WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            sendJson(200, ['success' => true, 'message' => 'Mark deleted successfully']);
        } else {
            sendJson(404, ['success' => false, 'message' => 'Mark not found']);
        }
    } else {
        sendJson(500, ['success' => false, 'message' => 'Error deleting mark: ' . $stmt->error]);
    }
}

$conn->close();
?>
