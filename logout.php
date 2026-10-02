<?php
/**
 * CarCare - User Logout
 */
require_once __DIR__ . '/includes/auth.php';

logoutUser();
setFlash('info', 'You have been logged out successfully. Have a safe drive!');
header('Location: ' . baseUrl('login.php'));
exit;
