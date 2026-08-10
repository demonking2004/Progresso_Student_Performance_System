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
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$role = trim($data['role'] ?? '');

if ($email === '' || $password === '') {
    sendJson(400, [
        'success' => false,
        'message' => 'Email and password are required.'
    ]);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJson(400, [
        'success' => false,
        'message' => 'Invalid email format.'
    ]);
}

$conn = getDbConnection();

$stmt = $conn->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1');
if (!$stmt) {
    $conn->close();
    sendJson(500, [
        'success' => false,
        'message' => 'Failed to prepare login query.'
    ]);
}

$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows === 0) {
    $stmt->close();
    $conn->close();

    sendJson(401, [
        'success' => false,
        'message' => 'Invalid email or password.'
    ]);
}

$stmt->bind_result($userId, $userName, $userEmail, $passwordHash, $userRole);
$stmt->fetch();
$stmt->close();

if (!password_verify($password, $passwordHash)) {
    $conn->close();

    sendJson(401, [
        'success' => false,
        'message' => 'Invalid email or password.'
    ]);
}

if ($role !== '' && $role !== $userRole) {
    $conn->close();

    sendJson(403, [
        'success' => false,
        'message' => 'This user is not registered as selected role.'
    ]);
}

$conn->close();

sendJson(200, [
    'success' => true,
    'message' => 'Login successful.',
    'user' => [
        'id' => (int) $userId,
        'name' => $userName,
        'email' => $userEmail,
        'role' => $userRole
    ]
]);
