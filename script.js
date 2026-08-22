// ---- Service catalog ----
// Edit this array to add/remove categories or services.
// `active: false` hides a category from the homepage grid without deleting
// its content — flip it to true once you actually have vetted workers
// and (for the "care" group) proper protocols in place for that category.
const CATALOG = [
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

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("serviceSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      render();
    });
  }
});

// ---- Render ----
const GROUP_LABELS = {
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

function render() {
  const grid = document.getElementById("categoryGrid");
  grid.innerHTML = "";

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

    const head = document.createElement("button");
    head.className = "category-head";
    head.type = "button";
    head.setAttribute("aria-expanded", "false");
    head.innerHTML = `
      <span class="category-icon">${cat.icon}</span>
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
    <h3>You're all set — pick a category to browse workers:</h3>
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
