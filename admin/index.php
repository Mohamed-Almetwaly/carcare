<?php
/**
 * CarCare Egypt - Admin Dashboard Overview
 * لوحة تحكم الإدارة والورشة - كار كير مصر
 */
$pageTitle = "لوحة تحكم الإدارة | كار كير مصر";
$activeNav = "admin-overview";

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

// Strict Admin Access Control
requireRole('admin');

$pdo = getDBConnection();

// Fetch Admin Statistics from MySQL
try {
    // 1. Total Appointments
    $stmt = $pdo->query("SELECT COUNT(*) FROM appointments");
    $totalAppointments = (int)$stmt->fetchColumn();

    // 2. Total Customers
    $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'customer'");
    $totalCustomers = (int)$stmt->fetchColumn();

    // 3. Total Registered Cars
    $stmt = $pdo->query("SELECT COUNT(*) FROM cars");
    $totalCars = (int)$stmt->fetchColumn();

    // 4. Total Services Available
    $stmt = $pdo->query("SELECT COUNT(*) FROM services");
    $totalServices = (int)$stmt->fetchColumn();

    // 5. Total Estimated Revenue (from Confirmed and Completed appointments)
    $stmt = $pdo->query("
        SELECT COALESCE(SUM(s.price), 0) 
        FROM appointments a 
        JOIN services s ON a.service_id = s.id 
        WHERE a.status IN ('Confirmed', 'In Progress', 'Completed')
    ");
    $totalRevenue = (float)$stmt->fetchColumn();

    // 6. Pending Appointments requiring attention
    $stmt = $pdo->query("SELECT COUNT(*) FROM appointments WHERE status = 'Pending'");
    $pendingCount = (int)$stmt->fetchColumn();

    // 7. Recent Appointments (Last 7)
    $stmt = $pdo->query("
        SELECT a.*, u.full_name as customer_name, u.phone as customer_phone, u.email as customer_email,
               c.brand, c.model, c.year, c.license_plate, 
               s.name as service_name, s.price as service_price
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        JOIN cars c ON a.car_id = c.id
        JOIN services s ON a.service_id = s.id
        ORDER BY a.id DESC
        LIMIT 7
    ");
    $recentAppointments = $stmt->fetchAll();

    // 8. Recent Unread Messages
    $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY id DESC LIMIT 4");
    $recentMessages = $stmt->fetchAll();

} catch (PDOException $e) {
    $totalAppointments = 0;
    $totalCustomers = 0;
    $totalCars = 0;
    $totalServices = 0;
    $totalRevenue = 0;
    $pendingCount = 0;
    $recentAppointments = [];
    $recentMessages = [];
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="dashboard-layout container">
  <!-- Admin Sidebar -->
  <aside class="dashboard-sidebar">
    <div class="dashboard-user-card" style="border-right:4px solid var(--accent);">
      <div class="user-avatar-circle" style="background:var(--accent); font-weight:800;">
        إد
      </div>
      <div class="user-name">إدارة كار كير مصر</div>
      <div class="user-email" style="color:var(--accent); font-weight:700;">م. محمد متولي - المدير الفني</div>
    </div>

    <nav class="sidebar-nav">
      <a href="<?= baseUrl('admin/index.php') ?>" class="sidebar-link active">
        <span>📊</span> نظرة عامة على الورشة
      </a>
      <a href="<?= baseUrl('admin/appointments.php') ?>" class="sidebar-link">
        <span>📅</span> إدارة مواعيد الصيانة
        <?php if ($pendingCount > 0): ?>
          <span class="badge badge-pending" style="margin-right:auto; font-size:0.75rem;"><?= $pendingCount ?> جديد</span>
        <?php endif; ?>
      </a>
      <a href="<?= baseUrl('admin/customers.php') ?>" class="sidebar-link">
        <span>👥</span> دليل وسجلات العملاء
      </a>
      <a href="<?= baseUrl('admin/services.php') ?>" class="sidebar-link">
        <span>🔧</span> باقات وخدمات الصيانة
      </a>
      <a href="<?= baseUrl('admin/messages.php') ?>" class="sidebar-link">
        <span>💬</span> استفسارات ورسائل العملاء
      </a>
      <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--border-color);">
        <a href="<?= baseUrl('index.php') ?>" class="sidebar-link" target="_blank">
          <span>🌐</span> زيارة واجهة الموقع العامة
        </a>
      </div>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="dashboard-content">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
      <div>
        <h1 style="font-size:1.75rem; font-weight:900; color:var(--dark); margin-bottom:0.25rem;">
          لوحة الإدارة الهندسية والتشغيل
        </h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          متابعة مباشرة لحارات الصيانة، الإيرادات بالجنيه المصري، طاقم الفنيين، وقوائم مواعيد العملاء.
        </p>
      </div>

      <a href="<?= baseUrl('admin/services.php?action=new') ?>" class="btn btn-primary btn-sm">
        <span>➕</span> إضافة باقة صيانة جديدة
      </a>
    </div>

    <!-- 5 Key Metrics Cards Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin-bottom:2rem;">
      <div class="stat-card">
        <div class="stat-card-label">إجمالي الحجوزات</div>
        <div class="stat-card-val"><?= number_format($totalAppointments) ?></div>
        <div style="font-size:0.8rem; color:var(--primary); margin-top:0.35rem; font-weight:700;">
          <?= $pendingCount ?> في انتظار التأكيد
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-label">العملاء المسجلون</div>
        <div class="stat-card-val"><?= number_format($totalCustomers) ?></div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.35rem;">حسابات نشطة بالقاهرة والجيزة</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-label">السيارات بالجراجات</div>
        <div class="stat-card-val"><?= number_format($totalCars) ?></div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.35rem;">سيارة مسجلة باللوحات</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-label">باقات الصيانة المعتمدة</div>
        <div class="stat-card-val"><?= number_format($totalServices) ?></div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.35rem;">خدمات بقائمة الأسعار</div>
      </div>

      <div class="stat-card" style="border-top:3px solid var(--accent);">
        <div class="stat-card-label">تقدير إيراد الصيانة (ج.م)</div>
        <div class="stat-card-val" style="color:var(--dark);"><?= formatPrice($totalRevenue) ?></div>
        <div style="font-size:0.8rem; color:var(--success); margin-top:0.35rem; font-weight:700;">المؤكدة والمكتملة</div>
      </div>
    </div>

    <!-- Recent Appointments Table -->
    <div class="table-card" style="margin-bottom:2.5rem;">
      <div class="table-card-header">
        <div>
          <h3 class="table-card-title">أحدث حجوزات الصيانة بالورشة</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">يمكنك تغيير حالة الصيانة مباشرة وسيتحدث السجل تلقائياً</p>
        </div>
        <a href="<?= baseUrl('admin/appointments.php') ?>" class="btn btn-secondary btn-sm">جميع الحجوزات &larr;</a>
      </div>

      <?php if (!empty($recentAppointments)): ?>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>كود الحجز</th>
                <th>اسم العميل</th>
                <th>السيارة واللوحة</th>
                <th>الخدمة المطلوبة</th>
                <th>الموعد المحدد</th>
                <th>التكلفة</th>
                <th>تحديث الحالة فورياً</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($recentAppointments as $apt): ?>
                <tr>
                  <td>
                    <span style="font-family:monospace; font-weight:800; color:var(--primary);">
                      <?= e($apt['reference_code']) ?>
                    </span>
                  </td>
                  <td>
                    <strong><?= e($apt['customer_name']) ?></strong><br>
                    <small style="color:var(--text-muted); font-family:sans-serif;"><?= e($apt['customer_phone']) ?></small>
                  </td>
                  <td>
                    <?= e($apt['brand']) ?> <?= e($apt['model']) ?> (<?= e($apt['year']) ?>)<br>
                    <small style="font-family:sans-serif; color:var(--text-muted); background:var(--bg-page); padding:0.1rem 0.35rem; border-radius:3px; border:1px solid var(--border-color); font-weight:700;">
                      <?= e($apt['license_plate']) ?>
                    </small>
                  </td>
                  <td>
                    <strong><?= e($apt['service_name']) ?></strong>
                  </td>
                  <td>
                    <?= formatDate($apt['appointment_date']) ?><br>
                    <small style="color:var(--text-muted);"><?= e($apt['appointment_time']) ?></small>
                  </td>
                  <td style="font-weight:800; color:var(--dark);"><?= formatPrice($apt['service_price']) ?></td>
                  <td>
                    <!-- Status selector with AJAX support -->
                    <select class="form-control ajax-status-select" 
                            style="padding:0.35rem 0.65rem; font-size:0.84rem; width:auto; font-weight:700;"
                            data-appointment-id="<?= $apt['id'] ?>"
                            data-url="<?= baseUrl('admin/appointments.php') ?>">
                      <option value="Pending" <?= $apt['status'] === 'Pending' ? 'selected' : '' ?>>قيد المراجعة</option>
                      <option value="Confirmed" <?= $apt['status'] === 'Confirmed' ? 'selected' : '' ?>>مؤكد هندسياً</option>
                      <option value="In Progress" <?= $apt['status'] === 'In Progress' ? 'selected' : '' ?>>جاري العمل بالورشة</option>
                      <option value="Completed" <?= $apt['status'] === 'Completed' ? 'selected' : '' ?>>مكتمل ومسلّم</option>
                      <option value="Cancelled" <?= $apt['status'] === 'Cancelled' ? 'selected' : '' ?>>ملغى</option>
                    </select>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php else: ?>
        <div class="empty-state">
          <p>لا توجد حجوزات صيانة مسجلة حتى الآن.</p>
        </div>
      <?php endif; ?>
    </div>

    <!-- Recent Contact Inquiries -->
    <div class="table-card">
      <div class="table-card-header">
        <h3 class="table-card-title">أحدث استفسارات العملاء الواردة</h3>
        <a href="<?= baseUrl('admin/messages.php') ?>" class="btn btn-secondary btn-sm">جميع الرسائل &larr;</a>
      </div>

      <?php if (!empty($recentMessages)): ?>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>اسم المرسل</th>
                <th>بيانات التواصل</th>
                <th>نص الرسالة / الاستفسار</th>
                <th>حالة القراءة</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($recentMessages as $msg): ?>
                <tr>
                  <td><strong><?= e($msg['name']) ?></strong></td>
                  <td>
                    <?= e($msg['email']) ?><br>
                    <small style="color:var(--text-muted); font-family:sans-serif;"><?= e($msg['phone']) ?></small>
                  </td>
                  <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    <?= e($msg['message']) ?>
                  </td>
                  <td>
                    <span class="badge <?= $msg['status'] === 'Unread' ? 'badge-pending' : 'badge-completed' ?>">
                      <?= $msg['status'] === 'Unread' ? 'غير مقروءة' : 'تم الرد' ?>
                    </span>
                  </td>
                  <td>
                    <a href="<?= baseUrl('admin/messages.php?view=' . $msg['id']) ?>" class="btn btn-secondary btn-sm" style="padding:0.25rem 0.5rem; font-size:0.8rem;">
                      مراجعة
                    </a>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php else: ?>
        <div class="empty-state">
          <p>لا توجد رسائل تواصل جديدة.</p>
        </div>
      <?php endif; ?>
    </div>
  </main>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
