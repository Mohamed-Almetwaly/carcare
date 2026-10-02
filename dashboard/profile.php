<?php
/**
 * CarCare Egypt - Customer Profile Settings
 * إعدادات الملف الشخصي والأمان - كار كير مصر
 */
$pageTitle = "إعدادات الحساب | كار كير مصر";
$activeNav = "profile";

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireRole('customer');

$userId = currentUserId();
$user = currentUser();
$pdo = getDBConnection();
$errors = [];

// Handle Profile Updates
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $errors[] = 'رمز الأمان غير صالح. يرجى إعادة المحاولة.';
    } else {
        $formType = $_POST['form_type'] ?? '';

        // 1. Update basic information
        if ($formType === 'info') {
            $fullName = trim($_POST['full_name'] ?? '');
            $phone    = trim($_POST['phone'] ?? '');

            if (empty($fullName)) {
                $errors[] = 'لا يمكن ترك الاسم بالكامل فارغاً.';
            } else {
                try {
                    $stmt = $pdo->prepare("UPDATE users SET full_name = ?, phone = ? WHERE id = ?");
                    $stmt->execute([$fullName, $phone, $userId]);
                    
                    // Refresh session data
                    $_SESSION['user']['full_name'] = $fullName;
                    $_SESSION['user']['phone'] = $phone;
                    $user = $_SESSION['user'];

                    setFlash('success', 'تم تحديث بيانات الملف الشخصي بنجاح!');
                    header('Location: ' . baseUrl('dashboard/profile.php'));
                    exit;
                } catch (PDOException $e) {
                    $errors[] = 'فشل تحديث البيانات: ' . $e->getMessage();
                }
            }
        }

        // 2. Change password
        elseif ($formType === 'password') {
            $currentPassword = $_POST['current_password'] ?? '';
            $newPassword     = $_POST['new_password'] ?? '';
            $confirmPassword = $_POST['confirm_password'] ?? '';

            if (empty($currentPassword) || empty($newPassword)) {
                $errors[] = 'يرجى ملء جميع حقول كلمة المرور.';
            } elseif (strlen($newPassword) < 6) {
                $errors[] = 'يجب ألا تقل كلمة المرور الجديدة عن 6 أحرف.';
            } elseif ($newPassword !== $confirmPassword) {
                $errors[] = 'كلمتا المرور الجديدتان غير متطابقتين.';
            } else {
                // Verify current password from database
                $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
                $stmt->execute([$userId]);
                $storedHash = $stmt->fetchColumn();

                if (!password_verify($currentPassword, $storedHash)) {
                    $errors[] = 'كلمة المرور الحالية غير صحيحة.';
                } else {
                    try {
                        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
                        $upd = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                        $upd->execute([$newHash, $userId]);

                        setFlash('success', 'تم تغيير كلمة المرور بنجاح! احتفظ بكلمة المرور الجديدة في مكان آمن.');
                        header('Location: ' . baseUrl('dashboard/profile.php'));
                        exit;
                    } catch (PDOException $e) {
                        $errors[] = 'فشل تغيير كلمة المرور: ' . $e->getMessage();
                    }
                }
            }
        }
    }
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="dashboard-layout container">
  <!-- Sidebar -->
  <aside class="dashboard-sidebar">
    <div class="dashboard-user-card">
      <div class="user-avatar-circle">
        <?= mb_substr($user['full_name'], 0, 2, 'UTF-8') ?>
      </div>
      <div class="user-name"><?= e($user['full_name']) ?></div>
      <div class="user-email"><?= e($user['email']) ?></div>
    </div>

    <nav class="sidebar-nav">
      <a href="<?= baseUrl('dashboard/index.php') ?>" class="sidebar-link">
        <span>📊</span> نظرة عامة
      </a>
      <a href="<?= baseUrl('dashboard/cars.php') ?>" class="sidebar-link">
        <span>🚗</span> جراج سياراتي
      </a>
      <a href="<?= baseUrl('dashboard/appointments.php') ?>" class="sidebar-link">
        <span>📅</span> مواعيدي وحجوزاتي
      </a>
      <a href="<?= baseUrl('dashboard/profile.php') ?>" class="sidebar-link active">
        <span>⚙️</span> البيانات الشخصية
      </a>
      <a href="<?= baseUrl('booking.php') ?>" class="sidebar-link" style="color:var(--primary); font-weight:800; border-top:1px solid var(--border-color); margin-top:0.5rem; padding-top:0.75rem;">
        <span>➕</span> حجز صيانة جديدة
      </a>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="dashboard-content">
    <div style="margin-bottom:2rem;">
      <h1 style="font-size:1.75rem; font-weight:900; color:var(--dark); margin-bottom:0.25rem;">
        إعدادات الملف الشخصي والأمان
      </h1>
      <p style="color:var(--text-muted); font-size:0.95rem;">
        تعديل بيانات التواصل ورقم الموبايل وتحديث كلمة مرور حسابك لدى مركز كار كير مصر.
      </p>
    </div>

    <?php if (!empty($errors)): ?>
      <div class="alert alert-error">
        <div><?= e($errors[0]) ?></div>
      </div>
    <?php endif; ?>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
      <!-- Profile Information Card -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-sm);">
        <h3 style="font-size:1.25rem; font-weight:800; color:var(--dark); margin-bottom:1.25rem;">البيانات الشخصية</h3>

        <form action="<?= baseUrl('dashboard/profile.php') ?>" method="POST" class="validate-form" novalidate>
          <?= csrfField() ?>
          <input type="hidden" name="form_type" value="info">

          <div class="form-group">
            <label for="full_name" class="form-label">الاسم بالكامل <span class="req">*</span></label>
            <input type="text" id="full_name" name="full_name" class="form-control" value="<?= e($user['full_name']) ?>" required>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">البريد الإلكتروني المسجل</label>
            <input type="email" id="email" class="form-control" value="<?= e($user['email']) ?>" disabled style="background:var(--bg-page); cursor:not-allowed;">
            <small style="color:var(--text-muted); font-size:0.78rem;">البريد الإلكتروني هو المعرف الأساسي لتسجيل الدخول ولا يمكن تعديله لأسباب أمنية.</small>
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">رقم الموبايل المصري للتواصل</label>
            <input type="tel" id="phone" name="phone" class="form-control" value="<?= e($user['phone'] ?? '') ?>" placeholder="مثال: 01023456789">
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top:1rem;">
            حفظ البيانات الشخصية
          </button>
        </form>
      </div>

      <!-- Change Password Card -->
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-sm);">
        <h3 style="font-size:1.25rem; font-weight:800; color:var(--dark); margin-bottom:1.25rem;">تغيير كلمة المرور</h3>

        <form action="<?= baseUrl('dashboard/profile.php') ?>" method="POST" class="validate-form" novalidate>
          <?= csrfField() ?>
          <input type="hidden" name="form_type" value="password">

          <div class="form-group">
            <label for="current_password" class="form-label">كلمة المرور الحالية <span class="req">*</span></label>
            <input type="password" id="current_password" name="current_password" class="form-control" required>
          </div>

          <div class="form-group">
            <label for="new_password" class="form-label">كلمة المرور الجديدة <span class="req">*</span></label>
            <input type="password" id="new_password" name="new_password" class="form-control" placeholder="6 أحرف على الأقل" required>
          </div>

          <div class="form-group">
            <label for="confirm_password" class="form-label">تأكيد كلمة المرور الجديدة <span class="req">*</span></label>
            <input type="password" id="confirm_password" name="confirm_password" class="form-control" required>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top:1rem;">
            تحديث كلمة المرور
          </button>
        </form>
      </div>
    </div>
  </main>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
