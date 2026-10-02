<?php
/**
 * CarCare Egypt - User Registration
 * إنشاء حساب عميل جديد - كار كير مصر
 */
$pageTitle = "إنشاء حساب عميل جديد | كار كير مصر";
$activeNav = "register";

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

// If already logged in, redirect to customer dashboard
if (isLoggedIn()) {
    header('Location: ' . baseUrl('dashboard/index.php'));
    exit;
}

$errors = [];
$fullName = '';
$email = '';
$phone = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Verify CSRF Token
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $errors[] = 'فشل التحقق من رمز أمان الجلسة. يرجى إعادة المحاولة.';
    }

    // 2. Sanitize and retrieve inputs
    $fullName        = trim($_POST['full_name'] ?? '');
    $email           = trim($_POST['email'] ?? '');
    $phone           = trim($_POST['phone'] ?? '');
    $password        = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    // 3. Server-side validation
    if (empty($fullName)) {
        $errors['full_name'] = 'يرجى إدخال الاسم بالكامل.';
    }

    if (empty($email)) {
        $errors['email'] = 'يرجى إدخال البريد الإلكتروني.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'يرجى إدخال بريد إلكتروني صحيح.';
    }

    if (empty($phone)) {
        $errors['phone'] = 'يرجى إدخال رقم الهاتف / الموبايل.';
    }

    if (empty($password)) {
        $errors['password'] = 'يرجى إدخال كلمة المرور.';
    } elseif (strlen($password) < 6) {
        $errors['password'] = 'يجب ألا تقل كلمة المرور عن 6 أحرف.';
    }

    if ($password !== $confirmPassword) {
        $errors['confirm_password'] = 'كلمتا المرور غير متطابقتين.';
    }

    // 4. Check if email already exists in MySQL
    if (empty($errors)) {
        try {
            $pdo = getDBConnection();
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                $errors['email'] = 'هذا البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول مباشرة.';
            }
        } catch (PDOException $e) {
            $errors[] = 'حدث خطأ في فحص توفر الحساب بقاعدة البيانات.';
        }
    }

    // 5. Insert new user into MySQL with hashed password
    if (empty($errors)) {
        try {
            $userRole = in_array(strtolower($email), ['almetwalym9@gmail.com', 'almetwaly088@gmail.com', 'admin@carcare.eg']) ? 'admin' : 'customer';
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$fullName, $email, $phone, $hashedPassword, $userRole]);

            setFlash('success', 'تم إنشاء حسابك بنجاح في كار كير مصر! يمكنك الآن تسجيل الدخول.');
            header('Location: ' . baseUrl('login.php?registered=1'));
            exit;
        } catch (PDOException $e) {
            $errors[] = 'فشل تسجيل الحساب: ' . $e->getMessage();
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="auth-wrapper">
  <div class="auth-card">
    <div class="auth-header">
      <h1>إنشاء حساب عميل جديد</h1>
      <p>سجل بياناتك لإضافة سياراتك وحجز مواعيد الصيانة الدورية بسهولة</p>
    </div>

    <?php if (!empty($errors) && isset($errors[0])): ?>
      <div class="alert alert-error">
        <div><?= e($errors[0]) ?></div>
      </div>
    <?php endif; ?>

    <form action="<?= baseUrl('register.php') ?>" method="POST" class="validate-form" novalidate id="register-form">
      <?= csrfField() ?>

      <div class="form-group">
        <label for="full_name" class="form-label">الاسم بالكامل <span class="req">*</span></label>
        <input type="text" 
               id="full_name" 
               name="full_name" 
               class="form-control <?= isset($errors['full_name']) ? 'error' : '' ?>" 
               placeholder="مثال: أحمد السيد الشناوي" 
               value="<?= e($fullName) ?>" 
               required>
        <?php if (isset($errors['full_name'])): ?>
          <span class="form-error"><?= e($errors['full_name']) ?></span>
        <?php endif; ?>
      </div>

      <div class="form-group">
        <label for="email" class="form-label">البريد الإلكتروني <span class="req">*</span></label>
        <input type="email" 
               id="email" 
               name="email" 
               class="form-control <?= isset($errors['email']) ? 'error' : '' ?>" 
               placeholder="name@example.com" 
               value="<?= e($email) ?>" 
               required>
        <?php if (isset($errors['email'])): ?>
          <span class="form-error"><?= e($errors['email']) ?></span>
        <?php endif; ?>
      </div>

      <div class="form-group">
        <label for="phone" class="form-label">رقم الموبايل المصري <span class="req">*</span></label>
        <input type="tel" 
               id="phone" 
               name="phone" 
               class="form-control <?= isset($errors['phone']) ? 'error' : '' ?>" 
               placeholder="مثال: 01023456789" 
               value="<?= e($phone) ?>" 
               required>
        <?php if (isset($errors['phone'])): ?>
          <span class="form-error"><?= e($errors['phone']) ?></span>
        <?php endif; ?>
      </div>

      <div class="form-group">
        <label for="password" class="form-label">كلمة المرور <span class="req">*</span></label>
        <div class="password-input-wrap">
          <input type="password" 
                 id="password" 
                 name="password" 
                 class="form-control <?= isset($errors['password']) ? 'error' : '' ?>" 
                 placeholder="6 أحرف على الأقل" 
                 required>
          <button type="button" class="password-toggle-btn" data-target="password">إظهار</button>
        </div>
        <?php if (isset($errors['password'])): ?>
          <span class="form-error"><?= e($errors['password']) ?></span>
        <?php endif; ?>
      </div>

      <div class="form-group">
        <label for="confirm_password" class="form-label">تأكيد كلمة المرور <span class="req">*</span></label>
        <div class="password-input-wrap">
          <input type="password" 
                 id="confirm_password" 
                 name="confirm_password" 
                 class="form-control <?= isset($errors['confirm_password']) ? 'error' : '' ?>" 
                 placeholder="أعد كتابة كلمة المرور" 
                 required>
          <button type="button" class="password-toggle-btn" data-target="confirm_password">إظهار</button>
        </div>
        <?php if (isset($errors['confirm_password'])): ?>
          <span class="form-error"><?= e($errors['confirm_password']) ?></span>
        <?php endif; ?>
      </div>

      <button type="submit" class="btn btn-primary btn-block" style="margin-top:1.5rem;" id="submit-register-btn">
        إنشاء حساب عميل
      </button>

      <div style="text-align:center; margin-top:1.5rem; font-size:0.92rem; color:var(--text-muted);">
        لديك حساب بالفعل؟ <a href="<?= baseUrl('login.php') ?>" style="font-weight:700;">تسجيل الدخول هنا</a>
      </div>
    </form>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
