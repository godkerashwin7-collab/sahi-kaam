/* ============================================================
   Sahi Kaam — Shared payment wrapper (Razorpay)
   ============================================================
   SETUP REQUIRED: Replace RAZORPAY_KEY_ID below with your real
   Key ID from the Razorpay dashboard: Settings → API Keys →
   Generate Key. Use the "Key ID" only — NEVER put your "Key
   Secret" in this file or anywhere in your website's code; the
   secret must only ever live on a server, not in the browser.

   HONEST LIMITATION: This charges money using Razorpay's client-
   only Checkout flow. It works and is fine to launch with, but
   payment success here is confirmed only in the browser — there's
   no backend re-checking it. For a small site this is a reasonable
   starting point; if Sahi Kaam grows, the next step is verifying
   payments server-side with a Firebase Cloud Function so a
   determined bad actor can't fake a successful payment.

   PAYMENT METHODS: Checkout is restricted to UPI (GPay, PhonePe,
   and any other UPI app) and Card only — netbanking, wallets, EMI,
   and pay-later are switched off below.

   CARD NETWORK NOTE: Restricting cards to Visa/Mastercard only
   (blocking RuPay/Amex/Diners) can't be done from this file —
   Checkout.js doesn't expose a "networks allowed" option. That has
   to be set in the Razorpay Dashboard under Settings → Payment
   Methods → Cards, where you can enable/disable specific card
   networks for your account. Do that there once your account is
   live; everything here will automatically respect it.
   ============================================================
   Usage:
     SahiPayment.charge({
       amountRupees: 100,
       description: "Worker Registration Fee",
       prefillName, prefillEmail, prefillPhone,
       onSuccess: (paymentId) => { ... },
       onFailure: (message) => { ... },
       onCancel: () => { ... }
     });
   ============================================================ */

const SahiPayment = (() => {
  const RAZORPAY_KEY_ID = "YOUR_RAZORPAY_KEY_ID"; // TODO: replace with your real Key ID

  let scriptLoaded = false;
  let scriptLoading = null;

  function loadScript() {
    if (scriptLoaded) return Promise.resolve();
    if (scriptLoading) return scriptLoading;
    scriptLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => { scriptLoaded = true; resolve(); };
      s.onerror = () => reject(new Error("Could not load the payment gateway. Check your internet connection."));
      document.head.appendChild(s);
    });
    return scriptLoading;
  }

  async function charge(opts) {
    const { amountRupees, description, prefillName, prefillEmail, prefillPhone, onSuccess, onFailure, onCancel } = opts;

    if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID === "YOUR_RAZORPAY_KEY_ID") {
      if (onFailure) onFailure("Payments aren't set up yet on this site — the site owner needs to add a Razorpay Key ID.");
      return;
    }

    try {
      await loadScript();
    } catch (e) {
      if (onFailure) onFailure(e.message);
      return;
    }

    if (typeof Razorpay === "undefined") {
      if (onFailure) onFailure("Payment gateway failed to load. Please try again.");
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amountRupees * 100), // Razorpay wants paise
      currency: "INR",
      name: "Sahi Kaam",
      description: description || "Registration Fee",
      // Only show UPI (GPay, PhonePe, and other UPI apps) and Card.
      // Netbanking, wallets, EMI, and pay-later are switched off.
      method: {
        upi: true,
        card: true,
        netbanking: false,
        wallet: false,
        emi: false,
        paylater: false
      },
      prefill: {
        name: prefillName || "",
        email: prefillEmail || "",
        contact: prefillPhone || ""
      },
      theme: { color: "#14213D" },
      handler: function (response) {
        if (onSuccess) onSuccess(response.razorpay_payment_id);
      },
      modal: {
        ondismiss: function () {
          if (onCancel) onCancel();
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", function (response) {
      const msg = (response && response.error && response.error.description) || "Payment failed. Please try again.";
      if (onFailure) onFailure(msg);
    });
    rzp.open();
  }

  return { charge };
})();
