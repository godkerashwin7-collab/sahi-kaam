/* ============================================================
   Sahi Kaam — Shared phone verification component
   ============================================================
   HOW IT WORKS RIGHT NOW (demo mode):
   - User enters a 10-digit mobile number and taps "Send code"
   - A 6-digit code is generated in the browser and shown on screen
     (because this site has no backend yet to actually send an SMS)
   - User enters that code and taps "Verify"
   - Once correct, the phone number is stored in sessionStorage for
     this browser tab, so the user doesn't have to re-verify on every
     page load in the same visit.

   TO GO LIVE WITH REAL SMS:
   Replace the block marked "TODO: replace this with a real SMS API
   call" below with a fetch() to your SMS provider (e.g. MSG91,
   Twilio, Firebase Phone Auth). Everything else in this file and in
   every page that uses SahiVerify.mount(...) stays exactly the same.
   ============================================================ */

const SahiVerify = (() => {
  let pendingCode = null;
  let pendingPhone = null;

  // Basic India-mobile format check: 10 digits, starts 6-9.
  // This does NOT verify the number is a real, active SIM on an Indian
  // carrier — that requires a paid lookup API (e.g. Twilio Lookup's
  // line-type-intelligence, or Truecaller's API) called from a backend,
  // since it needs a secret API key. What we CAN catch for free, client
  // side, is obviously fake/placeholder numbers people paste into spam
  // submissions — repeated digits, straight sequences, etc.
  function isValidPhone(phone) {
    const p = phone.trim();
    if (!/^[6-9]\d{9}$/.test(p)) return false;
    if (isObviouslyFake(p)) return false;
    return true;
  }

  function isObviouslyFake(p) {
    // All digits identical: 9999999999, 8888888888, ...
    if (/^(\d)\1{9}$/.test(p)) return true;
    // Ascending or descending run: 1234567890, 9876543210, etc.
    const asc = "0123456789";
    const desc = "9876543210";
    if (asc.includes(p) || desc.includes(p)) return true;
    // Common placeholder test numbers
    const blocklist = ["9000000000", "9999999999", "9876543210", "1234567890"];
    if (blocklist.includes(p)) return true;
    return false;
  }

  function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function getVerifiedPhone() {
    return sessionStorage.getItem("sahikaam_verified_phone") || null;
  }

  function isVerified() {
    return !!getVerifiedPhone();
  }

  function clearVerification() {
    sessionStorage.removeItem("sahikaam_verified_phone");
  }

  // Renders the verification UI inside the given container element id.
  // Calls onVerified(phone) immediately if already verified this
  // session, or as soon as the user successfully verifies.
  function mount(containerId, onVerified) {
    const box = document.getElementById(containerId);
    if (!box) return;

    const existing = getVerifiedPhone();
    if (existing) {
      renderVerified(box, existing);
      if (onVerified) onVerified(existing);
      return;
    }

    box.innerHTML = `
      <div class="sv-box">
        <label class="sv-label">Verify your phone to continue</label>
        <div class="sv-row">
          <input type="tel" id="sv-phone" maxlength="10" placeholder="10-digit mobile number">
          <button id="sv-send" type="button">Send code</button>
        </div>
        <div id="sv-code-row" class="sv-row sv-hidden">
          <input type="tel" id="sv-code" maxlength="6" placeholder="6-digit code">
          <button id="sv-verify" type="button">Verify</button>
        </div>
        <p id="sv-msg" class="sv-msg"></p>
      </div>
    `;

    const msg = box.querySelector("#sv-msg");
    const codeRow = box.querySelector("#sv-code-row");

    box.querySelector("#sv-send").addEventListener("click", () => {
      const phone = box.querySelector("#sv-phone").value.trim();
      if (!/^[6-9]\d{9}$/.test(phone)) {
        msg.textContent = "Enter a valid 10-digit Indian mobile number.";
        msg.className = "sv-msg sv-error";
        return;
      }
      if (isObviouslyFake(phone)) {
        msg.textContent = "That number looks like a placeholder — enter your real mobile number.";
        msg.className = "sv-msg sv-error";
        return;
      }
      pendingPhone = phone;
      pendingCode = generateCode();

      // ---- TODO: replace this with a real SMS API call ----
      // fetch('https://your-backend.example.com/send-otp', {
      //   method: 'POST',
      //   headers: {'Content-Type':'application/json'},
      //   body: JSON.stringify({ phone, code: pendingCode })
      // });
      // DEMO MODE — showing the code on screen since there's no SMS backend yet:
      msg.innerHTML = `Demo mode — no SMS sent yet. Your code is <strong>${pendingCode}</strong>`;
      msg.className = "sv-msg sv-info";
      // -------------------------------------------------------

      codeRow.classList.remove("sv-hidden");
    });

    box.querySelector("#sv-verify").addEventListener("click", () => {
      const entered = box.querySelector("#sv-code").value.trim();
      if (!pendingCode) {
        msg.textContent = "Request a code first.";
        msg.className = "sv-msg sv-error";
        return;
      }
      if (entered === pendingCode) {
        sessionStorage.setItem("sahikaam_verified_phone", pendingPhone);
        renderVerified(box, pendingPhone);
        if (onVerified) onVerified(pendingPhone);
      } else {
        msg.textContent = "Incorrect code. Please try again.";
        msg.className = "sv-msg sv-error";
      }
    });
  }

  function renderVerified(box, phone) {
    box.innerHTML = `<div class="sv-verified">✅ Verified as +91 ${phone}</div>`;
  }

  return { mount, isVerified, getVerifiedPhone, clearVerification };
})();
