const lastSiteUpdate = document.getElementById("lastSiteUpdate");

async function fetchLastUpdate() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/iqnite/iqnite.github.io/commits/main",
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const lastCommitDate = new Date(data.commit.committer.date);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    } as Intl.DateTimeFormatOptions;
    if (lastSiteUpdate) {
      lastSiteUpdate.textContent = `Last updated on ${lastCommitDate.toLocaleDateString(undefined, options)}`;
    }
  } catch (error) {
    console.error("Failed to fetch last update:", error);
  }
}

fetchLastUpdate();
