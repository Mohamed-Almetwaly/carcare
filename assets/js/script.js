/**
 * CarCare - Modern Automotive Service & Booking Platform
 * Vanilla JavaScript (No Frameworks, No Libraries, No jQuery)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initPasswordToggles();
  initServiceFilters();
  initModals();
  initFormValidations();
  initAutoDismissAlerts();
  initAjaxStatusUpdates();
  initBookingDateRestriction();
});

/**
 * 1. Mobile Hamburger Menu Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('main-nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = navMenu.classList.toggle('show');
      toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('show');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/**
 * 2. Password Show / Hide Toggle
 */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);

      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.textContent = 'Hide';
        } else {
          input.type = 'password';
          btn.textContent = 'Show';
        }
      }
    });
  });
}

/**
 * 3. Service Page Search & Category Filter
 */
function initServiceFilters() {
  const searchInput = document.getElementById('service-search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card-item');
  const emptyState = document.getElementById('services-empty-state');

  if (!serviceCards.length) return;

  let currentCategory = 'all';
  let currentSearch = '';

  function applyFilters() {
    let visibleCount = 0;

    serviceCards.forEach((card) => {
      const title = card.getAttribute('data-name')?.toLowerCase() || '';
      const desc = card.getAttribute('data-desc')?.toLowerCase() || '';
      const category = card.getAttribute('data-category')?.toLowerCase() || 'all';

      const matchesSearch = !currentSearch || title.includes(currentSearch) || desc.includes(currentSearch);
      const matchesCategory = currentCategory === 'all' || category === currentCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category')?.toLowerCase() || 'all';
      applyFilters();
    });
  });
}

/**
 * 4. Modal Window Controller
 */
function initModals() {
  // Open buttons
  const openButtons = document.querySelectorAll('[data-modal-target]');
  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      openModal(targetId);
    });
  });

  // Close buttons inside modals
  const closeButtons = document.querySelectorAll('.modal-close-trigger');
  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // Click on modal backdrop to close
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach((m) => m.classList.remove('active'));
  document.body.style.overflow = '';
}

/**
 * 5. Toast Notifications (Dynamic or Auto)
 */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
    <button type="button" class="alert-close" style="color:white;">&times;</button>
  `;

  container.appendChild(toast);

  // Close on click
  toast.querySelector('.alert-close').addEventListener('click', () => {
    toast.remove();
  });

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

/**
 * 6. Form Validations (Client-side)
 */
function initFormValidations() {
  const forms = document.querySelectorAll('.validate-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      let isValid = true;

      // Clear previous error messages
      form.querySelectorAll('.form-error').forEach((el) => el.remove());
      form.querySelectorAll('.form-control.error').forEach((el) => el.classList.remove('error'));

      // 1. Required fields
      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          highlightFieldError(input, 'This field is required.');
        }
      });

      // 2. Email format validation
      const emailInputs = form.querySelectorAll('input[type="email"]');
      emailInputs.forEach((input) => {
        const val = input.value.trim();
        if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          isValid = false;
          highlightFieldError(input, 'Please enter a valid email address.');
        }
      });

      // 3. Password match validation (e.g. on registration)
      const pass = form.querySelector('#password');
      const confirmPass = form.querySelector('#confirm_password');
      if (pass && confirmPass && pass.value && confirmPass.value) {
        if (pass.value !== confirmPass.value) {
          isValid = false;
          highlightFieldError(confirmPass, 'Passwords do not match.');
        }
        if (pass.value.length < 6) {
          isValid = false;
          highlightFieldError(pass, 'Password must be at least 6 characters.');
        }
      }

      if (!isValid) {
        e.preventDefault();
        // Focus first invalid element
        const firstError = form.querySelector('.form-control.error');
        if (firstError) firstError.focus();
      }
    });
  });
}

function highlightFieldError(input, message) {
  input.classList.add('error');
  const errorEl = document.createElement('span');
  errorEl.className = 'form-error';
  errorEl.textContent = message;
  input.parentNode.appendChild(errorEl);
}

/**
 * 7. Auto Dismiss Flash Alerts
 */
function initAutoDismissAlerts() {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach((alert) => {
    const closeBtn = alert.querySelector('.alert-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        alert.style.transition = 'opacity 0.3s ease';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
      });
    }
  });
}

/**
 * 8. Booking Page Date Restriction (Min today)
 */
function initBookingDateRestriction() {
  const dateInput = document.getElementById('appointment_date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}

/**
 * 9. AJAX Status Updates for Admin and Booking
 */
function initAjaxStatusUpdates() {
  // Appointment Status Change via AJAX (without reload if JS enabled)
  const statusSelectors = document.querySelectorAll('.ajax-status-select');

  statusSelectors.forEach((select) => {
    select.addEventListener('change', async () => {
      const appointmentId = select.getAttribute('data-appointment-id');
      const newStatus = select.value;
      const targetUrl = select.getAttribute('data-url');

      try {
        select.disabled = true;
        const formData = new FormData();
        formData.append('appointment_id', appointmentId);
        formData.append('status', newStatus);
        formData.append('ajax', '1');

        const response = await fetch(targetUrl, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          showToast(result.message || 'Status updated successfully', 'success');

          // Update status badge on page
          const badge = document.getElementById(`status-badge-${appointmentId}`);
          if (badge && result.badge_class) {
            badge.className = `badge ${result.badge_class}`;
            badge.textContent = newStatus;
          }
        } else {
          showToast(result.error || 'Failed to update status', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Network error while updating status', 'error');
      } finally {
        select.disabled = false;
      }
    });
  });
}

/**
 * Quick fill demo credentials on login page
 */
function fillDemoCredentials(email, password) {
  const emailInput = document.getElementById('email');
  const passInput = document.getElementById('password');

  if (emailInput && passInput) {
    emailInput.value = email;
    passInput.value = password;
    showToast('تم إدراج بيانات الدخول: ' + email, 'info');
  }
}
window.fillDemoCredentials = fillDemoCredentials;
window.openModal = openModal;
window.closeAllModals = closeAllModals;
window.showToast = showToast;
