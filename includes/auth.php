<?php
/**
 * CarCare Egypt - Authentication and Authorization Guards
 * نظام المصادقة والصلاحيات - كار كير مصر
 */

require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/../config/database.php';

function isLoggedIn(): bool {
    if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
        return true;
    }

    // Attempt restoration from remember cookie if available
    if (!empty($_COOKIE['carcare_remember'])) {
        try {
            $decoded = base64_decode($_COOKIE['carcare_remember']);
            if ($decoded && str_contains($decoded, ':')) {
                [$id, $hash] = explode(':', $decoded, 2);
                $pdo = getDBConnection();
                $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
                $stmt->execute([(int)$id]);
                $user = $stmt->fetch();
                if ($user && hash('sha256', $user['password']) === $hash) {
                    $_SESSION['user_id']    = (int)$user['id'];
                    $_SESSION['user_name']  = $user['full_name'];
                    $_SESSION['user_email'] = $user['email'];
                    $_SESSION['user_role']  = $user['role'];
                    $_SESSION['user_phone'] = $user['phone'] ?? '';
                    return true;
                }
            }
        } catch (Exception $e) {
            // ignore failure
        }
    }

    return false;
}

function isAdmin(): bool {
    return isLoggedIn() && (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin');
}

function currentUserId(): ?int {
    return $_SESSION['user_id'] ?? null;
}

function currentUser(): ?array {
    if (!isLoggedIn()) {
        return null;
    }

    // Return cached session info or fetch latest from DB
    return [
        'id'        => $_SESSION['user_id'],
        'full_name' => $_SESSION['user_name'] ?? 'User',
        'email'     => $_SESSION['user_email'] ?? '',
        'role'      => $_SESSION['user_role'] ?? 'customer',
        'phone'     => $_SESSION['user_phone'] ?? '',
    ];
}

function requireLogin(string $redirectMessage = 'يرجى تسجيل الدخول للوصول إلى هذه الصفحة.'): void {
    if (!isLoggedIn()) {
        setFlash('error', $redirectMessage);
        $returnUrl = $_SERVER['REQUEST_URI'] ?? '';
        header('Location: ' . baseUrl('login.php?redirect=' . urlencode($returnUrl)));
        exit;
    }
}

function requireAdmin(string $redirectMessage = 'غير مصرح بالدخول. هذه الصفحة مخصصة لمديري النظام فقط.'): void {
    if (!isLoggedIn()) {
        setFlash('error', 'يرجى تسجيل الدخول بحساب الإدارة.');
        header('Location: ' . baseUrl('login.php?redirect=' . urlencode($_SERVER['REQUEST_URI'] ?? '')));
        exit;
    }

    if (!isAdmin()) {
        setFlash('error', $redirectMessage);
        header('Location: ' . baseUrl('dashboard/index.php'));
        exit;
    }
}

function requireRole(string $role, string $redirectMessage = ''): void {
    if (!isLoggedIn()) {
        setFlash('error', $redirectMessage ?: 'يرجى تسجيل الدخول بحسابك أولاً.');
        $returnUrl = $_SERVER['REQUEST_URI'] ?? '';
        header('Location: ' . baseUrl('login.php?redirect=' . urlencode($returnUrl)));
        exit;
    }

    $user = currentUser();
    if (!$user || $user['role'] !== $role) {
        setFlash('error', $redirectMessage ?: 'هذه الصفحة مخصصة لحسابات الـ ' . ($role === 'admin' ? 'إدارة' : 'عملاء') . '.');
        if ($user && $user['role'] === 'admin') {
            header('Location: ' . baseUrl('admin/index.php'));
        } else {
            header('Location: ' . baseUrl('dashboard/index.php'));
        }
        exit;
    }
}

function loginUser(array $user, bool $remember = false): void {
    // Regenerate session ID to prevent session fixation attacks
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_regenerate_id(true);
    }

    $_SESSION['user_id']    = (int)$user['id'];
    $_SESSION['user_name']  = $user['full_name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role']  = $user['role'];
    $_SESSION['user_phone'] = $user['phone'] ?? '';

    // Always set a 30-day remember cookie with SameSite=None; Secure for iframe persistence
    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
        || true;

    $token = base64_encode($user['id'] . ':' . hash('sha256', $user['password']));
    setcookie('carcare_remember', $token, [
        'expires'  => time() + (86400 * 30),
        'path'     => '/',
        'domain'   => '',
        'secure'   => $isSecure,
        'httponly' => true,
        'samesite' => 'None',
    ]);
}

function logoutUser(): void {
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'],
            $params['secure'], $params['httponly']
        );
    }

    if (isset($_COOKIE['carcare_remember'])) {
        setcookie('carcare_remember', '', time() - 3600, '/', '', true, true);
    }

    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }
}
