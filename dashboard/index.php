<?php
/**
 * CarCare Egypt - Customer Dashboard Overview
 * لوحة تحكم العميل - كار كير مصر
 */
$pageTitle = "لوحة تحكم العميل | كار كير مصر";
$activeNav = "dashboard";

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

// Ensure user is logged in as customer
requireRole('customer');

$userId = currentUserId();
$user = currentUser();
$pdo = getDBConnection();

// Fetch customer stats
try {
    // Total cars
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM cars WHERE user_id = ?");
    $stmt->execute([$userId]);
    $totalCars = (int)$stmt->fetchColumn();

    // Total appointments
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM appointments WHERE user_id = ?");
    $stmt->execute([$userId]);
    $totalAppointments = (int)$stmt->fetchColumn();

    // Pending / Upcoming appointments
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM appointments WHERE user_id = ? AND status IN ('Pending', 'Confirmed', 'In Progress')");
    $stmt->execute([$userId]);
    $activeAppointments = (int)$stmt->fetchColumn();

    // Recent 5 appointments
    $stmt = $pdo->prepare("
        SELECT a.*, c.brand, c.model, c.year, c.license_plate, s.name as service_name, s.price as service_price
        FROM appointments a
        JOIN cars c ON a.car_id = c.id
        JOIN services s ON a.service_id = s.id
        WHERE a.user_id = ?
        ORDER BY a.appointment_date DESC, a.id DESC
        LIMIT 5
    ");
    $stmt->execute([$userId]);
    $recentAppointments = $stmt->fetchAll();

    // Customer cars list
    $stmt = $pdo->prepare("SELECT * FROM cars WHERE user_id = ? ORDER BY id DESC LIMIT 4");
    $stmt->execute([$userId]);
    $myCars = $stmt->fetchAll();

} catch (PDOException $e) {
    $totalCars = 0;
    $totalAppointments = 0;
    $activeAppointments = 0;
    $recentAppointments = [];
    $myCars = [];
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="dashboard-layout container">
  <!-- Sidebar Navigation -->
  <aside class="dashboard-sidebar">
    <div class="dashboard-user-card">
      <div class="user-avatar-circle">
        <?= mb_substr($user['full_name'], 0, 2, 'UTF-8') ?>
      </div>
      <div class="user-name"><?= e($user['full_name']) ?></div>
      <div class="user-email"><?= e($user['email']) ?></div>
      <div style="margin-top:0.35rem; font-size:0.82rem; color:var(--primary); font-weight:700;">عميل معتمد لدى كار كير مصر</div>
    </div>

    <nav class="sidebar-nav">
      <a href="<?= baseUrl('dashboard/index.php') ?>" class="sidebar-link active">
        <span>📊</span> نظرة عامة
      </a>
      <a href="<?= baseUrl('dashboard/cars.php') ?>" class="sidebar-link">
        <span>🚗</span> جراج سياراتي (<?= $totalCars ?>)
      </a>
      <a href="<?= baseUrl('dashboard/appointments.php') ?>" class="sidebar-link">
        <span>📅</span> مواعيدي وحجوزاتي
      </a>
      <a href="<?= baseUrl('dashboard/profile.php') ?>" class="sidebar-link">
        <span>⚙️</span> البيانات الشخصية
      </a>
      <a href="<?= baseUrl('booking.php') ?>" class="sidebar-link" style="color:var(--primary); font-weight:800; border-top:1px solid var(--border-color); margin-top:0.5rem; padding-top:0.75rem;">
        <span>➕</span> حجز صيانة جديدة
      </a>
    </nav>
  </aside>

  <!-- Main Content Area -->
  <main class="dashboard-content">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
      <div>
        <h1 style="font-size:1.75rem; font-weight:900; color:var(--dark); margin-bottom:0.25rem;">
          أهلاً بك، <?= e($user['full_name']) ?>! 👋
        </h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          مرحباً بك في لوحة تحكم حسابك؛ تابع حالة سياراتك، مواعيد الصيانة الدورية وسجل الفحص الفني.
        </p>
      </div>

      <div style="display:flex; gap:0.75rem;">
        <a href="<?= baseUrl('booking.php') ?>" class="btn btn-primary btn-sm">
          <span>📅</span> حجز موعد صيانة
        </a>
        <a href="<?= baseUrl('dashboard/cars.php?action=add') ?>" class="btn btn-secondary btn-sm">
          <span>🚗</span> إضافة سيارة
        </a>
      </div>
    </div>

    <!-- Quick Metric Cards -->
    <div class="stats-cards-grid">
      <div class="stat-card">
        <div class="stat-card-label">السيارات في جراجك</div>
        <div class="stat-card-val"><?= $totalCars ?></div>
        <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.35rem;">
          <a href="<?= baseUrl('dashboard/cars.php') ?>">إدارة السيارات &larr;</a>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-label">الحجوزات النشطة</div>
        <div class="stat-card-val" style="color:var(--primary);"><?= $activeAppointments ?></div>
        <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.35rem;">مجدولة أو قيد التنفيذ بالورشة</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-label">إجمالي الصيانات المكتملة</div>
        <div class="stat-card-val" style="color:var(--success);"><?= $totalAppointments ?></div>
        <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.35rem;">سجل الصيانة لدى كار كير مصر</div>
      </div>
    </div>

    <!-- Recent Appointments Table -->
    <div class="table-card" style="margin-bottom:2.5rem;">
      <div class="table-card-header">
        <h3 class="table-card-title">أحدث مواعيد الصيانة المسجلة</h3>
        <a href="<?= baseUrl('dashboard/appointments.php') ?>" class="btn btn-secondary btn-sm">عرض كل الحجوزات</a>
      </div>

      <?php if (!empty($recentAppointments)): ?>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>كود الحجز</th>
                <th>خدمة الصيانة</th>
                <th>السيارة</th>
                <th>التاريخ والوقت</th>
                <th>التكلفة التقديرية</th>
                <th>حالة الطلب</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($recentAppointments as $apt): ?>
                <tr>
                  <td>
                    <span style="font-family:monospace; font-weight:800; color:var(--dark);">
                      <?= e($apt['reference_code']) ?>
                    </span>
                  </td>
                  <td>
                    <strong><?= e($apt['service_name']) ?></strong>
                  </td>
                  <td>
                    <?= e($apt['brand']) ?> <?= e($apt['model']) ?> (<?= e($apt['year']) ?>)<br>
                    <small style="color:var(--text-muted); font-family:monospace;"><?= e($apt['license_plate']) ?></small>
                  </td>
                  <td>
                    <?= formatDate($apt['appointment_date']) ?><br>
                    <small style="color:var(--text-muted);"><?= e($apt['appointment_time']) ?></small>
                  </td>
                  <td style="font-weight:800; color:var(--primary);"><?= formatPrice($apt['service_price']) ?></td>
                  <td>
                    <span class="badge <?= getStatusBadgeClass($apt['status']) ?>">
                      <?= formatStatus($apt['status']) ?>
                    </span>
                  </td>
                  <td>
                    <a href="<?= baseUrl('dashboard/appointments.php?ref=' . urlencode($apt['reference_code'])) ?>" class="btn btn-secondary btn-sm" style="padding:0.25rem 0.65rem; font-size:0.8rem;">
                      التفاصيل
                    </a>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php else: ?>
        <div class="empty-state">
          <div class="empty-state-icon">📅</div>
          <h3>لا توجد مواعيد صيانة مسجلة حتى الآن</h3>
          <p>احجز موعد الصيانة الدورية أو غيار الزيت لسيارتك في أي من فروعنا بكل سهولة وبدون طوابير.</p>
          <a href="<?= baseUrl('booking.php') ?>" class="btn btn-primary btn-sm" style="margin-top:1rem;">احجز موعد صيانة الآن</a>
        </div>
      <?php endif; ?>
    </div>

    <!-- Quick Garage Preview -->
    <div class="table-card">
      <div class="table-card-header">
        <h3 class="table-card-title">جراج سياراتك المسجلة</h3>
        <a href="<?= baseUrl('dashboard/cars.php') ?>" class="btn btn-secondary btn-sm">إدارة الجراج</a>
      </div>

      <?php if (!empty($myCars)): ?>
        <div style="padding:1.5rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem;">
          <?php foreach ($myCars as $car): ?>
            <div style="background:var(--bg-page); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem;">
              <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:0.75rem;">
                <span style="font-size:1.5rem;">🚘</span>
                <span style="font-family:sans-serif; font-size:0.82rem; background:#fff; border:1px solid var(--border-color); padding:0.15rem 0.5rem; border-radius:4px; font-weight:800;">
                  <?= e($car['license_plate']) ?>
                </span>
              </div>
              <h4 style="font-size:1.05rem; font-weight:800; color:var(--dark); margin-bottom:0.25rem;">
                <?= e($car['brand']) ?> <?= e($car['model']) ?> (<?= e($car['year']) ?>)
              </h4>
              <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                قراءة العداد: <?= number_format($car['mileage'] ?? 0) ?> كم
              </div>
              <a href="<?= baseUrl('booking.php?car_id=' . $car['id']) ?>" class="btn btn-primary btn-sm btn-block">
                حجز موعد صيانة
              </a>
            </div>
          <?php endforeach; ?>
        </div>
      <?php else: ?>
        <div class="empty-state">
          <div class="empty-state-icon">🚗</div>
          <h3>جراجك لا يحتوي على سيارات مسجلة بعد</h3>
          <p>أضف سيارتك لتسهيل حجز الصيانة ومتابعة الفحص الفني الدوري وتغيير الزيوت.</p>
          <a href="<?= baseUrl('dashboard/cars.php') ?>" class="btn btn-primary btn-sm" style="margin-top:1rem;">إضافة سيارة جديدة</a>
        </div>
      <?php endif; ?>
    </div>
  </main>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
