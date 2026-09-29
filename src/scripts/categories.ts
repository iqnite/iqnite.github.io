const categoryBar = document.querySelector(".category-bar");
const projectCards = document.querySelectorAll(".project-card");
const projectLayout = document.querySelector(".project-layout") as HTMLElement | null;

const activeCategories: string[] = [];

function createCategoryButtons(categories: string[]) {
  if (!categoryBar) return;
  for (const category of categories) {
    const button = document.createElement("a");
    button.textContent = category;
    button.classList.add("category-button");
    button.addEventListener("click", selectCategory);
    categoryBar.appendChild(button);
  }
}

function selectCategory(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.classList.contains("category-button")) return;
  if (target.classList.contains("active")) {
    const index = activeCategories.indexOf(target.textContent as string);
    if (index !== -1) {
      activeCategories.splice(index, 1);
    }
    target.classList.remove("active");
  } else {
    activeCategories.push(target.textContent as string);
    target.classList.add("active");
  }
  updateProjectVisibility();
  requestAnimationFrame(layoutProjects);
}

function updateProjectVisibility() {
  for (const p of projectCards) {
    const projectCard = p as HTMLElement;
    if (
      activeCategories.length === 0 ||
      activeCategories.includes(projectCard.dataset.category as string)
    ) {
      projectCard.classList.remove("hidden");
    } else {
      projectCard.classList.add("hidden");
    }
  }
}

function layoutProjects() {
  if (!projectLayout) return;

  const visibleCards = Array.from(projectCards).filter(
    (card) => !(card as HTMLElement).classList.contains("hidden"),
  ) as HTMLElement[];
  const gap = 20;
  const columnWidth = 400;
  const columnCount = Math.max(
    1,
    Math.floor((projectLayout.clientWidth + gap) / (columnWidth + gap)),
  );
  const cardWidth =
    (projectLayout.clientWidth - gap * (columnCount - 1)) / columnCount;
  const columnHeights = Array<number>(columnCount).fill(0);

  projectLayout.classList.add("masonry-ready");

  for (const [index, card] of visibleCards.entries()) {
    const column = index % columnCount;
    card.style.width = `${cardWidth}px`;
    card.style.left = `${column * (cardWidth + gap)}px`;
    card.style.top = `${columnHeights[column]}px`;
    columnHeights[column] += card.offsetHeight + gap;
  }

  projectLayout.style.height = `${Math.max(0, ...columnHeights) - (visibleCards.length ? gap : 0)}px`;
}

createCategoryButtons(["Games", "Apps", "Demos"]);
window.addEventListener("load", layoutProjects);
window.addEventListener("resize", layoutProjects);
layoutProjects();
