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
        handleGetAttendance($conn, $teacher_id, $action);
        break;
    case 'POST':
        handlePostAttendance($conn, $teacher_id);
        break;
    case 'PUT':
        handleUpdateAttendance($conn, $teacher_id);
        break;
    default:
        sendJson(405, ['success' => false, 'message' => 'Method not allowed']);
}

function handleGetAttendance($conn, $teacher_id, $action) {
    if ($action === 'all') {
        // Get all attendance records for this teacher
        $query = "SELECT a.*, u.name as student_name, sp.student_id
                  FROM attendance a
                  INNER JOIN users u ON a.student_id = u.id
                  LEFT JOIN student_profiles sp ON u.id = sp.user_id
                  WHERE a.teacher_id = ?
                  ORDER BY a.attendance_date DESC";
        
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            sendJson(500, ['success' => false, 'message' => 'Database error: ' . $conn->error]);
        }
        
        $stmt->bind_param('i', $teacher_id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $attendance = [];
        
        while ($row = $result->fetch_assoc()) {
            $attendance[] = [
                'id' => intval($row['id']),
                'studentId' => intval($row['student_id']),
                'studentName' => $row['student_name'],
                'studentNo' => $row['student_id'],
                'subject' => $row['subject'],
                'date' => $row['attendance_date'],
                'status' => $row['status'],
                'remarks' => $row['remarks'],
                'createdAt' => $row['created_at']
            ];
        }
        
        sendJson(200, ['success' => true, 'data' => $attendance]);
        
    } else if ($action === 'student') {
        // Get attendance for a specific student
        $student_id = $_GET['student_id'] ?? '';
        
        if (!$student_id) {
            sendJson(400, ['success' => false, 'message' => 'Student ID is required']);
        }
        
        $student_id = intval($student_id);
        
        $query = "SELECT a.*, u.name as student_name
                  FROM attendance a
                  INNER JOIN users u ON a.student_id = u.id
                  WHERE a.teacher_id = ? AND a.student_id = ?
                  ORDER BY a.attendance_date DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ii', $teacher_id, $student_id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $attendance = [];
        
        while ($row = $result->fetch_assoc()) {
            $attendance[] = [
                'id' => intval($row['id']),
                'studentId' => intval($row['student_id']),
                'studentName' => $row['student_name'],
                'subject' => $row['subject'],
                'date' => $row['attendance_date'],
                'status' => $row['status'],
                'remarks' => $row['remarks'],
                'createdAt' => $row['created_at']
            ];
        }
        
        sendJson(200, ['success' => true, 'data' => $attendance]);
        
    } else if ($action === 'date') {
        // Get attendance for a specific date
        $date = $_GET['date'] ?? '';
        
        if (!$date) {
            sendJson(400, ['success' => false, 'message' => 'Date is required']);
        }
        
        $query = "SELECT a.*, u.name as student_name, sp.student_id
                  FROM attendance a
                  INNER JOIN users u ON a.student_id = u.id
                  LEFT JOIN student_profiles sp ON u.id = sp.user_id
                  WHERE a.teacher_id = ? AND a.attendance_date = ?
                  ORDER BY u.name ASC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param('is', $teacher_id, $date);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $attendance = [];
        
        while ($row = $result->fetch_assoc()) {
            $attendance[] = [
                'id' => intval($row['id']),
                'studentId' => intval($row['student_id']),
                'studentName' => $row['student_name'],
                'studentNo' => $row['student_id'],
                'subject' => $row['subject'],
                'date' => $row['attendance_date'],
                'status' => $row['status'],
                'remarks' => $row['remarks']
            ];
        }
        
        sendJson(200, ['success' => true, 'data' => $attendance]);
        
    } else if ($action === 'summary') {
        // Get attendance summary for all mentees
        $query = "SELECT u.id, u.name, 
                         COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present,
                         COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent,
                         COUNT(CASE WHEN a.status = 'leave' THEN 1 END) as leave_count,
                         COUNT(*) as total_classes,
                         ROUND((COUNT(CASE WHEN a.status = 'present' THEN 1 END) / COUNT(*)) * 100, 2) as percentage
                  FROM mentee_assignments ma
                  INNER JOIN users u ON ma.student_id = u.id
                  LEFT JOIN attendance a ON u.id = a.student_id AND a.teacher_id = ?
                  WHERE ma.teacher_id = ?
                  GROUP BY u.id, u.name
                  ORDER BY u.name ASC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ii', $teacher_id, $teacher_id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $summary = [];
        
        while ($row = $result->fetch_assoc()) {
            $summary[] = [
                'studentId' => intval($row['id']),
                'name' => $row['name'],
                'totalClasses' => intval($row['total_classes']) ?: 0,
                'present' => intval($row['present']) ?: 0,
                'absent' => intval($row['absent']) ?: 0,
                'leave' => intval($row['leave_count']) ?: 0,
                'percentage' => floatval($row['percentage']) ?: 0
            ];
        }
        
        sendJson(200, ['success' => true, 'data' => $summary]);
    } else {
        sendJson(400, ['success' => false, 'message' => 'Invalid action']);
    }
}

