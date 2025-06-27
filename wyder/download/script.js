const RELEASES_URL =
  "https://api.github.com/repos/iqnite/yt-dlp-ui/releases/latest";
const retryLink = document.getElementById("retry-link");

async function downloadLatestRelease() {
  const response = await fetch(RELEASES_URL);
  if (response.ok) {
    response.json().then((data) => {
      for (asset of data.assets) {
        if (asset.name.endsWith(".zip")) {
          const downloadUrl = asset.browser_download_url;
          window.location.href = downloadUrl;
          retryLink.href = downloadUrl;
          break;
        }
      }
    });
  } else {
    console.error("Download failed: ", response.statusText);
  }
}

document.addEventListener("DOMContentLoaded", downloadLatestRelease);
