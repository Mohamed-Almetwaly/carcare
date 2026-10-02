<?php
/**
 * CarCare Egypt - Customer Appointments List & Management
 * قائمة مواعيد وحجوزات الصيانة - كار كير مصر
 */
$pageTitle = "مواعيدي وحجوزاتي | كار كير مصر";
$activeNav = "my-appointments";

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireRole('customer');

$userId = currentUserId();
$user = currentUser();
$pdo = getDBConnection();
$errors = [];

// Handle Appointment Cancellation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $errors[] = 'رمز الأمان غير صالح. يرجى إعادة المحاولة.';
    } else {
        $action = $_POST['action'] ?? '';
        if ($action === 'cancel') {
            $appointmentId = (int)($_POST['appointment_id'] ?? 0);

            // Verify appointment belongs to user and is cancellable
            $stmt = $pdo->prepare("SELECT id, status, reference_code FROM appointments WHERE id = ? AND user_id = ?");
            $stmt->execute([$appointmentId, $userId]);
            $apt = $stmt->fetch();

            if (!$apt) {
                $errors[] = 'سجل الحجز غير موجود.';
            } elseif ($apt['status'] === 'Cancelled') {
                $errors[] = 'هذا الموعد ملغى بالفعل.';
            } elseif ($apt['status'] === 'Completed') {
                $errors[] = 'لا يمكن إلغاء موعد صيانة تم الانتهاء منه بالفعل.';
            } else {
                try {
                    $updateStmt = $pdo->prepare("UPDATE appointments SET status = 'Cancelled' WHERE id = ? AND user_id = ?");
                    $updateStmt->execute([$appointmentId, $userId]);
                    setFlash('info', 'تم إلغاء موعد الصيانة كود #' . $apt['reference_code'] . ' بنجاح.');
                    header('Location: ' . baseUrl('dashboard/appointments.php'));
                    exit;
                } catch (PDOException $e) {
                    $errors[] = 'تعذر إلغاء الحجز: ' . $e->getMessage();
                }
            }
        }
    }
}

// Filter parameter
$filter = $_GET['filter'] ?? 'all';
$querySql = "
    SELECT a.*, c.brand, c.model, c.year, c.license_plate, s.name as service_name, s.price as service_price, s.duration as service_duration
    FROM appointments a
    JOIN cars c ON a.car_id = c.id
    JOIN services s ON a.service_id = s.id
    WHERE a.user_id = ?
";

$params = [$userId];

if ($filter === 'upcoming') {
    $querySql .= " AND a.status IN ('Pending', 'Confirmed', 'In Progress')";
} elseif ($filter === 'completed') {
    $querySql .= " AND a.status = 'Completed'";
} elseif ($filter === 'cancelled') {
    $querySql .= " AND a.status = 'Cancelled'";
}

$querySql .= " ORDER BY a.appointment_date DESC, a.id DESC";

