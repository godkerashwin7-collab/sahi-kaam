/* ============================================================
   Sahi Kaam — Shared login/signup modal (Firebase Auth)
   ============================================================
   Usage in a page's module script:

     import { initializeApp } from ".../firebase-app.js";
     import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
               signInWithEmailAndPassword, updateProfile, signOut }
       from ".../firebase-auth.js";

     const auth = getAuth(app);

     SahiAuth.init({
       auth,
       fns: { onAuthStateChanged, createUserWithEmailAndPassword,
              signInWithEmailAndPassword, updateProfile, signOut },
       onChange: (user) => { ... update your own header UI here ... }
     });

   Elsewhere on the page:
     SahiAuth.open("login");                  // just show the modal
     SahiAuth.open("login", () => { ... });    // run callback after success
     SahiAuth.isLoggedIn();
     SahiAuth.getUser();
     SahiAuth.logout();
   ============================================================ */

const SahiAuth = (() => {
  let auth = null;
  let fns = null;
  let currentUser = null;
  let injected = false;
  let pendingSuccessCb = null;
  let onSignupExtra = null;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }
  function isValidName(name) {
    return /^[A-Za-z\s.]{2,60}$/.test(name.trim());
  }

  function friendlyError(err) {
    const code = (err && err.code) || "";
    if (code.includes("email-already-in-use")) return "That email already has an account — try logging in instead.";
    if (code.includes("invalid-email")) return "That doesn't look like a valid email address.";
    if (code.includes("weak-password")) return "Password should be at least 6 characters.";
    if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) return "Incorrect email or password.";
    if (code.includes("too-many-requests")) return "Too many attempts — please wait a moment and try again.";
    return "Something went wrong. Please try again.";
  }

  function injectModal() {
    if (injected) return;
    injected = true;
    const wrap = document.createElement("div");
    wrap.id = "sa-overlay";
    wrap.className = "sr-overlay sr-hidden";
    wrap.innerHTML = `
      <div class="sr-modal">
        <button type="button" class="sr-close" id="sa-close">&times;</button>

        <div class="sa-tabs">
          <button type="button" class="sa-tab sa-tab-active" id="sa-tab-login">Log In</button>
          <button type="button" class="sa-tab" id="sa-tab-signup">Sign Up</button>
        </div>

        <div id="sa-login-form">
          <label>Email</label>
          <input type="email" id="sa-login-email" placeholder="you@email.com">
          <label>Password</label>
          <input type="password" id="sa-login-password" placeholder="Password">
          <button type="button" class="sr-submit" id="sa-login-btn">Log In</button>
        </div>

        <div id="sa-signup-form" class="sr-hidden">
          <label>Full Name</label>
          <input type="text" id="sa-signup-name" placeholder="Your name">
          <p class="sk-error-text" id="sa-nameError">Enter your name (letters only, at least 2 characters).</p>

          <label>Email</label>
          <input type="email" id="sa-signup-email" placeholder="you@email.com">
          <p class="sk-error-text" id="sa-emailError">Enter a valid email address.</p>
          <label>Password</label>
          <input type="password" id="sa-signup-password" placeholder="At least 6 characters">
          <label>Confirm Password</label>
          <input type="password" id="sa-signup-confirm" placeholder="Re-enter password">
          <p class="sk-error-text" id="sa-passError">Passwords must match and be at least 6 characters.</p>

          <div class="fee-slogan">
            💚 Don't look at it as ₹50 — it's your ticket to safety, protection, and a home-like experience with every booking on Sahi Kaam. It also supports our cancer care cause.
            <strong>One-time only — you'll never be charged again.</strong>
          </div>

          <button type="button" class="sr-submit" id="sa-signup-btn">Pay ₹50 &amp; Create Account</button>
        </div>

        <p id="sa-status" class="sr-status"></p>
      </div>
    `;
    document.body.appendChild(wrap);

    document.getElementById("sa-close").addEventListener("click", close);
    wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });

    document.getElementById("sa-tab-login").addEventListener("click", () => switchTab("login"));
    document.getElementById("sa-tab-signup").addEventListener("click", () => switchTab("signup"));

    document.getElementById("sa-login-btn").addEventListener("click", doLogin);
    document.getElementById("sa-signup-btn").addEventListener("click", doSignup);
  }

  function switchTab(mode) {
    const loginTab = document.getElementById("sa-tab-login");
    const signupTab = document.getElementById("sa-tab-signup");
    const loginForm = document.getElementById("sa-login-form");
    const signupForm = document.getElementById("sa-signup-form");
    document.getElementById("sa-status").textContent = "";

    if (mode === "signup") {
      signupTab.classList.add("sa-tab-active");
      loginTab.classList.remove("sa-tab-active");
      signupForm.classList.remove("sr-hidden");
      loginForm.classList.add("sr-hidden");
    } else {
      loginTab.classList.add("sa-tab-active");
      signupTab.classList.remove("sa-tab-active");
      loginForm.classList.remove("sr-hidden");
      signupForm.classList.add("sr-hidden");
    }
  }

  async function doLogin() {
    const email = document.getElementById("sa-login-email").value.trim();
    const password = document.getElementById("sa-login-password").value;
    const statusEl = document.getElementById("sa-status");

    if (!isValidEmail(email) || !password) {
      statusEl.textContent = "Enter your email and password.";
      statusEl.className = "sr-status sr-status-error";
      return;
    }

    statusEl.textContent = "Logging in...";
    statusEl.className = "sr-status";
    try {
      await fns.signInWithEmailAndPassword(auth, email, password);
      statusEl.textContent = "";
      close();
      if (pendingSuccessCb) { const cb = pendingSuccessCb; pendingSuccessCb = null; cb(); }
    } catch (err) {
      statusEl.textContent = friendlyError(err);
      statusEl.className = "sr-status sr-status-error";
    }
  }

  async function doSignup() {
    const name = document.getElementById("sa-signup-name").value.trim();
    const email = document.getElementById("sa-signup-email").value.trim();
    const password = document.getElementById("sa-signup-password").value;
    const confirm = document.getElementById("sa-signup-confirm").value;
    const statusEl = document.getElementById("sa-status");

    const nameOk = isValidName(name);
    const emailOk = isValidEmail(email);
    const passOk = password.length >= 6 && password === confirm;

    document.getElementById("sa-signup-name").classList.toggle("sk-field-error", !nameOk);
    document.getElementById("sa-nameError").classList.toggle("sk-show", !nameOk);
    document.getElementById("sa-signup-email").classList.toggle("sk-field-error", !emailOk);
    document.getElementById("sa-emailError").classList.toggle("sk-show", !emailOk);
    document.getElementById("sa-passError").classList.toggle("sk-show", !passOk);

    if (!nameOk || !emailOk || !passOk) {
      statusEl.textContent = "Please fix the highlighted fields.";
      statusEl.className = "sr-status sr-status-error";
      return;
    }

    if (typeof SahiPayment === "undefined") {
      statusEl.textContent = "Payment system not loaded on this page.";
      statusEl.className = "sr-status sr-status-error";
      return;
    }

    const signupBtn = document.getElementById("sa-signup-btn");
    signupBtn.disabled = true;
    statusEl.textContent = "Opening secure payment...";
    statusEl.className = "sr-status";

    SahiPayment.charge({
      amountRupees: 50,
      description: "Customer Registration Fee",
      prefillName: name,
      prefillEmail: email,
      onSuccess: async (paymentId) => {
        statusEl.textContent = "Payment received — creating your account...";
        try {
          const cred = await fns.createUserWithEmailAndPassword(auth, email, password);
          await fns.updateProfile(cred.user, { displayName: name });
          if (onSignupExtra) {
            await onSignupExtra({ uid: cred.user.uid, name, email, registrationFeePaid: true, registrationPaymentId: paymentId });
          }
          statusEl.textContent = "";
          close();
          if (pendingSuccessCb) { const cb = pendingSuccessCb; pendingSuccessCb = null; cb(); }
        } catch (err) {
          statusEl.textContent = "Payment succeeded, but account creation failed: " + friendlyError(err) + " — contact support with payment ID: " + paymentId;
          statusEl.className = "sr-status sr-status-error";
        }
        signupBtn.disabled = false;
      },
      onFailure: (message) => {
        statusEl.textContent = "Payment failed: " + message;
        statusEl.className = "sr-status sr-status-error";
        signupBtn.disabled = false;
      },
      onCancel: () => {
        statusEl.textContent = "Payment cancelled — account not created.";
        statusEl.className = "sr-status sr-status-error";
        signupBtn.disabled = false;
      }
    });
  }

  function open(mode, onSuccess) {
    injectModal();
    switchTab(mode || "login");
    pendingSuccessCb = onSuccess || null;
    document.getElementById("sa-overlay").classList.remove("sr-hidden");
  }

  function close() {
    const el = document.getElementById("sa-overlay");
    if (el) el.classList.add("sr-hidden");
  }

  function init(config) {
    auth = config.auth;
    fns = config.fns;
    onSignupExtra = config.onSignupExtra || null;
    fns.onAuthStateChanged(auth, (user) => {
      currentUser = user;
      if (config.onChange) config.onChange(user);
    });
  }

  function isLoggedIn() { return !!currentUser; }
  function getUser() { return currentUser; }
  function logout() { if (auth && fns) fns.signOut(auth); }

  return { init, open, close, isLoggedIn, getUser, logout };
})();
