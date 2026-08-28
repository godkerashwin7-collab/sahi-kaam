// ============================================================
// SAHI KAAMWALA — Marathi translations
// ------------------------------------------------------------
// Two things live here:
// 1) CATALOG_MR — a Marathi version of script.js's CATALOG, same
//    ids (so bookings/pricing/worker trades still match across
//    languages), just translated names/taglines/services.
// 2) SAHI_I18N — English/Marathi text for the static parts of the
//    page. Elements tagged data-i18n="someKey" in index.html get
//    swapped automatically when the language toggle is used.
// Load this file BEFORE script.js.
// ============================================================

const CATALOG_MR = [
  {
    id: "carpenter",
    group: "trade",
    active: true,
    icon: "🪚",
    name: "सुतार",
    tagline: "फर्निचर, फिटिंग आणि लाकडाचे काम",
    services: [
      "फर्निचर दुरुस्ती",
      "कस्टम फर्निचर बनवणे",
      "दरवाजा व खिडकी बसवणे",
      "वॉर्डरोब / कॅबिनेट बसवणे",
      "मॉड्युलर किचनचे काम",
      "लाकूड पॉलिश (फ्रेंच पॉलिश)",
      "फर्निचर असेंब्ली (फ्लॅट-पॅक)",
      "कुलूप व बिजागरी दुरुस्ती",
      "फॉल्स सीलिंगचे काम",
      "दरवाजा दुरुस्ती व अलाइनमेंट"
    ]
  },
  {
    id: "electrician",
    group: "trade",
    active: true,
    icon: "🔌",
    name: "इलेक्ट्रिशियन",
    tagline: "वायरिंग, फिटिंग आणि दुरुस्ती",
    services: [
      "घराची वायरिंग / रीवायरिंग",
      "स्विच / सॉकेट दुरुस्ती किंवा बदलणे",
      "पंखा बसवणे व दुरुस्ती",
      "लाइट फिक्स्चर बसवणे",
      "MCB / फ्यूज बॉक्स दुरुस्ती",
      "इन्व्हर्टर व स्टॅबिलायझर बसवणे",
      "उपकरणे बसवणे (AC, गिझर इ.)",
      "शॉर्ट सर्किट तपासणी व दुरुस्ती",
      "डोअरबेल / इंटरकॉम बसवणे",
      "घराची वीज सुरक्षा तपासणी"
    ]
  },
  {
    id: "painter",
    group: "trade",
    active: true,
    icon: "🎨",
    name: "पेंटर",
    tagline: "आतील, बाहेरील आणि टच-अप पेंटिंग",
    services: [
      "आतील भिंत पेंटिंग",
      "बाहेरील भिंत पेंटिंग",
      "वॉटरप्रूफिंग ट्रीटमेंट",
      "टेक्सचर / डिझायनर वॉल पेंटिंग",
      "लाकूड पेंटिंग व वार्निश",
      "पुट्टी व भेगा भरणे",
      "सीलिंग पेंटिंग",
      "ग्रिल व गेट पेंटिंग",
      "वॉलपेपर बसवणे",
      "मोफत पेंटिंग सल्ला व अंदाज"
    ]
  },
  {
    id: "cleaning",
    group: "trade",
    active: true,
    icon: "🧹",
    name: "स्वच्छता सेवा",
    tagline: "घर, ऑफिस आणि डीप क्लीनिंग",
    services: [
      "संपूर्ण घराची डीप क्लीनिंग",
      "किचन डीप क्लीनिंग",
      "बाथरूम डीप क्लीनिंग",
      "सोफा व कार्पेट शॅम्पूइंग",
      "पाण्याची टाकी स्वच्छता",
      "ऑफिस / कमर्शियल स्वच्छता",
      "मूव्ह-इन / मूव्ह-आउट स्वच्छता",
      "पेस्ट कंट्रोल",
      "काच व खिडकी स्वच्छता",
      "बांधकामानंतरची स्वच्छता"
    ]
  },
  {
    id: "plumber",
    group: "trade",
    active: true,
    icon: "🔧",
    name: "प्लंबर",
    tagline: "गळती, फिटिंग आणि इंस्टॉलेशन",
    services: [
      "पाइप गळती दुरुस्ती",
      "नळ बसवणे",
      "बाथरूम फिटिंग बसवणे",
      "ड्रेनेज व चोक साफ करणे",
      "गिझर बसवणे व दुरुस्ती",
      "टॉयलेट / कमोड दुरुस्ती",
      "ओव्हरहेड पाण्याची टाकी बसवणे",
      "सिवर लाइन दुरुस्ती",
      "वॉटर मोटर / पंप दुरुस्ती",
      "RO व वॉटर प्युरिफायर बसवणे"
    ]
  },
  {
    id: "women-aid",
    group: "care",
    active: false,
    icon: "🤝",
    name: "महिला सहाय्य",
    tagline: "आधार, सुरक्षा आणि सक्षमीकरण",
    services: [
      "महिला हेल्पलाइन व समुपदेशन",
      "सेल्फ-डिफेन्स प्रशिक्षण",
      "महिलांसाठी कायदेशीर मदत",
      "घरगुती हिंसाचार सहाय्य",
      "आर्थिक साक्षरता कार्यशाळा",
      "कौशल्य विकास / व्यावसायिक प्रशिक्षण",
      "महिला आरोग्य जागृती सत्रे",
      "नोकरी मिळवण्यात मदत",
      "सपोर्ट ग्रुप समुपदेशन",
      "आपत्कालीन निवारा सहाय्य"
    ]
  },
  {
    id: "medical-aid",
    group: "care",
    active: false,
    icon: "⚕️",
    name: "वैद्यकीय सहाय्य",
    tagline: "घरगुती आरोग्यसेवा व आपत्कालीन मदत",
    services: [
      "घरी नर्सिंग काळजी",
      "डॉक्टर ऑन कॉल",
      "घरी फिजिओथेरपी",
      "घरातून लॅब सॅम्पल कलेक्शन",
      "रुग्णवाहिका सेवा",
      "औषध डिलिव्हरी",
      "घरगुती आरोग्य तपासणी पॅकेज",
      "प्रथमोपचार व आपत्कालीन प्रतिसाद",
      "शस्त्रक्रियेनंतरची घरगुती काळजी",
      "घरी लसीकरण"
    ]
  },
  {
    id: "old-age-assistance",
    group: "care",
    active: false,
    icon: "🧓",
    name: "वृद्ध सहाय्य",
    tagline: "ज्येष्ठांसाठी सोबत व दैनंदिन मदत",
    services: [
      "सोबत देण्यासाठी भेटी",
      "रोजच्या कामात मदत",
      "डॉक्टर अपॉइंटमेंटला सोबत",
      "किराणा व इतर कामांत मदत",
      "चालण्या-फिरण्यात मदत",
      "ज्येष्ठांसाठी घरगुती नर्सिंग",
      "भावनिक आधार व समुपदेशन",
      "जेवण तयार करण्यात मदत",
      "बिल भरणा व कागदपत्रांत मदत",
      "आपत्कालीन प्रतिसाद सेवा"
    ]
  }
];

