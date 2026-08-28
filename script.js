// ---- Service catalog ----
// Edit this array to add/remove categories or services.
// `active: false` hides a category from the homepage grid without deleting
// its content — flip it to true once you actually have vetted workers
// and (for the "care" group) proper protocols in place for that category.
const CATALOG_EN = [
  {
    id: "carpenter",
    group: "trade",
    active: true,
    icon: "🪚",
    name: "Carpenter",
    tagline: "Furniture, fittings & woodwork",
    services: [
      "Furniture repair",
      "Custom furniture making",
      "Door & window installation",
      "Wardrobe / cabinet installation",
      "Modular kitchen work",
      "Wood polishing & French polish",
      "Furniture assembly (flat-pack)",
      "Lock & hinge repair",
      "False ceiling work",
      "Door repair & alignment"
    ]
  },
  {
    id: "electrician",
    group: "trade",
    active: true,
    icon: "🔌",
    name: "Electrician",
    tagline: "Wiring, fittings & repairs",
    services: [
      "House wiring & rewiring",
      "Switch / socket repair or replacement",
      "Fan installation & repair",
      "Light fixture installation",
      "MCB / fuse box repair",
      "Inverter & stabilizer installation",
      "Appliance installation (AC, geyser, etc.)",
      "Short circuit diagnosis & repair",
      "Doorbell / intercom installation",
      "Home electrical safety inspection"
    ]
  },
  {
    id: "painter",
    group: "trade",
    active: true,
    icon: "🎨",
    name: "Painter",
    tagline: "Interior, exterior & touch-ups",
    services: [
      "Interior wall painting",
      "Exterior wall painting",
      "Waterproofing treatment",
      "Texture / designer wall painting",
      "Wood painting & varnishing",
      "Wall putty & crack filling",
      "Ceiling painting",
      "Grill & gate painting",
      "Wallpaper installation",
      "Free painting consultation & estimate"
    ]
  },
  {
    id: "cleaning",
    group: "trade",
    active: true,
    icon: "🧹",
    name: "Cleaning Services",
    tagline: "Home, office & deep cleaning",
    services: [
      "Full home deep cleaning",
      "Kitchen deep cleaning",
      "Bathroom deep cleaning",
      "Sofa & carpet shampooing",
      "Water tank cleaning",
      "Office / commercial cleaning",
      "Move-in / move-out cleaning",
      "Pest control",
      "Glass & window cleaning",
      "Post-construction cleaning"
    ]
  },
  {
    id: "plumber",
    group: "trade",
    active: true,
    icon: "🔧",
    name: "Plumber",
    tagline: "Leaks, fittings & installations",
    services: [
      "Pipe leak repair",
      "Tap & faucet installation",
      "Bathroom fitting installation",
      "Drainage & choke cleaning",
      "Water heater / geyser installation & repair",
      "Toilet / commode repair",
      "Overhead water tank installation",
      "Sewer line repair",
      "Water motor / pump repair",
      "RO & water purifier installation"
    ]
  },
  {
    id: "women-aid",
    group: "care",
    active: false, // turn on only once trained/vetted staff + safety protocol are ready
    icon: "🤝",
    name: "Women Aid",
    tagline: "Support, safety & empowerment",
    services: [
      "Women's helpline & counselling",
      "Self-defense training",
      "Legal aid for women",
      "Domestic violence support",
      "Financial literacy workshops",
      "Skill development / vocational training",
      "Women's health awareness sessions",
      "Job placement assistance",
      "Support group counselling",
      "Emergency shelter assistance"
    ]
  },
  {
    id: "medical-aid",
    group: "care",
    active: false, // turn on only once licensed medical/nursing staff are ready — do NOT advertise "ambulance"/"doctor on call" until genuinely arranged
    icon: "⚕️",
    name: "Medical Aid",
    tagline: "Home healthcare & emergency support",
    services: [
      "Home nursing care",
      "Doctor on call",
      "Physiotherapy at home",
      "Lab sample collection at home",
      "Ambulance service",
      "Medicine delivery",
      "Home health checkup packages",
      "First aid & emergency response",
      "Post-surgery home care",
      "Vaccination at home"
    ]
  },
  {
    id: "old-age-assistance",
    group: "care",
    active: false, // turn on only once trained/vetted staff + safety protocol are ready
    icon: "🧓",
    name: "Old Age Assistance",
    tagline: "Companionship & daily support for seniors",
    services: [
      "Companionship visits",
      "Daily chore assistance",
      "Medical appointment accompaniment",
      "Grocery & errand assistance",
      "Mobility & walking assistance",
      "Home nursing for elderly",
      "Emotional support & counselling",
      "Meal preparation assistance",
      "Bill payment & paperwork assistance",
      "Emergency response service"
    ]
  }
];