function handlePostAttendance($conn, $teacher_id) {
    $data = getJsonInput();
    
    // Validate required fields
    if (empty($data['studentId']) || empty($data['date']) || empty($data['status'])) {
        sendJson(400, ['success' => false, 'message' => 'Missing required fields']);
    }
    
    $student_id = intval($data['studentId']);
    $date = $conn->real_escape_string($data['date']);
    $status = $conn->real_escape_string($data['status']);
    $subject = $conn->real_escape_string($data['subject'] ?? '');
    $remarks = $conn->real_escape_string($data['remarks'] ?? '');
    
    // Check if attendance record already exists
    $check_query = "SELECT id FROM attendance 
                    WHERE student_id = ? AND teacher_id = ? AND attendance_date = ?";
    
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param('iis', $student_id, $teacher_id, $date);
    $check_stmt->execute();
    
    if ($check_stmt->get_result()->num_rows > 0) {
        // Update existing record
        $update_query = "UPDATE attendance 
                        SET status = ?, subject = ?, remarks = ?
                        WHERE student_id = ? AND teacher_id = ? AND attendance_date = ?";
        
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->bind_param('ssssis', $status, $subject, $remarks, $student_id, $teacher_id, $date);
        
        if ($update_stmt->execute()) {
            sendJson(200, ['success' => true, 'message' => 'Attendance updated successfully']);
        } else {
            sendJson(500, ['success' => false, 'message' => 'Error updating attendance: ' . $update_stmt->error]);
        }
    } else {
        // Insert new record
        $insert_query = "INSERT INTO attendance (student_id, teacher_id, subject, attendance_date, status, remarks)
                        VALUES (?, ?, ?, ?, ?, ?)";
        
        $insert_stmt = $conn->prepare($insert_query);
        $insert_stmt->bind_param('iissss', $student_id, $teacher_id, $subject, $date, $status, $remarks);
        
        if ($insert_stmt->execute()) {
            sendJson(201, [
                'success' => true,
                'message' => 'Attendance recorded successfully',
                'id' => $insert_stmt->insert_id
            ]);
        } else {
            sendJson(500, ['success' => false, 'message' => 'Error recording attendance: ' . $insert_stmt->error]);
        }
    }
}

function handleUpdateAttendance($conn, $teacher_id) {
    $data = getJsonInput();
    
    if (empty($data['id'])) {
        sendJson(400, ['success' => false, 'message' => 'Attendance ID is required']);
    }
    
    $id = intval($data['id']);
    $status = $conn->real_escape_string($data['status'] ?? '');
    $remarks = $conn->real_escape_string($data['remarks'] ?? '');
    $subject = $conn->real_escape_string($data['subject'] ?? '');
    
    $query = "UPDATE attendance 
              SET status = ?, subject = ?, remarks = ?
              WHERE id = ? AND teacher_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('sssii', $status, $subject, $remarks, $id, $teacher_id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            sendJson(200, ['success' => true, 'message' => 'Attendance updated successfully']);
        } else {
            sendJson(404, ['success' => false, 'message' => 'Attendance record not found or not authorized']);
        }
    } else {
        sendJson(500, ['success' => false, 'message' => 'Error updating attendance: ' . $stmt->error]);
    }
}

$conn->close();
?>
