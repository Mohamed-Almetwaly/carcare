<?php
/**
 * CarCare Egypt - Maintenance Services Catalog
 * دليل خدمات الصيانة والأسعار المعتمدة - كار كير مصر
 */
$pageTitle = "خدمات الصيانة والأسعار | كار كير مصر - مركز خدمة وصيانة السيارات";
$activeNav = "services";

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/header.php';

// Fetch all active services from MySQL database
try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("SELECT * FROM services ORDER BY id ASC");
    $services = $stmt->fetchAll();
} catch (Exception $e) {
    $services = [];
}

// Category mapping helper for Arabic keywords
function getServiceCategory($name): string {
    $nameLower = mb_strtolower($name, 'UTF-8');
    if (str_contains($nameLower, 'زيت') || str_contains($nameLower, 'oil')) return 'engine';
    if (str_contains($nameLower, 'كمبيوتر') || str_contains($nameLower, 'كشف') || str_contains($nameLower, 'obd') || str_contains($nameLower, 'diagnostic')) return 'diagnostic';
    if (str_contains($nameLower, 'فرامل') || str_contains($nameLower, 'تيل') || str_contains($nameLower, 'طنابير') || str_contains($nameLower, 'brake')) return 'brakes';
    if (str_contains($nameLower, 'زوايا') || str_contains($nameLower, 'ترصيص') || str_contains($nameLower, 'إطارات') || str_contains($nameLower, 'كاوتش') || str_contains($nameLower, 'wheel')) return 'tires';
    if (str_contains($nameLower, 'تكييف') || str_contains($nameLower, 'بطارية') || str_contains($nameLower, 'دينامو') || str_contains($nameLower, 'كهرباء') || str_contains($nameLower, 'ac')) return 'electrical';
    return 'general';
}
?>

<div class="container section">
  <div class="section-header">
    <span class="section-tag">قائمة الأسعار المعتمدة بالجنيه المصري (ج.م)</span>
    <h1 class="section-title">خدمات وباقات صيانة السيارات</h1>
    <p class="section-subtitle">
      نقدم صيانة شاملة للسيارات الكورية، اليابانية، الأوروبية والصينية. تشمل كل باقة فحصاً هندسياً مجانياً لـ 20 نقطة أمان وسوائل المحرك مع قطع غيار أصلية بضمان رسمي.
    </p>
  </div>

  <!-- Search & Category Filters -->
  <div class="filter-bar">
    <div class="search-input-wrap">
      <span class="search-icon">🔍</span>
      <input type="text" id="service-search-input" placeholder="ابحث باسم الخدمة (مثال: زيت، فرامل، تكييف، كمبيوتر، عفشة)..." autocomplete="off">
    </div>

    <div class="filter-categories">
      <button type="button" class="filter-btn active" data-category="all">جميع الخدمات</button>
      <button type="button" class="filter-btn" data-category="engine">الزيوت والمحرك</button>
      <button type="button" class="filter-btn" data-category="diagnostic">كشف الكمبيوتر والأعطال</button>
      <button type="button" class="filter-btn" data-category="brakes">الفرامل والطنابير</button>
      <button type="button" class="filter-btn" data-category="tires">الإطارات وضبط الزوايا</button>
      <button type="button" class="filter-btn" data-category="electrical">التكييف والبطارية</button>
    </div>
  </div>

  <!-- Services Grid -->
  <div class="services-grid" id="services-grid-container">
    <?php if (!empty($services)): ?>
      <?php foreach ($services as $service): 
        $cat = getServiceCategory($service['name']);
      ?>
        <div class="service-card service-card-item" 
             data-name="<?= e(mb_strtolower($service['name'], 'UTF-8')) ?>"
             data-desc="<?= e(mb_strtolower($service['description'], 'UTF-8')) ?>"
             data-category="<?= e($cat) ?>">
          <img src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80" alt="<?= e($service['name']) ?>" class="service-card-img" loading="lazy">
          
          <div class="service-card-body">
            <div class="service-meta-top">
              <span class="service-duration">⏱️ <?= e($service['duration']) ?></span>
              <span class="service-price"><?= formatPrice($service['price']) ?></span>
            </div>
            
            <h3 class="service-title"><?= e($service['name']) ?></h3>
            <p class="service-desc"><?= e($service['description']) ?></p>

            <div class="service-card-footer" style="display:flex; gap:0.5rem;">
              <button type="button" 
                      class="btn btn-secondary btn-sm" 
                      style="flex:1;"
                      onclick="openServiceDetailsModal(<?= htmlspecialchars(json_encode($service, JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8') ?>)">
                تفاصيل الخدمة
              </button>
              <a href="<?= baseUrl('booking.php?service_id=' . $service['id']) ?>" class="btn btn-primary btn-sm" style="flex:1;">
                حجز موعد
              </a>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    <?php endif; ?>
  </div>

  <!-- Empty State when filter yields 0 matches -->
  <div id="services-empty-state" class="empty-state" style="display:none;">
    <div class="empty-state-icon">🔧</div>
    <h3>لم يتم العثور على خدمات مطابقة</h3>
    <p>يرجى كتابة كلمة بحث أخرى أو إلغاء تصفية الفئات لعرض جميع الخدمات المتاحة.</p>
  </div>
