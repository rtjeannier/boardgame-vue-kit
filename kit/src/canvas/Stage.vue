<script setup lang="ts">
/**
 * Stage — the root of any canvas scene. Wraps `<v-stage>` and owns:
 *   - canvas width/height (consumer-supplied)
 *   - devicePixelRatio-aware crispness
 *   - theme bridge: `provideTheme()` so all descendant canvas
 *     components can read CSS-var values reactively
 *
 * A Stage expects one or more `<Layer>` children. Putting a Board,
 * Zone, or piece directly inside Stage will not render — Konva
 * requires Layers at the root.
 */
import { computed, ref } from 'vue';
import { Stage as VStage } from 'vue-konva';
import type Konva from 'konva';
import type { VueKonvaRef } from 'vue-konva';
import { provideTheme } from '../composables/useTheme';

const props = withDefaults(
  defineProps<{
    width: number;
    height: number;
    /** Override device pixel ratio. Defaults to window.devicePixelRatio. */
    pixelRatio?: number;
    /** Paint this fill behind all Layers. Defaults to --stage-bg. */
    background?: string;
  }>(),
  { pixelRatio: undefined, background: undefined },
);

const theme = provideTheme();
const stageRef = ref<VueKonvaRef<Konva.Stage> | null>(null);

const stageConfig = computed(() => ({
  width: props.width,
  height: props.height,
  pixelRatio: props.pixelRatio ?? (typeof window !== 'undefined' ? window.devicePixelRatio : 1),
}));

const bg = computed(() => props.background ?? theme.stage.bg);

defineExpose({
  /** Underlying Konva.Stage. Escape hatch for tweens, custom drawing. */
  node: computed(() => stageRef.value?.getStage() ?? null),
  theme,
});
</script>

<template>
  <div class="bg-stage" :style="{ background: bg, width: `${width}px`, height: `${height}px` }">
    <v-stage ref="stageRef" :config="stageConfig">
      <slot />
    </v-stage>
  </div>
</template>

<style scoped>
.bg-stage {
  display: inline-block;
  line-height: 0;
}
</style>
