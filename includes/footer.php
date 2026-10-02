<?php
/**
 * CarCare Egypt - Global Footer Layout
 * الهيكل السفلي وبيانات التواصل والفروع - كار كير مصر
 */
?>
  </main>

  <!-- Global Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <!-- Column 1: Brand & Bio -->
        <div class="footer-col">
          <div class="brand-logo" style="color:#ffffff; margin-bottom:1.25rem;">
            <div class="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2"></path>
                <circle cx="7" cy="17" r="2"></circle>
                <path d="M9 17h6"></path>
                <circle cx="17" cy="17" r="2"></circle>
              </svg>
            </div>
            <span>كار كير <span style="color:#f97316;">مصر</span></span>
          </div>
          <p style="font-size:0.92rem; line-height:1.7; margin-bottom:1.25rem; color:#cbd5e1;">
            مركز الخدمة والصيانة الهندسي المتكامل في مصر. نقدم خدمات فحص كمبيوتر دقيقة، غيار زيوت أصلية، صيانة فرامل وتكييف وعفشة، وحجز مواعيد إلكتروني بدون انتظار.
          </p>
          <div style="font-size:0.85rem; color:#60a5fa; font-weight:700; line-height:1.5;">
            ✓ مهندسون وفنيون معتمدون &bull; ضمان معتمد 6 أشهر أو 10,000 كم &bull; فواتير ضريبية معتمدة
          </div>
        </div>

        <!-- Column 2: Quick Links -->
        <div class="footer-col">
          <h4>روابط سريعة</h4>
          <ul class="footer-links">
            <li><a href="<?= baseUrl('index.php') ?>">الرئيسية</a></li>
            <li><a href="<?= baseUrl('services.php') ?>">باقات وخدمات الصيانة</a></li>
            <li><a href="<?= baseUrl('booking.php') ?>">حجز موعد صيانة جديد</a></li>
            <li><a href="<?= baseUrl('about.php') ?>">عن المركز والفروع</a></li>
            <li><a href="<?= baseUrl('contact.php') ?>">فروعنا والتواصل</a></li>
          </ul>
        </div>

        <!-- Column 3: Customer Portal -->
        <div class="footer-col">
          <h4>بوابة الحسابات</h4>
          <ul class="footer-links">
            <?php if (isLoggedIn()): ?>
              <?php if (isAdmin()): ?>
                <li><a href="<?= baseUrl('admin/index.php') ?>">لوحة تحكم الإدارة</a></li>
                <li><a href="<?= baseUrl('admin/appointments.php') ?>">إدارة مواعيد العملاء</a></li>
                <li><a href="<?= baseUrl('admin/services.php') ?>">إدارة الخدمات والأسعار</a></li>
              <?php else: ?>
                <li><a href="<?= baseUrl('dashboard/index.php') ?>">لوحة تحكم العميل</a></li>
                <li><a href="<?= baseUrl('dashboard/cars.php') ?>">جراج سياراتي</a></li>
                <li><a href="<?= baseUrl('dashboard/appointments.php') ?>">مواعيدي المسجلة</a></li>
                <li><a href="<?= baseUrl('dashboard/profile.php') ?>">البيانات الشخصية</a></li>
              <?php endif; ?>
              <li><a href="<?= baseUrl('logout.php') ?>">تسجيل الخروج</a></li>
            <?php else: ?>
              <li><a href="<?= baseUrl('login.php') ?>">دخول العملاء</a></li>
              <li><a href="<?= baseUrl('register.php') ?>">إنشاء حساب عميل جديد</a></li>
              <li><a href="<?= baseUrl('login.php') ?>">دخول الإدارة والمهندسين</a></li>
            <?php endif; ?>
          </ul>
        </div>

        <!-- Column 4: Contact & Workshop Hours -->
        <div class="footer-col">
          <h4>فروعنا وأوقات العمل</h4>
          <div class="footer-contact-item">
            <span>📍</span>
            <span>
              <strong>الفرع الرئيسي:</strong> شارع التسعين الجنوبي، التجمع الخامس، القاهرة الجديدة
            </span>
          </div>
          <div class="footer-contact-item">
            <span>📍</span>
            <span>
              <strong>فرع الجيزة:</strong> 45 شارع البطل أحمد عبد العزيز، المهندسين
            </span>
          </div>
          <div class="footer-contact-item">
            <span>📞</span>
            <span>الخط الساخن: <strong>19824</strong> | واتساب: <strong>01030705465</strong></span>
          </div>
          <div class="footer-contact-item">
            <span>✉️</span>
            <span>خدمة العملاء: almetwaly088@gmail.com</span>
          </div>
          <div style="margin-top:1rem; padding-top:0.75rem; border-top:1px solid rgba(255,255,255,0.1); font-size:0.85rem; color:#94a3b8;">
            <strong>مواعيد العمل الرسمية:</strong><br>
            السبت – الخميس: 9:00 ص – 10:00 م<br>
            الجمعة: 1:30 م – 9:00 م (بعد صلاة الجمعة)
          </div>
        </div>
      </div>

      <!-- Accepted Payment & Partners Bar -->
      <div style="border-top:1px solid rgba(255,255,255,0.08); border-bottom:1px solid rgba(255,255,255,0.08); padding:1.25rem 0; margin-top:2.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.25rem; font-size:0.86rem; color:#94a3b8;">
        <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          <span style="color:#ffffff; font-weight:700;">طرق الدفع المتاحة بالفرع:</span>
          <span>💳 فيزا / ماستركارد</span>
          <span>&bull;</span>
          <span>🇪🇬 بطاقة ميزة الوطنية</span>
          <span>&bull;</span>
          <span>⚡ فوري وفودافون كاش</span>
          <span>&bull;</span>
          <span>💵 الدفع نقداً عند استلام السيارة</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <span style="color:#ffffff; font-weight:700;">شركاء الزيوت والفحص:</span>
          <span style="color:#f97316; font-weight:700;">Shell Helix</span>
          <span>&bull;</span>
          <span style="color:#ef4444; font-weight:700;">Mobil 1</span>
          <span>&bull;</span>
          <span style="color:#10b981; font-weight:700;">Castrol EDGE</span>
          <span>&bull;</span>
          <span style="color:#3b82f6; font-weight:700;">Launch &amp; Autel 3D</span>
        </div>
      </div>

      <!-- Bottom Credits & Legal Registration -->
      <div class="footer-bottom" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; padding:1.5rem 0 0.5rem;">
        <div>
          &copy; <?= date('Y') ?> مركز كار كير مصر الهندسي لصيانة السيارات (CarCare Egypt). جميع الحقوق محفوظة.
        </div>
        <div style="font-size:0.84rem; color:#94a3b8; display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          <span>سجل تجاري: <strong style="color:#e2e8f0;">489215</strong></span>
          <span>&bull;</span>
          <span>بطاقة ضريبية: <strong style="color:#e2e8f0;">612-840-391</strong></span>
          <span>&bull;</span>
          <span style="color:#10b981; font-weight:700;">✓ خاضع لجهاز حماية المستهلك المصري</span>
        </div>
      </div>
    </div>
  </footer>

  <!-- Floating WhatsApp & Multi-Channel Support Chooser Widget -->
  <div class="floating-whatsapp-widget" id="whatsapp-widget-container" style="position:fixed; bottom:24px; left:24px; z-index:9990; font-family:'Cairo', sans-serif;">
    <!-- Popup Card Chooser (Initially Hidden) -->
    <div id="whatsapp-popup-card" style="display:none; position:absolute; bottom:68px; left:0; width:340px; background:#ffffff; border-radius:18px; box-shadow:0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.08); border:1px solid #e2e8f0; overflow:hidden; z-index:9999;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg, #075e54, #128c7e); color:#ffffff; padding:1.25rem 1rem 1rem; position:relative;">
        <button type="button" onclick="toggleWhatsAppPopup()" style="position:absolute; top:12px; left:12px; background:rgba(0,0,0,0.2); border:none; color:#ffffff; width:26px; height:26px; border-radius:50%; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; line-height:1;">&times;</button>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:44px; height:44px; border-radius:50%; background:#25D366; display:flex; align-items:center; justify-content:center; color:#ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.2); flex-shrink:0;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.83.49 3.55 1.35 5.03L2 22l5.12-1.34C8.54 21.49 10.22 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.63 0-3.15-.46-4.45-1.26l-.32-.19-3.3 0.87.88-3.21-.21-.33C3.76 14.73 3.3 13.4 3.3 12c0-4.8 3.9-8.7 8.7-8.7 4.8 0 8.7 3.9 8.7 8.7 0 4.8-3.9 8.7-8.7 8.7z"/>
            </svg>
          </div>
          <div>
            <div style="font-weight:800; font-size:1.05rem; line-height:1.2;">كار كير مصر</div>
            <div style="font-size:0.78rem; color:#dcfce7; display:flex; align-items:center; gap:5px; margin-top:2px;">
              <span style="width:7px; height:7px; background:#4ade80; border-radius:50%; display:inline-block;"></span>
              فريق الاستقبال والصيانة متصل الآن
            </div>
          </div>
        </div>
        <p style="font-size:0.83rem; margin:0.85rem 0 0; color:#e0f2fe; line-height:1.5;">
          مرحباً بك! اختر طريقة التواصل المناسبة لخدمتك فورياً:
        </p>
      </div>

      <!-- Selection List -->
      <div style="padding:1rem; background:#f8fafc; display:flex; flex-direction:column; gap:0.65rem;">
        <!-- Option 1: WhatsApp Customer Service & Booking -->
        <a href="https://wa.me/201030705465?text=مرحباً%20مركز%20كار%20كير%20مصر،%20أرغب%20في%20الاستفسار%20عن%20صيانة%20سيارتي%20وحجز%20موعد"
           target="_blank"
           rel="noopener noreferrer"
           style="display:flex; align-items:center; gap:12px; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:10px 12px; text-decoration:none; color:#1e293b; transition:all 0.2s ease; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div style="width:36px; height:36px; border-radius:10px; background:#dcfce7; color:#15803d; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;">
            💬
          </div>
          <div style="flex-grow:1; text-align:right;">
            <div style="font-weight:700; font-size:0.88rem; color:#0f172a;">خدمة العملاء وحجز الصيانة</div>
            <div style="font-size:0.78rem; color:#16a34a; font-weight:700; font-family:sans-serif;" dir="ltr">01030705465</div>
          </div>
          <div style="color:#25D366; font-size:15px; font-weight:800;">&larr;</div>
        </a>

        <!-- Option 2: WhatsApp Technical Consultation & Roadside -->
        <a href="https://wa.me/201030705465?text=مرحباً%20المهندس%20المسؤول%20في%20كار%20كير%20مصر،%20أحتاج%20استشارة%20هندسية%20أو%20طوارئ%20طريق%20لسيارتي"
           target="_blank"
           rel="noopener noreferrer"
           style="display:flex; align-items:center; gap:12px; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:10px 12px; text-decoration:none; color:#1e293b; transition:all 0.2s ease; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div style="width:36px; height:36px; border-radius:10px; background:#fef3c7; color:#b45309; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;">
            🛠️
          </div>
          <div style="flex-grow:1; text-align:right;">
            <div style="font-weight:700; font-size:0.88rem; color:#0f172a;">الاستشارات الفنية وطوارئ الطريق</div>
            <div style="font-size:0.78rem; color:#d97706; font-weight:700; font-family:sans-serif;" dir="ltr">01030705465</div>
          </div>
          <div style="color:#25D366; font-size:15px; font-weight:800;">&larr;</div>
        </a>

        <!-- Option 3: Direct Gmail Support -->
        <a href="mailto:almetwaly088@gmail.com?subject=استفسار%20عن%20خدمات%20وصيانة%20كار%20كير%20مصر"
           style="display:flex; align-items:center; gap:12px; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:10px 12px; text-decoration:none; color:#1e293b; transition:all 0.2s ease; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div style="width:36px; height:36px; border-radius:10px; background:#eff6ff; color:#1d4ed8; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;">
            ✉️
          </div>
          <div style="flex-grow:1; text-align:right;">
            <div style="font-weight:700; font-size:0.88rem; color:#0f172a;">مراسلة الإدارة عبر Gmail</div>
            <div style="font-size:0.78rem; color:#2563eb; font-weight:700; font-family:sans-serif;" dir="ltr">almetwaly088@gmail.com</div>
          </div>
          <div style="color:#2563eb; font-size:15px; font-weight:800;">&larr;</div>
        </a>

        <!-- Option 4: Direct Phone Call -->
        <a href="tel:01030705465"
           style="display:flex; align-items:center; justify-content:center; gap:8px; background:#0f172a; color:#ffffff; border-radius:10px; padding:9px; text-decoration:none; font-size:0.84rem; font-weight:700;">
          <span>📞</span>
          <span>اتصال هاتفي مباشر: 01030705465</span>
        </a>
      </div>
    </div>

    <!-- Floating Toggle Button -->
    <button type="button" 
            onclick="toggleWhatsAppPopup()"
            class="floating-whatsapp-btn" 
            id="floating-whatsapp-toggle-btn"
            title="تواصل مع كار كير مصر"
            style="display:flex; align-items:center; gap:10px; background:#25D366; color:#ffffff; padding:10px 18px; border-radius:50px; font-weight:700; font-size:0.9rem; border:2px solid #ffffff; box-shadow:0 8px 24px rgba(37,211,102,0.4); cursor:pointer; transition:all 0.25s ease;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.83.49 3.55 1.35 5.03L2 22l5.12-1.34C8.54 21.49 10.22 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.63 0-3.15-.46-4.45-1.26l-.32-.19-3.3 0.87.88-3.21-.21-.33C3.76 14.73 3.3 13.4 3.3 12c0-4.8 3.9-8.7 8.7-8.7 4.8 0 8.7 3.9 8.7 8.7 0 4.8-3.9 8.7-8.7 8.7z"/>
      </svg>
      <span>تواصل واتساب</span>
      <span style="background:#ffffff; color:#15803d; border-radius:50%; width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; font-size:11px; font-weight:800;">2</span>
    </button>
  </div>

  <script>
  function toggleWhatsAppPopup() {
    const card = document.getElementById('whatsapp-popup-card');
    if (card) {
      card.style.display = (card.style.display === 'none' || card.style.display === '') ? 'block' : 'none';
    }
  }
  document.addEventListener('click', function(e) {
    const container = document.getElementById('whatsapp-widget-container');
    const card = document.getElementById('whatsapp-popup-card');
    if (container && card && !container.contains(e.target)) {
      card.style.display = 'none';
    }
  });
  </script>

  <!-- Vanilla JavaScript -->
  <script src="<?= baseUrl('assets/js/script.js') ?>"></script>
</body>
</html>
