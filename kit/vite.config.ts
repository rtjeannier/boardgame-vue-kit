import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { fileURLToPath, URL } from 'node:url';

// Library build — emits ESM bundle + .d.ts declarations so consumers
// can `import { Card, CardZone } from 'boardgame-vue-kit'`. Vue is
// externalized; consumers bring their own copy.
export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.story.vue', 'src/histoire.setup.ts'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@kit': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'BoardgameVueKit',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: 'boardgame-vue-kit[extname]',
      },
    },
    cssCodeSplit: false,
    outDir: 'dist',
    emptyOutDir: true,
  },
});