// Active catalog — switches between CATALOG_EN and window.CATALOG_MR
// (from translations.js) when the language toggle is used.
let CATALOG = CATALOG_EN;

window.sahiSetCatalogLanguage = function(lang) {
  CATALOG = (lang === "mr" && window.CATALOG_MR) ? window.CATALOG_MR : CATALOG_EN;
  render();
  renderQuickIcons();
  renderPricingTable();
};

// ---- State ----
const STORAGE_KEY = "helloMumbai_selectedServices";
let selected = loadSelections();

function loadSelections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveSelections() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  } catch (e) {
    // storage unavailable — ignore, selections just won't persist
  }
}

function totalSelectedCount() {
  return Object.values(selected).reduce((sum, arr) => sum + arr.length, 0);
}

function isChecked(catId, service) {
  return !!(selected[catId] && selected[catId].includes(service));
}

function toggleService(catId, service) {
  if (!selected[catId]) selected[catId] = [];
  const idx = selected[catId].indexOf(service);
  if (idx === -1) {
    selected[catId].push(service);
  } else {
    selected[catId].splice(idx, 1);
    if (selected[catId].length === 0) delete selected[catId];
  }
  saveSelections();
  updateCounts();
}

function updateCounts() {
  const total = totalSelectedCount();
  document.getElementById("selectedCount").textContent = total;
  document.getElementById("traySummaryCount").textContent = total;

  // Per-category badges
  CATALOG.forEach(cat => {
    const badge = document.querySelector(`.category-badge[data-cat="${cat.id}"]`);
    if (badge) {
      const count = selected[cat.id] ? selected[cat.id].length : 0;
      badge.textContent = count > 0 ? count : "";
      badge.style.display = count > 0 ? "inline-block" : "none";
    }
  });

  const tray = document.getElementById("selectionTray");
  if (total > 0) {
    tray.classList.add("visible");
  } else {
    tray.classList.remove("visible");
  }
}

// ---- Search ----
let searchQuery = "";

function categoryMatchesSearch(cat, query) {
  if (!cat.active) return false;
  if (!query) return true;
  const q = query.toLowerCase();
  if (cat.name.toLowerCase().includes(q)) return true;
  return cat.services.some(s => s.toLowerCase().includes(q));
}

function onDomReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

