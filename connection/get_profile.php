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

if ($userId <= 0 || !in_array($role, ['student', 'teacher'], true)) {
    sendJson(400, [
        'success' => false,
        'message' => 'Valid user_id and role are required.'
    ]);
}

$conn = getDbConnection();

$userStmt = $conn->prepare('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1');
if (!$userStmt) {
    $conn->close();
    sendJson(500, ['success' => false, 'message' => 'Failed to prepare user query.']);
}

$userStmt->bind_param('i', $userId);
$userStmt->execute();
$userStmt->store_result();

if ($userStmt->num_rows === 0) {
    $userStmt->close();
    $conn->close();
    sendJson(404, ['success' => false, 'message' => 'User not found.']);
}

$userStmt->bind_result($id, $name, $email, $dbRole);
$userStmt->fetch();
$userStmt->close();

if ($dbRole !== $role) {
    $conn->close();
    sendJson(403, ['success' => false, 'message' => 'Role mismatch for this user.']);
}

$profile = [
    'name' => $name,
    'email' => $email,
    'role' => $dbRole
];

if ($role === 'student') {
    $profileStmt = $conn->prepare('SELECT student_id, department, semester, section_name, phone, guardian_name, guardian_phone, education_level, bio FROM student_profiles WHERE user_id = ? LIMIT 1');
    if (!$profileStmt) {
        $conn->close();
        sendJson(500, ['success' => false, 'message' => 'Failed to prepare student profile query.']);
    }

    $profileStmt->bind_param('i', $userId);
    $profileStmt->execute();
    $profileStmt->store_result();

    if ($profileStmt->num_rows > 0) {
        $profileStmt->bind_result($studentId, $department, $semester, $sectionName, $phone, $guardianName, $guardianPhone, $educationLevel, $bio);
        $profileStmt->fetch();
        $profile = array_merge($profile, [
            'student_id' => $studentId,
            'department' => $department,
            'semester' => $semester,
            'section_name' => $sectionName,
            'phone' => $phone,
            'guardian_name' => $guardianName,
            'guardian_phone' => $guardianPhone,
            'education_level' => $educationLevel,
            'bio' => $bio
        ]);
    }

    $profileStmt->close();
}

if ($role === 'teacher') {
    $profileStmt = $conn->prepare('SELECT employee_id, department, designation, subject_specialization, years_of_experience, highest_qualification, phone,  professional_bio FROM teacher_profiles WHERE user_id = ? LIMIT 1');
    if (!$profileStmt) {
        $conn->close();
        sendJson(500, ['success' => false, 'message' => 'Failed to prepare teacher profile query.']);
    }

    $profileStmt->bind_param('i', $userId);
    $profileStmt->execute();
    $profileStmt->store_result();

    if ($profileStmt->num_rows > 0) {
        $profileStmt->bind_result($employeeId, $department, $designation, $subjectSpecialization, $yearsOfExperience, $highestQualification, $phone, $professionalBio);
        $profileStmt->fetch();
        $profile = array_merge($profile, [
            'employee_id' => $employeeId,
            'department' => $department,
            'designation' => $designation,
            'subject_specialization' => $subjectSpecialization,
            'years_of_experience' => (int) $yearsOfExperience,
            'highest_qualification' => $highestQualification,
            'phone' => $phone,
            'professional_bio' => $professionalBio
        ]);
    }

    $profileStmt->close();
}

$conn->close();

sendJson(200, [
    'success' => true,
    'profile' => $profile
]);
