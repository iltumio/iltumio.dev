import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";
import { resolve } from "path";

export default defineConfig(() => {
  return {
    plugins: [tsconfigPaths(), qwikCity(), qwikVite(), viteCompression()],
    resolve: {
      alias: {
        "~": resolve(__dirname, "src"),
      },
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
