<?php
/**
 * CarCare Egypt - Admin Contact Messages Manager
 * إدارة استفسارات ورسائل العملاء - كار كير مصر
 */
$pageTitle = "استفسارات العملاء | كار كير مصر";
$activeNav = "admin-messages";

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

requireRole('admin');

$pdo = getDBConnection();
$errors = [];

// Handle actions: Mark as Read / Replied, Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $errors[] = 'رمز الأمان غير صالح.';
    } else {
        $action    = $_POST['action'] ?? '';
        $messageId = (int)($_POST['message_id'] ?? 0);

        if ($action === 'mark_read') {
            $stmt = $pdo->prepare("UPDATE contact_messages SET status = 'Read' WHERE id = ?");
            $stmt->execute([$messageId]);
            setFlash('success', 'تم تحديد الرسالة كمقروءة.');
            header('Location: ' . baseUrl('admin/messages.php'));
            exit;
        } elseif ($action === 'delete') {
            $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = ?");
            $stmt->execute([$messageId]);
            setFlash('info', 'تم حذف الرسالة بنجاح.');
            header('Location: ' . baseUrl('admin/messages.php'));
            exit;
        }
    }
}

// Filter status
$filter = $_GET['filter'] ?? 'all';
$sql = "SELECT * FROM contact_messages";
$params = [];

if ($filter === 'unread') {
    $sql .= " WHERE status = 'Unread'";
} elseif ($filter === 'read') {
    $sql .= " WHERE status = 'Read'";
}

$sql .= " ORDER BY id DESC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $messages = $stmt->fetchAll();
} catch (PDOException $e) {
    $messages = [];
}