const SAHI_I18N = {
  en: {
    brandTagline: "Trusted help, at your doorstep.",
    proBadge: "🛠️ Become a Professional",
    helpBarText: "Need help choosing a service?",
    callUs: "📞 Call us",
    whatsApp: "🟢 WhatsApp",
    searchPlaceholder: "🔍 Search services — e.g. tap repair, wiring, deep cleaning",
    yourLocation: "📍 Your location",
    locationHint: "Search, drag the pin, or scroll the map to set where you need service",
    addressSearchPlaceholder: "🔍 Search your address or area in Mumbai",
    useCurrentLocation: "📍 Use my current location",
    heroEyebrow: "Since your first call, sorted.",
    heroTitlePrefix: "Every home, every helper — ",
    heroTitleEm: "one tap away.",
    heroSub: `From a leaking tap at 8pm to a wobbly cupboard hinge — Sahi Kaamwala connects you with ID-verified home-service professionals across <span data-sk-service-areas>Mumbai</span>.`,
    bookService: "Book a Service ↓",
    submitRequest: "Submit a Request — Anytime →",
    trayCTA: "Submit Request →",
    heroFineprint: `You can submit a request any time of day — actual visit timing depends on professional availability in your area (<span data-sk-service-areas>Mumbai</span> only, for now).`,
    pricingSub: "Starting prices below — the professional confirms the exact price with you before any work begins.",
    pricingNote: "Prices shown are starting estimates for the category and may vary by the exact job, materials, and site conditions — always confirmed with you upfront.",
    pinEyebrow: "Service availability",
    pinHeading: "Is Sahi Kaamwala available in your area?",
    pinPlaceholder: "Enter your 6-digit PIN code, e.g. 400054",
    pinCheckBtn: "Check Availability",
    pinServeNote: `We currently serve <span data-sk-service-areas>Mumbai</span>.`,
    prosEyebrow: "Meet your professionals",
    prosHeading: "Know who's coming to your door",
    prosSub: "Real names, real experience — every professional is ID verified before their first job.",
    teamEyebrow: "Meet the team",
    teamHeading: "The people behind every visit",
    teamSub: "Real people you can call by name — not a faceless app.",
    reviewsEyebrow: "Customer reviews",
    reviewsHeading: "What people are saying",
    writeReview: "⭐ Write a Review",
    faqEyebrow: "Common questions",
    footerCompany: "Company",
    policeShoutout: "🙏 With gratitude to the Mumbai Police for their tireless work keeping our city and its people safe, every single day.",
    allRightsReserved: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    refundPolicy: "Refund Policy",
    loginTab: "Log In",
    signupTab: "Sign Up",
    emailLabel: "Email",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    forgotEmail: "Forgot email?",
    fullNameLabel: "Full Name",
    nameError: "Enter your name (letters only, at least 2 characters).",
    emailError: "Enter a valid email address.",
    confirmPasswordLabel: "Confirm Password",
    passError: "Passwords must match and be at least 6 characters.",
    createAccount: "Create Account",
    trustPhone: "Phone verified",
    trustId: "ID checked",
    trustFree: "Free to join — no signup fee",
    trustMore: "Why trust us →",
    howItWorks: "How it works",
    pricingEyebrow: "Transparent pricing",
    pricingHeading: "No surprise bills",
    faqHeading: "Frequently asked questions",
    footerServices: "Services",
    footerLegal: "Legal",
    footerLocations: "Locations",
    footerContact: "Contact",
    langToggleLabel: "मराठी"
  },
  mr: {
    brandTagline: "विश्वासार्ह मदत, तुमच्या दारात.",
    proBadge: "🛠️ व्यावसायिक व्हा",
    helpBarText: "सेवा निवडण्यासाठी मदत हवी आहे?",
    callUs: "📞 आम्हाला कॉल करा",
    whatsApp: "🟢 व्हॉट्सअ‍ॅप",
    searchPlaceholder: "🔍 सेवा शोधा — उदा. नळ दुरुस्ती, वायरिंग, डीप क्लीनिंग",
    yourLocation: "📍 तुमचे ठिकाण",
    locationHint: "शोधा, पिन ड्रॅग करा, किंवा नकाशा स्क्रोल करून तुम्हाला हवी असलेली सेवा कुठे हवी ते सेट करा",
    addressSearchPlaceholder: "🔍 मुंबईतील तुमचा पत्ता किंवा भाग शोधा",
    useCurrentLocation: "📍 माझे सध्याचे ठिकाण वापरा",
    heroEyebrow: "पहिल्या कॉलपासूनच, सगळं ठीक.",
    heroTitlePrefix: "प्रत्येक घर, प्रत्येक मदतनीस — ",
    heroTitleEm: "फक्त एका टॅपवर.",
    heroSub: `रात्री ८ वाजता नळ गळत असो किंवा कपाटाची बिजागरी ढिली असो — साही काम्वाला तुम्हाला <span data-sk-service-areas>मुंबई</span>भर ओळखपत्र-पडताळणी झालेल्या घरगुती सेवा व्यावसायिकांशी जोडते.`,
    bookService: "सेवा बुक करा ↓",
    submitRequest: "विनंती पाठवा — कधीही →",
    trayCTA: "विनंती पाठवा →",
    heroFineprint: `तुम्ही दिवसाच्या कोणत्याही वेळी विनंती पाठवू शकता — प्रत्यक्ष भेटीची वेळ तुमच्या भागातील व्यावसायिकांच्या उपलब्धतेवर अवलंबून असते (सध्या फक्त <span data-sk-service-areas>मुंबई</span>).`,
    pricingSub: "खालील किंमती सुरुवातीच्या आहेत — काम सुरू करण्यापूर्वी व्यावसायिक तुमच्यासोबत नक्की किंमत निश्चित करतो.",
    pricingNote: "दाखवलेल्या किंमती त्या श्रेणीसाठी सुरुवातीचे अंदाज आहेत आणि प्रत्यक्ष काम, साहित्य व जागेच्या स्थितीनुसार बदलू शकतात — नेहमी आधी तुमच्याशी निश्चित केल्या जातात.",
    pinEyebrow: "सेवा उपलब्धता",
    pinHeading: "साही काम्वाला तुमच्या भागात उपलब्ध आहे का?",
    pinPlaceholder: "तुमचा ६ अंकी PIN कोड टाका, उदा. 400054",
    pinCheckBtn: "उपलब्धता तपासा",
    pinServeNote: `आम्ही सध्या <span data-sk-service-areas>मुंबई</span>मध्ये सेवा देतो.`,
    prosEyebrow: "तुमच्या व्यावसायिकांना भेटा",
    prosHeading: "तुमच्या दारात कोण येणार आहे ते जाणून घ्या",
    prosSub: "खरी नावे, खरा अनुभव — प्रत्येक व्यावसायिकाची पहिल्या कामापूर्वी ओळखपत्र पडताळणी होते.",
    teamEyebrow: "आमच्या टीमला भेटा",
    teamHeading: "प्रत्येक भेटीमागील माणसं",
    teamSub: "नावाने हाक मारता येतील अशी खरी माणसं — चेहराविरहित अ‍ॅप नाही.",
    reviewsEyebrow: "ग्राहकांचे अभिप्राय",
    reviewsHeading: "लोक काय म्हणत आहेत",
    writeReview: "⭐ अभिप्राय लिहा",
    faqEyebrow: "सामान्य प्रश्न",
    footerCompany: "कंपनी",
    policeShoutout: "🙏 मुंबई पोलिसांचे आभार — आमचे शहर आणि तिथल्या लोकांना दररोज सुरक्षित ठेवण्याच्या त्यांच्या अथक परिश्रमासाठी.",
    allRightsReserved: "सर्व हक्क राखीव.",
    privacyPolicy: "गोपनीयता धोरण",
    termsOfService: "सेवा अटी",
    refundPolicy: "परतावा धोरण",
    loginTab: "लॉग इन",
    signupTab: "साइन अप",
    emailLabel: "ईमेल",
    passwordLabel: "पासवर्ड",
    forgotPassword: "पासवर्ड विसरलात?",
    forgotEmail: "ईमेल विसरलात?",
    fullNameLabel: "पूर्ण नाव",
    nameError: "तुमचे नाव टाका (फक्त अक्षरे, किमान २ अक्षरे).",
    emailError: "योग्य ईमेल पत्ता टाका.",
    confirmPasswordLabel: "पासवर्डची पुष्टी करा",
    passError: "पासवर्ड जुळले पाहिजेत आणि किमान ६ अक्षरांचे असावेत.",
    createAccount: "खाते तयार करा",
    trustPhone: "फोन पडताळणी झाली",
    trustId: "ओळखपत्र तपासले",
    trustFree: "सामील होणे मोफत — नोंदणी शुल्क नाही",
    trustMore: "आमच्यावर विश्वास का ठेवावा →",
    howItWorks: "हे कसे काम करते",
    pricingEyebrow: "पारदर्शक किंमत",
    pricingHeading: "कोणतेही आश्चर्यकारक बिल नाही",
    faqHeading: "वारंवार विचारले जाणारे प्रश्न",
    footerServices: "सेवा",
    footerLegal: "कायदेशीर",
    footerLocations: "ठिकाणे",
    footerContact: "संपर्क",
    langToggleLabel: "English"
  }
};

