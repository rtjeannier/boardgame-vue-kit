/**
 * Histoire setup — loads the kit's design tokens and registers
 * vue-konva globally so canvas stories can render `<v-stage>`,
 * `<v-layer>`, `<v-rect>`, etc. without per-story imports.
 */
import { defineSetupVue3 } from '@histoire/plugin-vue';
import VueKonva from 'vue-konva';
import './kit/theme/variables.css';
import './styles.css';

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.use(VueKonva);
});
