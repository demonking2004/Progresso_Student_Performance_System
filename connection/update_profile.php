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
$userId = (int) ($data['user_id'] ?? 0);
$role = trim($data['role'] ?? '');
$name = trim($data['name'] ?? '');

if ($userId <= 0 || !in_array($role, ['student', 'teacher'], true) || $name === '') {
    sendJson(400, [
        'success' => false,
        'message' => 'Valid user_id, role and name are required.'
    ]);
}

$conn = getDbConnection();
$conn->begin_transaction();

try {
    $roleCheckStmt = $conn->prepare('SELECT role FROM users WHERE id = ? LIMIT 1');
    if (!$roleCheckStmt) {
        throw new Exception('Failed to prepare role check.');
    }

    $roleCheckStmt->bind_param('i', $userId);
    $roleCheckStmt->execute();
    $roleCheckStmt->store_result();

    if ($roleCheckStmt->num_rows === 0) {
        throw new Exception('User not found.');
    }

    $roleCheckStmt->bind_result($dbRole);
    $roleCheckStmt->fetch();
    $roleCheckStmt->close();

    if ($dbRole !== $role) {
        throw new Exception('Role mismatch for this user.');
    }

    $updateUserStmt = $conn->prepare('UPDATE users SET name = ? WHERE id = ?');
    if (!$updateUserStmt) {
        throw new Exception('Failed to prepare user update.');
    }

    $updateUserStmt->bind_param('si', $name, $userId);
    if (!$updateUserStmt->execute()) {
        throw new Exception('Failed to update user data.');
    }
    $updateUserStmt->close();

    if ($role === 'student') {
        $studentId = trim($data['student_id'] ?? '');
        if ($studentId === '') {
            throw new Exception('Student ID is required.');
        }

        $department = trim($data['department'] ?? '');
        $semester = trim($data['semester'] ?? '');
        $sectionName = trim($data['section_name'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $guardianName = trim($data['guardian_name'] ?? '');
        $guardianPhone = trim($data['guardian_phone'] ?? '');
        $educationLevel = trim($data['education_level'] ?? '');
        $bio = trim($data['bio'] ?? '');

        $stmt = $conn->prepare('INSERT INTO student_profiles (user_id, student_id, department, semester, section_name, phone, guardian_name, guardian_phone, education_level, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE student_id = VALUES(student_id), department = VALUES(department), semester = VALUES(semester), section_name = VALUES(section_name), phone = VALUES(phone), guardian_name = VALUES(guardian_name), guardian_phone = VALUES(guardian_phone), education_level = VALUES(education_level), bio = VALUES(bio)');
        if (!$stmt) {
            throw new Exception('Failed to prepare student profile update.');
        }

        $stmt->bind_param('isssssssss', $userId, $studentId, $department, $semester, $sectionName, $phone, $guardianName, $guardianPhone, $educationLevel, $bio);
        if (!$stmt->execute()) {
            throw new Exception('Failed to update student profile.');
        }
        $stmt->close();
    }

    if ($role === 'teacher') {
        $employeeId = trim($data['employee_id'] ?? '');
        if ($employeeId === '') {
            throw new Exception('Employee ID is required.');
        }

        $department = trim($data['department'] ?? '');
        $designation = trim($data['designation'] ?? '');
        $subjectSpecialization = trim($data['subject_specialization'] ?? '');
        $yearsOfExperience = (int) ($data['years_of_experience'] ?? 0);
        $highestQualification = trim($data['highest_qualification'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $professionalBio = trim($data['professional_bio'] ?? '');

        $stmt = $conn->prepare('INSERT INTO teacher_profiles (user_id, employee_id, department, designation, subject_specialization, years_of_experience, highest_qualification, phone, professional_bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE employee_id = VALUES(employee_id), department = VALUES(department), designation = VALUES(designation), subject_specialization = VALUES(subject_specialization), years_of_experience = VALUES(years_of_experience), highest_qualification = VALUES(highest_qualification), phone = VALUES(phone), professional_bio = VALUES(professional_bio)');
        if (!$stmt) {
            throw new Exception('Failed to prepare teacher profile update.');
        }

        $stmt->bind_param('issssisss', $userId, $employeeId, $department, $designation, $subjectSpecialization, $yearsOfExperience, $highestQualification, $phone, $professionalBio);
        if (!$stmt->execute()) {
            throw new Exception('Failed to update teacher profile.');
        }
        $stmt->close();
    }

    $conn->commit();
    $conn->close();

    sendJson(200, [
        'success' => true,
        'message' => 'Profile updated successfully.'
    ]);
} catch (Throwable $e) {
    $conn->rollback();
    $conn->close();

    $message = $e->getMessage();
    if (stripos($message, 'Duplicate entry') !== false) {
        $message = 'Duplicate unique field value found (student ID or employee ID).';
    }

    sendJson(500, [
        'success' => false,
        'message' => $message
    ]);
}
