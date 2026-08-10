<?php
function getJsonInput(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!is_array($data)) {
        return [];
    }

    return $data;
}

function sendJson(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

/**
 * Calculate grade based on percentage
 * @param float $percentage The percentage score
 * @return string The grade (O, A, B, C, D, F)
 */
function calculateGrade($percentage): string {
    if ($percentage >= 90) return 'O';
    if ($percentage >= 80) return 'A';
    if ($percentage >= 70) return 'B';
    if ($percentage >= 60) return 'C';
    if ($percentage >= 50) return 'D';
    return 'F';
}
?>
