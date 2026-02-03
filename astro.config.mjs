import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://iltumio.dev",
  output: "server",
  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [icon(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
