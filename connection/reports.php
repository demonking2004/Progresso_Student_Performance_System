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
        if ($action === 'attendance') {
            handleGetAttendanceReport($conn, $teacher_id);
        } else if ($action === 'marks') {
            handleGetMarksReport($conn, $teacher_id);
        } else if ($action === 'student') {
            handleGetStudentReport($conn, $teacher_id);
        } else {
            sendJson(400, ['success' => false, 'message' => 'Invalid action']);
        }
        break;
    case 'POST':
        handleCreateStudentReport($conn, $teacher_id);
        break;
    default:
        sendJson(405, ['success' => false, 'message' => 'Method not allowed']);
}

function handleGetAttendanceReport($conn, $teacher_id) {
    // Get attendance report for all mentees
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
    $attendance_report = [];
    
    while ($row = $result->fetch_assoc()) {
        $attendance_report[] = [
            'studentId' => intval($row['id']),
            'name' => $row['name'],
            'totalClasses' => intval($row['total_classes']) ?: 0,
            'present' => intval($row['present']) ?: 0,
            'absent' => intval($row['absent']) ?: 0,
            'leave' => intval($row['leave_count']) ?: 0,
            'percentage' => floatval($row['percentage']) ?: 0
        ];
    }
    
    sendJson(200, ['success' => true, 'data' => $attendance_report]);
}

function handleGetMarksReport($conn, $teacher_id) {
    // Get marks report for all mentees
    $query = "SELECT u.id, u.name, m.subject, m.exam_type, m.marks_obtained, m.total_marks, 
                     m.percentage, m.grade, m.created_at
              FROM mentee_assignments ma
              INNER JOIN users u ON ma.student_id = u.id
              LEFT JOIN marks m ON u.id = m.student_id AND m.teacher_id = ?
              WHERE ma.teacher_id = ?
              ORDER BY u.name ASC, m.created_at DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $teacher_id, $teacher_id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $marks_report = [];
    
    while ($row = $result->fetch_assoc()) {
        $marks_report[] = [
            'studentId' => intval($row['id']),
            'name' => $row['name'],
            'subject' => $row['subject'],
            'examType' => $row['exam_type'],
            'marksObtained' => $row['marks_obtained'] ? floatval($row['marks_obtained']) : null,
            'totalMarks' => $row['total_marks'] ? floatval($row['total_marks']) : null,
            'percentage' => $row['percentage'] ? floatval($row['percentage']) : null,
            'grade' => $row['grade'],
            'date' => $row['created_at']
        ];
    }
    
    sendJson(200, ['success' => true, 'data' => $marks_report]);
}

function handleGetStudentReport($conn, $teacher_id) {
    $student_id = $_GET['student_id'] ?? '';
    
    if (!$student_id) {
        sendJson(400, ['success' => false, 'message' => 'Student ID is required']);
    }
    
    $student_id = intval($student_id);
    
    // Verify authorization
    $verify_query = "SELECT 1 FROM mentee_assignments WHERE teacher_id = ? AND student_id = ?";
    $verify_stmt = $conn->prepare($verify_query);
    $verify_stmt->bind_param('ii', $teacher_id, $student_id);
    $verify_stmt->execute();
    
    if ($verify_stmt->get_result()->num_rows === 0) {
        sendJson(403, ['success' => false, 'message' => 'Not authorized to view this report']);
    }
    
    // Get latest report for the student
    $query = "SELECT sr.* FROM student_reports sr
              WHERE sr.student_id = ? AND sr.teacher_id = ?
              ORDER BY sr.created_at DESC
              LIMIT 1";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $student_id, $teacher_id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        $report = [
            'id' => intval($row['id']),
            'reportType' => $row['report_type'],
            'content' => $row['report_content'],
            'overallPerformance' => $row['overall_performance'],
            'createdAt' => $row['created_at'],
            'updatedAt' => $row['updated_at']
        ];
        sendJson(200, ['success' => true, 'data' => $report]);
    } else {
        sendJson(404, ['success' => false, 'message' => 'No report found for this student']);
    }
}

function handleCreateStudentReport($conn, $teacher_id) {
    $data = getJsonInput();
    
    if (empty($data['studentId']) || empty($data['reportType']) || empty($data['content'])) {
        sendJson(400, ['success' => false, 'message' => 'Missing required fields']);
    }
    
    $student_id = intval($data['studentId']);
    $report_type = $conn->real_escape_string($data['reportType']);
    $content = $conn->real_escape_string($data['content']);
    $overall_performance = $conn->real_escape_string($data['overallPerformance'] ?? '');
    
    // Verify authorization
    $verify_query = "SELECT 1 FROM mentee_assignments WHERE teacher_id = ? AND student_id = ?";
    $verify_stmt = $conn->prepare($verify_query);
    $verify_stmt->bind_param('ii', $teacher_id, $student_id);
    $verify_stmt->execute();
    
    if ($verify_stmt->get_result()->num_rows === 0) {
        sendJson(403, ['success' => false, 'message' => 'Not authorized to create report for this student']);
    }
    
    // Check if report already exists and update if it does
    $check_query = "SELECT id FROM student_reports WHERE student_id = ? AND teacher_id = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param('ii', $student_id, $teacher_id);
    $check_stmt->execute();
    
    if ($check_stmt->get_result()->num_rows > 0) {
        // Update existing report
        $update_query = "UPDATE student_reports 
                        SET report_type = ?, report_content = ?, overall_performance = ?, updated_at = NOW()
                        WHERE student_id = ? AND teacher_id = ?";
        
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->bind_param('sssii', $report_type, $content, $overall_performance, $student_id, $teacher_id);
        
        if ($update_stmt->execute()) {
            sendJson(200, ['success' => true, 'message' => 'Report updated successfully']);
        } else {
            sendJson(500, ['success' => false, 'message' => 'Error updating report: ' . $update_stmt->error]);
        }
    } else {
        // Create new report
        $insert_query = "INSERT INTO student_reports (student_id, teacher_id, report_type, report_content, overall_performance)
                        VALUES (?, ?, ?, ?, ?)";
        
        $insert_stmt = $conn->prepare($insert_query);
        $insert_stmt->bind_param('iisss', $student_id, $teacher_id, $report_type, $content, $overall_performance);
        
        if ($insert_stmt->execute()) {
            sendJson(201, ['success' => true, 'message' => 'Report created successfully', 'id' => $insert_stmt->insert_id]);
        } else {
            sendJson(500, ['success' => false, 'message' => 'Error creating report: ' . $insert_stmt->error]);
        }
    }
}

$conn->close();
?>
