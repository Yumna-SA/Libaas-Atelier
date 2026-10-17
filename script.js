document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("#menuBtn");
  const nav = document.querySelector("#mainNav");

  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
});