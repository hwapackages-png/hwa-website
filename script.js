// =============================================
//  HWA PACKAGES – SCRIPTS
// =============================================

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
const isHomePage = document.querySelector('.hero') !== null;
window.addEventListener('scroll', () => {
  if (isHomePage) {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  updateActiveNavLink();
});
// Non-home pages always keep scrolled class
if (!isHomePage) navbar.classList.add('scrolled');

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// ---- Active nav link on scroll ----
function updateActiveNavLink() {
  const sections = ['home', 'products', 'about', 'contact', 'login'];
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) {
      current = id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href').replace('#', '');
    if (href === current) link.classList.add('active');
  });
}

// ---- Toast notification ----
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ---- Contact form ----
function handleContactForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const subject = form.querySelectorAll('input[type="text"]')[1].value.trim();
  const message = form.querySelector('textarea').value.trim();

  let text = `*New Contact Message*\n\n`;
  text += `*Name:* ${name}\n`;
  text += `*Email:* ${email}\n`;
  if (subject) text += `*Subject:* ${subject}\n`;
  text += `\n${message}`;

  const phone = '923335863444';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  showToast('Opening WhatsApp…');
  form.reset();
}

// ---- Quantity mode toggle ----
function setQtyMode(mode) {
  const pcsGroup = document.getElementById('qtyPcsGroup');
  const kgGroup = document.getElementById('qtyKgGroup');
  const pcsBtn = document.getElementById('qtyTogglePcs');
  const kgBtn = document.getElementById('qtyToggleKg');
  if (mode === 'pcs') {
    pcsGroup.style.display = '';
    kgGroup.style.display = 'none';
    document.getElementById('calc-qty-kg').value = '';
    pcsBtn.classList.add('active');
    kgBtn.classList.remove('active');
  } else {
    pcsGroup.style.display = 'none';
    kgGroup.style.display = '';
    document.getElementById('calc-qty-pcs').value = '';
    kgBtn.classList.add('active');
    pcsBtn.classList.remove('active');
  }
}