onDomReady(() => {
  renderPricingTable();

  const pinCheckBtn = document.getElementById("pinCheckBtn");
  const pinCheckInput = document.getElementById("pinCheckInput");
  if (pinCheckBtn && pinCheckInput) {
    pinCheckBtn.addEventListener("click", () => checkPinAvailability(pinCheckInput.value.trim()));
    pinCheckInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkPinAvailability(pinCheckInput.value.trim());
    });
  }

  const searchInput = document.getElementById("serviceSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      render();
      // Scroll results into view once the person starts typing, so they're
      // not left staring at the hero while filtered services sit below the fold.
      if (searchQuery) {
        const grid = document.getElementById("categoryGrid");
        if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Ticket counter in the header ("N selected") should jump straight to the
  // services grid so people can review/continue their selections.
  const ticketCounter = document.getElementById("ticketCounter");
  if (ticketCounter) {
    ticketCounter.addEventListener("click", () => {
      const grid = document.getElementById("categoryGrid");
      if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // "How it works" is optional reading — closed by default, opens as a
  // sliding sheet only if someone taps to learn more.
  const howItWorksTrigger = document.getElementById("howItWorksTrigger");
  const howItWorksOverlay = document.getElementById("how-it-works-overlay");
  const howItWorksClose = document.getElementById("howItWorksClose");
  if (howItWorksTrigger && howItWorksOverlay) {
    howItWorksTrigger.addEventListener("click", () => {
      howItWorksOverlay.classList.remove("sr-hidden");
    });
    if (howItWorksClose) {
      howItWorksClose.addEventListener("click", () => {
        howItWorksOverlay.classList.add("sr-hidden");
      });
    }
    howItWorksOverlay.addEventListener("click", (e) => {
      if (e.target === howItWorksOverlay) howItWorksOverlay.classList.add("sr-hidden");
    });
  }

  // Showcase cards ("On the job" / "Handled with care") — open a
  // photo/video gallery for that card.
  document.querySelectorAll("[data-gallery]").forEach(card => {
    card.addEventListener("click", () => openGallery(card.getAttribute("data-gallery")));
  });
  const galleryOverlay = document.getElementById("gallery-overlay");
  const galleryClose = document.getElementById("galleryClose");
  if (galleryOverlay && galleryClose) {
    galleryClose.addEventListener("click", () => galleryOverlay.classList.add("sr-hidden"));
    galleryOverlay.addEventListener("click", (e) => {
      if (e.target === galleryOverlay) galleryOverlay.classList.add("sr-hidden");
    });
  }
});

// ---- Showcase gallery media ----
// Edit this to add real photos/videos of completed jobs. Each entry is one
// slide in the gallery for that card. type can be "image" or "video"
// (video src should be an actual video file URL — mp4 works everywhere).
const SHOWCASE_MEDIA = {
  "on-the-job": [
    { type: "image", src: "gallery-modern.jpg", caption: "REPLACE_ME_CAPTION_1 — e.g. Electrician & plumber working the same visit" },
    { type: "image", src: "hero-kitchen.jpg", caption: "REPLACE_ME_CAPTION_2 — swap in a real before/after photo" },
    { type: "image", src: "gallery-heritage.jpg", caption: "REPLACE_ME_CAPTION_3 — add a short video walkthrough here too" }
  ],
  "handled-with-care": [
    { type: "image", src: "gallery-heritage.jpg", caption: "REPLACE_ME_CAPTION_1 — careful work in a heritage home" },
    { type: "image", src: "gallery-modern.jpg", caption: "REPLACE_ME_CAPTION_2 — swap in a real photo from a completed job" },
    { type: "image", src: "hero-kitchen.jpg", caption: "REPLACE_ME_CAPTION_3 — a customer testimonial video works great here" }
  ]
};

const SHOWCASE_TITLES = {
  "on-the-job": "On the job",
  "handled-with-care": "Handled with care"
};
const SHOWCASE_TITLES_MR = {
  "on-the-job": "कामावर",
  "handled-with-care": "काळजीपूर्वक हाताळलेले"
};

function openGallery(key) {
  const overlay = document.getElementById("gallery-overlay");
  const strip = document.getElementById("galleryStrip");
  const title = document.getElementById("galleryTitle");
  if (!overlay || !strip) return;
  const isMr = window.SahiI18n && window.SahiI18n.getLanguage() === "mr";

  const media = SHOWCASE_MEDIA[key] || [];
  title.textContent = (isMr ? SHOWCASE_TITLES_MR[key] : SHOWCASE_TITLES[key]) || "Photos & Videos";
  strip.innerHTML = media.map(item => `
    <div class="gallery-item">
      ${item.type === "video"
        ? `<video src="${item.src}" controls playsinline></video>`
        : `<img src="${item.src}" alt="${item.caption || ""}" loading="lazy">`}
      ${item.caption ? `<span class="gallery-item-caption">${item.caption}</span>` : ""}
    </div>
  `).join("");

  overlay.classList.remove("sr-hidden");
}

// ---- Quick category icons (Uber-style "For you" row) ----
function renderQuickIcons() {
  const row = document.getElementById("quickIcons");
  if (!row) return;
  row.innerHTML = CATALOG.filter(cat => cat.active).map(cat => `
    <button type="button" class="quick-icon-item" data-cat="${cat.id}">
      <span class="quick-icon-circle">${cat.icon}</span>
      <span class="quick-icon-label">${cat.name}</span>
    </button>
  `).join("");

  row.querySelectorAll(".quick-icon-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const catId = btn.getAttribute("data-cat");
      const card = document.getElementById(`card-${catId}`);
      if (!card) return;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      if (!card.classList.contains("open")) {
        const head = card.querySelector(".category-head");
        if (head) head.click();
      }
    });
  });
}

