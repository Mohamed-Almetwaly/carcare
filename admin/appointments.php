<?php
/**
 * CarCare Egypt - Admin Appointments Manager
 * إدارة مواعيد وحجوزات الصيانة - كار كير مصر
 */
$pageTitle = "إدارة مواعيد الصيانة | كار كير مصر";
$activeNav = "admin-appointments";

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireRole('admin');

$pdo = getDBConnection();
$errors = [];

// Handle Status Change (Standard POST or AJAX)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $appointmentId = (int)($_POST['appointment_id'] ?? 0);
    $newStatus     = trim($_POST['status'] ?? '');
    $isAjax        = isset($_POST['ajax']) && $_POST['ajax'] === '1';

    $allowedStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

    if (!in_array($newStatus, $allowedStatuses)) {
        if ($isAjax) {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'حالة غير صالحة']);
            exit;
        }
        $errors[] = 'حالة الحجز المختارة غير صالحة.';
    } else {
        try {
            $stmt = $pdo->prepare("UPDATE appointments SET status = ? WHERE id = ?");
            $stmt->execute([$newStatus, $appointmentId]);

            if ($isAjax) {
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => true,
                    'message' => 'تم تغيير حالة الموعد إلى ' . formatStatus($newStatus),
                    'status' => $newStatus,
                    'badge_class' => getStatusBadgeClass($newStatus)
                ]);
                exit;
            }

            setFlash('success', 'تم تحديث حالة الموعد #' . $appointmentId . ' إلى ' . formatStatus($newStatus));
            header('Location: ' . baseUrl('admin/appointments.php'));
            exit;
        } catch (PDOException $e) {
            if ($isAjax) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
                exit;
            }
            $errors[] = 'فشل تحديث الحالة: ' . $e->getMessage();
        }
    }
}

// Search and Filter logic
$statusFilter = $_GET['status'] ?? 'all';
$searchQuery  = trim($_GET['search'] ?? '');

$sql = "
    SELECT a.*, 
           u.full_name as customer_name, u.email as customer_email, u.phone as customer_phone,
           c.brand, c.model, c.year, c.license_plate, c.mileage,
           s.name as service_name, s.price as service_price, s.duration as service_duration
    FROM appointments a
    JOIN users u ON a.user_id = u.id
    JOIN cars c ON a.car_id = c.id
    JOIN services s ON a.service_id = s.id
    WHERE 1=1
";

$params = [];

