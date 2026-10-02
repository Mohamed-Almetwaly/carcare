<?php
/**
 * CarCare Egypt - Admin Maintenance Services CRUD
 * إدارة باقات وخدمات الصيانة - كار كير مصر
 */
$pageTitle = "إدارة باقات الصيانة | كار كير مصر";
$activeNav = "admin-services";

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireRole('admin');

$pdo = getDBConnection();
$errors = [];

// Handle POST: Add, Edit, Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $errors[] = 'رمز الأمان غير صالح. يرجى إعادة المحاولة.';
    } else {
        $action = $_POST['action'] ?? '';

        // 1. CREATE NEW SERVICE
        if ($action === 'add') {
            $name        = trim($_POST['name'] ?? '');
            $description = trim($_POST['description'] ?? '');
            $price       = (float)($_POST['price'] ?? 0);
            $duration    = trim($_POST['duration'] ?? '');
            $image       = trim($_POST['image'] ?? 'assets/images/service-default.jpg');

            if (empty($name) || empty($description) || $price <= 0 || empty($duration)) {
                $errors[] = 'يرجى ملء جميع الحقول المطلوبة (اسم الخدمة، الوصف، سعر موجب بالجنيه، والمدة التقديرية).';
            } else {
                try {
                    $stmt = $pdo->prepare("INSERT INTO services (name, description, price, duration, image) VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([$name, $description, $price, $duration, $image]);
                    setFlash('success', 'تمت إضافة خدمة "' . $name . '" إلى قائمة الخدمات بنجاح!');
                    header('Location: ' . baseUrl('admin/services.php'));
                    exit;
                } catch (PDOException $e) {
                    $errors[] = 'فشل حفظ الخدمة: ' . $e->getMessage();
                }
            }
        }

        // 2. UPDATE EXISTING SERVICE
        elseif ($action === 'edit') {
            $serviceId   = (int)($_POST['service_id'] ?? 0);
            $name        = trim($_POST['name'] ?? '');
            $description = trim($_POST['description'] ?? '');
            $price       = (float)($_POST['price'] ?? 0);
            $duration    = trim($_POST['duration'] ?? '');
            $image       = trim($_POST['image'] ?? 'assets/images/service-default.jpg');

            if ($serviceId <= 0 || empty($name) || empty($description) || $price <= 0 || empty($duration)) {
                $errors[] = 'يرجى التأكد من صحة بيانات الخدمة المدخلة.';
            } else {
                try {
                    $stmt = $pdo->prepare("UPDATE services SET name = ?, description = ?, price = ?, duration = ?, image = ? WHERE id = ?");
                    $stmt->execute([$name, $description, $price, $duration, $image, $serviceId]);
                    setFlash('success', 'تم تحديث بيانات باقة الصيانة بنجاح!');
                    header('Location: ' . baseUrl('admin/services.php'));
                    exit;
                } catch (PDOException $e) {
                    $errors[] = 'فشل تحديث الخدمة: ' . $e->getMessage();
                }
            }
        }

        // 3. DELETE SERVICE
        elseif ($action === 'delete') {
            $serviceId = (int)($_POST['service_id'] ?? 0);
            try {
                $stmt = $pdo->prepare("DELETE FROM services WHERE id = ?");
                $stmt->execute([$serviceId]);
                setFlash('info', 'تم حذف الخدمة من قائمة الخدمات.');
                header('Location: ' . baseUrl('admin/services.php'));
                exit;
            } catch (PDOException $e) {
                $errors[] = 'لا يمكن حذف هذه الخدمة نظراً لوجود حجوزات سابقة مرتبطة بها.';
            }
        }
    }
}

