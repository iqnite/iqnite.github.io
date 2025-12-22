const elements = document.querySelectorAll("div, h1, p, img, button, a, span");

let isTicking = false;

function applyScrollBlur() {
  const windowHeight = window.innerHeight;

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > windowHeight) {
      return;
    }

    const distanceFromBottom = windowHeight - rect.top;
    const distanceFromTop = rect.bottom;
    const distanceFromTopBottom = Math.min(distanceFromTop, distanceFromBottom);

    const maxBlur = 10;
    const blurRange = 50;

    if (distanceFromTopBottom < blurRange) {
      const blurAmount = maxBlur * (1 - distanceFromTopBottom / blurRange);
      element.style.filter = `blur(${blurAmount}px)`;
      element.style.transition = "filter 0.1s ease-out";
    } else {
      element.style.filter = "none";
    }
  });

  isTicking = false;
}

function requestTick() {
  if (!isTicking) {
    requestAnimationFrame(applyScrollBlur);
    isTicking = true;
  }
}

window.addEventListener("scroll", requestTick, { passive: true });
window.addEventListener("resize", requestTick, { passive: true });
window.addEventListener("load", applyScrollBlur);
