<?php
/**
 * CarCare - PHP Built-in Server Router
 * Enables clean URLs and handles static file serving
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Serve static assets directly if they exist on disk
$filePath = __DIR__ . $uri;
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    return false; // Let PHP built-in server handle the static file (CSS, JS, images)
}

// If root path or directory requested, look for index.php
if ($uri === '/' || is_dir($filePath)) {
    $indexFile = rtrim($filePath, '/') . '/index.php';
    if (file_exists($indexFile)) {
        require $indexFile;
        exit;
    }
}

// If path without .php extension exists as .php file, execute it
$phpFile = rtrim($filePath, '/') . '.php';
if (file_exists($phpFile)) {
    require $phpFile;
    exit;
}

// If direct .php file requested
if (file_exists($filePath)) {
    require $filePath;
    exit;
}

// Fallback 404
http_response_code(404);
require_once __DIR__ . '/includes/header.php';
?>
<div class="container section text-center" style="padding: 5rem 1rem;">
  <h1 style="font-size: 3rem; color: var(--primary);">404</h1>
  <h2>Page Not Found</h2>
  <p style="color: var(--text-muted); margin: 1rem 0 2rem;">The page you requested could not be found.</p>
  <a href="<?= baseUrl('index.php') ?>" class="btn btn-primary">Return to Homepage</a>
</div>
<?php
require_once __DIR__ . '/includes/footer.php';
exit;