// ---- Render ----
const GROUP_LABELS_EN = {
  trade: {
    eyebrow: "Home & Repair",
    title: "Skilled trades for the house",
    desc: "Carpentry, wiring, painting, plumbing and cleaning — booked by the job."
  },
  care: {
    eyebrow: "Community & Care",
    title: "Support for people, not just repairs",
    desc: "Help for women, medical needs and elderly care — handled with the same care as any home visit."
  }
};

const GROUP_LABELS_MR = {
  trade: {
    eyebrow: "घर आणि दुरुस्ती",
    title: "घरासाठी कुशल कारागीर",
    desc: "सुतारकाम, वायरिंग, पेंटिंग, प्लंबिंग आणि स्वच्छता — कामानुसार बुक करा."
  },
  care: {
    eyebrow: "समुदाय आणि काळजी",
    title: "फक्त दुरुस्तीच नाही, लोकांसाठी आधार",
    desc: "महिलांसाठी मदत, वैद्यकीय गरजा आणि ज्येष्ठांची काळजी — घरगुती भेटीइतकीच काळजी घेऊन."
  }
};

function currentGroupLabels() {
  return (window.SahiI18n && window.SahiI18n.getLanguage() === "mr") ? GROUP_LABELS_MR : GROUP_LABELS_EN;
}

function render() {
  const grid = document.getElementById("categoryGrid");
  grid.innerHTML = "";

  const GROUP_LABELS = currentGroupLabels();
  const query = searchQuery.toLowerCase();
  const visibleCats = CATALOG.filter(cat => categoryMatchesSearch(cat, searchQuery));

  if (query && visibleCats.length === 0) {
    grid.innerHTML = `<p class="search-empty">No services match "${searchQuery}". Try a different word.</p>`;
    return;
  }

  let lastGroup = null;

  visibleCats.forEach(cat => {
    if (cat.group && cat.group !== lastGroup) {
      const groupInfo = GROUP_LABELS[cat.group];
      if (groupInfo) {
        const header = document.createElement("div");
        header.className = "group-header" + (lastGroup ? " group-header-spaced" : "");
        header.innerHTML = `
          <span class="intro-eyebrow">${groupInfo.eyebrow}</span>
          <h3>${groupInfo.title}</h3>
          <p>${groupInfo.desc}</p>
        `;
        grid.appendChild(header);
      }
      lastGroup = cat.group;
    }

    const card = document.createElement("div");
    card.className = "category-card";
    card.id = `card-${cat.id}`;
    card.setAttribute("data-cat", cat.id);

    const head = document.createElement("button");
    head.className = "category-head";
    head.type = "button";
    head.setAttribute("aria-expanded", "false");
    head.innerHTML = `
      <span class="category-icon" data-cat="${cat.id}">${cat.icon}</span>
      <span class="category-title">
        <h2>${cat.name}</h2>
        <span>${cat.tagline}</span>
      </span>
      <span class="category-badge" data-cat="${cat.id}" style="display:none;"></span>
      <span class="chevron">▼</span>
    `;
    head.addEventListener("click", () => {
      const isOpen = card.classList.toggle("open");
      head.setAttribute("aria-expanded", isOpen ? "true" : "false");
      const list = card.querySelector(".service-list");
      list.style.maxHeight = isOpen ? list.scrollHeight + "px" : 0;
    });

    const listWrap = document.createElement("div");
    listWrap.className = "service-list";

    const ul = document.createElement("ul");
    const servicesToShow = query
      ? cat.services.filter(s => s.toLowerCase().includes(query) || cat.name.toLowerCase().includes(query))
      : cat.services;

    servicesToShow.forEach((service) => {
      const i = cat.services.indexOf(service);
      const li = document.createElement("li");
      li.className = "service-item";
      const inputId = `${cat.id}-${i}`;
      const checked = isChecked(cat.id, service);
      if (checked) li.classList.add("checked");

      li.innerHTML = `
        <input type="checkbox" id="${inputId}" ${checked ? "checked" : ""}>
        <label for="${inputId}">${service}</label>
      `;

      const checkbox = li.querySelector("input");
      checkbox.addEventListener("change", () => {
        toggleService(cat.id, service);
        li.classList.toggle("checked", checkbox.checked);
      });

      ul.appendChild(li);
    });

    listWrap.appendChild(ul);
    card.appendChild(head);
    card.appendChild(listWrap);
    grid.appendChild(card);

    // Auto-expand matching categories while searching
    if (query) {
      card.classList.add("open");
      head.setAttribute("aria-expanded", "true");
      requestAnimationFrame(() => {
        listWrap.style.maxHeight = listWrap.scrollHeight + "px";
      });
    }
  });

  updateCounts();
}

