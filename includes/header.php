<?php
/**
 * CarCare Egypt - Global Header Layout
 * الهيكل العلوي وشريط التنقل - كار كير مصر
 */
require_once __DIR__ . '/functions.php';
require_once __DIR__ . '/auth.php';

$pageTitle = $pageTitle ?? 'كار كير مصر | المركز المعتمد لصيانة وخدمة السيارات';
$activeNav = $activeNav ?? 'home';
$user = currentUser();
$flash = getFlash();
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($pageTitle) ?></title>
  <meta name="description" content="مركز كار كير مصر (CarCare Egypt) - المركز الهندسي المعتمد لصيانة السيارات، غيار زيوت شل وموبيل التخليقية، فحص كمبيوتر Launch و Autel، صيانة الفرامل والعفشة والتكييف، وحجز مواعيد الصيانة إلكترونياً.">
  
  <!-- Google Fonts: Cairo & Alexandria for Authentic Arabic Automotive Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">

  <!-- CSS Stylesheet -->
  <link rel="stylesheet" href="<?= baseUrl('assets/css/style.css') ?>">
</head>
<body>

  <!-- Top Announcement Bar (Egyptian Hotline & Working Hours) -->
  <div style="background:#0f172a; color:#94a3b8; font-size:0.84rem; padding:0.45rem 0; border-bottom:1px solid rgba(255,255,255,0.08);">
    <div class="container" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
      <div style="display:flex; align-items:center; gap:1.25rem;">
        <span>📞 الخط الساخن: <strong style="color:#f97316; font-family:sans-serif; font-size:0.95rem;">19824</strong></span>
        <span style="display:none; @media(min-width:640px){display:inline;}">📍 فروعنا: التجمع الخامس &bull; مدينة نصر &bull; المهندسين &bull; الشيخ زايد</span>
      </div>
      <div style="display:flex; align-items:center; gap:1rem;">
        <span>🕒 يومياً من 9:00 ص إلى 10:00 م</span>
        <span style="color:#10b981; font-weight:700;">● الورشة تستقبل السيارات الآن</span>
      </div>
    </div>
  </div>

  <!-- Top Header Navigation Bar -->
  <header class="site-header">
    <div class="container header-inner">
      <!-- Brand Logo -->
      <a href="<?= baseUrl('index.php') ?>" class="brand-logo" id="header-brand-logo">
        <div class="logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2"></path>
            <circle cx="7" cy="17" r="2"></circle>
            <path d="M9 17h6"></path>
            <circle cx="17" cy="17" r="2"></circle>
          </svg>
        </div>
        <div style="display:flex; flex-direction:column;">
          <span style="font-weight:900; letter-spacing:-0.01em; font-size:1.3rem;">كار كير <span class="accent">مصر</span></span>
          <span style="font-size:0.7rem; color:var(--text-muted); font-weight:600; margin-top:-3px;">CarCare Egypt Auto Center</span>
        </div>
      </a>

      <!-- Desktop & Mobile Navigation Links -->
      <nav class="main-nav" id="main-nav-menu">
        <a href="<?= baseUrl('index.php') ?>" class="nav-link <?= $activeNav === 'home' ? 'active' : '' ?>">الرئيسية</a>
        <a href="<?= baseUrl('services.php') ?>" class="nav-link <?= $activeNav === 'services' ? 'active' : '' ?>">خدمات الصيانة والأسعار</a>
        <a href="<?= baseUrl('index.php#how-it-works') ?>" class="nav-link">خطوات الحجز</a>
        <a href="<?= baseUrl('about.php') ?>" class="nav-link <?= $activeNav === 'about' ? 'active' : '' ?>">عن المركز والفروع</a>
        <a href="<?= baseUrl('contact.php') ?>" class="nav-link <?= $activeNav === 'contact' ? 'active' : '' ?>">اتصل بنا</a>

        <?php if (isLoggedIn()): ?>
          <?php if (isAdmin()): ?>
            <a href="<?= baseUrl('admin/index.php') ?>" class="nav-link <?= strpos($activeNav, 'admin') === 0 ? 'active' : '' ?>" style="color:var(--accent); font-weight:800;">لوحة الإدارة</a>
          <?php else: ?>
            <a href="<?= baseUrl('dashboard/index.php') ?>" class="nav-link <?= strpos($activeNav, 'dashboard') === 0 ? 'active' : '' ?>">لوحة التحكم</a>
            <a href="<?= baseUrl('dashboard/cars.php') ?>" class="nav-link <?= $activeNav === 'my-cars' ? 'active' : '' ?>">جراج سياراتي</a>
            <a href="<?= baseUrl('dashboard/appointments.php') ?>" class="nav-link <?= $activeNav === 'my-appointments' ? 'active' : '' ?>">حجوزاتي</a>
          <?php endif; ?>
        <?php endif; ?>
      </nav>

      <!-- Header Actions (Login / Register / User / Book Now) -->
      <div class="header-actions">
        <?php if (isLoggedIn()): ?>
          <span style="font-size:0.88rem; color:var(--text-muted); display:none; @media(min-width:640px){display:inline;}">
            أهلاً، <strong><?= e($user['full_name']) ?></strong>
          </span>
          <a href="<?= baseUrl('logout.php') ?>" class="btn btn-secondary btn-sm" id="header-logout-btn">خروج</a>
          <?php if (!isAdmin()): ?>
            <a href="<?= baseUrl('booking.php') ?>" class="btn btn-primary btn-sm" id="header-book-btn">حجز صيانة</a>
          <?php endif; ?>
        <?php else: ?>
          <a href="<?= baseUrl('login.php') ?>" class="btn btn-secondary btn-sm" id="header-login-btn">تسجيل الدخول</a>
          <a href="<?= baseUrl('register.php') ?>" class="btn btn-secondary btn-sm" id="header-register-btn" style="display:none; @media(min-width:768px){display:inline-flex;}">حساب جديد</a>
          <a href="<?= baseUrl('booking.php') ?>" class="btn btn-primary btn-sm" id="header-book-btn">احجز موعد صيانة</a>
        <?php endif; ?>

        <!-- Mobile Menu Toggle Button -->
        <button type="button" class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="تبديل القائمة">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Flash Notification Message Container -->
  <?php if ($flash): ?>
    <div class="container" style="margin-top:1.5rem;">
      <div class="alert alert-<?= e($flash['type']) ?>" role="alert">
        <div>
          <?= e($flash['message']) ?>
        </div>
        <button type="button" class="alert-close" aria-label="إغلاق التنبيه">&times;</button>
      </div>
    </div>
  <?php endif; ?>

  <!-- Main Body Content Area -->
  <main class="main-content">