if ($statusFilter !== 'all' && in_array($statusFilter, ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'])) {
    $sql .= " AND a.status = ?";
    $params[] = $statusFilter;
}

if (!empty($searchQuery)) {
    $sql .= " AND (a.reference_code LIKE ? OR u.full_name LIKE ? OR c.brand LIKE ? OR c.model LIKE ? OR c.license_plate LIKE ?)";
    $term = '%' . $searchQuery . '%';
    $params[] = $term;
    $params[] = $term;
    $params[] = $term;
    $params[] = $term;
    $params[] = $term;
}

$sql .= " ORDER BY a.appointment_date DESC, a.id DESC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $appointments = $stmt->fetchAll();
} catch (PDOException $e) {
    $appointments = [];
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
      <a href="<?= baseUrl('admin/appointments.php') ?>" class="sidebar-link active">
        <span>📅</span> إدارة مواعيد الصيانة
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
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="dashboard-content">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
      <div>
        <h1 style="font-size:1.75rem; font-weight:900; color:var(--dark); margin-bottom:0.25rem;">
          سجل وجدول مواعيد الصيانة
        </h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          متابعة وتحديث مراحل الفحص، قبول المواعيد، وتنسيق دخول السيارات لحارات العمل.
        </p>
      </div>
    </div>

    <?php if (!empty($errors)): ?>
      <div class="alert alert-error">
        <div><?= e($errors[0]) ?></div>
      </div>
    <?php endif; ?>

    <!-- Search & Filter Bar -->
    <div class="table-card" style="padding:1.25rem; margin-bottom:1.5rem;">
      <form action="<?= baseUrl('admin/appointments.php') ?>" method="GET" style="display:flex; flex-wrap:wrap; gap:1rem; align-items:center;">
        <div style="flex:2; min-width:240px;">
          <input type="text" name="search" class="form-control" placeholder="ابحث برقم الحجز، اسم العميل، رقم اللوحة، الماركة..." value="<?= e($searchQuery) ?>">
        </div>

        <div style="flex:1; min-width:180px;">
          <select name="status" class="form-control" onchange="this.form.submit()">
            <option value="all" <?= $statusFilter === 'all' ? 'selected' : '' ?>>كل الحالات</option>
            <option value="Pending" <?= $statusFilter === 'Pending' ? 'selected' : '' ?>>قيد المراجعة</option>
            <option value="Confirmed" <?= $statusFilter === 'Confirmed' ? 'selected' : '' ?>>مؤكد هندسياً</option>
            <option value="In Progress" <?= $statusFilter === 'In Progress' ? 'selected' : '' ?>>جاري العمل بالورشة</option>
            <option value="Completed" <?= $statusFilter === 'Completed' ? 'selected' : '' ?>>مكتمل ومسلّم</option>
            <option value="Cancelled" <?= $statusFilter === 'Cancelled' ? 'selected' : '' ?>>ملغى</option>
          </select>
        </div>

        <button type="submit" class="btn btn-secondary btn-sm">تصفية</button>
        <?php if (!empty($searchQuery) || $statusFilter !== 'all'): ?>
          <a href="<?= baseUrl('admin/appointments.php') ?>" class="btn btn-secondary btn-sm" style="color:var(--danger);">إلغاء التصفية</a>
        <?php endif; ?>
      </form>
    </div>

    <!-- Appointments Table -->
    <div class="table-card">
      <?php if (!empty($appointments)): ?>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>كود الحجز</th>
                <th>العميل</th>
                <th>السيارة</th>
                <th>الخدمة والتكلفة</th>
                <th>الموعد المحجوز</th>
                <th>الحالة الحالية</th>
                <th>تحديث الحالة</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($appointments as $apt): ?>
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
                    <strong><?= e($apt['service_name']) ?></strong><br>
                    <span style="color:var(--primary); font-weight:800;"><?= formatPrice($apt['service_price']) ?></span>
                  </td>
                  <td>
                    <span style="font-weight:700; color:var(--dark);"><?= formatDate($apt['appointment_date']) ?></span><br>
                    <small style="color:var(--text-muted);"><?= e($apt['appointment_time']) ?></small>
                  </td>
                  <td>
                    <span id="status-badge-<?= $apt['id'] ?>" class="badge <?= getStatusBadgeClass($apt['status']) ?>">
                      <?= formatStatus($apt['status']) ?>
                    </span>
                  </td>
                  <td>
                    <select class="form-control ajax-status-select" 
                            style="padding:0.3rem 0.6rem; font-size:0.82rem; width:auto; font-weight:700;"
                            data-appointment-id="<?= $apt['id'] ?>"
                            data-url="<?= baseUrl('admin/appointments.php') ?>">
                      <option value="Pending" <?= $apt['status'] === 'Pending' ? 'selected' : '' ?>>قيد المراجعة</option>
                      <option value="Confirmed" <?= $apt['status'] === 'Confirmed' ? 'selected' : '' ?>>مؤكد هندسياً</option>
                      <option value="In Progress" <?= $apt['status'] === 'In Progress' ? 'selected' : '' ?>>جاري العمل بالورشة</option>
                      <option value="Completed" <?= $apt['status'] === 'Completed' ? 'selected' : '' ?>>مكتمل ومسلّم</option>
                      <option value="Cancelled" <?= $apt['status'] === 'Cancelled' ? 'selected' : '' ?>>ملغى</option>
                    </select>
                  </td>
                  <td>
                    <button type="button" 
                            class="btn btn-secondary btn-sm" 
                            style="padding:0.25rem 0.6rem; font-size:0.8rem;"
                            onclick="openAdminAptModal(<?= htmlspecialchars(json_encode($apt, JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8') ?>)">
                      تفاصيل
                    </button>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php else: ?>
        <div class="empty-state">
          <div class="empty-state-icon">📅</div>
          <h3>لا توجد حجوزات مطابقة للبحث</h3>
          <p>لم يتم العثور على أي نتائج وفق معايير البحث أو التصفية الحالية.</p>
        </div>
      <?php endif; ?>
    </div>
  </main>
</div>

<!-- Modal: Admin Appointment Inspection -->
<div class="modal-overlay" id="admin-apt-modal">
  <div class="modal-card">
    <div class="modal-header">
      <h3>تفاصيل ملف فحص وحجز الصيانة</h3>
      <button type="button" class="modal-close-btn modal-close-trigger">&times;</button>
    </div>
    <div class="modal-body">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color);">
        <div>
          <span style="font-size:0.82rem; color:var(--text-muted); display:block;">كود الحجز:</span>
          <div id="adm-modal-ref" style="font-family:monospace; font-size:1.35rem; font-weight:900; color:var(--primary);">--</div>
        </div>
        <div id="adm-modal-status"></div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1.5rem; font-size:0.92rem;">
        <div>
          <span style="color:var(--text-muted); font-size:0.82rem; display:block;">اسم العميل:</span>
          <div id="adm-modal-cust" style="font-weight:800; color:var(--dark);">--</div>
          <div id="adm-modal-cust-contact" style="font-size:0.82rem; color:var(--text-muted);">--</div>
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.82rem; display:block;">السيارة واللوحة:</span>
          <div id="adm-modal-car" style="font-weight:800; color:var(--dark);">--</div>
          <div id="adm-modal-car-plate" style="font-size:0.82rem; font-family:sans-serif; color:var(--text-muted);">--</div>
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.82rem; display:block;">الخدمة والسعر التقديري:</span>
          <div id="adm-modal-service" style="font-weight:800; color:var(--dark);">--</div>
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.82rem; display:block;">موعد وتوقيت الوصول:</span>
          <div id="adm-modal-slot" style="font-weight:800; color:var(--dark);">--</div>
        </div>
      </div>

      <div style="background:var(--bg-page); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <strong style="display:block; font-size:0.85rem; color:var(--dark); margin-bottom:0.35rem;">ملاحظات وشكوى العميل الفنية:</strong>
        <p id="adm-modal-notes" style="font-size:0.9rem; color:var(--text-muted); line-height:1.5; margin:0;">--</p>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary btn-sm modal-close-trigger">إغلاق</button>
    </div>
  </div>
