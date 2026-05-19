<?php
/**
 * Contact form endpoint
 *
 * Receives JSON POST from the SPA contact form,
 * verifies the Turnstile token, and sends an email via Resend.
 *
 * Usage:
 *   POST /api/contact
 *   Content-Type: application/json
 *   Body: { "name": "...", "email": "...", "message": "..." }
 *
 * The Turnstile token is expected in cf-turnstile-response (POST body).
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

// Parse JSON body
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['name']) || empty($input['email']) || empty($input['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit;
}

$name   = trim($input['name']);
$email  = trim($input['email']);
$message = trim($input['message']);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address.']);
    exit;
}

// Validate Turnstile token
$token = $input['cf-turnstile-response'] ?? '';
if (!verifyTurnstile($token)) {
    http_response_code(403);
    echo json_encode(['error' => 'Bot verification failed.']);
    exit;
}

// Send email via Resend
$sent = sendEmailResend($name, $email, $message);

if ($sent) {
    http_response_code(200);
    echo json_encode(['status' => 'ok', 'message' => 'Message sent successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send message.']);
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function verifyTurnstile($token): bool {
    if (empty($token)) return false;

    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'secret'   => getenv('TURNSTILE_SECRET_KEY') ?: 'YOUR_SECRET_KEY',
        'response' => $token,
    ]);

    $result = json_decode(curl_exec($ch), true);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode === 200 && ($result['success'] ?? false) === true;
}

function sendEmailResend(string $name, string $email, string $message): bool {
    $apiKey = getenv('RESEND_API_KEY') ?: 'YOUR_RESEND_API_KEY';

    $payload = json_encode([
        'from'    => 'Contact Form <onboarding@resend.dev>',
        'to'      => ['you@example.com'],
        'subject' => 'New message from ' . $name,
        'replyTo' => $email,
        'text'    => "Name: $name\nEmail: $email\n\nMessage:\n$message",
    ]);

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode === 200;
}
