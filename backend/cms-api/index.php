<?php
/**
 * Minimal REST API for a config-driven CMS.
 *
 * Endpoints:
 *   GET    /api/pages          — list all pages
 *   GET    /api/pages/{key}    — get a single page
 *   POST   /api/pages          — create a page
 *   PUT    /api/pages/{key}    — update a page
 *   DELETE /api/pages/{key}    — delete a page
 *
 * Data is stored in a JSON file (pages.json).
 * In production, replace with a database (see /backend/database/).
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip /api/pages prefix and extract the page key if present
$prefix = '/api/pages';
if (strpos($path, $prefix) !== 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

$key = substr($path, strlen($prefix));
$key = trim($key, '/');

$dataFile = __DIR__ . '/pages.json';

// Load existing data
$pages = [];
if (file_exists($dataFile)) {
    $pages = json_decode(file_get_contents($dataFile), true) ?: [];
}

switch ($method) {
    case 'GET':
        if ($key) {
            // GET /api/pages/{key}
            if (!isset($pages[$key])) {
                http_response_code(404);
                echo json_encode(['error' => 'Page not found']);
                exit;
            }
            echo json_encode($pages[$key]);
        } else {
            // GET /api/pages
            echo json_encode(array_keys($pages));
        }
        break;

    case 'POST':
        // POST /api/pages — requires JSON body with 'key' and page data
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['key']) || empty($input['data'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: key, data']);
            exit;
        }
        $newKey = $input['key'];
        if (isset($pages[$newKey])) {
            http_response_code(409);
            echo json_encode(['error' => 'Page already exists']);
            exit;
        }
        $pages[$newKey] = $input['data'];
        file_put_contents($dataFile, json_encode($pages, JSON_PRETTY_PRINT));
        http_response_code(201);
        echo json_encode(['status' => 'created', 'key' => $newKey]);
        break;

    case 'PUT':
        // PUT /api/pages/{key}
        if (!$key) {
            http_response_code(400);
            echo json_encode(['error' => 'Page key required in URL']);
            exit;
        }
        if (!isset($pages[$key])) {
            http_response_code(404);
            echo json_encode(['error' => 'Page not found']);
            exit;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            exit;
        }
        $pages[$key] = $input;
        file_put_contents($dataFile, json_encode($pages, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'updated', 'key' => $key]);
        break;

    case 'DELETE':
        // DELETE /api/pages/{key}
        if (!$key) {
            http_response_code(400);
            echo json_encode(['error' => 'Page key required in URL']);
            exit;
        }
        if (!isset($pages[$key])) {
            http_response_code(404);
            echo json_encode(['error' => 'Page not found']);
            exit;
        }
        unset($pages[$key]);
        file_put_contents($dataFile, json_encode($pages, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'deleted', 'key' => $key]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
