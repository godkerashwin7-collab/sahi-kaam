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

        <form id="sa-login-form" autocomplete="on">
          <label>Email</label>
          <input type="email" id="sa-login-email" name="email" placeholder="you@email.com" autocomplete="username">
          <label>Password</label>
          <input type="password" id="sa-login-password" name="password" placeholder="Password" autocomplete="current-password">
          <button type="submit" class="sr-submit" id="sa-login-btn">Log In</button>
          <div class="sa-forgot-row">
            <button type="button" class="sa-forgot-link" id="sa-forgot-btn">Forgot password?</button>
            <button type="button" class="sa-forgot-link" id="sa-forgot-username-btn">Forgot email?</button>
          </div>
        </form>

        <form id="sa-signup-form" class="sr-hidden" autocomplete="on">
          <label>Full Name</label>
          <input type="text" id="sa-signup-name" name="name" placeholder="Your name" autocomplete="name">
          <p class="sk-error-text" id="sa-nameError">Enter your name (letters only, at least 2 characters).</p>

          <label>Email</label>
          <input type="email" id="sa-signup-email" name="email" placeholder="you@email.com" autocomplete="username">
          <p class="sk-error-text" id="sa-emailError">Enter a valid email address.</p>
          <label>Password</label>
          <input type="password" id="sa-signup-password" name="new-password" placeholder="At least 6 characters" autocomplete="new-password">
          <label>Confirm Password</label>
          <input type="password" id="sa-signup-confirm" name="confirm-password" placeholder="Re-enter password" autocomplete="new-password">
          <p class="sk-error-text" id="sa-passError">Passwords must match and be at least 6 characters.</p>

          <button type="submit" class="sr-submit" id="sa-signup-btn">Create Account</button>
        </form>

        <p id="sa-status" class="sr-status"></p>
      </div>
    `;
    document.body.appendChild(wrap);

    document.getElementById("sa-close").addEventListener("click", close);
    wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });

    document.getElementById("sa-tab-login").addEventListener("click", () => switchTab("login"));
    document.getElementById("sa-tab-signup").addEventListener("click", () => switchTab("signup"));

    // Real form submit (not just a button click) is what makes browsers
    // reliably offer to save the username/password on mobile and desktop.
    document.getElementById("sa-login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      doLogin();
    });
    document.getElementById("sa-signup-form").addEventListener("submit", (e) => {
      e.preventDefault();
      doSignup();
    });
    document.getElementById("sa-forgot-btn").addEventListener("click", doForgotPassword);
    document.getElementById("sa-forgot-username-btn").addEventListener("click", doForgotUsername);
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

    const signupBtn = document.getElementById("sa-signup-btn");
    signupBtn.disabled = true;
    statusEl.textContent = "Creating your account...";
    statusEl.className = "sr-status";

    try {
      const cred = await fns.createUserWithEmailAndPassword(auth, email, password);
      await fns.updateProfile(cred.user, { displayName: name });
      if (onSignupExtra) {
        await onSignupExtra({ uid: cred.user.uid, name, email, registrationFeePaid: false, registrationPaymentId: null });
      }
      statusEl.textContent = "";
      close();
      if (pendingSuccessCb) { const cb = pendingSuccessCb; pendingSuccessCb = null; cb(); }
    } catch (err) {
      statusEl.textContent = friendlyError(err);
      statusEl.className = "sr-status sr-status-error";
    }
    signupBtn.disabled = false;
  }

  async function doForgotPassword() {
    const statusEl = document.getElementById("sa-status");
    let email = document.getElementById("sa-login-email").value.trim();

    if (!isValidEmail(email)) {
      email = (window.prompt("Enter the email address you signed up with:") || "").trim();
      if (!email) return;
    }
    if (!isValidEmail(email)) {
      statusEl.textContent = "That doesn't look like a valid email address.";
      statusEl.className = "sr-status sr-status-error";
      return;
    }

    statusEl.textContent = "Sending reset link...";
    statusEl.className = "sr-status";
    try {
      await fns.sendPasswordResetEmail(auth, email);
      statusEl.textContent = "Check your inbox — we've sent a link to reset your password.";
      statusEl.className = "sr-status";
    } catch (err) {
      // Don't reveal whether the email exists, for privacy — Firebase's
      // own error already avoids this in most cases, but keep the
      // messaging generic either way.
      statusEl.textContent = "If that email has an account, a reset link is on its way.";
      statusEl.className = "sr-status";
    }
  }

  function doForgotUsername() {
    const statusEl = document.getElementById("sa-status");
    const b = window.SAHI_BUSINESS || {};
    const waMsg = encodeURIComponent("Hi, I've forgotten which email I used to sign up on Sahi Kaamwala. Can you help me find my account?");
    const waLink = b.whatsappNumber ? `https://wa.me/${b.whatsappNumber}?text=${waMsg}` : null;

    statusEl.innerHTML = `Your email address <em>is</em> your login — there's no separate username.
      If you've forgotten which email you signed up with, our team can help you find it:
      ${waLink ? `<a href="${waLink}" target="_blank" rel="noopener">message us on WhatsApp</a>` : ""}
      ${b.supportEmail ? ` or email <a href="mailto:${b.supportEmail}">${b.supportEmail}</a>` : ""}.`;
    statusEl.className = "sr-status";
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
