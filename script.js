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

  // Helper: image with initials fallback
  function photoHTML(src, alt, className) {
    return `<img src="${src}" alt="${alt}" class="${className}"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
            <span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;
                         font-family:var(--font-heading);font-weight:700;
                         font-size:${className === 'org-photo-pdg' ? '2rem' : '1.4rem'};
                         color:var(--color-accent);">
              ${alt.split(' ').map(w => w[0]).join('').slice(0,2)}
            </span>`;
  }

  const pdg = TEAM_DATA.pdg;

  // ---- PDG ----
  const pdgWrap = document.createElement('div');
  pdgWrap.className = 'org-pdg-wrap fade-in';
  pdgWrap.innerHTML = `
    <div class="org-card-pdg">
      <div class="org-photo-pdg">
        ${photoHTML(pdg.photo, pdg.nom, 'org-photo-pdg')}
      </div>
      <span class="org-badge-pdg">${pdg.sigle}</span>
      <div class="org-name-pdg">${pdg.nom}</div>
      <div class="org-role-pdg">${pdg.fonction}</div>
    </div>
  `;
  container.appendChild(pdgWrap);

  // Connecteur vertical
  const vline = document.createElement('div');
  vline.className = 'org-vline';
  container.appendChild(vline);

  // Ligne horizontale
  const hWrap = document.createElement('div');
  hWrap.className = 'org-hline-wrap';
  hWrap.innerHTML = `<div class="org-hline"></div>`;
  container.appendChild(hWrap);

  // ---- Membres ----
  const membersRow = document.createElement('div');
  membersRow.className = 'org-members';

  TEAM_DATA.membres.forEach(m => {
    const col = document.createElement('div');
    col.className = 'org-member-col fade-in';
    col.innerHTML = `
      <div class="org-member-vline"></div>
      <div class="org-card-member">
        <div class="org-photo-member">
          ${photoHTML(m.photo, m.nom, 'org-photo-member')}
        </div>
        <span class="org-badge-member">${m.sigle}</span>
        <div class="org-name-member">${m.nom}</div>
        <div class="org-role-member">${m.fonction}</div>
      </div>
    `;
    membersRow.appendChild(col);
  });

  container.appendChild(membersRow);

  // Re-observe fade-in elements
  container.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
}

renderOrgChart();

// ===========================
// Tour form
// ===========================
const tourForm = document.getElementById('tour-form');
if (tourForm) {
  const tourDate = tourForm.querySelector('#tour-date');
  if (tourDate) tourDate.min = new Date().toISOString().split('T')[0];

  tourForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Merci ! Votre demande d\'escapade a bien été enregistrée. Notre équipe vous contactera sous 24h.');
    tourForm.reset();
  });
}

// ===========================
// Tour stats (reuse counter observer)
// ===========================
const tourStatsSection = document.querySelector('.tour-concept-stats');
if (tourStatsSection && typeof counterObserver !== 'undefined') {
  counterObserver.observe(tourStatsSection);
}

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