const CATEGORY_PAGES = {
  carpenter: "carpenter.html",
  electrician: "electrician.html",
  painter: "painter.html",
  cleaning: "cleaning.html",
  plumber: "plumber.html",
  "women-aid": "women-aid.html",
  "medical-aid": "medical-aid.html",
  "old-age-assistance": "old-age-assistance.html"
};

// ---- Pricing (EDIT ME) ----
// Placeholder starting prices per category, in rupees. These are NOT
// real rates — replace them with your actual pricing whenever ready.
// You can also override a specific service's price below without
// touching the category default.
const CATEGORY_DEFAULT_PRICE = {
  carpenter: 299,
  electrician: 199,
  painter: 249,
  cleaning: 349,
  plumber: 199,
  "women-aid": 199,
  "medical-aid": 199,
  "old-age-assistance": 199
};

// Optional per-service overrides. Format: "categoryId::Exact Service Name": price
// Example: "carpenter::Modular kitchen work": 999,
const SERVICE_PRICE_OVERRIDES = {
  // add overrides here as your real pricing firms up
};

function getServicePrice(categoryId, serviceName) {
  const key = categoryId + "::" + serviceName;
  if (SERVICE_PRICE_OVERRIDES.hasOwnProperty(key)) return SERVICE_PRICE_OVERRIDES[key];
  return CATEGORY_DEFAULT_PRICE.hasOwnProperty(categoryId) ? CATEGORY_DEFAULT_PRICE[categoryId] : 199;
}

function getSelectedTotal(selectedObj) {
  let total = 0;
  Object.keys(selectedObj).forEach(catId => {
    selectedObj[catId].forEach(service => {
      total += getServicePrice(catId, service);
    });
  });
  return total;
}

// Expose pricing so index.html's module script can use it for payment + display
window.SahiPricing = { getServicePrice, getSelectedTotal, CATEGORY_DEFAULT_PRICE };

function renderPricingTable() {
  const table = document.getElementById("pricingTable");
  if (!table) return;
  const rows = CATALOG.filter(cat => cat.active).map(cat => `
    <div class="pricing-row">
      <span class="pricing-row-service">${cat.icon || ""} ${cat.name}</span>
      <span class="pricing-row-price">From ₹${CATEGORY_DEFAULT_PRICE[cat.id] || 199}</span>
    </div>
  `).join("");
  table.innerHTML = rows;
}

