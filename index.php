<?php
/**
 * CarCare Egypt - Home Page
 * الصفحة الرئيسية - كار كير مصر
 */
$pageTitle = "كار كير مصر | اهتم بسيارتك.. وسيب الباقي علينا - المركز المعتمد لصيانة السيارات";
$activeNav = "home";

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/header.php';

// Fetch popular active services from MySQL database
try {
    $pdo = getDBConnection();
    $stmt = $pdo->query("SELECT * FROM services ORDER BY id ASC LIMIT 6");
    $popularServices = $stmt->fetchAll();
} catch (Exception $e) {
    $popularServices = [];
}
?>

<!-- Hero Section -->
<section class="hero-section">
  <div class="container">
    <div class="hero-grid">
      <!-- Left Column: Copy & CTAs -->
      <div class="hero-content">
        <div class="hero-badge">
          <span>⚡</span> المركز الهندسي المعتمد لخدمة وصيانة السيارات في مصر
        </div>
        <h1 class="hero-title">
          اهتم بسيارتك.. <span class="highlight">وسيب الباقي علينا</span>
        </h1>
        <p class="hero-desc">
          صيانة سيارات احترافية بمعايير عالمية على أرض مصرية. احجز موعد صيانة سيارتك أونلاين بكل سهولة، ووفر وقتك مع نخبة من مهندسي السيارات المعتمدين وأحدث أجهزة الفحص بالكمبيوتر وقطع غيار أصلية بضمان حقيقي.
        </p>

        <div class="hero-buttons">
          <a href="<?= baseUrl('booking.php') ?>" class="btn btn-primary btn-lg" id="hero-book-btn">
            <span>📅</span> احجز موعد صيانة الآن
          </a>
          <a href="<?= baseUrl('services.php') ?>" class="btn btn-secondary btn-lg" id="hero-services-btn" style="background:rgba(255,255,255,0.1); color:#fff; border-color:rgba(255,255,255,0.2);">
            استكشف باقات الصيانة والأسعار
          </a>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-num">18,500+</div>
            <div class="stat-label">سيارة تمت صيانتها</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">99.4%</div>
            <div class="stat-label">نسبة رضا العملاء</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">6 أشهر</div>
            <div class="stat-label">ضمان معتمد على الصيانة</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Visual Feature Box -->
      <div class="hero-visual">
        <div class="hero-card-preview">
          <img src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80" alt="ورشة كار كير مصر لصيانة السيارات" loading="lazy">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:800; font-size:1.1rem; color:#fff;">ورش الخدمة المباشرة</div>
              <div style="font-size:0.85rem; color:#94a3b8;">12 حارة صيانة هيدروليكية تعمل حالياً</div>
            </div>
            <div class="live-status-pill">
              <span class="live-dot"></span> نستقبل السيارات الآن
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Popular Services Section -->
<section class="section" id="services">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">باقات وأسعار الصيانة</span>
      <h2 class="section-title">أشهر خدمات الصيانة المطلوبة</h2>
      <p class="section-subtitle">صيانة دورية معتمدة وفحص إلكتروني دقيق بالكمبيوتر للحفاظ على أداء المحرك وأمان سيارتك على الطرق.</p>
    </div>

    <div class="services-grid">
      <?php if (!empty($popularServices)): ?>
        <?php foreach ($popularServices as $service): ?>
          <div class="service-card">
            <img src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80" alt="<?= e($service['name']) ?>" class="service-card-img" loading="lazy">
            <div class="service-card-body">
              <div class="service-meta-top">
                <span class="service-duration">⏱️ <?= e($service['duration']) ?></span>
                <span class="service-price"><?= formatPrice($service['price']) ?></span>
              </div>
              <h3 class="service-title"><?= e($service['name']) ?></h3>
              <p class="service-desc"><?= e($service['description']) ?></p>
              <div class="service-card-footer">
                <a href="<?= baseUrl('booking.php?service_id=' . $service['id']) ?>" class="btn btn-primary btn-block btn-sm">
                  احجز هذه الخدمة
                </a>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      <?php else: ?>
        <p style="text-align:center; grid-column:1/-1; color:var(--text-muted);">لا توجد خدمات متاحة في الوقت الحالي.</p>
      <?php endif; ?>
    </div>

    <div style="text-align:center; margin-top:2.5rem;">
      <a href="<?= baseUrl('services.php') ?>" class="btn btn-secondary">
        عرض جميع خدمات الصيانة والأسعار (8 خدمات) &larr;
      </a>
    </div>
  </div>
</section>

<!-- How It Works Section -->
<section class="section section-alt" id="how-it-works">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">خطوات سهلة وبسيطة</span>
      <h2 class="section-title">كيف يعمل مركز كار كير مصر؟</h2>
      <p class="section-subtitle">احجز وافحص سيارتك في أربع خطوات شفافة ومريحة بدون أي انتظار في الورش.</p>
    </div>

    <div class="steps-grid">
      <div class="step-card">
        <div class="step-num">1</div>
        <h3 class="step-title">اختر الخدمة المطلوبة</h3>
        <p class="step-desc">اختر من بين غيار الزيت التخليقي، كشف كمبيوتر الأعطال، تيل وطنابير الفرامل، التكييف أو الصيانة الشاملة بأسعار واضحة ومحددة.</p>
      </div>

      <div class="step-card">
        <div class="step-num">2</div>
        <h3 class="step-title">حدد الفرع والوقت المناسب</h3>
        <p class="step-desc">اختر الفرع الأقرب لك (التجمع الخامس، مدينة نصر، المهندسين، أو الشيخ زايد) وحدد التاريخ والساعة المناسبة لك.</p>
      </div>

      <div class="step-card">
        <div class="step-num">3</div>
        <h3 class="step-title">سلّم سيارتك للفحص</h3>
        <p class="step-desc">استقبل مهندس الصيانة لعمل فحص مبدئي وشرح خطة العمل، مع إمكانية متابعة حالة الصيانة لحظياً من حسابك.</p>
      </div>

      <div class="step-card">
        <div class="step-num">4</div>
        <h3 class="step-title">استلم سيارتك مع الضمان</h3>
        <p class="step-desc">استلم تقرير فحص تفصيلي وفاتورة ضريبية رسمية، مع ضمان معتمد لمدة 6 أشهر أو 10,000 كم على جميع الإصلاحات.</p>
      </div>
    </div>
  </div>
