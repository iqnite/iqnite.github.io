// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://iqnite.github.io",
  redirects: {
    "/bitrun.html": "/bitrun",
    "/bitrun/play.html": "/bitrun/play",
    "/eggsplode.html": "/eggsplode",
    "/eggsplode/discord.html": "/eggsplode/discord",
    "/eggsplode/github.html": "/eggsplode/github",
    "/eggsplode/install.html": "/eggsplode/install",
    "/eggsplode/privacy.html": "/eggsplode/privacy",
    "/eggsplode/recipemaker.html": "/eggsplode/recipemaker",
    "/eggsplode/terms.html": "/eggsplode/terms",
    "/go/discord.html": "/go/discord",
    "/scratchos/changelog.html": "/scratchos/changelog",
    "/self-signed-msix.html": "/self-signed-msix",
  },
});