// ---- Applies the current language to every tagged element ----
function applySahiLanguage(lang) {
  const dict = SAHI_I18N[lang] || SAHI_I18N.en;
  document.documentElement.setAttribute("lang", lang === "mr" ? "mr" : "en");

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
  });

  // Re-fill anything driven by business-info.js (phone, service areas,
  // etc.) since the innerHTML swap above would otherwise wipe out any
  // nested [data-sk-*] spans inside a translated element.
  if (typeof window.sahiApplyBusinessInfo === "function") {
    window.sahiApplyBusinessInfo();
  }

  const toggleLabel = document.getElementById("langToggleLabel");
  if (toggleLabel) toggleLabel.textContent = dict.langToggleLabel;

  try { localStorage.setItem("sahi_lang", lang); } catch (e) { /* ignore */ }

  // Swap the category catalog (names/taglines/services) and re-render,
  // since that content is generated by script.js, not static HTML.
  if (typeof window.sahiSetCatalogLanguage === "function") {
    window.sahiSetCatalogLanguage(lang);
  }
}

window.SahiI18n = {
  getLanguage() {
    try { return localStorage.getItem("sahi_lang") || "en"; } catch (e) { return "en"; }
  },
  setLanguage(lang) {
    applySahiLanguage(lang);
  },
  toggle() {
    const next = this.getLanguage() === "mr" ? "en" : "mr";
    applySahiLanguage(next);
  },
  init() {
    applySahiLanguage(this.getLanguage());
  }
};