</div>

<script>
function openAdminAptModal(apt) {
  document.getElementById('adm-modal-ref').textContent = apt.reference_code;
  document.getElementById('adm-modal-cust').textContent = apt.customer_name;
  document.getElementById('adm-modal-cust-contact').textContent = apt.customer_email + ' • ' + apt.customer_phone;
  document.getElementById('adm-modal-car').textContent = apt.brand + ' ' + apt.model + ' (' + apt.year + ')';
  document.getElementById('adm-modal-car-plate').textContent = 'لوحة: ' + apt.license_plate + ' (العداد: ' + (apt.mileage || 0) + ' كم)';
  document.getElementById('adm-modal-service').textContent = apt.service_name + ' — ' + Math.round(parseFloat(apt.service_price)) + ' ج.م';
  document.getElementById('adm-modal-slot').textContent = apt.appointment_date + ' في تمام ' + apt.appointment_time;
  document.getElementById('adm-modal-notes').textContent = apt.problem_description || 'لا توجد ملاحظات إضافية مسجلة من العميل.';

  const statusMap = {
    'Pending': 'قيد المراجعة',
    'Confirmed': 'مؤكد هندسياً',
    'In Progress': 'جاري العمل بالورشة',
    'Completed': 'مكتمل ومسلّم',
    'Cancelled': 'ملغى'
  };

  const badgeClass = {
    'Pending': 'badge-pending',
    'Confirmed': 'badge-confirmed',
    'In Progress': 'badge-progress',
    'Completed': 'badge-completed',
    'Cancelled': 'badge-cancelled'
  }[apt.status] || 'badge-pending';

  document.getElementById('adm-modal-status').innerHTML = '<span class="badge ' + badgeClass + '">' + (statusMap[apt.status] || apt.status) + '</span>';

  openModal('admin-apt-modal');
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
