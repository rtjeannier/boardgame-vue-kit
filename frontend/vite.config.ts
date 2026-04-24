import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

/**
 * Dev/app config. This project ships as a template, so the default
 * Vite build produces an app (index.html + App.vue), not a library
 * bundle. If you extract the kit into a standalone package, add a
 * separate lib config with `build.lib` pointing to `kit/index.ts`.
 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@kit': fileURLToPath(new URL('./kit', import.meta.url)),
    },
  },
});