</div>

<!-- Service Details Modal -->
<div class="modal-overlay" id="service-details-modal">
  <div class="modal-card">
    <div class="modal-header">
      <h3 id="modal-service-name">تفاصيل خدمة الصيانة</h3>
      <button type="button" class="modal-close-btn modal-close-trigger">&times;</button>
    </div>
    <div class="modal-body">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color);">
        <div>
          <span style="font-size:0.85rem; color:var(--text-muted); display:block;">المدة التقريبية للصيانة</span>
          <div id="modal-service-duration" style="font-weight:800; color:var(--dark);">--</div>
        </div>
        <div style="text-align:left;">
          <span style="font-size:0.85rem; color:var(--text-muted); display:block;">السعر التقديري المعتمد</span>
          <div id="modal-service-price" style="font-size:1.45rem; font-weight:900; color:var(--primary);">--</div>
        </div>
      </div>

      <h4 style="font-size:1rem; margin-bottom:0.5rem; color:var(--dark);">وصف ونطاق العمل الهندسي</h4>
      <p id="modal-service-desc" style="color:var(--text-muted); font-size:0.95rem; line-height:1.7; margin-bottom:1.5rem;">--</p>

      <div style="background:var(--bg-page); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <h5 style="font-size:0.95rem; font-weight:800; color:var(--dark); margin-bottom:0.6rem;">ما تشمله الخدمة في مركز كار كير مصر:</h5>
        <ul style="padding-right:1.25rem; font-size:0.9rem; color:#475569; line-height:1.8;">
          <li>فحص مجاني لمستوى جميع سوائل المحرك والفرامل والتبريد ومياه المساحات.</li>
          <li>استخدام قطع غيار وزيوت أصلية معتمدة من كبرى الشركات العالمية (Mobil, Shell, Bosch, Mann).</li>
          <li>تقرير فحص هندسي مطبوع بحالة السيارة وأي توصيات فنية مستقبلية.</li>
          <li>ضمان رسمي معتمد لمدة 6 أشهر أو 10,000 كم على جميع المصنعيات وقطع الغيار.</li>
        </ul>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary btn-sm modal-close-trigger">إغلاق</button>
      <a href="#" id="modal-book-now-btn" class="btn btn-primary btn-sm">المتابعة لحجز الموعد</a>
    </div>
  </div>
</div>

<script>
function openServiceDetailsModal(service) {
  document.getElementById('modal-service-name').textContent = service.name;
  document.getElementById('modal-service-duration').textContent = service.duration;
  document.getElementById('modal-service-price').textContent = Math.round(parseFloat(service.price)) + ' ج.م';
  document.getElementById('modal-service-desc').textContent = service.description;
  document.getElementById('modal-book-now-btn').href = '<?= baseUrl("booking.php?service_id=") ?>' + service.id;
  openModal('service-details-modal');
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
