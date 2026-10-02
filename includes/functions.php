<?php
/**
 * CarCare Egypt - Helper Functions & Utilities
 * الدوال المساعدة لمنصة كار كير مصر
 */

if (session_status() === PHP_SESSION_NONE) {
    // Determine if connection is secure (HTTPS or forwarded by Cloud Run reverse proxy)
    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
        || true;

    // Configure session cookie params for modern browser iframes
    session_set_cookie_params([
        'lifetime' => 86400 * 30,
        'path'     => '/',
        'domain'   => '',
        'secure'   => $isSecure,
        'httponly' => true,
        'samesite' => $isSecure ? 'None' : 'Lax',
    ]);

    session_start();
}

/**
 * Escape string for safe HTML output (XSS Prevention)
 */
function e(?string $value): string {
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Determine the dynamic base URL of the CarCare installation
 * Works whether installed in root (/) or in a subfolder like (/carcare/) on XAMPP
 */
function baseUrl(string $path = ''): string {
    static $base = null;

    if ($base === null) {
        $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
        // Find where /admin/ or /dashboard/ or root files are located
        $dir = dirname($scriptName);
        $dir = str_replace('\\', '/', $dir);

        // Strip subdirectories if current script is in admin or dashboard
        if (preg_match('#/(admin|dashboard)$#i', $dir)) {
            $dir = dirname($dir);
        }

        $base = rtrim($dir, '/');
        if ($base === '') {
            $base = '';
        }
    }

    $cleanPath = ltrim($path, '/');
    if ($cleanPath === '') {
        return $base ?: '/';
    }

    return ($base ? $base . '/' : '/') . $cleanPath;
}

/**
 * Generate CSRF Token and store in session
 */
function generateCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Output a hidden CSRF token input for forms
 */
function csrfField(): string {
    $token = generateCsrfToken();
    return '<input type="hidden" name="csrf_token" value="' . e($token) . '">';
}

/**
 * Verify submitted CSRF token
 */
function verifyCsrfToken(?string $token): bool {
    if (empty($token) || empty($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Set a session flash message
 */
function setFlash(string $type, string $message): void {
    $_SESSION['flash'] = [
        'type'    => $type, // 'success', 'error', 'info', 'warning'
        'message' => $message,
    ];
}

/**
 * Retrieve and clear flash message
 */
function getFlash(): ?array {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

/**
 * Format currency amount in Egyptian Pounds (EGP / ج.م)
 */
function formatPrice($amount): string {
    return number_format((float)$amount, 0) . ' ج.م';
}

/**
 * Format human date
 */
function formatDate(string $date): string {
    if (!$date) return 'غير محدد';
    $timestamp = strtotime($date);
    return date('Y/m/d', $timestamp);
}

/**
 * Generate unique appointment reference code (e.g. EG-7842)
 */
function generateReferenceCode(): string {
    return 'EG-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 4));
}

/**
 * Translate status into Arabic display label
 */
function formatStatus(string $status): string {
    switch ($status) {
        case 'Pending':
            return 'قيد الانتظار';
        case 'Confirmed':
            return 'مؤكد';
        case 'In Service':
            return 'جاري الصيانة';
        case 'Completed':
            return 'تمت الصيانة';
        case 'Cancelled':
            return 'ملغي';
        case 'Unread':
            return 'جديد / غير مقروء';
        case 'Read':
            return 'تمت المتابعة';
        default:
            return $status;
    }
}

/**
 * CSS status badge classes
 */
function getStatusBadgeClass(string $status): string {
    switch ($status) {
        case 'Pending':
            return 'badge-pending';
        case 'Confirmed':
            return 'badge-confirmed';
        case 'In Service':
            return 'badge-inservice';
        case 'Completed':
            return 'badge-completed';
        case 'Cancelled':
            return 'badge-cancelled';
        case 'Unread':
            return 'badge-unread';
        case 'Read':
            return 'badge-read';
        default:
            return 'badge-default';
    }
}

/**
 * Helper to return JSON responses for AJAX
 */
function jsonResponse(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
