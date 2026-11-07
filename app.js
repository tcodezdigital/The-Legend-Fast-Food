/**
 * THE LEGEND FAST FOOD — SCROLL ANIMATED HERO & HOMEPAGE ENGINE
 * Handles 240-frame transparent PNG canvas scrubbing, progressive preloading,
 * side exploded layer callouts, customizer, and cart drawer.
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TOTAL_FRAMES = 240;
  const FRAME_BASE_PATH = 'frames/ezgif-frame-';
  const CANVAS_NATURAL_WIDTH = 1280;
  const CANVAS_NATURAL_HEIGHT = 720;
  const NAVBAR_HEIGHT = 68;

  // --- State ---
  const images = new Array(TOTAL_FRAMES + 1);
  const loadedFlags = new Array(TOTAL_FRAMES + 1).fill(false);
  let loadedCount = 0;
  let targetFrame = 1;
  let displayedFrame = 1;

  // --- DOM Elements ---
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  const heroSection = document.getElementById('hero-scroll-container');
  const heroSticky = document.getElementById('hero-sticky');
  const frameLoader = document.getElementById('frame-loader');
  const loaderProgressBar = document.getElementById('loader-progress-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderCount = document.getElementById('loader-count');
  const btnSkip = document.getElementById('btn-skip');

  // Stages & Exploded Callouts
  const stage1 = document.getElementById('stage-1');
  const stage3 = document.getElementById('stage-3');
  const stage4 = document.getElementById('stage-4');
  const explodedCallouts = document.getElementById('exploded-callouts');

  // Navbar & Cart
  const navbar = document.getElementById('navbar');
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCountBadge = document.getElementById('cart-count');
  const drawerItemsCount = document.getElementById('drawer-items-count');
  const cartEmptyView = document.getElementById('cart-empty-view');
  const cartList = document.getElementById('cart-list');
  const cartFooter = document.getElementById('cart-drawer-footer');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTax = document.getElementById('cart-tax');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('btn-checkout');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeModalBtn = document.getElementById('btn-close-modal');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  // Helpers (v3 cache-buster for transparent PNGs)
  const formatFrameNumber = (num) => String(num).padStart(3, '0');
  const getFrameUrl = (idx) => `${FRAME_BASE_PATH}${formatFrameNumber(idx)}.png?v=3`;

  // --- 1. Canvas Resizing & Transparent Frame Drawing ---
  function resizeCanvas() {
    if (!canvas || !heroSticky) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = heroSticky.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    renderCurrentFrame();
  }

  function getNearestLoadedImage(frameIdx) {
    frameIdx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIdx)));
    if (loadedFlags[frameIdx] && images[frameIdx]) {
      return images[frameIdx];
    }
    // Search nearest available frame to prevent any blank frames
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const lower = frameIdx - offset;
      const upper = frameIdx + offset;
      if (lower >= 1 && loadedFlags[lower] && images[lower]) {
        return images[lower];
      }
      if (upper <= TOTAL_FRAMES && loadedFlags[upper] && images[upper]) {
        return images[upper];
      }
    }
    return images[1] || null;
  }

  function renderFrame(frameIdx) {
    if (!ctx || !heroSticky) return;
    const img = getNearestLoadedImage(frameIdx);
    if (!img) return;

    const rect = heroSticky.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Clear canvas so transparent PNGs composite seamlessly over the background
    ctx.clearRect(0, 0, w, h);

    // FIT BURGER NATURALLY IN WINDOW (VERTICALLY CENTERED IN USABLE SPACE)
    const usableH = Math.max(200, h - NAVBAR_HEIGHT);
    const scaleH = (usableH * 0.88) / CANVAS_NATURAL_HEIGHT;
    const scaleW = (w * 0.94) / CANVAS_NATURAL_WIDTH;
    const scale = Math.min(scaleH, scaleW);

    const drawW = Math.round(CANVAS_NATURAL_WIDTH * scale);
    const drawH = Math.round(CANVAS_NATURAL_HEIGHT * scale);
    const drawX = Math.round((w - drawW) / 2);
    const drawY = Math.round(NAVBAR_HEIGHT + (usableH - drawH) / 2);

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  function renderCurrentFrame() {
    renderFrame(Math.round(displayedFrame));
  }

  // --- 2. Progressive Frame Loading System ---
  function loadSingleFrame(idx) {
    return new Promise((resolve) => {
      if (loadedFlags[idx]) {
        resolve(images[idx]);
        return;
      }
      const img = new Image();
      img.src = getFrameUrl(idx);
      img.onload = () => {
        images[idx] = img;
        loadedFlags[idx] = true;
        loadedCount++;
        onFrameLoaded(idx);
        resolve(img);
      };
      img.onerror = () => {
        resolve(null);
      };
    });
  }

  function onFrameLoaded(idx) {
    const pct = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
    loaderProgressBar.style.width = `${pct}%`;
    loaderPercent.textContent = `${pct}%`;
    loaderCount.textContent = `Loaded ${loadedCount} / ${TOTAL_FRAMES} frames`;

    // Render frame 1 immediately once ready
    if (idx === 1 && !frameLoader.classList.contains('fade-out')) {
      resizeCanvas();
      renderFrame(1);
    }

    // Enable skip button when at least 20 frames are ready
    if (loadedCount >= 20 && btnSkip.style.display === 'none') {
      btnSkip.style.display = 'inline-block';
    }

    // Dismiss preloader once 90% is loaded
    if (loadedCount >= 210 && !frameLoader.classList.contains('fade-out')) {
      dismissLoader();
    }
  }

  function dismissLoader() {
    frameLoader.classList.add('fade-out');
    setTimeout(() => {
      frameLoader.style.display = 'none';
    }, 500);
  }

  btnSkip.addEventListener('click', dismissLoader);

  async function startPreloadingSequence() {
    // Step 1: Priority load Frame 1
    await loadSingleFrame(1);
    resizeCanvas();

    // Step 2: Fast stride loading (every 4th frame: 1, 5, 9 ... 240)
    const strideList = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += 4) {
      if (i !== 1) strideList.push(i);
    }
    if (!strideList.includes(TOTAL_FRAMES)) strideList.push(TOTAL_FRAMES);

    await loadInBatches(strideList, 6);

    // Step 3: Load remaining frames in background
    const remainingList = [];
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      if (!loadedFlags[i]) remainingList.push(i);
    }
    await loadInBatches(remainingList, 6);
  }

  async function loadInBatches(items, batchSize) {
    for (let i = 0; i < items.length; i += batchSize) {
      const chunk = items.slice(i, i + batchSize);
      await Promise.all(chunk.map((idx) => loadSingleFrame(idx)));
    }
  }

  // --- 3. Scroll Calculation & Smooth Lerp Engine ---
  function updateScrollProgress() {
    const rect = heroSection.getBoundingClientRect();
    const scrollDistance = rect.height - window.innerHeight;
    const scrolled = -rect.top;

    let progress = 0;
    if (scrollDistance > 0) {
      progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
    }

    targetFrame = 1 + Math.round(progress * (TOTAL_FRAMES - 1));
  }

  function animationLoop() {
    const diff = targetFrame - displayedFrame;
    if (Math.abs(diff) > 0.01) {
      displayedFrame += diff * 0.18;
      renderCurrentFrame();
      updateStageUI(Math.round(displayedFrame));
    }

    requestAnimationFrame(animationLoop);
  }

  // --- 4. Dynamic Stages & Exploded Side Callouts ---
  function updateStageUI(frame) {
    frame = Math.max(1, Math.min(TOTAL_FRAMES, frame));

    // Stage 1: Intro (Frames 1 - 38) -> Far Left Only (Moved Up)
    if (frame <= 38) {
      stage1.classList.add('active');
      stage3.classList.remove('active');
      stage4.classList.remove('active');
      explodedCallouts.classList.remove('visible');
    }
    // Stage 2: Exploded Burger (Frames 39 - 110)
    // Cards positioned strictly on Left and Right sides away from the burger
    else if (frame > 38 && frame <= 110) {
      stage1.classList.remove('active');
      stage3.classList.remove('active');
      stage4.classList.remove('active');
      explodedCallouts.classList.add('visible');
    }
    // Stage 3: Searing Craft & Stats (Frames 111 - 180) -> Far Right Only (Moved Up)
    else if (frame > 110 && frame <= 180) {
      stage1.classList.remove('active');
      stage3.classList.add('active');
      stage4.classList.remove('active');
      explodedCallouts.classList.remove('visible');
    }
    // Stage 4: Reassembled & Order CTA (Frames 181 - 240) -> Far Right Only (Moved Up)
    else {
      stage1.classList.remove('active');
      stage3.classList.remove('active');
      stage4.classList.add('active');
      explodedCallouts.classList.remove('visible');
    }
  }

  // --- 5. Interactive Customizer / Flavor Lab ---
  let customConfig = {
    patties: 2,
    pattyPrice: 14.99,
    cheese: 'Aged Sharp Cheddar',
    cheesePrice: 0,
    addons: [{ name: 'Caramelized Sweet Onions', price: 0.99 }]
  };

  const pattyBtns = document.querySelectorAll('#patty-options .opt-btn');
  const cheeseBtns = document.querySelectorAll('#cheese-options .opt-btn');
  const addonCheckboxes = document.querySelectorAll('#addon-options input[type="checkbox"]');
  const customTotalPriceEl = document.getElementById('custom-total-price');
  const customBurgerTitle = document.getElementById('custom-burger-title');
  const customBurgerSummary = document.getElementById('custom-burger-summary');
  const customBurgerTags = document.getElementById('custom-burger-tags');
  const customPreviewImg = document.getElementById('custom-preview-img');
  const addCustomBtn = document.getElementById('add-custom-btn');

  function updateCustomizerUI() {
    const total = customConfig.pattyPrice + customConfig.cheesePrice +
      customConfig.addons.reduce((sum, item) => sum + item.price, 0);

    if (customTotalPriceEl) {
      customTotalPriceEl.textContent = `$${total.toFixed(2)}`;
    }

    // Determine appropriate image key from selected cheese & upgrades
    const cheeseKey = customConfig.cheese.includes('Pepper')
      ? 'pepperjack'
      : (customConfig.cheese.includes('Gouda') ? 'gouda' : 'cheddar');

    const isLoaded = customConfig.addons.some(a => a.name.includes('Bacon') || a.name.includes('Egg'));
    const targetImg = `images/custom-p${customConfig.patties}-${cheeseKey}${isLoaded ? '-loaded' : ''}.png`;

    // Smooth swap of transparent PNG burger
    if (customPreviewImg) {
      customPreviewImg.classList.add('swapping');
      setTimeout(() => {
        customPreviewImg.src = targetImg;
        customPreviewImg.classList.remove('swapping');
      }, 100);
    }

    // Dynamic Title Generation
    let title = 'The Legend Double Smash';
    const hasBacon = customConfig.addons.some(a => a.name.includes('Bacon'));
    const hasEgg = customConfig.addons.some(a => a.name.includes('Egg'));

    if (customConfig.patties === 1) {
      if (cheeseKey === 'pepperjack') title = 'The Legend Ghost Pepper Single';
      else if (cheeseKey === 'gouda') title = 'The Legend Smoked Gouda Single';
      else if (hasBacon && hasEgg) title = 'The Legend Sunrise Single Smash';
      else if (hasBacon) title = 'The Legend Smoky Bacon Single';
      else title = 'The Legend Single Smash';
    } else if (customConfig.patties === 2) {
      if (cheeseKey === 'pepperjack') title = 'The Legend Ghost Pepper Double';
      else if (cheeseKey === 'gouda') title = 'The Legend Smoked Gouda Double';
      else if (hasBacon && hasEgg) title = 'The Legend Sunrise Double Smash';
      else if (hasBacon) title = 'The Legend Applewood Bacon Double';
      else title = 'The Legend Double Smash';
    } else if (customConfig.patties === 3) {
      if (cheeseKey === 'pepperjack') title = 'The Legend Diablo Beast (Triple)';
      else if (cheeseKey === 'gouda') title = 'The Legend Truffle & Gouda Triple';
      else if (hasBacon && hasEgg) title = 'The Legend Ultimate Sunrise Triple';
      else title = 'The Legend Triple Smash';
    }

    if (customBurgerTitle) customBurgerTitle.textContent = title;

    const addonNames = customConfig.addons.map(a => a.name).join(', ') || 'House Secret Sauce & Brioche';
    if (customBurgerSummary) {
      customBurgerSummary.textContent = `${customConfig.patties}x Angus Patties, Melted ${customConfig.cheese}, ${addonNames}.`;
    }

    if (customBurgerTags) {
      customBurgerTags.innerHTML = `
        <span class="tag">${customConfig.patties}x Angus Patty</span>
        <span class="tag">${customConfig.cheese}</span>
        ${customConfig.addons.map(a => `<span class="tag">${a.name}</span>`).join('')}
      `;
    }
  }

  pattyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pattyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      customConfig.patties = parseInt(btn.dataset.val, 10);
      customConfig.pattyPrice = parseFloat(btn.dataset.price);
      updateCustomizerUI();
    });
  });

  cheeseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cheeseBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      customConfig.cheese = btn.dataset.val;
      customConfig.cheesePrice = parseFloat(btn.dataset.price);
      updateCustomizerUI();
    });
  });

  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      customConfig.addons = [];
      addonCheckboxes.forEach(box => {
        if (box.checked) {
          customConfig.addons.push({
            name: box.value,
            price: parseFloat(box.dataset.price)
          });
        }
      });
      updateCustomizerUI();
    });
  });

  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', () => {
      const total = customConfig.pattyPrice + customConfig.cheesePrice +
        customConfig.addons.reduce((sum, item) => sum + item.price, 0);

      addToCart({
        id: `custom-${Date.now()}`,
        name: customBurgerTitle ? customBurgerTitle.textContent : 'Custom Legend Burger',
        price: total,
        image: customPreviewImg ? customPreviewImg.getAttribute('src') : 'images/custom-p2-cheddar.png',
        qty: 1
      });

      // Automatically open cart drawer to confirm addition
      openCart();
    });
  }

  // --- 6. Menu Filter Tabs ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;

      menuCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 7. Shopping Cart Drawer System ---
  let cart = [];

  function addToCart(item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...item, qty: item.qty || 1 });
    }
    renderCart();
    openCart();
    showToast(`Added ${item.name} to your bag!`);
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      renderCart();
    }
  }

  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountBadge.textContent = count;
    drawerItemsCount.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;

    if (cart.length === 0) {
      cartEmptyView.style.display = 'block';
      cartList.style.display = 'none';
      cartFooter.style.display = 'none';
      return;
    }

    cartEmptyView.style.display = 'none';
    cartList.style.display = 'flex';
    cartFooter.style.display = 'block';

    cartList.innerHTML = cart.map(item => `
      <div class="cart-item">
        ${item.image ? `<img src="${item.image}" class="cart-item-thumb" alt="${item.name}">` : ''}
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="cart-qty-ctrls">
          <button class="qty-btn" onclick="window.changeCartQty('${item.id}', -1)">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="window.changeCartQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartTax.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  window.changeCartQty = changeQty;

  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
  }

  openCartBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Add from Menu Items
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        qty: 1
      });
    });
  });

  // Hero order button
  document.getElementById('hero-order-btn').addEventListener('click', () => {
    addToCart({
      id: 'legend-double-hero',
      name: 'The Classic Legend Double Smash',
      price: 14.99,
      qty: 1
    });
  });

  // Checkout modal
  checkoutBtn.addEventListener('click', () => {
    closeCart();
    checkoutModal.classList.add('open');
    cart = [];
    renderCart();
  });

  closeModalBtn.addEventListener('click', () => {
    checkoutModal.classList.remove('open');
  });

  // Toast
  let toastTimer = null;
  function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // --- 8. Navbar Scroll Shrink & Active Links ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateScrollProgress();
  }, { passive: true });

  window.addEventListener('resize', () => {
    resizeCanvas();
    updateScrollProgress();
  });

  // --- Initialize Everything ---
  window.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    updateCustomizerUI();
    renderCart();
    startPreloadingSequence();
    animationLoop();
  });

})();