// ---- Price Calculator ----
const calcBtn = document.getElementById('calcBtn');
if (calcBtn) {
  // Default pricing (overridden by Firebase if available)
  const defaultPricing = {
    basePrices: { wcut: 10, dcut: 12, loop: 16, cake: 19, stitch: 30, pouch: 5.98 },
    bagParams: {
      wcut: { bonusPct: 10 },
      dcut: { heightExtra: 6 },
      loop: { heightExtra: 4, handleWeightG: 4.5 },
      pouch: { heightExtra: 6 },
      stitch: { handleLen: 20, maghziW: 1.5, stitchCost: 0 },
      cake: { handleLen: 20, maghziW: 1.5, stitchCost: 0 }
    },
    printAddon: { none: 0, one: 2, two: 4, three: 6 },
    bulkDiscounts: [
      { minQty: 5000, discount: 0.82 },
      { minQty: 2000, discount: 0.88 },
      { minQty: 1000, discount: 0.92 },
      { minQty: 500, discount: 0.96 }
    ]
  };

  // Helper to get live pricing or fallback to defaults
  function getPricing() {
    return (window.hwaPricing) ? window.hwaPricing : defaultPricing;
  }

  const typeLabels = {
    wcut: 'W-Cut Bag', dcut: 'D-Cut Bag', loop: 'Loop Handle Bag',
    cake: 'Cake Bag', stitch: 'Stitch Bag', pouch: 'Pouch'
  };
  const bagImages = {
    wcut: 'images/bags/wcut.png', dcut: 'images/bags/dcut.png',
    loop: 'images/bags/loop.png', cake: 'images/bags/cake.png',
    stitch: 'images/bags/stitch.png', pouch: 'images/bags/pouch.png'
  };
  const printLabels = { none: 'No Printing', one: 'One Color', two: 'Two Color', three: 'Three Color' };

  // Commonly used GSM per bag type
  const commonGsm = {
    wcut: [30, 35, 40],
    dcut: [50, 60, 70],
    loop: [50, 60, 70],
    cake: [60],
    stitch: [60, 70],
    pouch: [35, 40]
  };

  // General market sizes per bag type (Size + Measurement only)
  const marketSizes = {
    wcut: {
      headers: ['Size', 'Measurement'],
      rows: [
        ['Small', '8 x 11'],
        ['Medium', '10 x 13'],
        ['Large', '12 x 15'],
        ['Extra Large', '15 x 18'],
        ['Jumbo', '18 x 18'],
        ['Super Jumbo', '18 x 22'],
        ['Mega', '22 x 22']
      ]
    },
    dcut: {
      headers: ['Size', 'Measurement'],
      rows: [
        ['Small', '8 x 10'],
        ['Medium', '10 x 12'],
        ['Large', '12 x 16'],
        ['Extra Large', '14 x 18'],
        ['Jumbo', '16 x 20']
      ]
    },
    loop: {
      headers: ['Size', 'Measurement'],
      rows: [
        ['Small', '10 x 12'],
        ['Medium', '12 x 15'],
        ['Large', '14 x 18'],
        ['Extra Large', '16 x 20']
      ]
    },
    cake: {
      headers: ['Size', 'Measurement'],
      rows: [
        ['1 Pound', '10 x 10 x 10'],
        ['2 Pound', '12 x 12 x 12']
      ]
    },
    stitch: {
      headers: ['Size', 'Measurement'],
      rows: [
        ['Medium', '12 x 12 x 5'],
        ['Large', '15 x 18 x 6'],
        ['Extra Large', '18 x 18 x 8'],
        ['Jumbo', '18 x 20 x 8']
      ]
    },
    pouch: {
      headers: ['Size', 'Measurement'],
      rows: [
        ['Small', '5 x 7'],
        ['Medium', '6 x 8'],
        ['Large', '8 x 10']
      ]
    }
  };

  // Show bag preview on type change
  const calcType = document.getElementById('calc-type');
  const calcPreview = document.getElementById('calcPreview');
  const calcPreviewImg = document.getElementById('calcPreviewImg');
  const calcPlaceholder = document.getElementById('calcPlaceholder');

  const gussetInput = document.getElementById('calc-gusset');
  const gussetSep = document.getElementById('calcGussetSep');
  const gussetTypes = ['stitch', 'cake'];

  calcType.addEventListener('change', () => {
    const val = calcType.value;
    // Show/hide gusset field
    if (gussetTypes.includes(val)) {
      gussetInput.style.display = '';
      gussetSep.style.display = '';
    } else {
      gussetInput.style.display = 'none';
      gussetSep.style.display = 'none';
      gussetInput.value = '';
    }
    // Force pieces-only for cake bags
    const qtyToggle = document.querySelector('.calc-qty-toggle');
    if (val === 'cake' || val === 'stitch') {
      setQtyMode('pcs');
      qtyToggle.style.display = 'none';
    } else {
      qtyToggle.style.display = '';
    }

    // Show bag preview
    const sizesRef = document.getElementById('calcSizesRef');
    const sizesTable = document.getElementById('calcSizesTable');
    const gsmHint = document.getElementById('calcGsmHint');
    if (val && bagImages[val]) {
      calcPreviewImg.src = bagImages[val];
      calcPreviewImg.alt = typeLabels[val];
      calcPreview.classList.add('visible');
      calcPlaceholder.style.display = 'none';

      // Build sizes reference table
      const sizes = marketSizes[val];
      if (sizes) {
        let html = '<thead><tr>' + sizes.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>';
        html += sizes.rows.map(row => '<tr>' + row.map(cell => '<td>' + cell + '</td>').join('') + '</tr>').join('');
        html += '</tbody>';
        sizesTable.innerHTML = html;
        sizesRef.style.display = '';
      }

      // Show common GSM hint under the GSM dropdown
      if (commonGsm[val]) {
        gsmHint.innerHTML = 'Most commonly used: ' + commonGsm[val].map(g => '<strong>' + g + ' GSM</strong>').join(', ');
        gsmHint.style.display = '';
      } else {
        gsmHint.style.display = 'none';
      }
    } else {
      calcPreview.classList.remove('visible');
      calcPlaceholder.style.display = '';
      sizesRef.style.display = 'none';
      gsmHint.style.display = 'none';
    }
  });

  calcBtn.addEventListener('click', () => {
    const type = document.getElementById('calc-type').value;
    const width = parseFloat(document.getElementById('calc-width').value) || 0;
    const height = parseFloat(document.getElementById('calc-height').value) || 0;
    const gusset = parseFloat(document.getElementById('calc-gusset').value) || 0;
    const gsm = document.getElementById('calc-gsm').value;
    const qtyPcs = parseInt(document.getElementById('calc-qty-pcs').value) || 0;
    const qtyKg = parseFloat(document.getElementById('calc-qty-kg').value) || 0;
    const print = document.getElementById('calc-print').value;

    const needsGusset = gussetTypes.includes(type);
    const hasPcs = qtyPcs >= 1000;
    const hasKg = qtyKg >= 50;

    if (!type || !width || !height || !gsm || (!hasPcs && !hasKg) || (needsGusset && !gusset)) {
      showToast('Please fill all fields. Min qty: 1000 pcs or 50 kg');
      return;
    }

    // Get live pricing from Firebase or defaults
    const pricing = getPricing();
    const basePrices = pricing.basePrices;
    const printAddon = pricing.printAddon;
    const bulkDiscounts = pricing.bulkDiscounts || [];
    const params = pricing.bagParams || defaultPricing.bagParams;
    const bp = params[type] || {};

    const gsmVal = parseFloat(gsm);

    // Calculate bag weight in grams (formula differs per bag type)
    let bagWeightGrams;
    switch (type) {
      case 'wcut': {
        // Area = (front + back + seam) × height; then bonus for W-cut shape
        const effectiveArea = (2 * width + 2) * height;
        const bonusPct = bp.bonusPct != null ? bp.bonusPct : 10;
        bagWeightGrams = (effectiveArea * gsmVal) / 1550 / (1 + bonusPct / 100);
        break;
      }
      case 'dcut': {
        // Area = width × (front + back + handle cut extra)
        const extra = bp.heightExtra != null ? bp.heightExtra : 6;
        bagWeightGrams = (width * (2 * height + extra) * gsmVal) / 1550;
        break;
      }
      case 'loop': {
        // Area = width × (front + back + handle area) + handle material weight
        const extra = bp.heightExtra != null ? bp.heightExtra : 4;
        const handleW = bp.handleWeightG != null ? bp.handleWeightG : 4.5;
        bagWeightGrams = (width * (2 * height + extra) * gsmVal) / 1550 + handleW;
        break;
      }
      case 'pouch': {
        // Area = width × (front + back + seal area)
        const extra = bp.heightExtra != null ? bp.heightExtra : 6;
        bagWeightGrams = (width * (2 * height + extra) * gsmVal) / 1550;
        break;
      }
      case 'cake':
      case 'stitch': {
        // Multi-component: main palla + side gussets + handles + maghzi
        const handleLen = bp.handleLen != null ? bp.handleLen : 20;
        const maghziW = bp.maghziW != null ? bp.maghziW : 1.5;
        const mainPalla = ((2 * height + gusset + 4) * width * gsmVal) / 1550;
        const sideGussets = 2 * ((gusset * (height + 3)) * gsmVal / 1550);
        const handles = (2 * 2 * handleLen * gsmVal) / 1550;
        const maghzi = (maghziW * (2 * height + gusset + 5) * gsmVal) / 1550;
        bagWeightGrams = mainPalla + sideGussets + handles + maghzi;
        break;
      }
    }

    const bagWeightKg = bagWeightGrams / 1000;

    // Determine qty in pieces; if kg, convert using bag weight
    let qty, qtyLabel;
    if (hasPcs) {
      qty = qtyPcs;
      qtyLabel = qty.toLocaleString() + ' pcs';
    } else {
      qty = Math.round(qtyKg / bagWeightKg);
      qtyLabel = qtyKg + ' kg (~' + qty.toLocaleString() + ' pcs)';
    }

    // Stitch cost for stitch/cake bags
    let stitchAddon = 0;
    if (type === 'stitch' || type === 'cake') {
      stitchAddon = bp.stitchCost != null ? bp.stitchCost : 0;
    }

    // Unit Price = (Kg Price + Print Addon per kg) × bag weight in kg + Stitch Cost
    const unitPrice = (basePrices[type] + printAddon[print]) * bagWeightKg + stitchAddon;

    // Bulk discount from Firebase tiers (sorted descending)
    let discount = 1;
    const sortedDiscounts = [...bulkDiscounts].sort((a, b) => b.minQty - a.minQty);
    for (const tier of sortedDiscounts) {
      if (qty >= tier.minQty) { discount = tier.discount; break; }
    }

    const finalUnit = unitPrice * discount;
    const total = finalUnit * qty;

    document.getElementById('resType').textContent = typeLabels[type];
    document.getElementById('resSize').textContent = needsGusset
      ? width + '" x ' + height + '" x ' + gusset + '" gusset'
      : width + '" x ' + height + '"';
    document.getElementById('resGsm').textContent = gsm + ' GSM';
    document.getElementById('resPrint').textContent = printLabels[print];
    document.getElementById('resQty').textContent = qtyLabel;

    // Show pieces per kg (except for cake and stitch bags)
    const pcsPerKgRow = document.getElementById('resPcsPerKgRow');
    if (type !== 'cake' && type !== 'stitch') {
      const pcsPerKg = Math.round(1 / bagWeightKg);
      document.getElementById('resPcsPerKg').textContent = pcsPerKg.toLocaleString() + ' pcs';
      pcsPerKgRow.style.display = '';
    } else {
      pcsPerKgRow.style.display = 'none';
    }

    document.getElementById('resUnit').textContent = 'Rs. ' + finalUnit.toFixed(2);
    const pricePerKg = finalUnit / bagWeightKg;
    const kgPriceRow = document.getElementById('resKgPriceRow');
    if (type !== 'cake' && type !== 'stitch') {
      document.getElementById('resKgPrice').textContent = 'Rs. ' + pricePerKg.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      kgPriceRow.style.display = '';
    } else {
      kgPriceRow.style.display = 'none';
    }
    document.getElementById('resTotal').textContent = 'Rs. ' + total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    document.querySelector('.calc-result-placeholder').style.display = 'none';
    document.getElementById('calcBreakdown').style.display = 'block';
  });
}

