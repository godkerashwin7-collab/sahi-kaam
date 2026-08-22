/* ============================================================
   Sahi Kaam — Shared help chat widget
   ============================================================
   A lightweight, honest FAQ-style chat bubble — not a real AI or
   live human agent. It answers common questions by keyword match
   and always offers a way to reach a real person (Call/WhatsApp).

   Usage: just include business-info.js BEFORE this script on the page.
   It reads window.SAHI_BUSINESS.phoneLink / whatsappNumber automatically.
   You can still override with window.SAHI_HELP_PHONE if needed.
   ============================================================ */

(function () {
  const biz = window.SAHI_BUSINESS || {};
  const HELP_PHONE = window.SAHI_HELP_PHONE || biz.phoneLink || "+91XXXXXXXXXX";
  const HELP_WA = biz.whatsappNumber || HELP_PHONE.replace(/[^\d]/g, "");

  const FAQ = [
    {
      keywords: ["cost", "price", "fee", "charge", "money", "pay", "100", "rupee", "₹"],
      answer: "Signing up as a customer is completely free. Workers pay a one-time ₹100 onboarding fee to get listed — after that, no hidden charges, ever. A share of every worker fee supports our cancer care cause."
    },
    {
      keywords: ["verify", "verified", "safe", "safety", "trust", "id", "aadhaar", "background"],
      answer: "Every worker verifies their phone number and submits a government ID (Aadhaar/PAN/DL/Passport) before being listed. Customers verify their phone before contacting or requesting a worker too — so everyone on the platform is a real, reachable person."
    },
    {
      keywords: ["emergency", "urgent", "ambulance", "police", "help now", "sos"],
      answer: "In a real emergency, don't wait for this chat — call 112 (National Emergency) directly. On our Women Aid, Medical Aid, and Old Age Assistance pages you'll also find one-tap Ambulance, Police, and helpline numbers right at the top, no login needed."
    },
    {
      keywords: ["request", "book", "hire", "how do i", "how to", "worker"],
      answer: "Pick a category on the home page, tick the services you need, tap Continue, and log in (or sign up). You'll land on that category's page where you can verify your phone and tap 'Request' on any worker."
    },
    {
      keywords: ["join", "work", "register as worker", "become a worker", "sign up as worker"],
      answer: "Tap 'Join as a Worker', verify your phone, fill in your details and ID, pay the one-time ₹100 fee, and submit. Our team reviews applications before listing you."
    },
    {
      keywords: ["human", "agent", "person", "talk", "call", "support", "real person"],
      answer: "Of course — tap the button below to call or WhatsApp our team directly."
    }
  ];

  function findAnswer(text) {
    const q = text.toLowerCase();
    for (const item of FAQ) {
      if (item.keywords.some(k => q.includes(k))) return item.answer;
    }
    return null;
  }

  function injectWidget() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "sc-fab";
    btn.className = "sc-fab";
    btn.setAttribute("aria-label", "Chat with us");
    btn.innerHTML = "💬";
    document.body.appendChild(btn);

    const panel = document.createElement("div");
    panel.id = "sc-panel";
    panel.className = "sc-panel sc-hidden";
    panel.innerHTML = `
      <div class="sc-header">
        <span>Sahi Kaam Helper</span>
        <button type="button" id="sc-close" class="sc-close">&times;</button>
      </div>
      <div class="sc-body" id="sc-body">
        <div class="sc-msg sc-bot">Hi! I'm a quick-answer helper, not a live agent. Ask me about pricing, verification, emergencies, or how to book — or tap "Talk to a human" any time.</div>
        <div class="sc-quick-replies" id="sc-quick">
          <button type="button" class="sc-chip" data-q="How much does it cost?">How much does it cost?</button>
          <button type="button" class="sc-chip" data-q="How does verification work?">How does verification work?</button>
          <button type="button" class="sc-chip" data-q="How do I request a worker?">How do I request a worker?</button>
          <button type="button" class="sc-chip" data-q="I have an emergency">I have an emergency</button>
        </div>
      </div>
      <div class="sc-footer">
        <input type="text" id="sc-input" placeholder="Type your question...">
        <button type="button" id="sc-send">➤</button>
      </div>
      <a class="sc-human-btn" href="https://wa.me/${HELP_WA}" target="_blank" rel="noopener">🟢 Talk to a human on WhatsApp</a>
    `;
    document.body.appendChild(panel);

    const body = document.getElementById("sc-body");

    function addMsg(text, who) {
      const div = document.createElement("div");
      div.className = "sc-msg " + (who === "user" ? "sc-user" : "sc-bot");
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function ask(text) {
      if (!text.trim()) return;
      addMsg(text, "user");
      const answer = findAnswer(text);
      setTimeout(() => {
        if (answer) {
          addMsg(answer, "bot");
        } else {
          addMsg("I don't have a canned answer for that yet — tap 'Talk to a human on WhatsApp' below and our team will help directly.", "bot");
        }
      }, 300);
    }

    btn.addEventListener("click", () => {
      panel.classList.toggle("sc-hidden");
    });
    document.getElementById("sc-close").addEventListener("click", () => {
      panel.classList.add("sc-hidden");
    });
    document.getElementById("sc-send").addEventListener("click", () => {
      const input = document.getElementById("sc-input");
      ask(input.value);
      input.value = "";
    });
    document.getElementById("sc-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        ask(e.target.value);
        e.target.value = "";
      }
    });
    document.getElementById("sc-quick").addEventListener("click", (e) => {
      const q = e.target.getAttribute("data-q");
      if (q) ask(q);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectWidget);
  } else {
    injectWidget();
  }
})();
