<?php
/**
 * CarCare Egypt - Admin Customer Management Directory
 * دليل وسجلات العملاء والسيارات - كار كير مصر
 */
$pageTitle = "دليل العملاء | كار كير مصر";
$activeNav = "admin-customers";

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireRole('admin');

$pdo = getDBConnection();
$search = trim($_GET['search'] ?? '');

$sql = "
    SELECT u.*, 
           (SELECT COUNT(*) FROM cars c WHERE c.user_id = u.id) as car_count,
           (SELECT COUNT(*) FROM appointments a WHERE a.user_id = u.id) as appointment_count
    FROM users u
    WHERE u.role = 'customer'
";

$params = [];
if (!empty($search)) {
    $sql .= " AND (u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)";
    $term = '%' . $search . '%';
    $params = [$term, $term, $term];
}

$sql .= " ORDER BY u.created_at DESC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $customers = $stmt->fetchAll();
} catch (PDOException $e) {
    $customers = [];
}

// If viewing a specific customer modal via GET
$viewCustId = (int)($_GET['view'] ?? 0);
$selectedCustomer = null;
$selectedCustomerCars = [];
$selectedCustomerAppointments = [];

if ($viewCustId > 0) {
    $cStmt = $pdo->prepare("SELECT * FROM users WHERE id = ? AND role = 'customer'");
    $cStmt->execute([$viewCustId]);
    $selectedCustomer = $cStmt->fetch();

    if ($selectedCustomer) {
        // Fetch cars
        $carStmt = $pdo->prepare("SELECT * FROM cars WHERE user_id = ? ORDER BY id DESC");
        $carStmt->execute([$viewCustId]);
        $selectedCustomerCars = $carStmt->fetchAll();

        // Fetch appointments
        $aptStmt = $pdo->prepare("
            SELECT a.*, s.name as service_name, c.brand, c.model, c.license_plate 
            FROM appointments a
            JOIN services s ON a.service_id = s.id
            JOIN cars c ON a.car_id = c.id
            WHERE a.user_id = ?
            ORDER BY a.appointment_date DESC
        ");
        $aptStmt->execute([$viewCustId]);
        $selectedCustomerAppointments = $aptStmt->fetchAll();
    }
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
      <a href="<?= baseUrl('admin/index.php') ?>" class="sidebar-link">
        <span>📊</span> نظرة عامة على الورشة
      </a>
      <a href="<?= baseUrl('admin/appointments.php') ?>" class="sidebar-link">
        <span>📅</span> إدارة مواعيد الصيانة
      </a>
      <a href="<?= baseUrl('admin/customers.php') ?>" class="sidebar-link active">
        <span>👥</span> دليل وسجلات العملاء
      </a>
      <a href="<?= baseUrl('admin/services.php') ?>" class="sidebar-link">
        <span>🔧</span> باقات وخدمات الصيانة
      </a>
      <a href="<?= baseUrl('admin/messages.php') ?>" class="sidebar-link">
        <span>💬</span> استفسارات ورسائل العملاء
      </a>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="dashboard-content">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
      <div>
        <h1 style="font-size:1.75rem; font-weight:900; color:var(--dark); margin-bottom:0.25rem;">
          دليل وسجلات العملاء المسجلين
        </h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          قاعدة بيانات العملاء، بيانات التواصل المصرية، أسطول السيارات وسجل زيارات الصيانة السابقة.
        </p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="table-card" style="padding:1.25rem; margin-bottom:1.5rem;">
      <form action="<?= baseUrl('admin/customers.php') ?>" method="GET" style="display:flex; gap:1rem; align-items:center;">
        <input type="text" name="search" class="form-control" placeholder="ابحث باسم العميل، البريد الإلكتروني، أو رقم الموبايل المصري..." value="<?= e($search) ?>" style="flex:1;">
        <button type="submit" class="btn btn-secondary btn-sm">بحث</button>
        <?php if (!empty($search)): ?>
          <a href="<?= baseUrl('admin/customers.php') ?>" class="btn btn-secondary btn-sm" style="color:var(--danger);">إلغاء البحث</a>
        <?php endif; ?>
      </form>
    </div>

    <!-- Customers List Table -->
    <div class="table-card">
      <?php if (!empty($customers)): ?>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>اسم العميل</th>
                <th>البريد الإلكتروني</th>
                <th>رقم الموبايل</th>
                <th>السيارات المسجلة</th>
                <th>إجمالي الحجوزات</th>
                <th>تاريخ الانضمام</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($customers as $c): ?>
                <tr>
                  <td>
                    <strong><?= e($c['full_name']) ?></strong>
                  </td>
                  <td><?= e($c['email']) ?></td>
                  <td style="font-family:sans-serif;"><?= e($c['phone'] ?? 'غير مسجل') ?></td>
                  <td>
                    <span class="badge" style="background:#e0e7ff; color:#3730a3; font-weight:700;">
                      🚗 <?= $c['car_count'] ?> سيارة
                    </span>
                  </td>
                  <td>
                    <span class="badge" style="background:#f1f5f9; color:#334155; font-weight:700;">
                      📅 <?= $c['appointment_count'] ?> موعد
                    </span>
                  </td>
                  <td><?= formatDate($c['created_at']) ?></td>
                  <td>
                    <a href="<?= baseUrl('admin/customers.php?view=' . $c['id']) ?>" class="btn btn-secondary btn-sm" style="padding:0.25rem 0.6rem; font-size:0.8rem;">
                      عرض الملف
                    </a>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php else: ?>
        <div class="empty-state">
          <div class="empty-state-icon">👥</div>
          <h3>لم يتم العثور على عملاء</h3>
          <p>لا توجد حسابات عملاء تطابق كلمة البحث الحالية.</p>
        </div>
      <?php endif; ?>
    </div>
  </main>
</div>

<!-- Modal: Customer Profile Details & Vehicles -->
<?php if ($selectedCustomer): ?>
<div class="modal-overlay active" id="customer-view-modal">
  <div class="modal-card" style="max-width:700px;">
    <div class="modal-header">
      <h3>ملف العميل: <?= e($selectedCustomer['full_name']) ?></h3>
      <a href="<?= baseUrl('admin/customers.php') ?>" class="modal-close-btn">&times;</a>
    </div>
    <div class="modal-body">
      <!-- Contact summary -->
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; padding-bottom:1rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border-color); font-size:0.9rem;">
        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; display:block;">البريد الإلكتروني</span>
          <strong><?= e($selectedCustomer['email']) ?></strong>
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; display:block;">رقم الموبايل</span>
          <strong style="font-family:sans-serif;"><?= e($selectedCustomer['phone'] ?? 'غير مسجل') ?></strong>
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; display:block;">تاريخ التسجيل</span>
          <strong><?= formatDate($selectedCustomer['created_at']) ?></strong>
        </div>
      </div>

      <!-- Customer's Garage -->
      <h4 style="font-size:1.05rem; font-weight:800; margin-bottom:0.75rem; color:var(--dark);">
        جراج السيارات المسجلة (<?= count($selectedCustomerCars) ?> سيارة)
      </h4>
      <?php if (!empty($selectedCustomerCars)): ?>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; margin-bottom:1.5rem;">
          <?php foreach ($selectedCustomerCars as $car): ?>
            <div style="background:var(--bg-page); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.75rem;">
              <strong style="font-size:0.92rem; color:var(--dark); display:block;"><?= e($car['brand']) ?> <?= e($car['model']) ?> (<?= e($car['year']) ?>)</strong>
              <div style="font-family:sans-serif; font-size:0.82rem; color:var(--primary); font-weight:800;">لوحة: <?= e($car['license_plate']) ?></div>
              <div style="font-size:0.78rem; color:var(--text-muted);">العداد: <?= number_format($car['mileage'] ?? 0) ?> كم</div>
            </div>
          <?php endforeach; ?>
        </div>
      <?php else: ?>
        <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:1.5rem;">لا توجد سيارات مسجلة في جراج العميل حتى الآن.</p>
      <?php endif; ?>

      <!-- Customer's Appointments -->
      <h4 style="font-size:1.05rem; font-weight:800; margin-bottom:0.75rem; color:var(--dark);">
        سجل زيارات الصيانة (<?= count($selectedCustomerAppointments) ?> حجز)
      </h4>
      <?php if (!empty($selectedCustomerAppointments)): ?>
        <div class="table-responsive" style="max-height:220px; overflow-y:auto;">
          <table class="data-table" style="font-size:0.85rem;">
            <thead>
              <tr>
                <th>كود الحجز</th>
                <th>خدمة الصيانة</th>
                <th>السيارة</th>
                <th>تاريخ الحجز</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($selectedCustomerAppointments as $apt): ?>
                <tr>
                  <td style="font-family:monospace; font-weight:800;"><?= e($apt['reference_code']) ?></td>
                  <td><?= e($apt['service_name']) ?></td>
                  <td><?= e($apt['brand']) ?> <?= e($apt['model']) ?></td>
                  <td><?= formatDate($apt['appointment_date']) ?></td>
                  <td>
                    <span class="badge <?= getStatusBadgeClass($apt['status']) ?>">
                      <?= formatStatus($apt['status']) ?>
                    </span>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php else: ?>
        <p style="color:var(--text-muted); font-size:0.88rem;">لا توجد مواعيد صيانة سابقة لهذا العميل.</p>
      <?php endif; ?>
    </div>
    <div class="modal-footer">
      <a href="<?= baseUrl('admin/customers.php') ?>" class="btn btn-secondary btn-sm">إغلاق النافذة</a>
    </div>
  </div>
</div>
<?php endif; ?>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
