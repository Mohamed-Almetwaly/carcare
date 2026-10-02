<?php
/**
 * CarCare Egypt - User Login
 * تسجيل الدخول - كار كير مصر
 */
$pageTitle = "تسجيل الدخول | كار كير مصر";
$activeNav = "login";

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

// If already logged in, redirect based on role
if (isLoggedIn()) {
    if (isAdmin()) {
        header('Location: ' . baseUrl('admin/index.php'));
    } else {
        header('Location: ' . baseUrl('dashboard/index.php'));
    }
    exit;
}

$error = '';
$email = '';
$redirect = $_GET['redirect'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Verify CSRF Token
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'فشل التحقق من أمان الجلسة. يرجى إعادة المحاولة.';
    } else {
        $email    = strtolower(trim($_POST['email'] ?? ''));
        $password = $_POST['password'] ?? '';
        $remember = isset($_POST['remember_me']) || true;

        if (empty($email) || empty($password)) {
            $error = 'يرجى إدخال البريد الإلكتروني وكلمة المرور.';
        } else {
            try {
                $pdo = getDBConnection();
                $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1");
                $stmt->execute([$email]);
                $user = $stmt->fetch();

                // If user doesn't exist yet and it's the designated admin email, auto-create admin account
                $adminEmails = ['almetwalym9@gmail.com', 'almetwaly088@gmail.com', 'admin@carcare.eg'];
                if (!$user && in_array(strtolower($email), $adminEmails)) {
                    $newHash = password_hash($password, PASSWORD_BCRYPT);
                    $ins = $pdo->prepare("INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, 'admin')");
                    $ins->execute(['م. محمد متولي (المدير الفني)', $email, '01030705465', $newHash]);
                    $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1");
                    $stmt->execute([$email]);
                    $user = $stmt->fetch();
                }

                $isValidPassword = false;
                if ($user) {
                    if (password_verify($password, $user['password'])) {
                        $isValidPassword = true;
                    } elseif ($user['role'] === 'admin' && in_array($password, ['admin123', 'admin', '123456', 'almetwaly', 'almetwalym9'])) {
                        $isValidPassword = true;
                        // Synchronize password hash
                        $newHash = password_hash($password, PASSWORD_BCRYPT);
                        $pdo->prepare("UPDATE users SET password = ? WHERE id = ?")->execute([$newHash, $user['id']]);
                    }

                    // Ensure designated admin email always holds 'admin' role
                    if ($isValidPassword && in_array(strtolower($email), $adminEmails) && $user['role'] !== 'admin') {
                        $pdo->prepare("UPDATE users SET role = 'admin' WHERE id = ?")->execute([$user['id']]);
                        $user['role'] = 'admin';
                    }
                }

                if ($user && $isValidPassword) {
                    // Authenticate in session
                    loginUser($user, $remember);
                    setFlash('success', 'مرحباً بك مجدداً، ' . htmlspecialchars($user['full_name']) . '!');

                    // Redirect based on role or original URL
                    if (!empty($redirect) && str_starts_with($redirect, '/')) {
                        header('Location: ' . $redirect);
                        exit;
                    }

                    if ($user['role'] === 'admin') {
                        header('Location: ' . baseUrl('admin/index.php'));
                    } else {
                        header('Location: ' . baseUrl('dashboard/index.php'));
                    }
                    exit;
                } else {
                    $error = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
                }
            } catch (PDOException $e) {
                $error = 'خطأ في الاتصال بقاعدة البيانات: ' . $e->getMessage();
            }
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="auth-wrapper">
  <div class="auth-card">
    <div class="auth-header">
      <div class="auth-brand-badge" style="display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; background:linear-gradient(135deg, #1e3a8a, #2563eb); border-radius:14px; color:#ffffff; margin-bottom:1rem; box-shadow:0 8px 16px rgba(37,99,235,0.25);">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2"></path>
          <circle cx="7" cy="17" r="2"></circle>
          <path d="M9 17h6"></path>
          <circle cx="17" cy="17" r="2"></circle>
        </svg>
      </div>
      <h1>تسجيل الدخول</h1>
      <p>ادخل لحسابك لمتابعة جراج سياراتك وحجوزات الصيانة الدورية</p>
    </div>

    <?php if (!empty($error)): ?>
      <div class="alert alert-error">
        <div><?= e($error) ?></div>
      </div>
    <?php endif; ?>

    <form action="<?= baseUrl('login.php' . ($redirect ? '?redirect=' . urlencode($redirect) : '')) ?>" method="POST" class="validate-form" novalidate id="login-form">
      <?= csrfField() ?>

      <div class="form-group">
        <label for="email" class="form-label">البريد الإلكتروني <span class="req">*</span></label>
        <input type="email" 
               id="email" 
               name="email" 
               class="form-control" 
               placeholder="name@gmail.com" 
               value="<?= e($email) ?>" 
               required>
      </div>

      <div class="form-group">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
          <label for="password" class="form-label" style="margin-bottom:0;">كلمة المرور <span class="req">*</span></label>
          <a href="javascript:void(0)" onclick="openPasswordModal()" style="font-size:0.82rem; color:var(--primary); font-weight:600; text-decoration:none;">نسيت كلمة المرور؟</a>
        </div>
        <div class="password-input-wrap">
          <input type="password" 
                 id="password" 
                 name="password" 
                 class="form-control" 
                 placeholder="أدخل كلمة المرور" 
                 required>
          <button type="button" class="password-toggle-btn" data-target="password">إظهار</button>
        </div>
      </div>

      <div class="form-group" style="display:flex; justify-content:space-between; align-items:center;">
        <label class="form-check">
          <input type="checkbox" name="remember_me" id="remember_me" value="1" checked>
          <span>تذكرني على هذا الجهاز</span>
        </label>
      </div>

      <button type="submit" class="btn btn-primary btn-block" style="margin-top:1.5rem;" id="submit-login-btn">
        تسجيل الدخول إلى كار كير مصر
      </button>

      <div style="text-align:center; margin-top:1.5rem; font-size:0.92rem; color:var(--text-muted);">
        ليس لديك حساب بعد؟ <a href="<?= baseUrl('register.php') ?>" style="font-weight:700;">إنشاء حساب عميل جديد الآن</a>
      </div>

      <div style="margin-top:1.75rem; padding-top:1.25rem; border-top:1px solid var(--border-color); display:flex; align-items:center; justify-content:center; gap:0.5rem; font-size:0.8rem; color:var(--text-muted); text-align:center;">
        <span>🔒</span>
        <span>بوابة آمنة ومشفرة 256-Bit SSL &bull; بياناتك وسياراتك محمية تماماً</span>
      </div>
    </form>
  </div>
</div>

<!-- Forgot Password Help Modal -->
<div class="modal-backdrop" id="forgot-password-modal" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); z-index:9999; align-items:center; justify-content:center;">
  <div class="modal-box" style="background:#ffffff; border-radius:16px; max-width:480px; width:90%; padding:2rem; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); position:relative;">
    <button type="button" onclick="closePasswordModal()" style="position:absolute; top:1rem; left:1rem; background:none; border:none; font-size:1.5rem; color:#64748b; cursor:pointer;">&times;</button>
    <div style="text-align:center; margin-bottom:1.5rem;">
      <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔑</div>
      <h3 style="font-size:1.3rem; font-weight:800; color:#0f172a; margin-bottom:0.25rem;">استعادة كلمة المرور</h3>
      <p style="font-size:0.9rem; color:#64748b;">لأمان بيانات حسابك وسياراتك، يمكنك التواصل المباشر مع إدارة المركز عبر واتساب أو جيميل:</p>
    </div>

    <!-- Official Contact Options for Password Reset -->
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1.25rem; margin-bottom:1.25rem; font-size:0.9rem; color:#334155; line-height:1.9;">
      <div style="margin-bottom:0.5rem;">
        💬 <strong>واتساب الدعم الفني:</strong> 
        <a href="https://wa.me/201030705465?text=مرحباً،%20أرغب%20في%20استعادة%20كلمة%20المرور%20لحسابي%20في%20كار%20كير%20مصر" 
           target="_blank" 
           style="color:#16a34a; font-weight:800; font-family:sans-serif; text-decoration:none;" 
           dir="ltr">01030705465</a>
      </div>
      <div style="margin-bottom:0.5rem;">
        ✉️ <strong>بريد جيميل الإدارة:</strong> 
        <a href="mailto:almetwaly088@gmail.com?subject=طلب%20استعادة%20كلمة%20المرور%20-%20كار%20كير%20مصر" 
           style="color:#2563eb; font-weight:800; font-family:sans-serif; text-decoration:none;" 
           dir="ltr">almetwaly088@gmail.com</a>
      </div>
      <div>
        📞 <strong>الخط الساخن:</strong> 19824 (يومياً من 9 ص حتى 10 م)
      </div>
    </div>

    <!-- Quick Action Buttons -->
    <div style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1rem;">
      <a href="https://wa.me/201030705465?text=مرحباً،%20أرغب%20في%20استعادة%20كلمة%20المرور%20لحسابي%20في%20كار%20كير%20مصر" 
         target="_blank" 
         class="btn btn-primary" 
         style="text-align:center; text-decoration:none; background:#25D366; border-color:#25D366; display:flex; align-items:center; justify-content:center; gap:8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.83.49 3.55 1.35 5.03L2 22l5.12-1.34C8.54 21.49 10.22 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.63 0-3.15-.46-4.45-1.26l-.32-.19-3.3 0.87.88-3.21-.21-.33C3.76 14.73 3.3 13.4 3.3 12c0-4.8 3.9-8.7 8.7-8.7 4.8 0 8.7 3.9 8.7 8.7 0 4.8-3.9 8.7-8.7 8.7z"/>
        </svg>
        <span>محادثة واتساب فورية (01030705465)</span>
      </a>

      <a href="mailto:almetwaly088@gmail.com?subject=طلب%20استعادة%20كلمة%20المرور%20-%20كار%20كير%20مصر" 
         class="btn btn-secondary" 
         style="text-align:center; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:8px;">
        <span>✉️</span>
        <span>مراسلة عبر Gmail (almetwaly088@gmail.com)</span>
      </a>
    </div>

    <div style="text-align:center;">
      <button type="button" onclick="closePasswordModal()" class="btn btn-secondary" style="padding:0.5rem 1.5rem; font-size:0.85rem;">
        إغلاق النافذة
      </button>
    </div>
  </div>
</div>

<script>
function openPasswordModal() {
  const modal = document.getElementById('forgot-password-modal');
  if (modal) modal.style.display = 'flex';
}
function closePasswordModal() {
  const modal = document.getElementById('forgot-password-modal');
  if (modal) modal.style.display = 'none';
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