try {
    $stmt = $pdo->prepare($querySql);
    $stmt->execute($params);
    $appointments = $stmt->fetchAll();
} catch (PDOException $e) {
    $appointments = [];
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
      <a href="<?= baseUrl('dashboard/appointments.php') ?>" class="sidebar-link active">
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

  <!-- Main Content -->
  <main class="dashboard-content">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
      <div>
        <h1 style="font-size:1.75rem; font-weight:900; color:var(--dark); margin-bottom:0.25rem;">
          سجل مواعيد الصيانة
        </h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          متابعة وتفاصيل جميع حجوزات الصيانة الدورية لسياراتك في مراكز كار كير مصر.
        </p>
      </div>

      <a href="<?= baseUrl('booking.php') ?>" class="btn btn-primary">
        <span>📅</span> حجز موعد جديد
      </a>
    </div>

    <?php if (!empty($errors)): ?>
      <div class="alert alert-error">
        <div><?= e($errors[0]) ?></div>
      </div>
    <?php endif; ?>

    <!-- Filter Buttons -->
    <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; flex-wrap:wrap;">
      <a href="<?= baseUrl('dashboard/appointments.php?filter=all') ?>" class="btn btn-sm <?= $filter === 'all' ? 'btn-primary' : 'btn-secondary' ?>">
        جميع المواعيد
      </a>
      <a href="<?= baseUrl('dashboard/appointments.php?filter=upcoming') ?>" class="btn btn-sm <?= $filter === 'upcoming' ? 'btn-primary' : 'btn-secondary' ?>">
        المواعيد القادمة والنشطة
      </a>
      <a href="<?= baseUrl('dashboard/appointments.php?filter=completed') ?>" class="btn btn-sm <?= $filter === 'completed' ? 'btn-primary' : 'btn-secondary' ?>">
        الصيانات المكتملة
      </a>
      <a href="<?= baseUrl('dashboard/appointments.php?filter=cancelled') ?>" class="btn btn-sm <?= $filter === 'cancelled' ? 'btn-primary' : 'btn-secondary' ?>">
        الحجوزات الملغاة
      </a>
    </div>

    <!-- Appointments Table Card -->
    <div class="table-card">
      <?php if (!empty($appointments)): ?>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>كود الحجز</th>
                <th>خدمة الصيانة</th>
                <th>السيارة</th>
                <th>تاريخ وموعد الوصول</th>
                <th>السعر التقديري</th>
                <th>حالة الصيانة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($appointments as $apt): ?>
                <tr>
                  <td>
                    <span style="font-family:monospace; font-weight:800; font-size:0.95rem; color:var(--dark);">
                      <?= e($apt['reference_code']) ?>
                    </span>
                  </td>
                  <td>
                    <strong><?= e($apt['service_name']) ?></strong><br>
                    <small style="color:var(--text-muted);">⏱️ مدة تقريبية: <?= e($apt['service_duration']) ?></small>
                  </td>
                  <td>
                    <?= e($apt['brand']) ?> <?= e($apt['model']) ?> (<?= e($apt['year']) ?>)<br>
                    <span style="font-family:sans-serif; font-size:0.8rem; background:var(--bg-page); border:1px solid var(--border-color); padding:0.1rem 0.4rem; border-radius:3px;">
                      <?= e($apt['license_plate']) ?>
                    </span>
                  </td>
                  <td>
                    <strong><?= formatDate($apt['appointment_date']) ?></strong><br>
                    <small style="color:var(--text-muted);"><?= e($apt['appointment_time']) ?></small>
                  </td>
                  <td style="font-weight:900; color:var(--primary); font-size:1.05rem;">
                    <?= formatPrice($apt['service_price']) ?>
                  </td>
                  <td>
                    <span class="badge <?= getStatusBadgeClass($apt['status']) ?>">
                      <?= formatStatus($apt['status']) ?>
                    </span>
                  </td>
                  <td>
                    <div style="display:flex; gap:0.35rem; align-items:center;">
                      <button type="button" 
                              class="btn btn-secondary btn-sm" 
                              style="padding:0.25rem 0.6rem; font-size:0.8rem;"
                              onclick="openAptDetailsModal(<?= htmlspecialchars(json_encode($apt, JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8') ?>)">
                        تفاصيل
                      </button>

                      <?php if ($apt['status'] !== 'Cancelled' && $apt['status'] !== 'Completed'): ?>
                        <form action="<?= baseUrl('dashboard/appointments.php') ?>" method="POST" onsubmit="return confirm('هل تريد بالتأكيد إلغاء موعد الصيانة #<?= e($apt['reference_code']) ?>؟');" style="margin:0;">
                          <?= csrfField() ?>
                          <input type="hidden" name="action" value="cancel">
                          <input type="hidden" name="appointment_id" value="<?= $apt['id'] ?>">
                          <button type="submit" class="btn btn-danger btn-sm" style="padding:0.25rem 0.5rem; font-size:0.8rem;" title="إلغاء الموعد">
                            إلغاء
                          </button>
                        </form>
                      <?php endif; ?>
                    </div>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php else: ?>
        <div class="empty-state">
          <div class="empty-state-icon">📅</div>
          <h3>لا توجد مواعيد صيانة مطابقة</h3>
          <p>لم يتم العثور على أي حجوزات صيانة في هذا التصنيف.</p>
          <a href="<?= baseUrl('booking.php') ?>" class="btn btn-primary btn-sm" style="margin-top:1rem;">حجز موعد صيانة جديد</a>
        </div>
      <?php endif; ?>
    </div>
  </main>
</div>

<!-- Modal: Appointment Details -->
<div class="modal-overlay" id="apt-details-modal">
  <div class="modal-card">
    <div class="modal-header">
      <h3>تفاصيل حجز الصيانة</h3>
      <button type="button" class="modal-close-btn modal-close-trigger">&times;</button>
    </div>
    <div class="modal-body">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color);">
        <div>
          <span style="font-size:0.85rem; color:var(--text-muted); display:block;">كود الحجز المرجعي</span>
          <span id="modal-apt-ref" style="font-family:monospace; font-size:1.35rem; font-weight:900; color:var(--primary);">--</span>
        </div>
        <div style="text-align:left;">
          <span style="font-size:0.85rem; color:var(--text-muted); display:block;">حالة الحجز</span>
          <span id="modal-apt-status" class="badge">--</span>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1.5rem; font-size:0.92rem;">
        <div>
          <span style="color:var(--text-muted); font-size:0.82rem; display:block;">خدمة الصيانة</span>
          <strong id="modal-apt-service" style="color:var(--dark);">--</strong>
          <div id="modal-apt-price" style="color:var(--primary); font-weight:800;">--</div>
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.82rem; display:block;">السيارة واللوحة</span>
          <strong id="modal-apt-car" style="color:var(--dark);">--</strong>
          <div id="modal-apt-plate" style="color:var(--text-muted); font-size:0.85rem;">--</div>
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.82rem; display:block;">تاريخ الصيانة المجدول</span>
          <strong id="modal-apt-date" style="color:var(--dark);">--</strong>
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.82rem; display:block;">فترة الوصول</span>
          <strong id="modal-apt-time" style="color:var(--dark);">--</strong>
        </div>
      </div>

      <div style="background:var(--bg-page); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <span style="font-size:0.85rem; font-weight:800; color:var(--dark); display:block; margin-bottom:0.35rem;">ملاحظات الفرع والعميل:</span>
        <p id="modal-apt-desc" style="font-size:0.9rem; color:#475569; margin:0; line-height:1.6;">--</p>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary btn-sm modal-close-trigger">إغلاق</button>
    </div>
  </div>
</div>

<script>
function openAptDetailsModal(apt) {
  document.getElementById('modal-apt-ref').textContent = apt.reference_code;
  
  const statusMap = {
    'Pending': 'قيد المراجعة',
    'Confirmed': 'مؤكد هندسياً',
    'In Progress': 'جاري العمل بالورشة',
    'Completed': 'مكتمل ومسلّم',
    'Cancelled': 'ملغى'
  };
  
  document.getElementById('modal-apt-status').textContent = statusMap[apt.status] || apt.status;
  document.getElementById('modal-apt-service').textContent = apt.service_name;
  document.getElementById('modal-apt-price').textContent = Math.round(parseFloat(apt.service_price)) + ' ج.م';
  document.getElementById('modal-apt-car').textContent = apt.year + ' ' + apt.brand + ' ' + apt.model;
  document.getElementById('modal-apt-plate').textContent = 'لوحة: ' + apt.license_plate;
  document.getElementById('modal-apt-date').textContent = apt.appointment_date;
  document.getElementById('modal-apt-time').textContent = apt.appointment_time;
  document.getElementById('modal-apt-desc').textContent = apt.problem_description || 'لا توجد ملاحظات إضافية.';
  openModal('apt-details-modal');
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
