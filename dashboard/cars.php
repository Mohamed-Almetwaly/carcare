<?php
/**
 * CarCare Egypt - Customer Garage (My Cars) CRUD
 * جراج سيارات العميل - كار كير مصر
 */
$pageTitle = "جراج سياراتي | كار كير مصر";
$activeNav = "my-cars";

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireRole('customer');

$userId = currentUserId();
$user = currentUser();
$pdo = getDBConnection();
$errors = [];

// Handle POST actions: Add, Edit, Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $errors[] = 'رمز الأمان غير صالح. يرجى إعادة المحاولة.';
    } else {
        $action = $_POST['action'] ?? '';

        // 1. ADD NEW CAR
        if ($action === 'add') {
            $brand   = trim($_POST['brand'] ?? '');
            $model   = trim($_POST['model'] ?? '');
            $year    = (int)($_POST['year'] ?? 0);
            $plate   = trim($_POST['license_plate'] ?? '');
            $mileage = (int)($_POST['mileage'] ?? 0);

            if (empty($brand) || empty($model) || $year < 1980 || empty($plate)) {
                $errors[] = 'يرجى ملء جميع الحقول المطلوبة (الماركة، الموديل، سنة الصنع 1980+، ورقم اللوحة).';
            } else {
                try {
                    $stmt = $pdo->prepare("INSERT INTO cars (user_id, brand, model, year, license_plate, mileage) VALUES (?, ?, ?, ?, ?, ?)");
                    $stmt->execute([$userId, $brand, $model, $year, $plate, $mileage]);
                    setFlash('success', 'تمت إضافة سيارتك "' . $brand . ' ' . $model . ' (' . $year . ')" إلى جراجك بنجاح!');
                    header('Location: ' . baseUrl('dashboard/cars.php'));
                    exit;
                } catch (PDOException $e) {
                    $errors[] = 'تعذر حفظ بيانات السيارة: ' . $e->getMessage();
                }
            }
        }

        // 2. UPDATE EXISTING CAR
        elseif ($action === 'edit') {
            $carId   = (int)($_POST['car_id'] ?? 0);
            $brand   = trim($_POST['brand'] ?? '');
            $model   = trim($_POST['model'] ?? '');
            $year    = (int)($_POST['year'] ?? 0);
            $plate   = trim($_POST['license_plate'] ?? '');
            $mileage = (int)($_POST['mileage'] ?? 0);

            // Verify car ownership
            $check = $pdo->prepare("SELECT id FROM cars WHERE id = ? AND user_id = ?");
            $check->execute([$carId, $userId]);
            if (!$check->fetch()) {
                $errors[] = 'ليس لديك صلاحية لتعديل بيانات هذه السيارة.';
            } elseif (empty($brand) || empty($model) || $year < 1980 || empty($plate)) {
                $errors[] = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح.';
            } else {
                try {
                    $stmt = $pdo->prepare("UPDATE cars SET brand = ?, model = ?, year = ?, license_plate = ?, mileage = ? WHERE id = ? AND user_id = ?");
                    $stmt->execute([$brand, $model, $year, $plate, $mileage, $carId, $userId]);
                    setFlash('success', 'تم تحديث بيانات السيارة بنجاح!');
                    header('Location: ' . baseUrl('dashboard/cars.php'));
                    exit;
                } catch (PDOException $e) {
                    $errors[] = 'فشل تحديث بيانات السيارة: ' . $e->getMessage();
                }
            }
        }

        // 3. DELETE CAR
        elseif ($action === 'delete') {
            $carId = (int)($_POST['car_id'] ?? 0);

            // Verify ownership
            $check = $pdo->prepare("SELECT id, brand, model FROM cars WHERE id = ? AND user_id = ?");
            $check->execute([$carId, $userId]);
            $carToDelete = $check->fetch();

            if (!$carToDelete) {
                $errors[] = 'السيارة غير موجودة أو غير مسجلة بحسابك.';
            } else {
                try {
                    $stmt = $pdo->prepare("DELETE FROM cars WHERE id = ? AND user_id = ?");
                    $stmt->execute([$carId, $userId]);
                    setFlash('info', 'تم حذف السيارة من جراجك.');
                    header('Location: ' . baseUrl('dashboard/cars.php'));
                    exit;
                } catch (PDOException $e) {
                    $errors[] = 'تعذر حذف السيارة لأن لها مواعيد صيانة مسجلة مرتبطة بها.';
                }
            }
        }
    }
}