// ---- PIN code / area availability checker ----
// Approximate coordinates for the hub areas we currently serve. A PIN code
// is treated as "available" if it falls within SERVICE_RADIUS_KM of any hub.
// Edit SERVICE_HUBS / SERVICE_RADIUS_KM as your real coverage area changes.
const SERVICE_HUBS = [
  { name: "Santacruz", lat: 19.0800, lng: 72.8400 },
  { name: "Dadar", lat: 19.0178, lng: 72.8478 },
  { name: "Chembur", lat: 19.0522, lng: 72.9005 },
  { name: "Sion", lat: 19.0448, lng: 72.8631 },
  { name: "Ghatkopar", lat: 19.0863, lng: 72.9081 }
];
const SERVICE_RADIUS_KM = 20;

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function checkPinAvailability(pin) {
  const isMr = window.SahiI18n && window.SahiI18n.getLanguage() === "mr";
  const resultEl = document.getElementById("pinCheckResult");
  resultEl.className = "pin-check-result";
  if (!/^\d{6}$/.test(pin)) {
    resultEl.textContent = isMr ? "योग्य ६ अंकी PIN कोड टाका." : "Enter a valid 6-digit PIN code.";
    resultEl.classList.add("pin-no");
    return;
  }
  resultEl.textContent = isMr ? "तपासत आहोत..." : "Checking...";
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&country=India&postalcode=${pin}`);
    const data = await res.json();
    if (!data.length) {
      resultEl.textContent = isMr ? "हा PIN कोड सापडला नाही — पुन्हा तपासा आणि प्रयत्न करा." : "Couldn't find that PIN code — double-check and try again.";
      resultEl.classList.add("pin-no");
      return;
    }
    const { lat, lon } = data[0];
    let nearest = null, nearestKm = Infinity;
    SERVICE_HUBS.forEach(hub => {
      const km = haversineKm(parseFloat(lat), parseFloat(lon), hub.lat, hub.lng);
      if (km < nearestKm) { nearestKm = km; nearest = hub.name; }
    });
    if (nearestKm <= SERVICE_RADIUS_KM) {
      resultEl.textContent = isMr
        ? `✅ होय! आम्ही या भागात सेवा देतो (${nearest} जवळ, सुमारे ${Math.round(nearestKm)} किमी दूर).`
        : `✅ Yes! We serve this area (near ${nearest}, about ${Math.round(nearestKm)} km away).`;
      resultEl.classList.add("pin-ok");
    } else {
      resultEl.textContent = isMr
        ? `अजून नाही — हे आमच्या सर्वात जवळच्या भागापासून (${nearest}) सुमारे ${Math.round(nearestKm)} किमी दूर आहे. आम्ही दर आठवड्याला विस्तार करत आहोत, लवकरच पुन्हा तपासा!`
        : `Not quite yet — this is about ${Math.round(nearestKm)} km from our nearest area (${nearest}). We're expanding weekly, check back soon!`;
      resultEl.classList.add("pin-no");
    }
  } catch (err) {
    resultEl.textContent = isMr ? "आत्ता तपासता आले नाही — थोड्या वेळाने प्रयत्न करा." : "Couldn't check right now — try again in a moment.";
    resultEl.classList.add("pin-no");
  }
}

function showCategoryLinks() {
  let panel = document.getElementById("continuePanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "continuePanel";
    panel.className = "continue-panel";
    document.getElementById("selectionTray").insertAdjacentElement("beforebegin", panel);
  }

  let linksHtml = "";
  CATALOG.forEach(cat => {
    if (selected[cat.id] && selected[cat.id].length) {
      const href = CATEGORY_PAGES[cat.id] || "#";
      linksHtml += `<a class="continue-link" href="${href}">${cat.icon} ${cat.name} <span>(${selected[cat.id].length})</span> →</a>`;
    }
  });

  panel.innerHTML = `
    <h3>${window.SahiI18n && window.SahiI18n.getLanguage() === "mr" ? "तयार आहे — कारागीर पाहण्यासाठी श्रेणी निवडा:" : "You're all set — pick a category to browse workers:"}</h3>
    <div class="continue-links">${linksHtml}</div>
  `;
  panel.scrollIntoView({ behavior: "smooth", block: "center" });
}

document.getElementById("continueBtn").addEventListener("click", () => {
  const total = totalSelectedCount();
  if (total === 0) return;

  function proceedToReview() {
    if (typeof window.sahiOpenBookingReview === "function") {
      window.sahiOpenBookingReview(selected, CATALOG);
    } else {
      showCategoryLinks();
    }
  }

  if (typeof window.sahiRequireLogin === "function") {
    window.sahiRequireLogin(proceedToReview);
  } else {
    proceedToReview();
  }
});

render();
renderQuickIcons();
