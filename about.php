<?php
/**
 * CarCare Egypt - About Us
 * عن المركز وفروعنا - كار كير مصر
 */
$pageTitle = "عن المركز وفروعنا | كار كير مصر - هندسة صيانة السيارات";
$activeNav = "about";

require_once __DIR__ . '/includes/header.php';
?>

<div class="container section">
  <div class="section-header">
    <span class="section-tag">معايير هندسية متطورة</span>
    <h1 class="section-title">دقة في التشخيص.. أمانة في الصيانة</h1>
    <p class="section-subtitle">
      تأسس مركز كار كير مصر لتقديم أعلى مستوى من الجودة الهندسية وشفافية الأسعار لمالكي السيارات في مصر بعيداً عن مبالغات التوكيلات وعشوائية الورش التقليدية.
    </p>
  </div>

  <!-- Story & Vision Grid -->
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:center; margin-bottom:5rem;">
    <div>
      <h2 style="font-size:1.85rem; font-weight:800; color:var(--dark); margin-bottom:1rem;">
        صيانة سيارات بمواصفات التوكيل وبأسعار عادلة
      </h2>
      <p style="color:var(--text-muted); font-size:1.05rem; line-height:1.8; margin-bottom:1.25rem;">
        تأسس مركز <strong>كار كير مصر (CarCare Egypt)</strong> على يد نخبة من مهندسي ميكانيكا السيارات وخريجي كليات الهندسة المصرية ومراكز تدريب وكلاء السيارات العالمية. بدأنا من ورشة فحص وتشخيص إلكتروني متقدمة، واليوم نخدم أكثر من 18,500 سيارة سنوياً عبر 4 فروع رئيسية في القاهرة والجيزة.
      </p>
      <p style="color:var(--text-muted); font-size:1.05rem; line-height:1.8; margin-bottom:1.5rem;">
        السيارات الحديثة أصبحت أجهزة كمبيوتر تسير على الطرقات؛ لذلك نستثمر سنوياً في أحدث اشتراكات برامج التشخيص المصنعية لأجهزة Launch و Autel، وأحدث أجهزة ضبط الزوايا ثلاثية الأبعاد 3D لضمان أن كل فحص أو إصلاح يتم وفق كتالوج المصنع بالضبط.
      </p>
      
      <div style="display:flex; gap:2rem; border-top:1px solid var(--border-color); padding-top:1.5rem;">
        <div>
          <div style="font-size:1.6rem; font-weight:900; color:var(--primary);">100%</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">قطع غيار وزيوت أصلية</div>
        </div>
        <div>
          <div style="font-size:1.6rem; font-weight:900; color:var(--primary);">6 أشهر</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">ضمان معتمد على الإصلاحات</div>
        </div>
        <div>
          <div style="font-size:1.6rem; font-weight:900; color:var(--primary);">18.5k+</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">سائق يثقون بنا سنوياً</div>
        </div>
      </div>
    </div>

    <div>
      <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80" 
           alt="حارات الصيانة الحديثة في كار كير مصر" 
           style="border-radius:var(--radius-lg); box-shadow:var(--shadow-xl); width:100%; height:380px; object-fit:cover;">
    </div>
  </div>

  <!-- Mission and Vision Cards -->
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem; margin-bottom:5rem;">
    <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:2.5rem; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">
      <div style="font-size:2rem; margin-bottom:1rem;">🎯</div>
      <h3 style="font-size:1.35rem; font-weight:800; color:var(--dark); margin-bottom:0.75rem;">رؤيتنا الهندسية</h3>
      <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.8;">
        أن نكون الوجهة الأولى والموثوقة في مصر لكل من يبحث عن صيانة هندسية دقيقة تحافظ على قيمة سيارته وعمره الافتراضي، مع القضاء التام على ثقافة التخمين وتغيير القطع السليمة دون داعٍ.
      </p>
    </div>

    <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:2.5rem; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">
      <div style="font-size:2rem; margin-bottom:1rem;">🛡️</div>
      <h3 style="font-size:1.35rem; font-weight:800; color:var(--dark); margin-bottom:0.75rem;">ميثاق الأمانة والشفافية</h3>
      <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.8;">
        نلتزم بإطلاع العميل على القطع القديمة المستبدلة، وتقديم فاتورة ضريبية رسمية مفصلة بالقطع والمصنعيات، وضمان حق العميل في التجربة والتأكد التام قبل مغادرة الفرع.
      </p>
    </div>
  </div>

  <!-- Branches Showcase -->
  <div class="section-header" style="margin-bottom:2.5rem;">
    <span class="section-tag">فروعنا في القاهرة الكبرى</span>
    <h2 class="section-title">أقرب إليك في كل مكان</h2>
  </div>

  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.5rem;">
    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.5rem;">
      <h4 style="font-size:1.1rem; font-weight:800; color:var(--primary); margin-bottom:0.5rem;">📍 فرع التجمع الخامس</h4>
      <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6;">شارع التسعين الجنوبي، خلف كونكورد بلازا ومجمع البنوك، القاهرة الجديدة.</p>
    </div>

    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.5rem;">
      <h4 style="font-size:1.1rem; font-weight:800; color:var(--primary); margin-bottom:0.5rem;">📍 فرع مدينة نصر</h4>
      <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6;">تقاطع طريق النصر مع شارع مكرم عبيد، بجوار سيتي ستارز، القاهرة.</p>
    </div>

    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.5rem;">
      <h4 style="font-size:1.1rem; font-weight:800; color:var(--primary); margin-bottom:0.5rem;">📍 فرع المهندسين</h4>
      <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6;">45 شارع البطل أحمد عبد العزيز، متفرع من شارع جامعة الدول العربية، الجيزة.</p>
    </div>

    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.5rem;">
      <h4 style="font-size:1.1rem; font-weight:800; color:var(--primary); margin-bottom:0.5rem;">📍 فرع الشيخ زايد</h4>
      <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.6;">محور 26 يوليو، مدخل زايد 2، بجوار هايبر وان، مدينة 6 أكتوبر.</p>
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
