<?php
/**
 * CarCare Egypt - Service Appointment Booking
 * حجز موعد صيانة سيارة - كار كير مصر
 */
$pageTitle = "حجز موعد صيانة سيارة | كار كير مصر";
$activeNav = "booking";

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

// Require login to book appointment
requireLogin('يرجى تسجيل الدخول أو إنشاء حساب عميل جديد لتتمكن من حجز موعد صيانة لسيارتك.');

$pdo = getDBConnection();
$userId = currentUserId();
$errors = [];
$bookingConfirmation = null;

// Selected service from URL query string if coming from services page
$preselectedServiceId = (int)($_GET['service_id'] ?? 0);

// 1. Fetch customer's registered cars
try {
    $stmt = $pdo->prepare("SELECT * FROM cars WHERE user_id = ? ORDER BY id DESC");
    $stmt->execute([$userId]);
    $userCars = $stmt->fetchAll();
} catch (PDOException $e) {
    $userCars = [];
}

// 2. Fetch all services
try {
    $stmt = $pdo->query("SELECT * FROM services ORDER BY price ASC");
    $servicesList = $stmt->fetchAll();
} catch (PDOException $e) {
    $servicesList = [];
}

// 3. Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $errors[] = 'انتهت صلاحية رمز الأمان. يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى.';
    } else {
        $carId              = (int)($_POST['car_id'] ?? 0);
        $serviceId          = (int)($_POST['service_id'] ?? 0);
        $branch             = trim($_POST['branch'] ?? 'التجمع الخامس');
        $appointmentDate    = trim($_POST['appointment_date'] ?? '');
        $appointmentTime    = trim($_POST['appointment_time'] ?? '');
        $problemDescription = trim($_POST['problem_description'] ?? '');

        // If user chose to register a new car inline during booking
        $newCarBrand   = trim($_POST['new_car_brand'] ?? '');
        $newCarModel   = trim($_POST['new_car_model'] ?? '');
        $newCarYear    = (int)($_POST['new_car_year'] ?? 0);
        $newCarPlate   = trim($_POST['new_car_plate'] ?? '');
        $newCarMileage = (int)($_POST['new_car_mileage'] ?? 0);

        if ($carId === -1) { // Adding new car inline
            if (empty($newCarBrand) || empty($newCarModel) || $newCarYear < 1980 || empty($newCarPlate)) {
                $errors['new_car'] = 'يرجى استكمال جميع بيانات السيارة (الماركة، الموديل، سنة الصنع، ورقم اللوحة المعدنية).';
            } else {
                // Insert new car first
                try {
                    $carStmt = $pdo->prepare("INSERT INTO cars (user_id, brand, model, year, license_plate, mileage) VALUES (?, ?, ?, ?, ?, ?)");
                    $carStmt->execute([$userId, $newCarBrand, $newCarModel, $newCarYear, $newCarPlate, $newCarMileage]);
                    $carId = (int)$pdo->lastInsertId();
                } catch (PDOException $e) {
                    $errors['new_car'] = 'تعذر تسجيل بيانات السيارة: ' . $e->getMessage();
                }
            }
        }

        // Validate vehicle selection
        if ($carId <= 0) {
            $errors['car_id'] = 'يرجى اختيار إحدى سياراتك المسجلة أو إضافة سيارة جديدة.';
        } else {
            // Verify car belongs to this user
            $checkCar = $pdo->prepare("SELECT id FROM cars WHERE id = ? AND user_id = ?");
            $checkCar->execute([$carId, $userId]);
            if (!$checkCar->fetch()) {
                $errors['car_id'] = 'السيارة المحددة غير مسجلة في حسابك.';
            }
        }

        // Validate service selection
        if ($serviceId <= 0) {
            $errors['service_id'] = 'يرجى اختيار باقة الصيانة المطلوبة.';
        } else {
            $checkSvc = $pdo->prepare("SELECT id FROM services WHERE id = ?");
            $checkSvc->execute([$serviceId]);
            if (!$checkSvc->fetch()) {
                $errors['service_id'] = 'الخدمة المختارة غير صحيحة.';
            }
        }

        // Validate appointment date (must be today or future date)
        if (empty($appointmentDate)) {
            $errors['appointment_date'] = 'يرجى تحديد تاريخ موعد الصيانة.';
        } else {
            $today = date('Y-m-d');
            if ($appointmentDate < $today) {
                $errors['appointment_date'] = 'لا يمكن اختيار تاريخ في الماضي.';
            }
        }

        // Validate appointment time
        if (empty($appointmentTime)) {
            $errors['appointment_time'] = 'يرجى اختيار فترة الوصول المناسبة لك.';
        }

        // Save appointment to MySQL
        if (empty($errors)) {
            try {
                $referenceCode = generateReferenceCode();
                $fullNotes = "الفرع: " . $branch . ($problemDescription ? " | ملاحظات العميل: " . $problemDescription : "");

                $sql = "INSERT INTO appointments 
                        (user_id, car_id, service_id, appointment_date, appointment_time, problem_description, status, reference_code) 
                        VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)";
                $insStmt = $pdo->prepare($sql);
                $insStmt->execute([
                    $userId,
                    $carId,
                    $serviceId,
                    $appointmentDate,
                    $appointmentTime,
                    $fullNotes,
                    $referenceCode
                ]);

                // Fetch details for confirmation card
                $detailStmt = $pdo->prepare("
                    SELECT a.*, c.brand, c.model, c.year, c.license_plate, s.name as service_name, s.price as service_price, s.duration as service_duration
                    FROM appointments a
                    JOIN cars c ON a.car_id = c.id
                    JOIN services s ON a.service_id = s.id
                    WHERE a.reference_code = ?
                ");
                $detailStmt->execute([$referenceCode]);
                $bookingConfirmation = $detailStmt->fetch();

                setFlash('success', 'تم حجز موعد الصيانة بنجاح! كود الحجز المرجعي: ' . $referenceCode);
            } catch (PDOException $e) {
                $errors[] = 'تعذر إتمام الحجز: ' . $e->getMessage();
            }
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="container section">
  <?php if ($bookingConfirmation): ?>
    <!-- Booking Confirmation Success Screen -->
    <div style="max-width:650px; margin:0 auto; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2.5rem; box-shadow:var(--shadow-lg);">
      <div style="text-align:center; margin-bottom:2rem;">
        <div style="width:64px; height:64px; background:var(--success-bg); color:var(--success); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto 1rem;">
          ✓
        </div>
        <h1 style="font-size:2rem; font-weight:800; color:var(--dark); margin-bottom:0.5rem;">تم تأكيد حجز موعد الصيانة!</h1>
        <p style="color:var(--text-muted);">تم تسجيل حجزك بنجاح في مركز كار كير مصر، بانتظار تشريفك في الفرع المحدد.</p>
      </div>

      <div style="background:var(--bg-page); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.5rem; margin-bottom:2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color);">
          <span style="font-weight:700; color:var(--text-muted);">كود الحجز المرجعي:</span>
          <span style="font-family:monospace; font-size:1.4rem; font-weight:900; color:var(--primary);"><?= e($bookingConfirmation['reference_code']) ?></span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; font-size:0.92rem;">
          <div>
            <div style="color:var(--text-muted); font-size:0.82rem;">الخدمة المطلوبة</div>
            <div style="font-weight:800; color:var(--dark);"><?= e($bookingConfirmation['service_name']) ?></div>
            <div style="color:var(--primary); font-weight:800;"><?= formatPrice($bookingConfirmation['service_price']) ?></div>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.82rem;">بيانات السيارة</div>
            <div style="font-weight:800; color:var(--dark);">
              <?= e($bookingConfirmation['brand']) ?> <?= e($bookingConfirmation['model']) ?> (<?= e($bookingConfirmation['year']) ?>)
            </div>
            <div style="color:var(--text-muted); font-size:0.85rem;">رقم اللوحة: <?= e($bookingConfirmation['license_plate']) ?></div>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.82rem;">تاريخ الحجز المجدول</div>
            <div style="font-weight:800; color:var(--dark);"><?= formatDate($bookingConfirmation['appointment_date']) ?></div>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.82rem;">فترة الوصول المحددة</div>
            <div style="font-weight:800; color:var(--dark);"><?= e($bookingConfirmation['appointment_time']) ?></div>
          </div>
        </div>
      </div>

      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        <a href="<?= baseUrl('dashboard/appointments.php') ?>" class="btn btn-primary" style="flex:1;">
          متابعة الحجز في حسابي
        </a>
        <a href="<?= baseUrl('booking.php') ?>" class="btn btn-secondary" style="flex:1;">
          حجز موعد جديد
        </a>
      </div>
    </div>

  <?php else: ?>
    <!-- Standard Booking Form Screen -->
    <div style="max-width:750px; margin:0 auto;">
      <div class="section-header" style="margin-bottom:2rem;">
        <span class="section-tag">حجز إلكتروني فوري</span>
        <h1 class="section-title">حجز موعد صيانة سيارة</h1>
        <p class="section-subtitle">حدد سيارتك، باقة الصيانة المطلوبة، والفرع وتوقيت الوصول الأنسب لك دون أي انتظار.</p>
      </div>

      <?php if (!empty($errors) && isset($errors[0])): ?>
        <div class="alert alert-error">
          <div><?= e($errors[0]) ?></div>
        </div>
      <?php endif; ?>

      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2.5rem; box-shadow:var(--shadow-md);">
        <form action="<?= baseUrl('booking.php') ?>" method="POST" class="validate-form" novalidate id="booking-form">
          <?= csrfField() ?>

          <!-- 0. Branch Selection -->
          <div class="form-group">
            <label for="branch" class="form-label">اختر فرع كار كير مصر <span class="req">*</span></label>
            <select name="branch" id="branch" class="form-control" required>
              <option value="فرع التجمع الخامس (شارع التسعين الجنوبي)">فرع التجمع الخامس - القاهرة الجديدة (شارع التسعين الجنوبي)</option>
              <option value="فرع مدينة نصر (طريق النصر)">فرع مدينة نصر - القاهرة (طريق النصر تقاطع مكرم عبيد)</option>
              <option value="فرع المهندسين (شارع البطل أحمد عبد العزيز)">فرع المهندسين - الجيزة (شارع البطل أحمد عبد العزيز)</option>
              <option value="فرع الشيخ زايد (محور 26 يوليو)">فرع الشيخ زايد - 6 أكتوبر (محور 26 يوليو مدخل 2)</option>
            </select>
          </div>

          <!-- 1. Vehicle Selection -->
          <div class="form-group">
            <label for="car_id" class="form-label">اختر سيارتك <span class="req">*</span></label>
            <select name="car_id" id="car_id" class="form-control <?= isset($errors['car_id']) ? 'error' : '' ?>" required onchange="toggleInlineNewCar(this.value)">
              <option value="">-- اختر سيارة من جراجك المسجل --</option>
              <?php foreach ($userCars as $car): ?>
                <option value="<?= $car['id'] ?>">
                  <?= e($car['brand']) ?> <?= e($car['model']) ?> (موديل <?= e($car['year']) ?>) - لوحة: <?= e($car['license_plate']) ?>
                </option>
              <?php endforeach; ?>
              <option value="-1" <?= empty($userCars) ? 'selected' : '' ?>>+ إضافة وتسجيل سيارة جديدة الآن</option>
            </select>
            <?php if (isset($errors['car_id'])): ?>
              <span class="form-error"><?= e($errors['car_id']) ?></span>
            <?php endif; ?>
          </div>

          <!-- Inline New Car Section (Shown if user has no cars or selected + Register new car) -->
          <div id="inline-new-car-fields" style="display:<?= empty($userCars) ? 'block' : 'none' ?>; background:var(--bg-page); border:1px dashed var(--border-color); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.5rem;">
            <h4 style="font-size:0.95rem; font-weight:800; color:var(--dark); margin-bottom:1rem;">بيانات السيارة الجديدة:</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label for="new_car_brand" class="form-label">ماركة السيارة (المصنع) <span class="req">*</span></label>
                <input type="text" id="new_car_brand" name="new_car_brand" class="form-control" placeholder="مثال: هيونداي، نيسان، فيات، كيا، تويوتا، شيري">
              </div>
              <div class="form-group">
                <label for="new_car_model" class="form-label">الموديل والفئة <span class="req">*</span></label>
                <input type="text" id="new_car_model" name="new_car_model" class="form-control" placeholder="مثال: إلنترا CN7، صني N17، تيبو، سبورتاج">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="new_car_year" class="form-label">سنة الصنع <span class="req">*</span></label>
                <input type="number" id="new_car_year" name="new_car_year" class="form-control" placeholder="2022" min="1980" max="2027" value="2022">
              </div>
              <div class="form-group">
                <label for="new_car_plate" class="form-label">رقم اللوحة المعدنية المصرية <span class="req">*</span></label>
                <input type="text" id="new_car_plate" name="new_car_plate" class="form-control" placeholder="مثال: س ق ر 6318 أو 4925 ب و د">
              </div>
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label for="new_car_mileage" class="form-label">قراءة العداد الحالية (كم)</label>
              <input type="number" id="new_car_mileage" name="new_car_mileage" class="form-control" placeholder="مثال: 45000" min="0">
            </div>
          </div>

          <!-- 2. Service Selection -->
          <div class="form-group">
            <label for="service_id" class="form-label">باقة الصيانة المطلوبة <span class="req">*</span></label>
            <select name="service_id" id="service_id" class="form-control <?= isset($errors['service_id']) ? 'error' : '' ?>" required>
              <option value="">-- اختر خدمة الصيانة --</option>
              <?php foreach ($servicesList as $svc): ?>
                <option value="<?= $svc['id'] ?>" <?= ($preselectedServiceId === (int)$svc['id']) ? 'selected' : '' ?>>
                  <?= e($svc['name']) ?> — <?= formatPrice($svc['price']) ?> (المدة التقديرية: <?= e($svc['duration']) ?>)
                </option>
              <?php endforeach; ?>
            </select>
            <?php if (isset($errors['service_id'])): ?>
              <span class="form-error"><?= e($errors['service_id']) ?></span>
            <?php endif; ?>
          </div>

          <!-- 3. Date & Time Selection -->
          <div class="form-row">
            <div class="form-group">
              <label for="appointment_date" class="form-label">تاريخ الحجز المفضل <span class="req">*</span></label>
              <input type="date" 
                     id="appointment_date" 
                     name="appointment_date" 
                     class="form-control <?= isset($errors['appointment_date']) ? 'error' : '' ?>" 
                     required 
                     min="<?= date('Y-m-d') ?>">
              <?php if (isset($errors['appointment_date'])): ?>
                <span class="form-error"><?= e($errors['appointment_date']) ?></span>
              <?php endif; ?>
            </div>

            <div class="form-group">
              <label for="appointment_time" class="form-label">فترة الوصول المفضلة <span class="req">*</span></label>
              <select name="appointment_time" id="appointment_time" class="form-control <?= isset($errors['appointment_time']) ? 'error' : '' ?>" required>
                <option value="">-- اختر توقيت الوصول --</option>
                <option value="09:30 ص">09:30 ص - فترة الصباح الأولى</option>
                <option value="11:00 ص">11:00 ص - قبل الظهر</option>
                <option value="01:00 م">01:00 م - فترة الظهيرة</option>
                <option value="03:00 م">03:00 م - بعد الظهر</option>
                <option value="05:30 م">05:30 م - فترة العصر</option>
                <option value="07:30 م">07:30 م - فترة المساء</option>
                <option value="09:00 م">09:00 م - مسائي متأخر</option>
              </select>
              <?php if (isset($errors['appointment_time'])): ?>
                <span class="form-error"><?= e($errors['appointment_time']) ?></span>
              <?php endif; ?>
            </div>
          </div>

          <!-- 4. Problem Description / Notes -->
          <div class="form-group">
            <label for="problem_description" class="form-label">ملاحظات العميل أو أعراض تشكو منها السيارة (اختياري)</label>
            <textarea id="problem_description" 
                      name="problem_description" 
                      rows="3" 
                      class="form-control" 
                      placeholder="صف أي أصوات غير معتادة، رعشة في الفرامل أو الدركسيون، لمبة أعطال مضاءة بالتابلوه، أو متطلبات خاصة..."></textarea>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top:1.5rem;" id="submit-booking-btn">
            تأكيد وتسجيل موعد الصيانة
          </button>
        </form>
      </div>
    </div>
  <?php endif; ?>
</div>

<script>
function toggleInlineNewCar(value) {
  const container = document.getElementById('inline-new-car-fields');
  if (container) {
    container.style.display = (value === '-1') ? 'block' : 'none';
  }
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
