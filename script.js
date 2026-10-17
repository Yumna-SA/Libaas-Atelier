document.addEventListener("DOMContentLoaded", () => {
  // Menu toggle
  const menuBtn = document.querySelector("#menuBtn");
  const nav = document.querySelector("#mainNav");

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  // Dark mode button (created here, inside the menu)
  const themeBtn = document.createElement("button");
  themeBtn.id = "themeBtn";
  themeBtn.className = "tb";
  themeBtn.textContent = "Dark mode";
  nav.appendChild(themeBtn);

  // On every page load, check if dark mode was saved earlier
  let saved = "light";
  try {
    saved = localStorage.getItem("theme") || "light";
  } catch (err) {}

  if (saved === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "Light mode";
  }

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");

    if (isDark) {
      themeBtn.textContent = "Light mode";
    } else {
      themeBtn.textContent = "Dark mode";
    }

    // Save the choice so the next page remembers it
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (err) {}
  });

  // Contact form (only runs on pages that have the form)
  const form = document.querySelector("#contactForm");

  if (form) {
    const nameBox = document.querySelector("#nameBox");
    const emailBox = document.querySelector("#emailBox");
    const msgBox = document.querySelector("#msgBox");
    const nameErr = document.querySelector("#nameErr");
    const emailErr = document.querySelector("#emailErr");
    const msgErr = document.querySelector("#msgErr");
    const success = document.querySelector("#success");
    const count = document.querySelector("#count");

    msgBox.addEventListener("input", () => {
      count.textContent = msgBox.value.length + " / 200";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = nameBox.value.trim();
      const email = emailBox.value.trim();
      const message = msgBox.value.trim();
      let valid = true;

      nameErr.textContent = "";
      emailErr.textContent = "";
      msgErr.textContent = "";
      success.textContent = "";

      if (name.length < 3) {
        nameErr.textContent = "Please enter your full name.";
        valid = false;
      }
      if (!email.includes("@") || !email.includes(".")) {
        emailErr.textContent = "Please enter a valid email.";
        valid = false;
      }
      if (message.length < 10) {
        msgErr.textContent = "Tell us a little more (10+ characters).";
        valid = false;
      }

      if (valid) {
        success.textContent = "Thanks, " + name + "! We got your message.";
      }
    });
  }
});