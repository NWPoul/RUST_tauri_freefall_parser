import { resolve } from 'path';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react(),
    tsconfigPaths(),
],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // 3. to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],

  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        // spanel: resolve(process.cwd(), './src/serv_window/index.html'),
      },
    },
  },

}));
