import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://iltumio.dev",
  trailingSlash: "never",
  output: "server",
  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [icon(), sitemap()],
  markdown: {
    // Leave mermaid blocks unhighlighted so the client renderer can parse them
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid"],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
