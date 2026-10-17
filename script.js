document.addEventListener("DOMContentLoaded", () => {
  // ---------- Menu toggle ----------
  const menuBtn = document.querySelector("#menuBtn");
  const nav = document.querySelector("#mainNav");

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  // ---------- Dark mode button (created inside the menu) ----------
  const themeBtn = document.createElement("button");
  themeBtn.id = "themeBtn";
  themeBtn.className = "tb";
  themeBtn.textContent = "Dark mode";
  nav.appendChild(themeBtn);

  // remember the theme between pages
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

    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (err) {}
  });

  // ---------- Contact form (Task 3) ----------
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

    // live character counter (input event)
    msgBox.addEventListener("input", () => {
      count.textContent = msgBox.value.length + " / 200";
    });

    // validation (submit event)
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // stop the page reloading

      const name = nameBox.value.trim();
      const email = emailBox.value.trim();
      const message = msgBox.value.trim();
      let valid = true;

      // clear old messages
      nameErr.textContent = "";
      emailErr.textContent = "";
      msgErr.textContent = "";
      success.textContent = "";

      // Name: at least 3 characters after trim
      if (name.length < 3) {
        nameErr.textContent = "Please enter your full name.";
        valid = false;
      }

      // Email: contains @ and . (and the @ is not first, the dot comes after it)
      const at = email.indexOf("@");
      const dot = email.lastIndexOf(".");
      if (!email.includes("@") || !email.includes(".") || at < 1 || dot < at + 2 || dot === email.length - 1 || email.indexOf("@") !== email.lastIndexOf("@") || email.includes(" ")) {
        emailErr.textContent = "Please enter a valid email.";
        valid = false;
      }

      // Message: at least 10 characters after trim
      if (message.length < 10) {
        msgErr.textContent = "Tell us a little more (10+ characters).";
        valid = false;
      }

      // Success message uses textContent, never innerHTML
      if (valid) {
        success.textContent = "Thanks, " + name + "! We got your message.";
      }
    });
  }
});