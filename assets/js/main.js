/* ============================================
   GRANDEHOTEL — Main JavaScript
   Standard Pattern: Header, Reveal, Form, Smooth Scroll
   ============================================ */

(function () {
  'use strict';

  /* ---- DOM Ready ---- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initHeader();
    initMobileNav();
    initReveal();
    initSmoothScroll();
    initBookingForm();
    initContactForm();
    initHeroCarousel();
  }

  /* ============================================
     HEADER — Scroll behavior
     ============================================ */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    var scrollThreshold = 60;

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ============================================
     MOBILE NAV — Toggle
     ============================================ */
  function initMobileNav() {
    var burger = document.querySelector('.header__burger');
    var mobileNav = document.querySelector('.header__mobile-nav');
    if (!burger || !mobileNav) return;

    var isOpen = false;

    burger.addEventListener('click', function () {
      isOpen = !isOpen;
      mobileNav.classList.toggle('header__mobile-nav--open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Animate burger to X
      var lines = burger.querySelectorAll('.header__burger-line');
      if (isOpen) {
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        lines[0].style.transform = '';
        lines[1].style.opacity = '';
        lines[2].style.transform = '';
      }
    });

    // Close mobile nav on link click
    var mobileLinks = mobileNav.querySelectorAll('.header__mobile-nav-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        isOpen = false;
        mobileNav.classList.remove('header__mobile-nav--open');
        document.body.style.overflow = '';
        var lines = burger.querySelectorAll('.header__burger-line');
        lines[0].style.transform = '';
        lines[1].style.opacity = '';
        lines[2].style.transform = '';
      });
    });
  }

  /* ============================================
     REVEAL — Intersection Observer
     ============================================ */
  function initReveal() {
    var revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all
      revealElements.forEach(function (el) {
        el.classList.add('reveal--visible', 'reveal-stagger--visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-stagger')) {
            entry.target.classList.add('reveal-stagger--visible');
          } else {
            entry.target.classList.add('reveal--visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================
     SMOOTH SCROLL — Anchor links
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        var headerHeight = document.querySelector('.header')
          ? document.querySelector('.header').offsetHeight
          : 0;

        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ============================================
     HERO BOOKING FORM — Date validation
     ============================================ */
  function initBookingForm() {
    var form = document.querySelector('[data-form="booking"]');
    if (!form) return;

    var checkinInput = form.querySelector('[name="checkin"]');
    var checkoutInput = form.querySelector('[name="checkout"]');

    // Set min date to today
    var today = new Date();
    var todayStr = today.toISOString().split('T')[0];
    if (checkinInput) checkinInput.setAttribute('min', todayStr);
    if (checkoutInput) checkoutInput.setAttribute('min', todayStr);

    // Check-in change -> update check-out min
    if (checkinInput && checkoutInput) {
      checkinInput.addEventListener('change', function () {
        var checkinDate = new Date(this.value);
        checkinDate.setDate(checkinDate.getDate() + 1);
        var minCheckout = checkinDate.toISOString().split('T')[0];
        checkoutInput.setAttribute('min', minCheckout);

        if (checkoutInput.value && checkoutInput.value <= this.value) {
          checkoutInput.value = minCheckout;
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // Basic validation
      if (!data.checkin || !data.checkout) {
        showFormMessage(form, 'Please select check-in and check-out dates.', 'error');
        return;
      }

      if (data.checkin >= data.checkout) {
        showFormMessage(form, 'Check-out date must be after check-in date.', 'error');
        return;
      }

      // Success
      showFormMessage(form, 'Thank you! We will review your booking request and contact you shortly.', 'success');
      form.reset();
    });
  }

  /* ============================================
     CONTACT FORM
     ============================================ */
  function initContactForm() {
    var form = document.querySelector('[data-form="contact"]');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // Basic validation
      if (!data.name || !data.email || !data.message) {
        showFormMessage(form, 'Please fill in all required fields.', 'error');
        return;
      }

      // Email validation
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showFormMessage(form, 'Please enter a valid email address.', 'error');
        return;
      }

      // Success
      showFormMessage(form, 'Thank you for your message! We will get back to you within 24 hours.', 'success');
      form.reset();
    });
  }

  /* ============================================
     FORM MESSAGE
     ============================================ */
  function showFormMessage(form, message, type) {
    // Remove existing message
    var existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    var msg = document.createElement('div');
    msg.className = 'form-message form-message--' + type;
    msg.textContent = message;
    msg.style.cssText = 'padding:12px 20px;border-radius:6px;margin-top:16px;font-size:0.875rem;text-align:center;animation:fadeIn 0.3s ease;';

    if (type === 'success') {
      msg.style.backgroundColor = '#ecfdf5';
      msg.style.color = '#065f46';
      msg.style.border = '1px solid #a7f3d0';
    } else {
      msg.style.backgroundColor = '#fef2f2';
      msg.style.color = '#991b1b';
      msg.style.border = '1px solid #fecaca';
    }

    form.appendChild(msg);

    // Auto-remove after 6 seconds
    setTimeout(function () {
      msg.style.opacity = '0';
      msg.style.transition = 'opacity 0.3s ease';
      setTimeout(function () { msg.remove(); }, 300);
    }, 6000);
  }

  /* ============================================
     HERO CAROUSEL (simple fade)
     ============================================ */
  function initHeroCarousel() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var bg = hero.querySelector('.hero__bg');
    if (!bg) return;

    var images = bg.getAttribute('data-carousel');
    if (!images) return;

    var imageList = images.split(',').map(function (s) { return s.trim(); });
    if (imageList.length <= 1) return;

    var currentIndex = 0;

    function changeImage() {
      currentIndex = (currentIndex + 1) % imageList.length;
      bg.style.transition = 'opacity 1s ease';
      bg.style.opacity = '0';

      setTimeout(function () {
        bg.style.backgroundImage = 'url(' + imageList[currentIndex] + ')';
        bg.style.opacity = '1';
      }, 1000);
    }

    setInterval(changeImage, 6000);
  }

})();
