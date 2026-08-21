/* ============================================================
   Sahi Kaam — Shared "Request this worker" modal
   ============================================================
   Usage in a page's module script (after Firebase is set up):

     SahiRequest.init(async (requestData) => {
       await addDoc(collection(db, "customer_requests"), requestData);
     });

   Then, per worker card:
     SahiRequest.open({ id: worker.id, name: worker.name, skill: "carpenter" });
   ============================================================ */

const SahiRequest = (() => {
  let onSubmit = null;
  let currentWorker = null;
  let injected = false;

  function isValidName(name) {
    return /^[A-Za-z\s.]{3,60}$/.test(name.trim());
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }
  function isValidAddress(addr) {
    return addr.trim().length >= 10;
  }

  function injectModal() {
    if (injected) return;
    injected = true;
    const wrap = document.createElement("div");
    wrap.id = "sr-overlay";
    wrap.className = "sr-overlay sr-hidden";
    wrap.innerHTML = `
      <div class="sr-modal">
        <button type="button" class="sr-close" id="sr-close">&times;</button>
        <h2 id="sr-title">Request this worker</h2>
        <p id="sr-verified-as" class="sr-verified-as"></p>

        <label>Your Name</label>
        <input type="text" id="sr-name" placeholder="Full name">
        <p class="sk-error-text" id="sr-nameError">Enter your full name (letters only, at least 3 characters).</p>

        <label>Email Address</label>
        <input type="email" id="sr-email" placeholder="you@email.com">
        <p class="sk-error-text" id="sr-emailError">Enter a valid email address.</p>

        <label>Address</label>
        <textarea id="sr-address" placeholder="Flat/House no., building, street, landmark"></textarea>
        <p class="sk-error-text" id="sr-addressError">Enter your full address (at least 10 characters).</p>

        <label>What do you need done? (optional)</label>
        <textarea id="sr-issue" placeholder="Briefly describe the job"></textarea>

        <button type="button" class="sr-submit" id="sr-submit">Send Request</button>
        <p id="sr-status" class="sr-status"></p>
      </div>
    `;
    document.body.appendChild(wrap);

    document.getElementById("sr-close").addEventListener("click", close);
    wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });

    document.getElementById("sr-submit").addEventListener("click", async () => {
      const name = document.getElementById("sr-name").value.trim();
      const email = document.getElementById("sr-email").value.trim();
      const address = document.getElementById("sr-address").value.trim();
      const issue = document.getElementById("sr-issue").value.trim();
      const statusEl = document.getElementById("sr-status");

      const nameOk = isValidName(name);
      const emailOk = isValidEmail(email);
      const addressOk = isValidAddress(address);
      toggleErr("sr-name", "sr-nameError", nameOk);
      toggleErr("sr-email", "sr-emailError", emailOk);
      toggleErr("sr-address", "sr-addressError", addressOk);

      if (!nameOk || !emailOk || !addressOk) {
        statusEl.textContent = "Please fix the highlighted fields.";
        statusEl.className = "sr-status sr-status-error";
        return;
      }

      const phone = (typeof SahiVerify !== "undefined") ? SahiVerify.getVerifiedPhone() : null;
      if (!phone) {
        statusEl.textContent = "Please verify your phone number first.";
        statusEl.className = "sr-status sr-status-error";
        return;
      }

      const payload = {
        workerId: currentWorker ? currentWorker.id : null,
        workerName: currentWorker ? currentWorker.name : null,
        skill: currentWorker ? currentWorker.skill : null,
        name, email, address, issue,
        phone,
        status: "new",
        submittedAt: new Date().toISOString()
      };

      try {
        if (onSubmit) await onSubmit(payload);
        statusEl.textContent = "Request sent! The worker (or our team) will contact you shortly.";
        statusEl.className = "sr-status sr-status-ok";
        setTimeout(close, 1600);
      } catch (err) {
        statusEl.textContent = "Something went wrong. Please try again.";
        statusEl.className = "sr-status sr-status-error";
        console.log(err);
      }
    });
  }

  function toggleErr(inputId, errId, ok) {
    document.getElementById(inputId).classList.toggle("sk-field-error", !ok);
    document.getElementById(errId).classList.toggle("sk-show", !ok);
  }

  function init(submitHandler) {
    onSubmit = submitHandler;
    injectModal();
  }

  function open(worker) {
    if (!injected) injectModal();
    currentWorker = worker;
    document.getElementById("sr-title").textContent = `Request ${worker.name || "this worker"}`;
    const phone = (typeof SahiVerify !== "undefined") ? SahiVerify.getVerifiedPhone() : null;
    document.getElementById("sr-verified-as").textContent = phone ? `Sending as verified number +91 ${phone}` : "";
    document.getElementById("sr-name").value = "";
    document.getElementById("sr-email").value = "";
    document.getElementById("sr-address").value = "";
    document.getElementById("sr-issue").value = "";
    document.getElementById("sr-status").textContent = "";
    document.getElementById("sr-overlay").classList.remove("sr-hidden");
  }

  function close() {
    const el = document.getElementById("sr-overlay");
    if (el) el.classList.add("sr-hidden");
  }

  return { init, open, close };
})();
