<script setup lang="ts">
/**
 * Board — a Zone with a rendered playing-surface preset. "A board."
 *
 * Thin wrapper: forwards every prop to Zone, fills `#surface` with
 * a themed rect (fill / stroke / radius from `--board-surface-*`).
 * Consumers who want a custom surface pass their own `#surface` slot
 * — the default is only used if they don't override.
 *
 * Board's behavior IS Zone's behavior. The component exists because
 * "board" belongs in the kit's vocabulary, not because Boards do
 * anything Zones don't.
 */
import { computed, ref } from 'vue';
import { Rect as VRect } from 'vue-konva';
import Zone from './Zone.vue';
import type { ZoneLayout } from './Zone.vue';
import { useTheme } from '../composables/useTheme';

interface Props {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  count?: number;
  layout?: ZoneLayout;
  gap?: number;
  cellWidth?: number;
  cellHeight?: number;
  cols?: number;
  padding?: number;
  /** Override the themed surface fill. */
  surfaceFill?: string;
  /** Override the themed surface stroke. */
  surfaceStroke?: string;
}

const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
  width: undefined,
  height: undefined,
  count: 0,
  layout: 'row',
  gap: undefined,
  cellWidth: undefined,
  cellHeight: undefined,
  cols: undefined,
  padding: 0,
  surfaceFill: undefined,
  surfaceStroke: undefined,
});

const theme = useTheme();
// Untyped zone handle — exposing it through InstanceType<typeof Zone>
// would pull Zone's internal Props interface into the emitted dts and
// trip TS4058 because that interface isn't part of the public API.
const zoneRef = ref<{ node: unknown } | null>(null);

const fill = computed(() => props.surfaceFill ?? theme.board.fill);
const stroke = computed(() => props.surfaceStroke ?? theme.board.stroke);

defineExpose({
  node: computed(() => (zoneRef.value?.node as unknown) ?? null),
});
</script>

<template>
  <Zone
    ref="zoneRef"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :count="count"
    :layout="layout"
    :gap="gap"
    :cell-width="cellWidth"
    :cell-height="cellHeight"
    :cols="cols"
    :padding="padding"
  >
    <template #surface="{ w, h }">
      <slot name="surface" :w="w" :h="h">
        <v-rect
          :config="{
            x: 0,
            y: 0,
            width: w,
            height: h,
            fill,
            stroke,
            strokeWidth: theme.board.strokeW,
            cornerRadius: theme.board.radius,
          }"
        />
      </slot>
    </template>

    <template #default="scope">
      <slot v-bind="scope" />
    </template>
  </Zone>
</template>
