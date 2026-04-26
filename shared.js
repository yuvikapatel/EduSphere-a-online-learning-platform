/**
 * EduSphere — Shared Navigation & Utilities
 * Include this in every page
 */

// ── Navigation Helper ──────────────────────────────
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ── Sign-In Panel Toggle ───────────────────────────
function initSignIn() {
  const loginBtn = document.getElementById('loginBtn');
  const panel = document.getElementById('signinPanel');
  const closeBtn = document.getElementById('panelClose');

  if (!loginBtn || !panel) return;

  loginBtn.addEventListener('click', () => panel.classList.toggle('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.remove('open'));
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== loginBtn) {
      panel.classList.remove('open');
    }
  });

  // Sign in form
  const form = document.getElementById('signinForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('siEmail').value;
      const pass = document.getElementById('siPassword').value;
      const users = JSON.parse(localStorage.getItem('edusphere_users') || '[]');
      const user = users.find(u => u.email === email && u.password === pass);
      if (user) {
        localStorage.setItem('edusphere_current', JSON.stringify(user));
        showToast('success', `👋 Welcome back, ${user.firstName}!`);
        panel.classList.remove('open');
        updateAuthUI(user);
      } else {
        showToast('error', '❌ Invalid email or password.');
      }
    });
  }

  // Restore session
  const current = JSON.parse(localStorage.getItem('edusphere_current') || 'null');
  if (current) updateAuthUI(current);
}

function updateAuthUI(user) {
  const loginBtn = document.getElementById('loginBtn');
  const startBtn = document.getElementById('startBtn');
  if (loginBtn) {
    loginBtn.textContent = user.firstName;
    loginBtn.style.color = 'var(--accent)';
  }
}

// ── Hamburger Menu ─────────────────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (btn && links) {
    btn.addEventListener('click', () => links.classList.toggle('open'));
  }
}

// ── Toast Notifications ────────────────────────────
function showToast(type, message, duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : '✗'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ── PDF Generation (using jsPDF) ───────────────────
function generateUserPDF(userData) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Header
  doc.setFillColor(15, 17, 23);
  doc.rect(0, 0, 210, 50, 'F');
  doc.setTextColor(79, 142, 247);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('EduSphere', 20, 30);
  doc.setFontSize(10);
  doc.setTextColor(136, 146, 164);
  doc.text('Virtual Classroom Platform', 20, 40);

  // Enrollment Details
  doc.setFillColor(22, 27, 36);
  doc.rect(0, 50, 210, 200, 'F');

  doc.setFontSize(16);
  doc.setTextColor(232, 234, 240);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Enrollment Details', 20, 70);

  doc.setDrawColor(79, 142, 247);
  doc.line(20, 74, 190, 74);

  const fields = [
    ['First Name', userData.firstName],
    ['Last Name', userData.lastName],
    ['Email', userData.email],
    ['Experience Level', userData.level],
    ['Phone', userData.phone || 'N/A'],
    ['Country', userData.country || 'N/A'],
  ];

  let y = 86;
  doc.setFontSize(11);
  fields.forEach(([label, value]) => {
    doc.setTextColor(136, 146, 164);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', 20, y);
    doc.setTextColor(232, 234, 240);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || ''), 80, y);
    y += 12;
  });

  // Learning Goals
  y += 10;
  doc.setFontSize(14);
  doc.setTextColor(232, 234, 240);
  doc.setFont('helvetica', 'bold');
  doc.text('Learning Goals', 20, y);
  doc.setDrawColor(79, 142, 247);
  doc.line(20, y + 4, 190, y + 4);
  y += 16;

  const goals = userData.goals || [];
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  goals.forEach(goal => {
    doc.setTextColor(79, 142, 247);
    doc.text('✓', 20, y);
    doc.setTextColor(232, 234, 240);
    doc.text(goal, 30, y);
    y += 11;
  });

  // Footer
  y += 20;
  doc.setFontSize(9);
  doc.setTextColor(90, 100, 120);
  doc.text(`Enrollment Date: ${new Date().toLocaleDateString()}`, 20, y);
  doc.text('EduSphere — Where Learning Comes Alive', 20, y + 8);

  doc.save(`EduSphere_${userData.firstName}_${userData.lastName}.pdf`);
}

// ── Initialize all shared components ─────────────
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initSignIn();
  initHamburger();
});
