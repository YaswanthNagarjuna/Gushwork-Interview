'use strict';

(function () {

  // -- DOM references --
  var stickyHeader = document.getElementById('stickyHeader');
  var mainHeader = document.getElementById('mainHeader');
  var hero = document.getElementById('hero');

  var carouselTrack = document.getElementById('carouselTrack');
  var carouselViewport = document.getElementById('carouselViewport');
  var carouselZoom = document.getElementById('carouselZoom');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var thumbBtns = document.querySelectorAll('.carousel__thumb');
  var counterEl = document.getElementById('carouselCounter');
  var slides = document.querySelectorAll('.carousel__slide');

  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var stickyHamburgerBtn = document.getElementById('stickyHamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileOverlay = document.getElementById('mobileOverlay');

  var appCarousel = document.getElementById('appCarousel');
  var appPrev = document.getElementById('appPrev');
  var appNext = document.getElementById('appNext');

  var processChips = document.querySelectorAll('.process__chip');
  var processDetails = document.querySelectorAll('.process__detail');
  var processCounter = document.getElementById('processCounter');
  var processPrev = document.getElementById('processPrev');
  var processNext = document.getElementById('processNext');

  var faqItems = document.querySelectorAll('.faq__item');

  var contactForm = document.getElementById('contactForm');
  var catalogueForm = document.getElementById('catalogueForm');

  var datasheetBtn = document.getElementById('downloadDatasheetBtn');
  var datasheetModal = document.getElementById('datasheetModal');
  var modalCloseBtn = document.getElementById('modalCloseBtn');
  var datasheetForm = document.getElementById('datasheetForm');

  var quoteModal = document.getElementById('quoteModal');
  var quoteCloseBtn = document.getElementById('quoteModalCloseBtn');
  var quoteForm = document.getElementById('quoteForm');
  var quoteTriggers = document.querySelectorAll('.quote-modal-trigger');

  // -- State --
  var currentSlide = 0;
  var totalSlides = slides.length;
  var currentStep = 0;
  var totalSteps = processChips.length;
  var touchStartX = 0;
  var ticking = false;


  // -----------------------------------------------
  // Sticky header
  // Sits below the main nav; slides in once we
  // scroll past the hero section.
  // -----------------------------------------------

  function syncHeaderHeight() {
    if (!mainHeader) return;
    document.documentElement.style.setProperty(
      '--main-header-height',
      mainHeader.offsetHeight + 'px'
    );
  }

  function onScroll() {
    var y = window.scrollY;
    var trigger = hero ? hero.offsetHeight : window.innerHeight;

    if (y > trigger) stickyHeader.classList.add('visible');
    else stickyHeader.classList.remove('visible');

    ticking = false;
  }

  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });


  // -----------------------------------------------
  // Image carousel
  // -----------------------------------------------

  function goToSlide(idx) {
    if (idx < 0) idx = totalSlides - 1;
    if (idx >= totalSlides) idx = 0;
    currentSlide = idx;

    carouselTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    thumbBtns.forEach(function (t, i) { t.classList.toggle('active', i === currentSlide); });
    counterEl.textContent = (currentSlide + 1) + ' / ' + totalSlides;
  }

  prevBtn.addEventListener('click', function () { goToSlide(currentSlide - 1); });
  nextBtn.addEventListener('click', function () { goToSlide(currentSlide + 1); });
  thumbBtns.forEach(function (t) {
    t.addEventListener('click', function () { goToSlide(+t.dataset.index); });
  });

  // keyboard nav (only when carousel is visible)
  document.addEventListener('keydown', function (e) {
    var r = carouselViewport.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  });

  // touch swipe
  carouselViewport.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselViewport.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) goToSlide(currentSlide + (diff > 0 ? 1 : -1));
  }, { passive: true });


  // -----------------------------------------------
  // Zoom lens on carousel hover
  // -----------------------------------------------

  var ZOOM = 2.5;

  carouselViewport.addEventListener('mousemove', function (e) {
    var rect = carouselViewport.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var img = slides[currentSlide].querySelector('img');
    if (!img) return;

    var half = carouselZoom.offsetWidth / 2;
    carouselZoom.style.left = (x - half) + 'px';
    carouselZoom.style.top = (y - half) + 'px';

    var bw = rect.width * ZOOM;
    var bh = rect.height * ZOOM;
    carouselZoom.style.backgroundImage = "url('" + img.src + "')";
    carouselZoom.style.backgroundSize = bw + 'px ' + bh + 'px';
    carouselZoom.style.backgroundPosition = -(x * ZOOM - half) + 'px ' + -(y * ZOOM - half) + 'px';
  });

  carouselViewport.addEventListener('mouseenter', function () { carouselZoom.style.opacity = '1'; });
  carouselViewport.addEventListener('mouseleave', function () { carouselZoom.style.opacity = '0'; });


  // -----------------------------------------------
  // Mobile menu
  // -----------------------------------------------

  function toggleMenu() {
    var opening = !mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
    if (stickyHamburgerBtn) stickyHamburgerBtn.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', opening);
    if (stickyHamburgerBtn) stickyHamburgerBtn.setAttribute('aria-expanded', opening);
    document.body.classList.toggle('menu-open');
  }

  function closeMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    if (stickyHamburgerBtn) stickyHamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    if (stickyHamburgerBtn) stickyHamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  hamburgerBtn.addEventListener('click', toggleMenu);
  if (stickyHamburgerBtn) stickyHamburgerBtn.addEventListener('click', toggleMenu);
  mobileOverlay.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });


  // -----------------------------------------------
  // Applications carousel (horizontal scroll)
  // -----------------------------------------------

  var SCROLL_PX = 340;

  appPrev.addEventListener('click', function () {
    appCarousel.scrollBy({ left: -SCROLL_PX, behavior: 'smooth' });
  });
  appNext.addEventListener('click', function () {
    appCarousel.scrollBy({ left: SCROLL_PX, behavior: 'smooth' });
  });


  // -----------------------------------------------
  // Manufacturing process tabs
  // -----------------------------------------------

  function setStep(idx) {
    if (idx < 0) idx = totalSteps - 1;
    if (idx >= totalSteps) idx = 0;
    currentStep = idx;

    processChips.forEach(function (c, i) { c.classList.toggle('active', i === currentStep); });
    processDetails.forEach(function (d, i) { d.classList.toggle('active', i === currentStep); });
    processCounter.textContent = 'Step ' + (currentStep + 1) + ' / ' + totalSteps;
  }

  processChips.forEach(function (chip) {
    chip.addEventListener('click', function () { setStep(+chip.dataset.step); });
  });
  processPrev.addEventListener('click', function () { setStep(currentStep - 1); });
  processNext.addEventListener('click', function () { setStep(currentStep + 1); });


  // -----------------------------------------------
  // FAQ accordion (single-open)
  // -----------------------------------------------

  faqItems.forEach(function (item) {
    item.querySelector('.faq__question').addEventListener('click', function () {
      var wasOpen = item.classList.contains('active');

      // collapse all first
      faqItems.forEach(function (el) {
        el.classList.remove('active');
        el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      if (!wasOpen) {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // -----------------------------------------------
  // Form submissions (simulated – no backend)
  // -----------------------------------------------

  function handleFormSubmit(form, btnSelector, msgs) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector(btnSelector);
      var orig = btn.textContent;
      btn.textContent = msgs.pending;
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = msgs.done;
        setTimeout(function () {
          btn.textContent = orig;
          btn.disabled = false;
          form.reset();
          if (msgs.after) msgs.after();
        }, 2000);
      }, 1000);
    });
  }

  handleFormSubmit(contactForm, 'button[type="submit"]', {
    pending: 'Sending...',
    done: 'Quote Requested!'
  });

  handleFormSubmit(catalogueForm, 'button[type="submit"]', {
    pending: 'Sending...',
    done: 'Sent!'
  });


  // -----------------------------------------------
  // Datasheet download modal
  // -----------------------------------------------

  function openModal(modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    var input = modal.querySelector('input');
    if (input) setTimeout(function () { input.focus(); }, 300);
  }

  function closeModalEl(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // wire up open/close
  datasheetBtn.addEventListener('click', function () { openModal(datasheetModal); });
  modalCloseBtn.addEventListener('click', function () { closeModalEl(datasheetModal); });
  datasheetModal.addEventListener('click', function (e) {
    if (e.target === datasheetModal) closeModalEl(datasheetModal);
  });

  // read specs table into an array
  function getSpecsData() {
    var out = [];
    document.querySelectorAll('.specs__table tbody tr').forEach(function (row) {
      var cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        out.push({ param: cells[0].textContent.trim(), spec: cells[1].textContent.trim() });
      }
    });
    return out;
  }

  // build CSV with header row
  function toCSV(data) {
    var lines = ['Parameter,Specification'];
    data.forEach(function (d) {
      var p = d.param.indexOf(',') > -1 ? '"' + d.param + '"' : d.param;
      var s = d.spec.indexOf(',') > -1 ? '"' + d.spec + '"' : d.spec;
      lines.push(p + ',' + s);
    });
    return lines.join('\n');
  }

  // trigger file download via blob
  function downloadBlob(content, type, filename) {
    var blob = new Blob([content], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // compose a mailto link with the specs in the body
  function mailSpecs(email) {
    var data = getSpecsData();
    var body = data.map(function (d) { return d.param + ': ' + d.spec; }).join('\n');
    var subj = encodeURIComponent('HDPE Pipes - Technical Datasheet');
    var text = encodeURIComponent(
      'Hi,\n\nPlease find the technical specifications below:\n\n' +
      body + '\n\n' +
      'For queries, contact us at info@gushwork.com\n\nRegards,\nMangalam HDPE Pipes'
    );
    window.open('mailto:' + email + '?subject=' + subj + '&body=' + text, '_self');
  }

  // handle form submit – download CSV + open mail client
  if (datasheetForm) {
    datasheetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('modalSubmitBtn');
      var email = document.getElementById('modalEmail').value.trim();
      var orig = btn.textContent;

      btn.textContent = 'Preparing...';
      btn.disabled = true;

      setTimeout(function () {
        downloadBlob(toCSV(getSpecsData()), 'text/csv;charset=utf-8;', 'HDPE_Pipes_Technical_Datasheet.csv');
        mailSpecs(email);

        btn.textContent = 'Downloaded & Sent!';
        setTimeout(function () {
          btn.textContent = orig;
          btn.disabled = false;
          datasheetForm.reset();
          closeModalEl(datasheetModal);
        }, 2000);
      }, 800);
    });
  }


  // -----------------------------------------------
  // Request-a-quote modal
  // -----------------------------------------------

  quoteTriggers.forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(quoteModal); });
  });

  if (quoteCloseBtn) {
    quoteCloseBtn.addEventListener('click', function () { closeModalEl(quoteModal); });
  }

  if (quoteModal) {
    quoteModal.addEventListener('click', function (e) {
      if (e.target === quoteModal) closeModalEl(quoteModal);
    });
  }

  handleFormSubmit(quoteForm, 'button[type="submit"]', {
    pending: 'Submitting...',
    done: 'Submitted!',
    after: function () { closeModalEl(quoteModal); }
  });


  // -----------------------------------------------
  // Close any active modal on Escape
  // -----------------------------------------------

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    [datasheetModal, quoteModal].forEach(function (m) {
      if (m && m.classList.contains('active')) closeModalEl(m);
    });
  });


  // -----------------------------------------------
  // Smooth scroll for anchor links
  // -----------------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var el = document.querySelector(id);
      if (!el) return;

      e.preventDefault();
      var offset = 80; // account for sticky headers
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

})();
