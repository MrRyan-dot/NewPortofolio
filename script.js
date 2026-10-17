
const themeToggle = document.getElementById("themeToggle");

// 1. DARK MODE
themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    themeToggle.textContent = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
});

// 2. LIVE CLOCK
const liveClock = document.getElementById("liveClock");

function updateClock() {
    if (!liveClock) return;

    liveClock.textContent = new Date().toLocaleTimeString(
        "id-ID",
        { hour12: false }
    );
}

updateClock();
setInterval(updateClock, 1000);

// 3. TYPING TEXT ANIMATION
const typingText = document.getElementById("typingText");
const words = ["Student", "Web Developer", "Content Creator"];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
    if (!typingText) return;

    const word = words[wordIndex];

    typingText.textContent = word.substring(0, charIndex);

    if (!deleting) {
        charIndex++;

        if (charIndex > word.length) {
            deleting = true;
            setTimeout(typeEffect, 1000);
            return;
        }
    } else {
        charIndex--;

        if (charIndex < 0) {
            charIndex = 0;
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }

    setTimeout(typeEffect, deleting ? 50 : 100);
}

typeEffect();

// 4. SMART CONTACT FORM
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    formStatus.textContent =
        "Form valid! Siap dihubungkan ke layanan email.";

    contactForm.reset();
});
