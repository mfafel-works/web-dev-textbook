<?php
/**
 * Contact form endpoint — Resend + Turnstile
 *
 * Standalone PHP file. Drop into any PHP-capable hosting
 * and point your SPA contact form to this URL.
 *
 * POST /contact.php
 * Content-Type: application/json
 *
 * Body: {
 *   "name": "...",
 *   "email": "...",
 *   "message": "...",
 *   "cf-turnstile-response": "..."
 * }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['name']) || empty($input['email']) || empty($input['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit;
}

$name    = trim($input['name']);
$email   = trim($input['email']);
$message = trim($input['message']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address.']);
    exit;
}

// Truncate long input
if (strlen($name) > 100 || strlen($message) > 5000) {
    http_response_code(400);
    echo json_encode(['error' => 'Input exceeds maximum length.']);
    exit;
}

// Verify Turnstile token
$token = $input['cf-turnstile-response'] ?? '';
if (!verifyTurnstile($token)) {
    http_response_code(403);
    echo json_encode(['error' => 'Bot verification failed.']);
    exit;
}

// Forward to Resend
$sent = sendViaResend($name, $email, $message);

if ($sent) {
    http_response_code(200);
    echo json_encode(['status' => 'ok']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send message. Please try again later.']);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function verifyTurnstile(string $token): bool {
    if (empty($token)) return false;

    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS     => [
            'secret'   => $_ENV['TURNSTILE_SECRET_KEY'] ?? getenv('TURNSTILE_SECRET_KEY'),
            'response' => $token,
        ],
    ]);

    $result = json_decode(curl_exec($ch), true);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode === 200 && ($result['success'] ?? false) === true;
}

function sendViaResend(string $name, string $email, string $message): bool {
    $apiKey = $_ENV['RESEND_API_KEY'] ?? getenv('RESEND_API_KEY');

    $payload = json_encode([
        'from'    => 'Contact Form <onboarding@resend.dev>',
        'to'      => ['hello@example.com'],
        'subject' => 'New message from ' . $name,
        'replyTo' => $email,
        'text'    => "Name: $name\nEmail: $email\n\n$message",
    ]);

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS     => $payload,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode === 200;
}