// Fetch all customer cars
try {
    $stmt = $pdo->prepare("
        SELECT c.*, 
          (SELECT COUNT(*) FROM appointments a WHERE a.car_id = c.id) as service_count
        FROM cars c 
        WHERE c.user_id = ? 
        ORDER BY c.id DESC
    ");
    $stmt->execute([$userId]);
    $cars = $stmt->fetchAll();
} catch (PDOException $e) {
    $cars = [];
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
      <a href="<?= baseUrl('dashboard/cars.php') ?>" class="sidebar-link active">
        <span>🚗</span> جراج سياراتي (<?= count($cars) ?>)
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

  <!-- Content -->
  <main class="dashboard-content">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
      <div>
        <h1 style="font-size:1.75rem; font-weight:900; color:var(--dark); margin-bottom:0.25rem;">
          جراج سياراتي المسجلة
        </h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          أضف وعدّل بيانات سياراتك لمتابعة الفحص والصيانة الدورية وتغيير الزيوت.
        </p>
      </div>

      <button type="button" class="btn btn-primary" onclick="openAddCarModal()">
        <span>➕</span> إضافة سيارة جديدة
      </button>
    </div>

    <?php if (!empty($errors)): ?>
      <div class="alert alert-error">
        <div><?= e($errors[0]) ?></div>
      </div>
    <?php endif; ?>

    <!-- Cars Grid -->
    <?php if (!empty($cars)): ?>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;">
        <?php foreach ($cars as $car): ?>
          <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                <div style="font-size:1.8rem;">🚘</div>
                <div style="text-align:left;">
                  <span style="font-family:sans-serif; font-size:0.9rem; font-weight:800; background:var(--bg-page); border:1px solid var(--border-color); padding:0.25rem 0.75rem; border-radius:var(--radius-sm); color:var(--dark);">
                    <?= e($car['license_plate']) ?>
                  </span>
                </div>
              </div>

              <h3 style="font-size:1.35rem; font-weight:900; color:var(--dark); margin-bottom:0.35rem;">
                <?= e($car['brand']) ?> <?= e($car['model']) ?> (<?= e($car['year']) ?>)
              </h3>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:1rem 0; padding:0.75rem; background:var(--bg-page); border-radius:var(--radius-md); font-size:0.88rem;">
                <div>
                  <span style="color:var(--text-muted); display:block; font-size:0.78rem;">قراءة العداد:</span>
                  <strong><?= number_format($car['mileage'] ?? 0) ?> كم</strong>
                </div>
                <div>
                  <span style="color:var(--text-muted); display:block; font-size:0.78rem;">سجل الزيارات:</span>
                  <strong><?= (int)$car['service_count'] ?> زيارة صيانة</strong>
                </div>
              </div>
            </div>

            <div style="display:flex; gap:0.5rem; margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border-light);">
              <a href="<?= baseUrl('booking.php?car_id=' . $car['id']) ?>" class="btn btn-primary btn-sm" style="flex:2;">
                حجز صيانة
              </a>
              <button type="button" class="btn btn-secondary btn-sm" style="flex:1;" onclick="openEditCarModal(<?= htmlspecialchars(json_encode($car, JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8') ?>)">
                تعديل
              </button>
              <form action="<?= baseUrl('dashboard/cars.php') ?>" method="POST" onsubmit="return confirm('هل أنت متأكد من رغبتك في حذف سيارة <?= e($car['brand']) ?> من جراجك؟');" style="margin:0;">
                <?= csrfField() ?>
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="car_id" value="<?= $car['id'] ?>">
                <button type="submit" class="btn btn-danger btn-sm" title="حذف السيارة">
                  🗑️
                </button>
              </form>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php else: ?>
      <div class="empty-state" style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:3.5rem 1.5rem;">
        <div class="empty-state-icon">🚘</div>
        <h3>جراجك خالٍ من السيارات المسجلة</h3>
        <p>أضف سيارتك الأولى الآن لتتمكن من حجز مواعيد الصيانة الدورية ومتابعة حالتها الفنية.</p>
        <button type="button" class="btn btn-primary" onclick="openAddCarModal()" style="margin-top:1rem;">
          + إضافة سيارتك الأولى الآن
        </button>
      </div>
    <?php endif; ?>
  </main>
</div>

<!-- Modal: Add New Car -->
<div class="modal-overlay" id="add-car-modal">
  <div class="modal-card">
    <div class="modal-header">
      <h3>تسجيل سيارة جديدة بالجراج</h3>
      <button type="button" class="modal-close-btn modal-close-trigger">&times;</button>
    </div>
    <form action="<?= baseUrl('dashboard/cars.php') ?>" method="POST" class="validate-form" novalidate>
      <?= csrfField() ?>
      <input type="hidden" name="action" value="add">
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label for="add_brand" class="form-label">الماركة المصنعة <span class="req">*</span></label>
            <input type="text" id="add_brand" name="brand" class="form-control" placeholder="مثال: هيونداي، تويوتا، نيسان، كيا" required>
          </div>
          <div class="form-group">
            <label for="add_model" class="form-label">الموديل والفئة <span class="req">*</span></label>
            <input type="text" id="add_model" name="model" class="form-control" placeholder="مثال: إلنترا CN7، كورولا، سبورتاج" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="add_year" class="form-label">سنة الصنع <span class="req">*</span></label>
            <input type="number" id="add_year" name="year" class="form-control" placeholder="2022" min="1980" max="2027" required>
          </div>
          <div class="form-group">
            <label for="add_plate" class="form-label">رقم اللوحة المعدنية المصرية <span class="req">*</span></label>
            <input type="text" id="add_plate" name="license_plate" class="form-control" placeholder="مثال: س ق ر 6318 أو 4925 ب و د" required>
          </div>
        </div>

        <div class="form-group">
          <label for="add_mileage" class="form-label">قراءة العداد الحالية (كم)</label>
          <input type="number" id="add_mileage" name="mileage" class="form-control" placeholder="مثال: 45000" min="0">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm modal-close-trigger">إلغاء</button>
        <button type="submit" class="btn btn-primary btn-sm">حفظ السيارة بالجراج</button>
      </div>
    </form>
  </div>
</div>

<!-- Modal: Edit Car -->
<div class="modal-overlay" id="edit-car-modal">
  <div class="modal-card">
    <div class="modal-header">
      <h3>تعديل بيانات السيارة</h3>
      <button type="button" class="modal-close-btn modal-close-trigger">&times;</button>
    </div>
    <form action="<?= baseUrl('dashboard/cars.php') ?>" method="POST" class="validate-form" novalidate>
      <?= csrfField() ?>
      <input type="hidden" name="action" value="edit">
      <input type="hidden" name="car_id" id="edit_car_id">
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label for="edit_brand" class="form-label">الماركة المصنعة <span class="req">*</span></label>
            <input type="text" id="edit_brand" name="brand" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="edit_model" class="form-label">الموديل والفئة <span class="req">*</span></label>
            <input type="text" id="edit_model" name="model" class="form-control" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="edit_year" class="form-label">سنة الصنع <span class="req">*</span></label>
            <input type="number" id="edit_year" name="year" class="form-control" min="1980" max="2027" required>
          </div>
          <div class="form-group">
            <label for="edit_plate" class="form-label">رقم اللوحة المعدنية <span class="req">*</span></label>
            <input type="text" id="edit_plate" name="license_plate" class="form-control" required>
          </div>
        </div>

        <div class="form-group">
          <label for="edit_mileage" class="form-label">قراءة العداد (كم)</label>
          <input type="number" id="edit_mileage" name="mileage" class="form-control" min="0">
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
function openAddCarModal() {
  openModal('add-car-modal');
}

function openEditCarModal(car) {
  document.getElementById('edit_car_id').value = car.id;
  document.getElementById('edit_brand').value = car.brand;
  document.getElementById('edit_model').value = car.model;
  document.getElementById('edit_year').value = car.year;
  document.getElementById('edit_plate').value = car.license_plate;
  document.getElementById('edit_mileage').value = car.mileage || '';
  openModal('edit-car-modal');
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
