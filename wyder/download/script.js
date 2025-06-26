const RELEASES_URL =
  "https://api.github.com/repos/iqnite/yt-dlp-ui/releases/latest";
const retryLink = document.getElementById("retry-link");

async function downloadLatestRelease() {
  const response = await fetch(RELEASES_URL);
  if (response.ok) {
    response.json().then((data) => {
      const downloadUrl = data.assets[0].browser_download_url;
      window.location.href = downloadUrl;
      retryLink.href = downloadUrl;
    });
  } else {
    console.error("Download failed: ", response.statusText);
  }
}

document.addEventListener("DOMContentLoaded", downloadLatestRelease);
