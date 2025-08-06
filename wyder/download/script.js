const RELEASES_URL =
  "https://api.github.com/repos/iqnite/yt-dlp-ui/releases/latest";
const retryLink = document.getElementById("retry-link");

async function getWindowsVersion() {
  if (!navigator.userAgentData) {
    return 0; // Fallback for browsers without userAgentData
  }
  try {
    const ua = await navigator.userAgentData.getHighEntropyValues([
      "platformVersion",
    ]);
    if (navigator.userAgentData.platform === "Windows") {
      const majorPlatformVersion = parseInt(ua.platformVersion.split(".")[0]);
      if (majorPlatformVersion >= 13) {
        return 11;
      } else if (majorPlatformVersion > 0) {
        return 10;
      } else {
        return 1; // Older than Windows 10
      }
    }
  } catch (error) {
    console.error("Could not determine Windows version", error);
  }
  return 0; // Not windows or error
}

async function downloadLatestRelease() {
  const windowsVersion = await getWindowsVersion();
  const response = await fetch(RELEASES_URL);
  if (response.ok) {
    const data = await response.json();
    for (const asset of data.assets) {
      if (asset.name.includes(`win-${windowsVersion}`)) {
        const downloadUrl = asset.browser_download_url;
        window.location.href = downloadUrl;
        retryLink.href = downloadUrl;
        break;
      }
    }
  } else {
    console.error("Download failed: ", response.statusText);
  }
}

document.addEventListener("DOMContentLoaded", downloadLatestRelease);
