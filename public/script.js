
/* ========================================
   PERSONAL PORTFOLIO 2.0
======================================== */

// 1. DARK MODE
const themeToggle = document.getElementById("themeToggle");
const themeLabel = themeToggle?.querySelector(".theme-label");
const themeIcon = themeToggle?.querySelector("[aria-hidden='true']");

function setTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);

  if (themeLabel) {
    themeLabel.textContent = isDark ? "Light" : "Dark";
  }

  if (themeIcon) {
    themeIcon.textContent = isDark ? "☀" : "☾";
  }

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}

themeToggle?.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark-mode");
  setTheme(isDark);
});


// 2. LIVE CLOCK
const liveClock = document.getElementById("liveClock");

function updateClock() {
  if (!liveClock) return;

  liveClock.textContent = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}

updateClock();
setInterval(updateClock, 1000);


// 3. TYPING TEXT ANIMATION
const typingText = document.getElementById("typingText");

const words = [
  "Creative Design",
  "Digital Content",
  "Web Development"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typingText) return;

  const currentWord = words[wordIndex];

  typingText.textContent = currentWord.substring(0, charIndex);

  let delay = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    delay = 1300;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 350;
  } else {
    charIndex += isDeleting ? -1 : 1;
  }

  window.setTimeout(typeEffect, delay);
}

if (typingText) {
  typeEffect();
}


// 4. CONTACT FORM — FRONTEND DEMO


const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const formData = new FormData(contactForm);

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    if (formStatus) {
      formStatus.textContent = "Please complete all fields.";
    }
    return;
  }

  const submitButton = contactForm.querySelector(
    'button[type="submit"]'
  );

  if (submitButton) {
    submitButton.disabled = true;
  }

  if (formStatus) {
    formStatus.textContent = "Sending your message...";
  }

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to send your message."
      );
    }

    contactForm.reset();

    if (formStatus) {
      formStatus.textContent =
        "Message sent successfully! Thank you for contacting me.";
    }
  } catch (error) {
    console.error("Contact form error:", error);

    if (formStatus) {
      formStatus.textContent =
        "Unable to send your message. Please try again.";
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
});


// 5. AUTOMATIC COPYRIGHT YEAR
const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
