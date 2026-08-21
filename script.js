// ---- Service catalog ----
// Edit this array to add/remove categories or services.
const CATALOG = [
  {
    id: "carpenter",
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

// ---- Render ----
function render() {
  const grid = document.getElementById("categoryGrid");
  grid.innerHTML = "";

  CATALOG.forEach(cat => {
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
    cat.services.forEach((service, i) => {
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
  });

  updateCounts();
}

document.getElementById("continueBtn").addEventListener("click", () => {
  const total = totalSelectedCount();
  if (total === 0) return;
  let summary = "Selected services:\n\n";
  CATALOG.forEach(cat => {
    if (selected[cat.id] && selected[cat.id].length) {
      summary += `${cat.name}:\n`;
      selected[cat.id].forEach(s => summary += `  • ${s}\n`);
      summary += "\n";
    }
  });
  alert(summary + "Wire this button up to your booking / checkout flow next.");
});

render();
