// ===========================
// Navbar scroll effect
// ===========================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

// ===========================
// Mobile menu
// ===========================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===========================
// Active nav link highlighting
// ===========================
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

// ===========================
// Scroll reveal (Intersection Observer)
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
// Testimonials carousel
// ===========================
const testimonials = [
  {
    text: "Un séjour absolument magique. Le service est impeccable, la suite présidentielle est à couper le souffle. Nous reviendrons sans hésiter.",
    name: "Marie-Claire Dubois",
    location: "Lyon, France",
    avatar: "https://picsum.photos/100/100?random=40",
    stars: 5
  },
  {
    text: "Le restaurant gastronomique est une expérience en soi. Le chef a créé un menu personnalisé pour notre anniversaire. Inoubliable !",
    name: "Alessandro Rossi",
    location: "Milan, Italie",
    avatar: "https://picsum.photos/100/100?random=41",
    stars: 5
  },
  {
    text: "Le spa est un véritable havre de paix. Les soins sont exceptionnels et le personnel aux petits soins. Un pur moment de bonheur.",
    name: "Sophie Müller",
    location: "Zurich, Suisse",
    avatar: "https://picsum.photos/100/100?random=42",
    stars: 5
  },
  {
    text: "L'emplacement est idéal, les chambres magnifiques et le rooftop bar offre une vue incroyable sur Paris. L'hôtel parfait.",
    name: "James Wellington",
    location: "Londres, Royaume-Uni",
    avatar: "https://picsum.photos/100/100?random=43",
    stars: 5
  }
];

let currentTestimonial = 0;
let autoRotate;

const testimonialText = document.getElementById('testimonial-text');
const testimonialName = document.getElementById('testimonial-name');
const testimonialLocation = document.getElementById('testimonial-location');
const testimonialAvatar = document.getElementById('testimonial-avatar');
const testimonialStars = document.getElementById('testimonial-stars');
const dotsContainer = document.getElementById('carousel-dots');

// Create dots
testimonials.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToTestimonial(i));
  dotsContainer.appendChild(dot);
});

function showTestimonial(index) {
  const t = testimonials[index];
  testimonialText.textContent = t.text;
  testimonialName.textContent = t.name;
  testimonialLocation.textContent = t.location;
  testimonialAvatar.src = t.avatar;
  testimonialAvatar.alt = t.name;
  testimonialStars.innerHTML = Array(t.stars).fill('<i class="fas fa-star"></i>').join('');

  // Update dots
  dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function goToTestimonial(index) {
  currentTestimonial = index;
  showTestimonial(index);
  resetAutoRotate();
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
}

document.getElementById('next-btn').addEventListener('click', () => {
  nextTestimonial();
  resetAutoRotate();
});

document.getElementById('prev-btn').addEventListener('click', () => {
  prevTestimonial();
  resetAutoRotate();
});

function startAutoRotate() {
  autoRotate = setInterval(nextTestimonial, 5000);
}

function resetAutoRotate() {
  clearInterval(autoRotate);
  startAutoRotate();
}

// Initialize
showTestimonial(0);
startAutoRotate();

// Pause on hover
const carousel = document.querySelector('.testimonial-carousel');
carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
carousel.addEventListener('mouseleave', startAutoRotate);

// ===========================
// Gallery lightbox
// ===========================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ===========================
// Booking form
// ===========================
const bookingForm = document.getElementById('booking-form');
const bookingSuccess = document.getElementById('booking-success');

// Set min dates
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const today = new Date().toISOString().split('T')[0];
checkinInput.min = today;
checkoutInput.min = today;

checkinInput.addEventListener('change', () => {
  checkoutInput.min = checkinInput.value;
  if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
    checkoutInput.value = '';
  }
});

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate dates
  if (checkoutInput.value <= checkinInput.value) {
    alert('La date de départ doit être postérieure à la date d\'arrivée.');
    return;
  }

  // Show success
  bookingForm.parentElement.style.display = 'none';
  bookingSuccess.classList.add('active');

  // Scroll to success message
  bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ===========================
// Newsletter form
// ===========================
document.getElementById('newsletter-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  alert('Merci ! Vous recevrez bientôt nos offres exclusives à ' + input.value);
  input.value = '';
});

// ===========================
// Smooth scroll for all anchor links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
