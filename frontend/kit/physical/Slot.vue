<script setup lang="ts">
/**
 * Slot — a Zone that holds at most one piece.
 *
 * When `filled` is true (or the default slot is used to render a
 * piece), the piece is placed at the slot's (x, y). When `filled`
 * is false, Slot paints a dashed empty-state outline so the space
 * reads as a reserved position.
 *
 * Use Slot for single-piece positions where "empty" is a state
 * worth showing: discard pile, reserved tableau spots, Chess
 * squares, exhaust zones. Use a plain Zone when emptiness doesn't
 * need an affordance.
 */
import { computed, ref } from 'vue';
import { Group as VGroup, Rect as VRect } from 'vue-konva';
import type Konva from 'konva';
import type { VueKonvaRef } from 'vue-konva';
import { useTheme } from '../composables/useTheme';

interface Props {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  /**
   * When false, Slot paints a dashed empty-state outline.
   * When true, the default slot is rendered instead.
   */
  filled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
  width: undefined,
  height: undefined,
  filled: false,
});

const theme = useTheme();
const nodeRef = ref<VueKonvaRef<Konva.Group> | null>(null);

const w = computed(() => props.width ?? theme.card.w);
const h = computed(() => props.height ?? theme.card.h);

const groupConfig = computed(() => ({ x: props.x, y: props.y }));
const emptyRectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: w.value,
  height: h.value,
  stroke: theme.slot.stroke,
  strokeWidth: theme.slot.strokeW,
  dash: theme.slot.dash,
  cornerRadius: theme.board.radius,
  listening: false,
}));

defineExpose({
  node: computed(() => nodeRef.value?.getNode() ?? null),
});
</script>

<template>
  <v-group ref="nodeRef" :config="groupConfig">
    <slot v-if="filled" :x="0" :y="0" :w="w" :h="h" />
    <v-rect v-else :config="emptyRectConfig" />
  </v-group>
</template>