</section>

<!-- Why Choose CarCare Section -->
<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">معايير كار كير الهندسية</span>
      <h2 class="section-title">لماذا يفضل عملاؤنا الصيانة معنا؟</h2>
      <p class="section-subtitle">نجمع بين الخبرة الهندسية العميقة وأحدث تكنولوجيا تشخيص أعطال السيارات العالمية.</p>
    </div>

    <div class="features-grid">
      <div class="feature-box">
        <div class="feature-icon-wrap">🛠️</div>
        <h3>مهندسون وفنيون معتمدون</h3>
        <p>فريق فني خريج مراكز تدريب وكلاء السيارات العالمية مع إشراف مباشر من مهندسين ميكانيكا ونظم إلكترونية متخصصة.</p>
      </div>

      <div class="feature-box">
        <div class="feature-icon-wrap">💻</div>
        <h3>أحدث أجهزة فحص Launch و Autel</h3>
        <p>فحص كمبيوتر بأحدث الإصدارات المصنعية لكشف أدق الأعطال في الكنترول، الحساسات، والفتيس الأوتوماتيك والـ CVT.</p>
      </div>

      <div class="feature-box">
        <div class="feature-icon-wrap">🛡️</div>
        <h3>قطع غيار أصلية بضمان رسمي</h3>
        <p>نستخدم قطع غيار أصلية OEM معتمدة من الوكلاء، مع شهادة ضمان معتمدة وفاتورة ضريبية إلكترونية رسمية تحميك تماماً.</p>
      </div>

      <div class="feature-box">
        <div class="feature-icon-wrap">💵</div>
        <h3>أسعار ثابتة وشفافية مطلقة</h3>
        <p>لا مفاجآت أو تكاليف غير مبررة؛ نطلعك على المقايسة الكاملة وأسعار القطع قبل فك أي جزء أو بدء العمل.</p>
      </div>
    </div>
  </div>
</section>

<!-- Customer Testimonials Section (Real Egyptian Reviews) -->
<section class="section section-alt">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">آراء وتقييمات العملاء</span>
      <h2 class="section-title">ماذا يقول عملاؤنا في مصر؟</h2>
      <p class="section-subtitle">أكثر من 18,500 عميل في القاهرة والجيزة يعتمدون على كار كير لضمان أمان سياراتهم وعائلاتهم.</p>
    </div>

    <div class="testimonials-grid">
      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-text">
          "عملت صيانة الـ 40,000 كم لسيارتي إلنترا في فرع التجمع الخامس.. شغل هندسي نظيف جداً وفحص كمبيوتر طمني على حالة الفتيس والموتور، وأحلى حاجة الفاتورة واضحة بالقرش بدون استغلال."
        </p>
        <div class="testimonial-author">
          <div class="author-avatar">أش</div>
          <div>
            <div class="author-name">م. أحمد السيد الشناوي</div>
            <div class="author-meta">مالك هيونداي إلنترا CN7 - القاهرة الجديدة</div>
          </div>
        </div>
      </div>

      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-text">
          "شحنت التكييف فريون فرنسي أصلي عندكم وفحصتوا تسريب الكباس في فرع مدينة نصر، التكييف شغال تلاجة في عز زحمة وحر القاهرة! شكراً للمهندس محمد وطاقم الفنيين."
        </p>
        <div class="testimonial-author">
          <div class="author-avatar">سج</div>
          <div>
            <div class="author-name">أ. سارة الجوهري</div>
            <div class="author-meta">مالكة نيسان صني N17 - مدينة نصر</div>
          </div>
        </div>
      </div>

      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-text">
          "قبل ما أسافر الساحل عملت فحص شامل وظبطت زوايا وترصيص كمبيوتر 3D، الثبات على الطريق بقى ممتاز والرعشة في الدركسيون اختفت تماماً. مركز محترم يستاهل كل تقدير."
        </p>
        <div class="testimonial-author">
          <div class="author-avatar">مح</div>
          <div>
            <div class="author-name">م. محمود حسن علي</div>
            <div class="author-meta">مالك فيات تيبو هاتشباك - المهندسين</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Call to Action Banner -->
<section style="background:linear-gradient(135deg, #1e3a8a, #0f172a); color:#fff; padding:4.5rem 0; text-align:center;">
  <div class="container">
    <h2 style="font-size:2.3rem; font-weight:900; margin-bottom:1rem; letter-spacing:-0.02em;">جاهز لقيادة أكثر أماناً وراحة لسيارتك؟</h2>
    <p style="font-size:1.15rem; color:#cbd5e1; max-width:650px; margin:0 auto 2rem; line-height:1.7;">
      احجز موعد صيانتك اليوم في أقرب فرع لك (التجمع الخامس، مدينة نصر، المهندسين، أو الشيخ زايد) وتمتع بخدمة التوكيل بدون أسعار التوكيل.
    </p>
    <a href="<?= baseUrl('booking.php') ?>" class="btn btn-secondary btn-lg" style="color:var(--primary); font-weight:800; padding:1rem 2.5rem;">
      احجز موعد الصيانة الآن
    </a>
  </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
