// ===========================
// Navbar scroll effect
// ===========================
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ===========================
// Mobile menu
// ===========================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ===========================
// Animated counters
// ===========================
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(counter => {
    if (counter.dataset.animated) return;

    const target = parseInt(counter.dataset.count, 10);
    const suffix = counter.dataset.suffix || '';
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * (target - start) + start);
      counter.textContent = current.toLocaleString('fr-FR') + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    counter.dataset.animated = 'true';
    requestAnimationFrame(update);
  });
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) counterObserver.observe(statsBar);

// ===========================
// Scroll reveal
// ===========================
const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));

// ===========================
// Tabs (tarifs page)
// ===========================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

// ===========================
// Contact form
// ===========================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Merci pour votre message ! Notre équipe vous répondra dans les plus brefs délais.');
    contactForm.reset();
  });
}

// ===========================
// Reservation Modal
// ===========================
const reserveBtn = document.getElementById('floating-reserve-btn');
const modalOverlay = document.getElementById('reservation-modal');
const modalClose = document.getElementById('modal-close');
const modalCancel = document.getElementById('modal-cancel');
const reservationForm = document.getElementById('reservation-form');

function openModal() {
  if (modalOverlay) {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (reserveBtn) reserveBtn.addEventListener('click', openModal);
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalCancel) modalCancel.addEventListener('click', closeModal);

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

if (reservationForm) {
  const checkin = reservationForm.querySelector('#res-checkin');
  const checkout = reservationForm.querySelector('#res-checkout');
  const today = new Date().toISOString().split('T')[0];
  if (checkin) checkin.min = today;
  if (checkout) checkout.min = today;
  if (checkin) {
    checkin.addEventListener('change', () => {
      if (checkout) {
        checkout.min = checkin.value;
        if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
      }
    });
  }

  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Merci ! Votre demande de réservation a bien été enregistrée. Notre équipe vous contactera sous peu.');
    reservationForm.reset();
    closeModal();
  });
}

// ===========================
// Organigramme (render from team-data.js)
// ===========================
function renderOrgChart() {
  const container = document.getElementById('org-chart');
  if (!container || typeof TEAM_DATA === 'undefined') return;

  function createCard(member, isDirector) {
    const card = document.createElement('div');
    card.className = 'org-card' + (isDirector ? ' director' : '') + ' fade-in';

    const avatarContent = member.photo
      ? `<img src="${member.photo}" alt="${member.name}">`
      : member.initials;

    card.innerHTML = `
      <div class="org-avatar">${avatarContent}</div>
      <div class="org-name">${member.name}</div>
      <div class="org-role">${member.role}</div>
    `;
    return card;
  }

  // Level 1
  const level1 = document.createElement('div');
  level1.className = 'org-level';
  TEAM_DATA.level1.forEach(m => level1.appendChild(createCard(m, true)));
  container.appendChild(level1);

  // Connector
  const c1 = document.createElement('div');
  c1.className = 'org-connector';
  container.appendChild(c1);

  // Level 2
  const level2 = document.createElement('div');
  level2.className = 'org-level';
  TEAM_DATA.level2.forEach(m => level2.appendChild(createCard(m, false)));
  container.appendChild(level2);

  // Connector
  const c2 = document.createElement('div');
  c2.className = 'org-connector';
  container.appendChild(c2);

  // Level 3
  const level3 = document.createElement('div');
  level3.className = 'org-level';
  TEAM_DATA.level3.forEach(m => level3.appendChild(createCard(m, false)));
  container.appendChild(level3);

  // Re-observe new fade-in elements
  container.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
}

renderOrgChart();

// ===========================
// Smooth scroll
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
