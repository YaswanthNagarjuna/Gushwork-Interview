/**
 * Gushwork HDPE Pipes Landing Page - Interactive Features
 *
 * Features:
 * 1. Sticky Header - appears on scroll down past first fold, hides on scroll up
 * 2. Image Carousel - with thumbnail navigation and smooth transitions
 * 3. Carousel Zoom - magnified preview on hover
 * 4. Mobile Menu - hamburger toggle with overlay
 * 5. Manufacturing Process - step-by-step interactive tabs
 * 6. FAQ Accordion - expandable questions
 * 7. Horizontal Carousel Navigation - for applications and testimonials
 * 8. Form Handling - basic validation and submission
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // 1. STICKY HEADER
  // Shows when scrolled past first fold and scrolling DOWN,
  // hides when scrolling UP or near the top
  // ============================================================
  const stickyHeader = document.getElementById('stickyHeader');
  const heroSection = document.getElementById('hero');
  let lastScrollY = 0;
  let ticking = false;

  /**
   * Determines sticky header visibility based on scroll position.
   * Header appears when scrolled past the first fold (hero section)
   * and stays visible until the user scrolls back to the top.
   */
  function handleStickyHeader() {
    const currentScrollY = window.scrollY;
    // Show sticky header once user scrolls past the hero/first fold
    const triggerPoint = heroSection ? heroSection.offsetHeight : window.innerHeight;

    if (currentScrollY > triggerPoint) {
      // Past the first fold — show sticky header
      stickyHeader.classList.add('visible');
    } else {
      // Back at the top / within first fold — hide sticky header
      stickyHeader.classList.remove('visible');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleStickyHeader);
      ticking = true;
    }
  }, { passive: true });

  // ============================================================
  // 2. IMAGE CAROUSEL
  // Navigate between product images via arrows, thumbnails, or counter
  // ============================================================
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselViewport = document.getElementById('carouselViewport');
  const carouselZoom = document.getElementById('carouselZoom');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const thumbnails = document.querySelectorAll('.carousel__thumb');
  const counterEl = document.getElementById('carouselCounter');
  const slides = document.querySelectorAll('.carousel__slide');
  let currentSlide = 0;
  const totalSlides = slides.length;

  /**
   * Updates carousel to display the slide at the given index.
   * Moves the track, updates thumbnails and counter.
   */
  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    // Move track
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update thumbnails
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentSlide);
    });

    // Update counter
    counterEl.textContent = `${currentSlide + 1} / ${totalSlides}`;
  }

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      goToSlide(parseInt(thumb.dataset.index, 10));
    });
  });

  // ============================================================
  // 3. CAROUSEL ZOOM ON HOVER
  // Displays a magnified circular preview following the cursor.
  // The zoom factor is 2.5x and uses the current slide's image.
  // ============================================================
  const ZOOM_FACTOR = 2.5;

  /**
   * Calculates zoom lens position and background offset
   * based on mouse position relative to the carousel viewport.
   */
  function handleZoomMove(e) {
    const rect = carouselViewport.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Get the current slide's image
    const activeSlide = slides[currentSlide];
    const img = activeSlide.querySelector('img');
    if (!img) return;

    const zoomSize = carouselZoom.offsetWidth;
    const halfZoom = zoomSize / 2;

    // Position the zoom lens centered on cursor
    carouselZoom.style.left = `${x - halfZoom}px`;
    carouselZoom.style.top = `${y - halfZoom}px`;

    // Calculate background position for the zoomed image
    const bgWidth = rect.width * ZOOM_FACTOR;
    const bgHeight = rect.height * ZOOM_FACTOR;
    const bgX = -(x * ZOOM_FACTOR - halfZoom);
    const bgY = -(y * ZOOM_FACTOR - halfZoom);

    carouselZoom.style.backgroundImage = `url('${img.src}')`;
    carouselZoom.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
    carouselZoom.style.backgroundPosition = `${bgX}px ${bgY}px`;
  }

  carouselViewport.addEventListener('mousemove', handleZoomMove);

  // Hide zoom when mouse leaves
  carouselViewport.addEventListener('mouseleave', () => {
    carouselZoom.style.opacity = '0';
  });

  carouselViewport.addEventListener('mouseenter', () => {
    carouselZoom.style.opacity = '1';
  });

  // Keyboard support for carousel
  document.addEventListener('keydown', (e) => {
    // Only respond if carousel area is in view
    const rect = carouselViewport.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isInView) return;

    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  });

  // Touch swipe support for carousel
  let touchStartX = 0;
  let touchEndX = 0;

  carouselViewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselViewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentSlide + 1); // Swipe left → next
      else goToSlide(currentSlide - 1); // Swipe right → prev
    }
  }, { passive: true });

  // ============================================================
  // 4. MOBILE MENU
  // Toggle hamburger menu with overlay and body scroll lock
  // ============================================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const stickyHamburgerBtn = document.getElementById('stickyHamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
    if (stickyHamburgerBtn) stickyHamburgerBtn.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', !isOpen);
    if (stickyHamburgerBtn) stickyHamburgerBtn.setAttribute('aria-expanded', !isOpen);
    document.body.classList.toggle('menu-open');
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    if (stickyHamburgerBtn) stickyHamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    if (stickyHamburgerBtn) stickyHamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  hamburgerBtn.addEventListener('click', toggleMobileMenu);
  if (stickyHamburgerBtn) stickyHamburgerBtn.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close mobile menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close sticky header links on click (smooth scroll)
  document.querySelectorAll('.sticky-nav a').forEach(link => {
    link.addEventListener('click', () => {
      // Let the browser handle smooth scroll via CSS
    });
  });

  // ============================================================
  // 5. VERSATILE APPLICATIONS CAROUSEL
  // Horizontal scroll navigation with arrow buttons
  // ============================================================
  const appCarousel = document.getElementById('appCarousel');
  const appPrev = document.getElementById('appPrev');
  const appNext = document.getElementById('appNext');
  const APP_SCROLL_AMOUNT = 340;

  appPrev.addEventListener('click', () => {
    appCarousel.scrollBy({ left: -APP_SCROLL_AMOUNT, behavior: 'smooth' });
  });

  appNext.addEventListener('click', () => {
    appCarousel.scrollBy({ left: APP_SCROLL_AMOUNT, behavior: 'smooth' });
  });

  // ============================================================
  // 6. MANUFACTURING PROCESS - Interactive Steps
  // Desktop: chip tabs | Mobile: prev/next navigation
  // ============================================================
  const processChips = document.querySelectorAll('.process__chip');
  const processDetails = document.querySelectorAll('.process__detail');
  const processCounter = document.getElementById('processCounter');
  const processPrev = document.getElementById('processPrev');
  const processNext = document.getElementById('processNext');
  let currentStep = 0;
  const totalSteps = processChips.length;

  /**
   * Activates the manufacturing process step at the given index.
   * Updates chips, detail panels, and the mobile counter.
   */
  function setProcessStep(index) {
    if (index < 0) index = totalSteps - 1;
    if (index >= totalSteps) index = 0;
    currentStep = index;

    // Update chips
    processChips.forEach((chip, i) => {
      chip.classList.toggle('active', i === currentStep);
    });

    // Update details
    processDetails.forEach((detail, i) => {
      detail.classList.toggle('active', i === currentStep);
    });

    // Update counter
    processCounter.textContent = `Step ${currentStep + 1} / ${totalSteps}`;
  }

  // Desktop chip click
  processChips.forEach(chip => {
    chip.addEventListener('click', () => {
      setProcessStep(parseInt(chip.dataset.step, 10));
    });
  });

  // Mobile navigation
  processPrev.addEventListener('click', () => setProcessStep(currentStep - 1));
  processNext.addEventListener('click', () => setProcessStep(currentStep + 1));

  // ============================================================
  // 7. FAQ ACCORDION
  // Toggle individual questions open/closed
  // ============================================================
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq__question');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all items first (single-open accordion behavior)
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ============================================================
  // 8. FORM HANDLING
  // Basic client-side validation and submission feedback
  // ============================================================

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic validation is handled by HTML5 required attributes
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Simulate submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Quote Requested!';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2000);
      }, 1000);
    });
  }

  // Catalogue form
  const catalogueForm = document.getElementById('catalogueForm');
  if (catalogueForm) {
    catalogueForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = catalogueForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sent!';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        catalogueForm.reset();
      }, 2000);
    });
  }

  // ============================================================
  // 9. DATASHEET DOWNLOAD MODAL
  // Opens a popup form when "Download Full Technical Datasheet" is clicked
  // ============================================================
  const datasheetBtn = document.getElementById('downloadDatasheetBtn');
  const datasheetModal = document.getElementById('datasheetModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const datasheetForm = document.getElementById('datasheetForm');

  function openModal() {
    datasheetModal.classList.add('active');
    document.body.classList.add('modal-open');
    // Focus the first input for accessibility
    setTimeout(() => {
      const firstInput = datasheetModal.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 300);
  }

  function closeModal() {
    datasheetModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  datasheetBtn.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);

  // Close modal on overlay click (outside the modal box)
  datasheetModal.addEventListener('click', (e) => {
    if (e.target === datasheetModal) closeModal();
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && datasheetModal.classList.contains('active')) {
      closeModal();
    }
  });

  /**
   * Extracts all rows from the specs table and returns them
   * as an array of { parameter, specification } objects.
   */
  function getSpecsTableData() {
    const rows = document.querySelectorAll('.specs__table tbody tr');
    const data = [];
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        data.push({
          parameter: cells[0].textContent.trim(),
          specification: cells[1].textContent.trim()
        });
      }
    });
    return data;
  }

  /**
   * Generates a styled HTML document string for the technical datasheet,
   * suitable for downloading or printing as a PDF.
   */
  function generateDatasheetHTML(data) {
    const rows = data.map(d =>
      `<tr><td>${d.parameter}</td><td>${d.specification}</td></tr>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HDPE Pipes - Technical Datasheet</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 48px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 3px solid #2B3990; }
    .header h1 { font-size: 22px; color: #2B3990; }
    .header .date { font-size: 13px; color: #666; }
    .subtitle { font-size: 14px; color: #444; margin-bottom: 28px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { background: #2B3990; color: #fff; text-align: left; padding: 12px 16px; font-size: 13px; font-weight: 600; }
    td { padding: 11px 16px; font-size: 13px; border-bottom: 1px solid #e2e4e8; }
    tr:nth-child(even) td { background: #f8f9fa; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #888; text-align: center; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Premium HDPE Pipes &amp; Coils — Technical Datasheet</h1>
    <span class="date">Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
  </div>
  <p class="subtitle">Our HDPE pipes are manufactured with PE100 grade resin and comply with BIS IS 4984, ISO 4427, and CE marking standards. Below are the complete technical specifications.</p>
  <table>
    <thead><tr><th>Parameter</th><th>Specification</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">
    <p>This document is auto-generated. For custom specifications or queries, contact us at info@gushwork.com</p>
    <p>&copy; ${new Date().getFullYear()} Gushwork — Premium HDPE Pipes &amp; Fittings Manufacturer</p>
  </div>
</body>
</html>`;
  }

  /**
   * Downloads the specs table as a styled HTML file (openable in browser / printable as PDF).
   */
  function downloadDatasheet() {
    const data = getSpecsTableData();
    const html = generateDatasheetHTML(data);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'HDPE_Pipes_Technical_Datasheet.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Opens the user's mail client with the datasheet as a pre-filled email
   * to the address they entered in the modal form.
   */
  function sendDatasheetEmail(email) {
    const data = getSpecsTableData();
    const tableText = data.map(d => `${d.parameter}: ${d.specification}`).join('\n');

    const subject = encodeURIComponent('HDPE Pipes — Technical Datasheet');
    const body = encodeURIComponent(
      `Hi,\n\nPlease find the technical specifications below:\n\n` +
      `${'—'.repeat(40)}\n` +
      `${tableText}\n` +
      `${'—'.repeat(40)}\n\n` +
      `For custom specifications or queries, contact us at info@gushwork.com\n\n` +
      `Regards,\nGushwork — Premium HDPE Pipes & Fittings`
    );

    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  }

  // Handle datasheet form submission — download file + send email
  if (datasheetForm) {
    datasheetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('modalSubmitBtn');
      const emailInput = document.getElementById('modalEmail');
      const email = emailInput.value.trim();
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Preparing...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // 1. Download the datasheet file
        downloadDatasheet();

        // 2. Open mail client with specs data to the entered email
        sendDatasheetEmail(email);

        submitBtn.textContent = 'Downloaded & Sent!';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          datasheetForm.reset();
          closeModal();
        }, 2000);
      }, 800);
    });
  }

  // ============================================================
  // 10. REQUEST A QUOTE / CALLBACK MODAL
  // Opens when any "Request a Quote" or "Get Custom Quote" button is clicked
  // ============================================================
  const quoteModal = document.getElementById('quoteModal');
  const quoteModalCloseBtn = document.getElementById('quoteModalCloseBtn');
  const quoteForm = document.getElementById('quoteForm');
  const quoteTriggers = document.querySelectorAll('.quote-modal-trigger');

  function openQuoteModal() {
    quoteModal.classList.add('active');
    document.body.classList.add('modal-open');
    setTimeout(() => {
      const firstInput = quoteModal.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 300);
  }

  function closeQuoteModal() {
    quoteModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // Attach to all quote trigger buttons
  quoteTriggers.forEach(btn => {
    btn.addEventListener('click', openQuoteModal);
  });

  quoteModalCloseBtn.addEventListener('click', closeQuoteModal);

  // Close on overlay click
  quoteModal.addEventListener('click', (e) => {
    if (e.target === quoteModal) closeQuoteModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quoteModal.classList.contains('active')) {
      closeQuoteModal();
    }
  });

  // Handle quote form submission
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('quoteSubmitBtn');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Submitted!';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          quoteForm.reset();
          closeQuoteModal();
        }, 2000);
      }, 1000);
    });
  }

  // ============================================================
  // 11. SMOOTH SCROLL FOR ANCHOR LINKS
  // Adjusts scroll offset to account for sticky header height
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
