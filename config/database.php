<?php
/**
 * CarCare - Database Configuration
 */

// استخدم SQLite بدل MySQL على Railway
$sqlitePath = __DIR__ . '/../database/carcare.sqlite';

if (file_exists($sqlitePath)) {
    // استخدم SQLite
    try {
        $pdo = new PDO('sqlite:' . $sqlitePath);
        $pdo->exec('PRAGMA foreign_keys = ON;');
    } catch (PDOException $e) {
        die('SQLite Error: ' . $e->getMessage());
    }
} else {
    // أو MySQL كـ backup
    $host = getenv('DB_HOST') ?: 'localhost';
    $name = getenv('DB_NAME') ?: 'carcare';
    $user = getenv('DB_USER') ?: 'root';
    $pass = getenv('DB_PASS') ?: '';
    
    try {
        $dsn = "mysql:host=$host;dbname=$name;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $e) {
        die('Database Error: ' . $e->getMessage());
    }
}

function getDBConnection(): PDO {
    global $pdo;
    return $pdo;
}
?>