// Fetch all services
try {
    $stmt = $pdo->query("SELECT s.*, (SELECT COUNT(*) FROM appointments a WHERE a.service_id = s.id) as bookings_count FROM services s ORDER BY s.id ASC");
    $services = $stmt->fetchAll();
} catch (PDOException $e) {
    $services = [];
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
      <a href="<?= baseUrl('admin/customers.php') ?>" class="sidebar-link">
        <span>👥</span> دليل وسجلات العملاء
      </a>
      <a href="<?= baseUrl('admin/services.php') ?>" class="sidebar-link active">
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
          دليل باقات وخدمات الصيانة
        </h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          تحديد الأسعار بالجنيه المصري، فترات التنفيذ التقريبية، ونطاق الفحص المتاح للحجز.
        </p>
      </div>

      <button type="button" class="btn btn-primary" onclick="openAddServiceModal()">
        <span>➕</span> إضافة باقة صيانة جديدة
      </button>
    </div>

    <?php if (!empty($errors)): ?>
      <div class="alert alert-error">
        <div><?= e($errors[0]) ?></div>
      </div>
    <?php endif; ?>

    <!-- Services Table -->
    <div class="table-card">
      <?php if (!empty($services)): ?>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>اسم الخدمة والباقة</th>
                <th>تفاصيل الإجراء الفني</th>
                <th>التكلفة (ج.م)</th>
                <th>المدة التقديرية</th>
                <th>مرات الحجز</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($services as $svc): ?>
                <tr>
                  <td>
                    <strong style="color:var(--dark); font-size:0.95rem;"><?= e($svc['name']) ?></strong>
                  </td>
                  <td style="max-width:320px; font-size:0.85rem; color:var(--text-muted); line-height:1.5;">
                    <?= e($svc['description']) ?>
                  </td>
                  <td style="font-weight:900; color:var(--primary); font-size:1.05rem;">
                    <?= formatPrice($svc['price']) ?>
                  </td>
                  <td>
                    <span style="font-size:0.85rem; color:var(--text-muted);">⏱️ <?= e($svc['duration']) ?></span>
                  </td>
                  <td>
                    <span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;">
                      <?= (int)$svc['bookings_count'] ?> حجز
                    </span>
                  </td>
                  <td>
                    <div style="display:flex; gap:0.4rem;">
                      <button type="button" 
                              class="btn btn-secondary btn-sm" 
                              style="padding:0.25rem 0.6rem; font-size:0.8rem;"
                              onclick="openEditServiceModal(<?= htmlspecialchars(json_encode($svc, JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8') ?>)">
                        تعديل
                      </button>
                      <form action="<?= baseUrl('admin/services.php') ?>" method="POST" onsubmit="return confirm('هل أنت متأكد من حذف باقة \'<?= e($svc['name']) ?>\'؟');" style="margin:0;">
                        <?= csrfField() ?>
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="service_id" value="<?= $svc['id'] ?>">
                        <button type="submit" class="btn btn-danger btn-sm" style="padding:0.25rem 0.6rem; font-size:0.8rem;">
                          حذف
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php else: ?>
        <div class="empty-state">
          <p>لا توجد خدمات مسجلة في القائمة حالياً.</p>
        </div>
      <?php endif; ?>
    </div>
  </main>
</div>

<!-- Modal: Add Service -->
<div class="modal-overlay" id="add-service-modal">
  <div class="modal-card">
    <div class="modal-header">
      <h3>إضافة باقة صيانة جديدة</h3>
      <button type="button" class="modal-close-btn modal-close-trigger">&times;</button>
    </div>
    <form action="<?= baseUrl('admin/services.php') ?>" method="POST" class="validate-form" novalidate>
      <?= csrfField() ?>
      <input type="hidden" name="action" value="add">
      <div class="modal-body">
        <div class="form-group">
          <label for="add_svc_name" class="form-label">مسمى الخدمة أو الباقة <span class="req">*</span></label>
          <input type="text" id="add_svc_name" name="name" class="form-control" placeholder="مثال: غسيل دورة التبريد وتغيير مياه الردياتير" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="add_svc_price" class="form-label">السعر التقديري (بالجنيه المصري) <span class="req">*</span></label>
            <input type="number" step="1" id="add_svc_price" name="price" class="form-control" placeholder="650" required min="1">
          </div>
          <div class="form-group">
            <label for="add_svc_duration" class="form-label">المدة التقديرية بالورشة <span class="req">*</span></label>
            <input type="text" id="add_svc_duration" name="duration" class="form-control" placeholder="مثال: 45 دقيقة أو 1.5 ساعة" required>
          </div>
        </div>

        <div class="form-group">
          <label for="add_svc_desc" class="form-label">شرح تفصيلي لما تشمله الخدمة <span class="req">*</span></label>
          <textarea id="add_svc_desc" name="description" rows="3" class="form-control" placeholder="اشرح الخطوات الفنية وقطع الغيار أو السوائل المشمولة..." required></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm modal-close-trigger">إلغاء</button>
        <button type="submit" class="btn btn-primary btn-sm">حفظ الباقة بالقائمة</button>
      </div>
    </form>
  </div>
</div>

<!-- Modal: Edit Service -->
<div class="modal-overlay" id="edit-service-modal">
  <div class="modal-card">
    <div class="modal-header">
      <h3>تعديل باقة الصيانة</h3>
      <button type="button" class="modal-close-btn modal-close-trigger">&times;</button>
    </div>
    <form action="<?= baseUrl('admin/services.php') ?>" method="POST" class="validate-form" novalidate>
      <?= csrfField() ?>
      <input type="hidden" name="action" value="edit">
      <input type="hidden" name="service_id" id="edit_svc_id">
      <div class="modal-body">
        <div class="form-group">
          <label for="edit_svc_name" class="form-label">مسمى الخدمة أو الباقة <span class="req">*</span></label>
          <input type="text" id="edit_svc_name" name="name" class="form-control" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="edit_svc_price" class="form-label">السعر بالجنيه المصري (ج.م) <span class="req">*</span></label>
            <input type="number" step="1" id="edit_svc_price" name="price" class="form-control" required min="1">
          </div>
          <div class="form-group">
            <label for="edit_svc_duration" class="form-label">المدة التقديرية بالورشة <span class="req">*</span></label>
            <input type="text" id="edit_svc_duration" name="duration" class="form-control" required>
          </div>
        </div>

        <div class="form-group">
          <label for="edit_svc_desc" class="form-label">شرح تفصيلي لما تشمله الخدمة <span class="req">*</span></label>
          <textarea id="edit_svc_desc" name="description" rows="3" class="form-control" required></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm modal-close-trigger">إلغاء</button>
        <button type="submit" class="btn btn-primary btn-sm">حفظ التعديلات</button>
      </div>
    </form>
  </div>
</div>

<script>
function openAddServiceModal() {
  openModal('add-service-modal');
}

function openEditServiceModal(svc) {
  document.getElementById('edit_svc_id').value = svc.id;
  document.getElementById('edit_svc_name').value = svc.name;
  document.getElementById('edit_svc_price').value = Math.round(parseFloat(svc.price));
  document.getElementById('edit_svc_duration').value = svc.duration;
  document.getElementById('edit_svc_desc').value = svc.description;
  openModal('edit-service-modal');
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
