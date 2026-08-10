<?php
require_once 'db.php';
require_once 'helpers.php';

$conn = getDbConnection();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$teacher_id = $_GET['teacher_id'] ?? '';

if (!$teacher_id) {
    sendJson(400, ['success' => false, 'message' => 'Teacher ID is required']);
}

switch ($method) {
    case 'GET':
        handleGetMentees($conn, $teacher_id, $action);
        break;
    case 'POST':
        handleAssignMentee($conn, $teacher_id);
        break;
    case 'DELETE':
        handleRemoveMentee($conn, $teacher_id);
        break;
    default:
        sendJson(405, ['success' => false, 'message' => 'Method not allowed']);
}

function handleGetMentees($conn, $teacher_id, $action) {
    if ($action === 'all') {
        // Get all mentees assigned to this teacher
        $query = "SELECT u.id, u.name, sp.student_id, sp.department, sp.semester, sp.section_name, 
                         sp.phone, sp.education_level,
                         (SELECT AVG(percentage) FROM marks WHERE student_id = u.id AND teacher_id = ?) as avg_marks
                  FROM mentee_assignments ma
                  INNER JOIN users u ON ma.student_id = u.id
                  LEFT JOIN student_profiles sp ON u.id = sp.user_id
                  WHERE ma.teacher_id = ?
                  ORDER BY u.name ASC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ii', $teacher_id, $teacher_id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $mentees = [];
        
        while ($row = $result->fetch_assoc()) {
            $mentees[] = [
                'userId' => intval($row['id']),
                'name' => $row['name'],
                'studentId' => $row['student_id'],
                'department' => $row['department'],
                'semester' => $row['semester'],
                'sectionName' => $row['section_name'],
                'phone' => $row['phone'],
                'educationLevel' => $row['education_level'],
                'averageMarks' => $row['avg_marks'] ? floatval($row['avg_marks']) : 0
            ];
        }
        
        sendJson(200, ['success' => true, 'data' => $mentees]);
        
    } else if ($action === 'profile') {
        // Get detailed profile for a specific mentee
        $student_id = $_GET['student_id'] ?? '';
        
        if (!$student_id) {
            sendJson(400, ['success' => false, 'message' => 'Student ID is required']);
        }
        
        $student_id = intval($student_id);
        
        // Verify that this is a mentee of the teacher
        $verify_query = "SELECT 1 FROM mentee_assignments WHERE teacher_id = ? AND student_id = ?";
        $verify_stmt = $conn->prepare($verify_query);
        $verify_stmt->bind_param('ii', $teacher_id, $student_id);
        $verify_stmt->execute();
        
        if ($verify_stmt->get_result()->num_rows === 0) {
            sendJson(403, ['success' => false, 'message' => 'Not authorized to view this mentee']);
        }
        
        $query = "SELECT u.id, u.name, u.email, sp.student_id, sp.department, sp.semester, 
                         sp.section_name, sp.phone, sp.guardian_name, sp.guardian_phone, 
                         sp.education_level, sp.bio
                  FROM users u
                  LEFT JOIN student_profiles sp ON u.id = sp.user_id
                  WHERE u.id = ?";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $student_id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            $mentee = [
                'userId' => intval($row['id']),
                'name' => $row['name'],
                'email' => $row['email'],
                'studentId' => $row['student_id'],
                'department' => $row['department'],
                'semester' => $row['semester'],
                'sectionName' => $row['section_name'],
                'phone' => $row['phone'],
                'guardianName' => $row['guardian_name'],
                'guardianPhone' => $row['guardian_phone'],
                'educationLevel' => $row['education_level'],
                'bio' => $row['bio']
            ];
            
            sendJson(200, ['success' => true, 'data' => $mentee]);
        } else {
            sendJson(404, ['success' => false, 'message' => 'Mentee not found']);
        }
    } else {
        sendJson(400, ['success' => false, 'message' => 'Invalid action']);
    }
}

function handleAssignMentee($conn, $teacher_id) {
    $data = getJsonInput();
    
    if (empty($data['studentId'])) {
        sendJson(400, ['success' => false, 'message' => 'Student ID is required']);
    }
    
    $student_id = intval($data['studentId']);
    
    // Check if student exists
    $check_query = "SELECT id FROM users WHERE id = ? AND role = 'student'";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param('i', $student_id);
    $check_stmt->execute();
    
    if ($check_stmt->get_result()->num_rows === 0) {
        sendJson(404, ['success' => false, 'message' => 'Student not found']);
    }
    
    // Check if already assigned
    $existing_query = "SELECT id FROM mentee_assignments WHERE teacher_id = ? AND student_id = ?";
    $existing_stmt = $conn->prepare($existing_query);
    $existing_stmt->bind_param('ii', $teacher_id, $student_id);
    $existing_stmt->execute();
    
    if ($existing_stmt->get_result()->num_rows > 0) {
        sendJson(409, ['success' => false, 'message' => 'This student is already assigned as a mentee']);
    }
    
    // Assign mentee
    $insert_query = "INSERT INTO mentee_assignments (teacher_id, student_id) VALUES (?, ?)";
    $insert_stmt = $conn->prepare($insert_query);
    $insert_stmt->bind_param('ii', $teacher_id, $student_id);
    
    if ($insert_stmt->execute()) {
        sendJson(201, ['success' => true, 'message' => 'Mentee assigned successfully']);
    } else {
        sendJson(500, ['success' => false, 'message' => 'Error assigning mentee: ' . $insert_stmt->error]);
    }
}

function handleRemoveMentee($conn, $teacher_id) {
    $data = getJsonInput();
    
    if (empty($data['studentId'])) {
        sendJson(400, ['success' => false, 'message' => 'Student ID is required']);
    }
    
    $student_id = intval($data['studentId']);
    
    $query = "DELETE FROM mentee_assignments WHERE teacher_id = ? AND student_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $teacher_id, $student_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            sendJson(200, ['success' => true, 'message' => 'Mentee removed successfully']);
        } else {
            sendJson(404, ['success' => false, 'message' => 'Mentee assignment not found']);
        }
    } else {
        sendJson(500, ['success' => false, 'message' => 'Error removing mentee: ' . $stmt->error]);
    }
}

$conn->close();
?>