// If viewing a message directly
$viewId = (int)($_GET['view'] ?? 0);
$currentMsg = null;
if ($viewId > 0) {
    $vStmt = $pdo->prepare("SELECT * FROM contact_messages WHERE id = ?");
    $vStmt->execute([$viewId]);
    $currentMsg = $vStmt->fetch();

    if ($currentMsg && $currentMsg['status'] === 'Unread') {
        // Automatically mark as read when opened
        $upd = $pdo->prepare("UPDATE contact_messages SET status = 'Read' WHERE id = ?");
        $upd->execute([$viewId]);
        $currentMsg['status'] = 'Read';
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
      <a href="<?= baseUrl('admin/customers.php') ?>" class="sidebar-link">
        <span>👥</span> دليل وسجلات العملاء
      </a>
      <a href="<?= baseUrl('admin/services.php') ?>" class="sidebar-link">
        <span>🔧</span> باقات وخدمات الصيانة
      </a>
      <a href="<?= baseUrl('admin/messages.php') ?>" class="sidebar-link active">
        <span>💬</span> استفسارات ورسائل العملاء
      </a>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="dashboard-content">
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
      <div>
        <h1 style="font-size:1.75rem; font-weight:900; color:var(--dark); margin-bottom:0.25rem;">
          صندوق استفسارات وطلبات العملاء
        </h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          الرسائل والاستفسارات الفنية الواردة من خلال نموذج اتصل بنا بموقع كار كير مصر.
        </p>
      </div>
    </div>

    <?php if (!empty($errors)): ?>
      <div class="alert alert-error">
        <div><?= e($errors[0]) ?></div>
      </div>
    <?php endif; ?>

    <!-- Filter Buttons -->
    <div class="filter-categories" style="margin-bottom:1.5rem;">
      <a href="<?= baseUrl('admin/messages.php?filter=all') ?>" class="filter-btn <?= $filter === 'all' ? 'active' : '' ?>">جميع الرسائل</a>
      <a href="<?= baseUrl('admin/messages.php?filter=unread') ?>" class="filter-btn <?= $filter === 'unread' ? 'active' : '' ?>">غير المقروءة</a>
      <a href="<?= baseUrl('admin/messages.php?filter=read') ?>" class="filter-btn <?= $filter === 'read' ? 'active' : '' ?>">المقروءة</a>
    </div>

    <!-- Messages Table -->
    <div class="table-card">
      <?php if (!empty($messages)): ?>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>اسم الراسل</th>
                <th>بيانات الاتصال</th>
                <th>مقتطف الرسالة</th>
                <th>الحالة</th>
                <th>تاريخ الاستلام</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($messages as $msg): ?>
                <tr style="<?= $msg['status'] === 'Unread' ? 'background:rgba(30, 58, 138, 0.04); font-weight:700;' : '' ?>">
                  <td>
                    <?= e($msg['name']) ?>
                  </td>
                  <td>
                    <?= e($msg['email']) ?><br>
                    <small style="color:var(--text-muted); font-family:sans-serif;"><?= e($msg['phone'] ?: 'بدون رقم') ?></small>
                  </td>
                  <td style="max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    <?= e($msg['message']) ?>
                  </td>
                  <td>
                    <span class="badge <?= $msg['status'] === 'Unread' ? 'badge-pending' : 'badge-completed' ?>">
                      <?= $msg['status'] === 'Unread' ? 'غير مقروءة' : 'تم الاطلاع' ?>
                    </span>
                  </td>
                  <td style="font-size:0.85rem; color:var(--text-muted);">
                    <?= formatDate($msg['created_at']) ?>
                  </td>
                  <td>
                    <div style="display:flex; gap:0.4rem;">
                      <a href="<?= baseUrl('admin/messages.php?view=' . $msg['id']) ?>" class="btn btn-secondary btn-sm" style="padding:0.25rem 0.6rem; font-size:0.8rem;">
                        قراءة
                      </a>
                      <form action="<?= baseUrl('admin/messages.php') ?>" method="POST" onsubmit="return confirm('هل تريد حذف رسالة <?= e($msg['name']) ?>؟');" style="margin:0;">
                        <?= csrfField() ?>
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="message_id" value="<?= $msg['id'] ?>">
                        <button type="submit" class="btn btn-danger btn-sm" style="padding:0.25rem 0.5rem; font-size:0.8rem;">
                          🗑️
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
          <div class="empty-state-icon">💬</div>
          <h3>لا توجد رسائل واردة</h3>
          <p>لم يتم العثور على أي رسائل ضمن هذا التصنيف.</p>
        </div>
      <?php endif; ?>
    </div>
  </main>
</div>

<!-- Modal: View Message -->
<?php if ($currentMsg): ?>
<div class="modal-overlay active" id="view-message-modal">
  <div class="modal-card">
    <div class="modal-header">
      <h3>رسالة من: <?= e($currentMsg['name']) ?></h3>
      <a href="<?= baseUrl('admin/messages.php') ?>" class="modal-close-btn">&times;</a>
    </div>
    <div class="modal-body">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; padding-bottom:1rem; margin-bottom:1rem; border-bottom:1px solid var(--border-color); font-size:0.9rem;">
        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; display:block;">البريد الإلكتروني</span>
          <a href="mailto:<?= e($currentMsg['email']) ?>" style="color:var(--primary); font-weight:700;"><?= e($currentMsg['email']) ?></a>
        </div>
        <div>
          <span style="color:var(--text-muted); font-size:0.8rem; display:block;">رقم الموبايل</span>
          <strong style="font-family:sans-serif;"><?= e($currentMsg['phone'] ?: 'غير متوفر') ?></strong>
        </div>
      </div>

      <div style="background:var(--bg-page); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <strong style="display:block; font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">نص الرسالة والاستفسار:</strong>
        <p style="white-space:pre-wrap; color:var(--dark); line-height:1.7; margin:0; font-size:0.95rem;">
          <?= e($currentMsg['message']) ?>
        </p>
      </div>
    </div>
    <div class="modal-footer">
      <a href="mailto:<?= e($currentMsg['email']) ?>?subject=رد%20من%20مركز%20كار%20كير%20مصر%20لصيانة%20السيارات" class="btn btn-primary btn-sm">
        ✉️ الرد عبر البريد الإلكتروني
      </a>
      <a href="<?= baseUrl('admin/messages.php') ?>" class="btn btn-secondary btn-sm">
        إغلاق النافذة
      </a>
    </div>
  </div>
</div>
<?php endif; ?>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
