import { defineConfig } from 'histoire';
import { HstVue } from '@histoire/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

/**
 * Histoire — the kit's component playground.
 *
 *   npm run story:dev       # dev server on :6006
 *   npm run story:build     # static site
 */
export default defineConfig({
  plugins: [HstVue()],
  setupFile: 'histoire.setup.ts',
  storyMatch: ['kit/**/*.story.vue'],
  vite: {
    resolve: {
      alias: {
        '@kit': fileURLToPath(new URL('./kit', import.meta.url)),
      },
    },
  },
  theme: {
    title: 'boardgame-vue-kit',
    defaultColorScheme: 'dark',
  },
});
