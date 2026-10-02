<?php
/**
 * CarCare - Database Connection Configuration
 * PDO Connection to MySQL Database
 */

// Define environment/connection variables with XAMPP defaults
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'carcare');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');

function getDBConnection(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Check if SQLite fallback is desired in offline container environments
            $sqlitePath = __DIR__ . '/../database/carcare.sqlite';
            if (file_exists($sqlitePath)) {
                $pdo = new PDO('sqlite:' . $sqlitePath, null, null, $options);
                $pdo->exec('PRAGMA foreign_keys = ON;');
                return $pdo;
            }

            // Otherwise die with friendly error for XAMPP troubleshooting
            die('<div style="font-family:sans-serif;padding:30px;max-width:650px;margin:50px auto;background:#fff5f5;border:1px solid #fed7d7;border-radius:8px;color:#c53030;">'
                . '<h2 style="margin-top:0;">Database Connection Error</h2>'
                . '<p>Could not connect to MySQL database <strong>' . htmlspecialchars(DB_NAME) . '</strong> on <strong>' . htmlspecialchars(DB_HOST) . '</strong>.</p>'
                . '<p><strong>Details:</strong> ' . htmlspecialchars($e->getMessage()) . '</p>'
                . '<hr style="border:0;border-top:1px solid #feb2b2;margin:20px 0;">'
                . '<p style="font-size:14px;color:#742a2a;"><strong>XAMPP Checklist:</strong><br>'
                . '1. Open XAMPP Control Panel and ensure <strong>MySQL</strong> is started (green icon).<br>'
                . '2. Open phpMyAdmin (<a href="http://localhost/phpmyadmin">localhost/phpmyadmin</a>).<br>'
                . '3. Import the file <code>database/schema.sql</code> to create the <code>carcare</code> database.</p>'
                . '</div>');
        }
    }

    return $pdo;
}
