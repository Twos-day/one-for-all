import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin({
      identifiers: ({ hash }) => `css_${hash}`,
    }),
    svgr({
      svgrOptions: {
        svgo: false,
      },
    }),
  ],
  build: {
    outDir: resolve(__dirname, "../was/public"),
    emptyOutDir: true, // 빌드시 기존 파일 삭제
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        // target: "https://one-for-all.twosday.live/api",
        target: "http://localhost:8080/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
