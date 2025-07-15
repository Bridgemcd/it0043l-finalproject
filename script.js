document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Theme Toggle Logic
  const themeToggle = document.getElementById("themeToggle");
  let currentTheme = localStorage.getItem("theme") || "light";

  function applyTheme(theme) {
    document.body.classList.remove("dark-mode", "warm-mode");
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.textContent = "🌙 Warm Mode";
    } else if (theme === "warm") {
      document.body.classList.add("warm-mode");
      themeToggle.textContent = "🍁 Light Mode";
    } else {
      themeToggle.textContent = "☀️ Dark Mode";
    }
  }

  applyTheme(currentTheme);

  themeToggle.addEventListener("click", () => {
    if (currentTheme === "light") {
      currentTheme = "dark";
    } else if (currentTheme === "dark") {
      currentTheme = "warm";
    } else {
      currentTheme = "light";
    }
    applyTheme(currentTheme);
    localStorage.setItem("theme", currentTheme);
  });

  // Contact Form Validation
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent actual form submission

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const messageType = document.getElementById("messageType");
    const message = document.getElementById("message");

    let allFilled = true;

    [name, email, subject, messageType, message].forEach(field =>
      field.classList.remove("error")
    );

    if (!name.value.trim()) { name.classList.add("error"); allFilled = false; }
    if (!email.value.trim()) { email.classList.add("error"); allFilled = false; }
    if (!subject.value.trim()) { subject.classList.add("error"); allFilled = false; }
    if (!messageType.value.trim()) { messageType.classList.add("error"); allFilled = false; }
    if (!message.value.trim()) { message.classList.add("error"); allFilled = false; }

    if (!allFilled) {
      showModalMessage("Please fill out all required fields.", "red");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showModalMessage("Please enter a valid email address.", "red");
      return;
    }

    showConfirmationModal(
      "Are you sure you want to submit?",
      () => {
        sendFormData(new FormData(contactForm));
      },
      () => {
        console.log("Submission canceled.");
      }
    );
  });

  // Scroll Navbar Handler
  window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    const heroSection = document.querySelector('.hero');

    if (!heroSection) return;
    const heroHeight = heroSection.offsetHeight;

    if (window.scrollY < heroHeight) {
      navbar.classList.remove('top-fixed');
      navbar.classList.add('bottom-fixed');
    } else {
      navbar.classList.remove('bottom-fixed');
      navbar.classList.add('top-fixed');
    }
  });

  window.dispatchEvent(new Event('scroll'));

  // Show Confirmation Modal
  function showConfirmationModal(message, onConfirm, onCancel) {
    const modal = document.getElementById("confirmationModal");
    const modalMessage = document.getElementById("confirmationMessage");
    const confirmBtn = document.getElementById("confirmSubmit");
    const cancelBtn = document.getElementById("cancelSubmit");

    modalMessage.textContent = message;
    modal.style.display = "block";

    function cleanup() {
      modal.style.display = "none";
      confirmBtn.removeEventListener("click", handleConfirm);
      cancelBtn.removeEventListener("click", handleCancel);
    }

    function handleConfirm() {
      cleanup();
      onConfirm();
    }

    function handleCancel() {
      cleanup();
      onCancel();
    }

    confirmBtn.addEventListener("click", handleConfirm);
    cancelBtn.addEventListener("click", handleCancel);

    window.addEventListener("click", function (e) {
      if (e.target === modal) {
        cleanup();
        onCancel();
      }
    });
  }

  // Floating Stars Animation
  function playFloatingStars() {
    const container = document.createElement("div");
    container.className = "star-animation-container";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.overflow = "hidden";
    container.style.zIndex = "9999";
    document.body.appendChild(container);

    for (let i = 0; i < 40; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.position = "absolute";
      star.style.width = star.style.height = `${Math.random() * 6 + 4}px`;
      star.style.borderRadius = "50%";
      star.style.background = "#fff";
      star.style.opacity = "0.8";
      star.style.boxShadow = "0 0 8px #fff";
      star.style.transform = "scale(0)";
      star.style.transition = "transform 1s ease-out";

      const left = Math.random() * window.innerWidth;
      const top = window.innerHeight + Math.random() * 100;
      star.style.left = `${left}px`;
      star.style.top = `${top}px`;

      container.appendChild(star);

      setTimeout(() => {
        star.style.transform = "scale(1)";
        star.style.top = "-100px";
      }, i * 100);

      setTimeout(() => {
        star.remove();
      }, 5000);
    }

    setTimeout(() => {
      container.remove();
    }, 6000);
  }

  // Show Modal Message
  function showModalMessage(message, color = "green") {
    const modal = document.getElementById("successModal");
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message;
    modalMessage.style.color = color;
    modal.style.display = "block";
  }

  // Close Modals
  document.getElementById("modalCloseBtn").addEventListener("click", () => {
    document.getElementById("successModal").style.display = "none";
  });

  window.addEventListener("click", (e) => {
    const modal = document.getElementById("successModal");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Send Form Data
  const scriptURL = " https://script.google.com/macros/s/AKfycbwsqc18JOqfwi4kpOU-COlpx-5jYs-zQF6CBXJfjy0fuoZvFStrk4SrMP6PhiF_2cXmFg/exec "; // Replace with yours
  const form = document.getElementById("contactForm");
  const sendButton = document.getElementById("sendButton");

  function sendFormData(formData) {
    sendButton.disabled = true;
    sendButton.innerHTML = "Sending... <span class='loading'></span>";

    fetch(scriptURL, {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.result === "success") {
        showModalMessage("Your message has been sent successfully!", "green");
        playFloatingStars();
        form.reset();
      } else {
        showModalMessage("There was a problem: " + (data.message || "Unknown error"), "red");
      }
    })
    .catch(error => {
      showModalMessage("There was a problem sending your message.", "red");
      console.error("Error:", error);
    })
    .finally(() => {
      sendButton.disabled = false;
      sendButton.textContent = "Send Message";
    });
  }
});