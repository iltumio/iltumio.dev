import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";

export default defineConfig(() => {
  return {
    plugins: [qwikVite({ csr: true }), tsconfigPaths(), viteCompression()],
    build: {
      target: "es2020",
      lib: false,
      rollupOptions: {
        input: "index.html",
      },
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
