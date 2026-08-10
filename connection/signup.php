<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(405, [
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
}

$data = getJsonInput();
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$role = trim($data['role'] ?? 'student');

if ($name === '' || $email === '' || $password === '') {
    sendJson(400, [
        'success' => false,
        'message' => 'Name, email and password are required.'
    ]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJson(400, [
        'success' => false,
        'message' => 'Invalid email format.'
    ]);
}

if (!in_array($role, ['student', 'teacher'], true)) {
    sendJson(400, [
        'success' => false,
        'message' => 'Invalid role selected.'
    ]);
}

if (strlen($password) < 6) {
    sendJson(400, [
        'success' => false,
        'message' => 'Password must be at least 6 characters.'
    ]);
}

$studentId = trim($data['student_id'] ?? '');
$teacherEmployeeId = trim($data['employee_id'] ?? '');
$department = trim($data['department'] ?? '');
$phone = trim($data['phone'] ?? '');

if ($role === 'student' && $studentId === '') {
    sendJson(400, [
        'success' => false,
        'message' => 'Student ID is required for student signup.'
    ]);
}

if ($role === 'teacher' && $teacherEmployeeId === '') {
    sendJson(400, [
        'success' => false,
        'message' => 'Employee ID is required for teacher signup.'
    ]);
}

$conn = getDbConnection();
$conn->begin_transaction();

try {
    $checkStmt = $conn->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    if (!$checkStmt) {
        throw new Exception('Failed to prepare email check.');
    }

    $checkStmt->bind_param('s', $email);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        $checkStmt->close();
        $conn->rollback();
        $conn->close();

        sendJson(409, [
            'success' => false,
            'message' => 'Email is already registered.'
        ]);
    }
    $checkStmt->close();

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $insertUserStmt = $conn->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    if (!$insertUserStmt) {
        throw new Exception('Failed to prepare user insert.');
    }

    $insertUserStmt->bind_param('ssss', $name, $email, $hashedPassword, $role);
    if (!$insertUserStmt->execute()) {
        throw new Exception('Could not create user account.');
    }

    $userId = (int) $conn->insert_id;
    $insertUserStmt->close();

    if ($role === 'student') {
        $semester = trim($data['semester'] ?? '');
        $sectionName = trim($data['section_name'] ?? '');
        $guardianName = trim($data['guardian_name'] ?? '');
        $guardianPhone = trim($data['guardian_phone'] ?? '');
        $educationLevel = trim($data['education_level'] ?? '');
        $bio = trim($data['bio'] ?? '');

        $studentStmt = $conn->prepare('INSERT INTO student_profiles (user_id, student_id, department, semester, section_name, phone, guardian_name, guardian_phone, education_level, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        if (!$studentStmt) {
            throw new Exception('Failed to prepare student profile insert.');
        }

        $studentStmt->bind_param('isssssssss', $userId, $studentId, $department, $semester, $sectionName, $phone, $guardianName, $guardianPhone, $educationLevel, $bio);
        if (!$studentStmt->execute()) {
            throw new Exception('Could not create student profile.');
        }

        $studentStmt->close();
    }

    if ($role === 'teacher') {
        $designation = trim($data['designation'] ?? '');
        $subjectSpecialization = trim($data['subject_specialization'] ?? '');
        $yearsOfExperience = (int) ($data['years_of_experience'] ?? 0);
        $highestQualification = trim($data['highest_qualification'] ?? '');
        $professionalBio = trim($data['professional_bio'] ?? '');

        $teacherStmt = $conn->prepare('INSERT INTO teacher_profiles (user_id, employee_id, department, designation, subject_specialization, years_of_experience, highest_qualification, phone,  professional_bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        if (!$teacherStmt) {
            throw new Exception('Failed to prepare teacher profile insert.');
        }

        $teacherStmt->bind_param('issssisss', $userId, $teacherEmployeeId, $department, $designation, $subjectSpecialization, $yearsOfExperience, $highestQualification, $phone, $professionalBio);
        if (!$teacherStmt->execute()) {
            throw new Exception('Could not create teacher profile.');
        }

        $teacherStmt->close();
    }

    $conn->commit();
    $conn->close();

    sendJson(201, [
        'success' => true,
        'message' => 'Signup successful. Please login.'
    ]);
} catch (Throwable $e) {
    $conn->rollback();
    $conn->close();

    $message = $e->getMessage();
    if (stripos($message, 'Duplicate entry') !== false) {
        $message = 'A unique profile identifier (email/student ID/employee ID) already exists.';
    }

    sendJson(500, [
        'success' => false,
        'message' => $message
    ]);
}
