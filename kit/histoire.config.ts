import { defineConfig } from 'histoire';
import { HstVue } from '@histoire/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

/**
 * Histoire — the kit's component playground.
 *
 * Run with:
 *   npm run story:dev       # dev server with HMR (port 6006)
 *   npm run story:build     # static site
 */
export default defineConfig({
  plugins: [HstVue()],
  setupFile: 'src/histoire.setup.ts',
  storyMatch: ['src/**/*.story.vue'],
  vite: {
    resolve: {
      alias: {
        '@kit': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  theme: {
    title: 'boardgame-vue-kit',
    defaultColorScheme: 'dark',
  },
});
