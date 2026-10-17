
/* =====================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   ===================================== */

// 1. SMOOTH SCROLLING
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (target) {
            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});


// 2. JAM DAN TANGGAL OTOMATIS
function updateDateTime() {
    const dateTimeElement = document.getElementById("liveDateTime");

    if (!dateTimeElement) return;

    const now = new Date();

    const date = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const time = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    dateTimeElement.textContent = `${date} • ${time}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);


// 3. SAPAAN INTERAKTIF
const greetingButton = document.getElementById("greetingBtn");
const greetingMessage = document.getElementById("greetingMessage");

if (greetingButton && greetingMessage) {
    greetingButton.addEventListener("click", function () {
        const hour = new Date().getHours();
        let greeting;

        if (hour >= 4 && hour < 11) {
            greeting = "Selamat pagi";
        } else if (hour >= 11 && hour < 15) {
            greeting = "Selamat siang";
        } else if (hour >= 15 && hour < 18) {
            greeting = "Selamat sore";
        } else {
            greeting = "Selamat malam";
        }

        greetingMessage.textContent =
            `${greeting}! Terima kasih sudah mengunjungi portofolioku. 😊`;
    });
}


// 4. DARK MODE
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    // Mengambil tema yang sebelumnya dipilih
    const savedTheme = localStorage.getItem("portfolioTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeButton();

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const currentTheme = document.body.classList.contains("dark-mode")
            ? "dark"
            : "light";

        localStorage.setItem("portfolioTheme", currentTheme);
        updateThemeButton();
    });
}

function updateThemeButton() {
    if (!themeToggle) return;

    const isDark = document.body.classList.contains("dark-mode");

    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    themeToggle.setAttribute("aria-pressed", String(isDark));
}


// 5. SKILL PROGRESS BAR
const skillBars = document.querySelectorAll(".skill-fill");

function showSkillProgress() {
    skillBars.forEach((bar) => {
        const progress = Number(bar.dataset.progress);

        // Membatasi nilai antara 0 sampai 100
        const safeProgress = Number.isFinite(progress)
            ? Math.min(100, Math.max(0, progress))
            : 0;

        bar.style.width = `${safeProgress}%`;
    });
}

showSkillProgress();


// 6. FORM KONTAK INTERAKTIF
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm && formMessage) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const name = document.getElementById("contactName")
            .value.trim();

        formMessage.textContent =
            `Terima kasih, ${name}! Form berhasil diperiksa. ` +
            "Namun, pesan belum dikirim karena website ini belum terhubung ke layanan pengiriman pesan.";

        formMessage.className = "form-message success";

        contactForm.reset();
    });
}