// ---- Smooth scroll for anchor links (same-page only) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href.length <= 1) return; // skip bare "#"
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Intersection Observer: fade-in on scroll ----
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-in styles via JS
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity .5s ease, transform .5s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(fadeStyle);

// Apply fade-in to key elements
const fadeTargets = [
  '.bag-card',
  '.item-card',
  '.about-card',
  '.cert-card',
  '.phone-card',
  '.info-card',
  '.product-category',
  '.stat',
  '.feature-item',
];

fadeTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
});

// ---- Stat counter animation ----
const statNums = document.querySelectorAll('.stat-num[data-count]');

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const step = 16;
  const totalSteps = Math.round(duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current++;
    const value = Math.round(current / totalSteps * target);
    el.textContent = value + suffix;
    if (current >= totalSteps) {
      el.textContent = target + suffix;
      clearInterval(timer);
    }
  }, step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

// ---- Category header slideshow (1s interval) ----
document.querySelectorAll('.cat-slideshow').forEach(slideshow => {
  const slides = slideshow.querySelectorAll('.cat-slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 1000);
});

// ---- Product detail slideshow (1s interval) ----
document.querySelectorAll('.pd-slideshow').forEach(slideshow => {
  const slides = slideshow.querySelectorAll('.pd-slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 1000);
});

// ---- Item card click (product catalog) ----
document.querySelectorAll('.item-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('span:last-child').textContent;
    showToast(`${name} – Contact us to customize your order!`);
  });
});
