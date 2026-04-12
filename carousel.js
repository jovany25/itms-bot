// ===========================
// Carousel + Lightbox System
// ===========================
(function () {
  'use strict';

  // ---- Placeholder on image error ----
  window.carouselImgError = function (img) {
    img.style.display = 'none';
    var ph = img.nextElementSibling;
    if (ph && ph.classList.contains('carousel-placeholder')) {
      ph.style.display = 'flex';
    }
  };

  // ---- Init all carousels ----
  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      var slides = carousel.querySelectorAll('.carousel-slide');
      var prevBtn = carousel.querySelector('.carousel-prev');
      var nextBtn = carousel.querySelector('.carousel-next');
      var dotsWrap = carousel.querySelector('.carousel-dots');
      if (!slides.length) return;

      var current = 0;

      // Build dots
      if (dotsWrap) {
        slides.forEach(function (_, i) {
          var dot = document.createElement('span');
          dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
          dot.addEventListener('click', function () { goTo(i); });
          dotsWrap.appendChild(dot);
        });
      }
      var dots = dotsWrap ? dotsWrap.querySelectorAll('.carousel-dot') : [];

      function goTo(idx) {
        slides[current].classList.remove('active');
        if (dots[current]) dots[current].classList.remove('active');
        current = idx;
        slides[current].classList.add('active');
        if (dots[current]) dots[current].classList.add('active');
      }

      if (prevBtn) prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        goTo(current > 0 ? current - 1 : slides.length - 1);
      });
      if (nextBtn) nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        goTo(current < slides.length - 1 ? current + 1 : 0);
      });

      // Touch / swipe
      var startX = 0;
      carousel.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });
      carousel.addEventListener('touchend', function (e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          if (diff > 0 && nextBtn) nextBtn.click();
          else if (prevBtn) prevBtn.click();
        }
      });

      // Click image -> lightbox
      slides.forEach(function (slide, i) {
        var img = slide.querySelector('img');
        if (img) {
          img.style.cursor = 'zoom-in';
          img.addEventListener('click', function () {
            openLightbox(carousel, i);
          });
        }
      });
    });
  }

  // ---- Lightbox ----
  var lbOverlay, lbImg, lbPrev, lbNext, lbClose;
  var lbSlides = [];
  var lbIndex = 0;

  function createLightbox() {
    lbOverlay = document.createElement('div');
    lbOverlay.className = 'lightbox-overlay';
    lbOverlay.innerHTML =
      '<button class="lightbox-close" aria-label="Fermer">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Précédent"><i class="fas fa-chevron-left"></i></button>' +
      '<img class="lightbox-img" alt="">' +
      '<button class="lightbox-next" aria-label="Suivant"><i class="fas fa-chevron-right"></i></button>';
    document.body.appendChild(lbOverlay);

    lbImg = lbOverlay.querySelector('.lightbox-img');
    lbPrev = lbOverlay.querySelector('.lightbox-prev');
    lbNext = lbOverlay.querySelector('.lightbox-next');
    lbClose = lbOverlay.querySelector('.lightbox-close');

    lbClose.addEventListener('click', closeLightbox);
    lbOverlay.addEventListener('click', function (e) {
      if (e.target === lbOverlay) closeLightbox();
    });
    lbPrev.addEventListener('click', function () {
      lbIndex = lbIndex > 0 ? lbIndex - 1 : lbSlides.length - 1;
      showLbSlide();
    });
    lbNext.addEventListener('click', function () {
      lbIndex = lbIndex < lbSlides.length - 1 ? lbIndex + 1 : 0;
      showLbSlide();
    });

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (!lbOverlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev.click();
      if (e.key === 'ArrowRight') lbNext.click();
    });

    // Touch swipe on lightbox
    var sx = 0;
    lbOverlay.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX;
    }, { passive: true });
    lbOverlay.addEventListener('touchend', function (e) {
      var diff = sx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) lbNext.click();
        else lbPrev.click();
      }
    });
  }

  function openLightbox(carousel, index) {
    if (!lbOverlay) createLightbox();
    lbSlides = [];
    carousel.querySelectorAll('.carousel-slide img').forEach(function (img) {
      if (img.style.display !== 'none' && img.src) {
        lbSlides.push(img.src);
      }
    });
    if (!lbSlides.length) return;
    lbIndex = Math.min(index, lbSlides.length - 1);
    showLbSlide();
    lbOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lbOverlay) {
      lbOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function showLbSlide() {
    lbImg.src = lbSlides[lbIndex];
    lbImg.alt = 'Photo ' + (lbIndex + 1) + ' / ' + lbSlides.length;
  }

  // ---- Boot ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }
})();
