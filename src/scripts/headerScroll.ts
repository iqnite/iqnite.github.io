const header = document.querySelector("header");

function handleHeaderScroll() {
  if (!header) return;
  const scrollY = window.scrollY;
  if (scrollY > 80 || window.innerWidth < 700) {
    header.classList.add("scrolled");
  } else if (scrollY < 10) {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", handleHeaderScroll, { passive: true });
window.addEventListener("resize", handleHeaderScroll);
window.addEventListener("orientationchange", handleHeaderScroll);
window.addEventListener("load", handleHeaderScroll);
handleHeaderScroll();
