/* ============================================================
   Sahi Kaam — Limited in-app chat (no direct phone/WhatsApp exposure)
   ============================================================
   By design, customers can only send PRESET messages — no free
   typing. This is intentional: it keeps people from swapping phone
   numbers and moving off-platform, and avoids abuse/harassment risk
   that comes with open free-text chat between strangers.

   HONEST LIMITATION #1 — one-directional for now: workers don't yet
   have their own logged-in app on this site, so there's no way for
   a worker to type a reply through Sahi Kaam itself. Replies have to
   be added by your team manually in the Firestore console (same
   "messages" array format, sender: "worker") until a proper worker
   portal exists. Any message added that way — by you or a worker
   once they have a portal — appears in the customer's chat in real
   time via onSnapshot.

   HONEST LIMITATION #2 — chat access isn't cryptographically tied to
   a real identity. Phone verification on this site is a demo OTP
   (see verify.js), not real Firebase Phone Auth, so Firestore rules
   can't safely check "is this really that phone number." Chat reads
   are left open in firestore.rules as a result. Good enough to
   launch with; closing this gap for real needs either real Firebase
   Phone Auth (paid SMS) or requiring email/password login before
   reaching a category page.

   Usage in a page's module script:
     SahiChatBox.init({
       db,
       fns: { doc, setDoc, updateDoc, arrayUnion, onSnapshot }
     });
   Then per worker card:
     SahiChatBox.open({ id: worker.id, name: worker.name, skill: "carpenter" });
   ============================================================ */

const SahiChatBox = (() => {
  let db = null;
  let fns = null;
  let injected = false;
  let currentThreadId = null;
  let currentWorker = null;
  let unsubscribe = null;

  const PRESETS = [
    "Where are you right now?",
    "How long will you take to arrive?",
    "I'm ready, please come",
    "Can we reschedule?",
    "Please wait, I'm running a little late",
    "Thank you!"
  ];

  function injectModal() {
    if (injected) return;
    injected = true;
    const wrap = document.createElement("div");
    wrap.id = "cb-overlay";
    wrap.className = "sr-overlay sr-hidden";
    wrap.innerHTML = `
      <div class="sr-modal cb-modal">
        <button type="button" class="sr-close" id="cb-close">&times;</button>
        <h2 id="cb-title">Chat</h2>
        <p class="cb-note">Only quick preset messages can be sent here — this keeps contact safely inside Sahi Kaam.</p>
        <div class="cb-messages" id="cb-messages"></div>
        <div class="cb-presets" id="cb-presets">
          ${PRESETS.map(p => `<button type="button" class="sc-chip cb-preset-btn" data-text="${p}">${p}</button>`).join("")}
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    document.getElementById("cb-close").addEventListener("click", close);
    wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });
    document.getElementById("cb-presets").addEventListener("click", (e) => {
      const text = e.target.getAttribute("data-text");
      if (text) sendPreset(text);
    });
  }

  function init(config) {
    db = config.db;
    fns = config.fns;
  }

  async function open(worker) {
    if (!db || !fns) {
      alert("Chat isn't set up on this page yet.");
      return;
    }
    const phone = (typeof SahiVerify !== "undefined") ? SahiVerify.getVerifiedPhone() : null;
    if (!phone) {
      alert("Please verify your phone number above before chatting.");
      return;
    }
    injectModal();
    currentWorker = worker;
    currentThreadId = `${worker.id}_${phone}`;
    document.getElementById("cb-title").textContent = "Chat with " + (worker.name || "worker");
    document.getElementById("cb-messages").innerHTML = "<p class='cb-empty'>Loading...</p>";
    document.getElementById("cb-overlay").classList.remove("sr-hidden");

    if (unsubscribe) { unsubscribe(); unsubscribe = null; }
    const ref = fns.doc(db, "chats", currentThreadId);
    unsubscribe = fns.onSnapshot(ref, (snap) => {
      const data = snap.exists() ? snap.data() : { messages: [] };
      renderMessages(data.messages || []);
    });
  }

  function renderMessages(messages) {
    const box = document.getElementById("cb-messages");
    if (!messages.length) {
      box.innerHTML = "<p class='cb-empty'>No messages yet — tap a quick message below to start.</p>";
      return;
    }
    box.innerHTML = messages.map(m => `
      <div class="sc-msg ${m.sender === 'customer' ? 'sc-user' : 'sc-bot'}">${escapeHtml(m.text)}</div>
    `).join("");
    box.scrollTop = box.scrollHeight;
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  async function sendPreset(text) {
    const phone = SahiVerify.getVerifiedPhone();
    const ref = fns.doc(db, "chats", currentThreadId);
    const msg = { text, sender: "customer", timestamp: new Date().toISOString() };
    try {
      await fns.setDoc(ref, {
        workerId: currentWorker.id,
        workerName: currentWorker.name,
        skill: currentWorker.skill,
        customerPhone: phone,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      await fns.updateDoc(ref, { messages: fns.arrayUnion(msg) });
    } catch (err) {
      console.log(err);
      alert("Message couldn't be sent. Please try again.");
    }
  }

  function close() {
    const el = document.getElementById("cb-overlay");
    if (el) el.classList.add("sr-hidden");
    if (unsubscribe) { unsubscribe(); unsubscribe = null; }
  }

  return { init, open, close };
})();
