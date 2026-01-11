const header = document.querySelector("header");
const lastSiteUpdate = document.getElementById("lastSiteUpdate");

async function fetchLastUpdate() {
  try {
    const response = await fetch("https://api.github.com/repos/iqnite/iqnite.github.io/commits/main");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const lastCommitDate = new Date(data.commit.committer.date);
    const options = { year: "numeric", month: "long", day: "numeric" };
    lastSiteUpdate.textContent = `Last updated on ${lastCommitDate.toLocaleDateString(undefined, options)}`;
  } catch (error) {
    console.error("Failed to fetch last update:", error);
  }
}

function handleHeaderScroll() {
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
fetchLastUpdate();
