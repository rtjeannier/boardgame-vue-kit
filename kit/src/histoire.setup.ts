/**
 * Histoire setup — load kit design tokens, register vue-konva globally
 * so canvas stories can render `<v-stage>`, `<v-layer>`, `<v-rect>`,
 * etc. without per-story imports.
 */
import { defineSetupVue3 } from '@histoire/plugin-vue';
import VueKonva from 'vue-konva';
import './theme/variables.css';
import './styles/playground.css';

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(VueKonva);
});
