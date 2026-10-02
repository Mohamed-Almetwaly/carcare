<?php
/**
 * CarCare Egypt - Contact & Support
 * اتصل بنا وفروعنا - كار كير مصر
 */
$pageTitle = "اتصل بنا وفروعنا | كار كير مصر - خدمة العملاء وحجز الصيانة";
$activeNav = "contact";

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

$errors = [];
$name = '';
$email = '';
$phone = '';
$message = '';
$submitted = false;

// Pre-fill user data if logged in
$user = currentUser();
if ($user) {
    $name = $user['full_name'];
    $email = $user['email'];
    $phone = $user['phone'] ?? '';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $errors[] = 'رمز الأمان غير صالح. يرجى إعادة تحميل الصفحة.';
    } else {
        $name    = trim($_POST['name'] ?? '');
        $email   = trim($_POST['email'] ?? '');
        $phone   = trim($_POST['phone'] ?? '');
        $message = trim($_POST['message'] ?? '');

        if (empty($name)) {
            $errors['name'] = 'يرجى كتابة الاسم بالكامل.';
        }

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'يرجى إدخال بريد إلكتروني صحيح.';
        }

        if (empty($message)) {
            $errors['message'] = 'يرجى كتابة استفسارك أو رسالتك.';
        }

        if (empty($errors)) {
            try {
                $pdo = getDBConnection();
                $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, phone, message, status) VALUES (?, ?, ?, ?, 'Unread')");
                $stmt->execute([$name, $email, $phone, $message]);

                $submitted = true;
                setFlash('success', 'شكراً لك! تم استلام رسالتك وسيتواصل معك مهندس خدمة العملاء خلال ساعتي عمل.');
                // Clear message box
                $message = '';
            } catch (PDOException $e) {
                $errors[] = 'فشل إرسال الرسالة: ' . $e->getMessage();
            }
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="container section">
  <div class="section-header">
    <span class="section-tag">قنوات التواصل المباشرة</span>
    <h1 class="section-title">فروعنا وخدمة العملاء في مصر</h1>
    <p class="section-subtitle">
      سواء كنت ترغب في استشارة هندسية حول أعطال سيارتك، الاستفسار عن أسعار الصيانة الدورية، أو تنسيق زيارة لصيانة أسطول شركات، فريقنا جاهز لمساعدتك.
    </p>
  </div>

  <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:3rem;">
    <!-- Left: Contact Form -->
    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2.5rem; box-shadow:var(--shadow-md);">
      <h2 style="font-size:1.4rem; font-weight:800; color:var(--dark); margin-bottom:1.5rem;">
        أرسل استفسارك لمهندسي الصيانة
      </h2>

      <?php if (!empty($errors) && isset($errors[0])): ?>
        <div class="alert alert-error">
          <div><?= e($errors[0]) ?></div>
        </div>
      <?php endif; ?>

      <form action="<?= baseUrl('contact.php') ?>" method="POST" class="validate-form" novalidate id="contact-form">
        <?= csrfField() ?>

        <div class="form-row">
          <div class="form-group">
            <label for="name" class="form-label">الاسم بالكامل <span class="req">*</span></label>
            <input type="text" 
                   id="name" 
                   name="name" 
                   class="form-control <?= isset($errors['name']) ? 'error' : '' ?>" 
                   value="<?= e($name) ?>" 
                   placeholder="مثال: أحمد السيد" 
                   required>
            <?php if (isset($errors['name'])): ?>
              <span class="form-error"><?= e($errors['name']) ?></span>
            <?php endif; ?>
          </div>

          <div class="form-group">
            <label for="phone" class="form-label">رقم الموبايل / واتساب</label>
            <input type="tel" 
                   id="phone" 
                   name="phone" 
                   class="form-control" 
                   value="<?= e($phone) ?>" 
                   placeholder="مثال: 01023456789">
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">البريد الإلكتروني <span class="req">*</span></label>
          <input type="email" 
                 id="email" 
                 name="email" 
                 class="form-control <?= isset($errors['email']) ? 'error' : '' ?>" 
                 value="<?= e($email) ?>" 
                 placeholder="name@example.com" 
                 required>
          <?php if (isset($errors['email'])): ?>
            <span class="form-error"><?= e($errors['email']) ?></span>
          <?php endif; ?>
        </div>

        <div class="form-group">
          <label for="message" class="form-label">تفاصيل الاستفسار أو شكوى السيارة <span class="req">*</span></label>
          <textarea id="message" 
                    name="message" 
                    rows="4" 
                    class="form-control <?= isset($errors['message']) ? 'error' : '' ?>" 
                    placeholder="اكتب ماركة وموديل سيارتك والأعراض أو الخدمة التي ترغب بالاستفسار عنها..." 
                    required><?= e($message) ?></textarea>
          <?php if (isset($errors['message'])): ?>
            <span class="form-error"><?= e($errors['message']) ?></span>
          <?php endif; ?>
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="margin-top:1.25rem;" id="submit-contact-btn">
          إرسال الاستفسار
        </button>
      </form>
    </div>

    <!-- Right: Workshop Details & Hours -->
    <div>
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-sm); margin-bottom:1.5rem;">
        <h3 style="font-size:1.25rem; font-weight:800; color:var(--dark); margin-bottom:1.25rem;">بيانات الاتصال المباشرة</h3>
        
        <div style="display:flex; gap:1rem; margin-bottom:1.25rem;">
          <div style="font-size:1.35rem;">📞</div>
          <div>
            <strong style="color:var(--dark); display:block;">الخط الساخن الموحد</strong>
            <span style="color:var(--text-muted); font-size:0.95rem; font-family:sans-serif; font-weight:700;">19824</span>
          </div>
        </div>

        <div style="display:flex; gap:1rem; margin-bottom:1.25rem;">
          <div style="font-size:1.35rem;">💬</div>
          <div>
            <strong style="color:var(--dark); display:block;">واتساب خدمة العملاء</strong>
            <a href="https://wa.me/201030705465" target="_blank" style="color:#16a34a; font-size:0.95rem; font-family:sans-serif; font-weight:700; text-decoration:none;" dir="ltr">01030705465</a>
          </div>
        </div>

        <div style="display:flex; gap:1rem; margin-bottom:1.25rem;">
          <div style="font-size:1.35rem;">✉️</div>
          <div>
            <strong style="color:var(--dark); display:block;">بريد الإدارة المعتمد (Gmail)</strong>
            <a href="mailto:almetwaly088@gmail.com" style="color:#2563eb; font-size:0.92rem; font-family:sans-serif; font-weight:700; text-decoration:none;" dir="ltr">almetwaly088@gmail.com</a>
          </div>
        </div>

        <div style="display:flex; gap:1rem; margin-bottom:1.25rem;">
          <div style="font-size:1.35rem;">🏢</div>
          <div>
            <strong style="color:var(--dark); display:block;">الإدارة والفرع الرئيسي</strong>
            <span style="color:var(--text-muted); font-size:0.92rem;">شارع التسعين الجنوبي، مجمع البنوك، التجمع الخامس، القاهرة الجديدة</span>
          </div>
        </div>
      </div>

      <div style="background:#0f172a; color:#fff; border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-sm);">
        <h3 style="font-size:1.2rem; font-weight:800; margin-bottom:1rem; color:#60a5fa;">مواعيد استقبال السيارات</h3>
        <p style="font-size:0.92rem; color:#cbd5e1; line-height:1.7; margin-bottom:1rem;">
          <strong>من السبت إلى الخميس:</strong><br>
          من الساعة 9:00 صباحاً حتى 10:00 مساءً
        </p>
        <p style="font-size:0.92rem; color:#cbd5e1; line-height:1.7; margin-bottom:1.25rem;">
          <strong>يوم الجمعة:</strong><br>
          من الساعة 1:30 ظهراً حتى 9:00 مساءً (بعد صلاة الجمعة)
        </p>
        <div style="font-size:0.85rem; color:#f97316; font-weight:700;">
          ⚡ خدمة الطوارئ السريعة متوفرة على مدار 24 ساعة عبر الخط الساخن.
        </div>
      </div>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
