<script setup lang="ts">
/**
 * Token — a physical piece: chip, cube, meeple, cylinder.
 *
 * `shape` picks the silhouette (it's what the token *is*, not a
 * display variant). `size` reads the `--size-*` scale (xs..xl).
 * `color` is the fill — typically a player color or an accent. A
 * `#label` slot accepts Konva content painted centered on the token.
 */
import { computed, ref } from 'vue';
import {
  Group as VGroup,
  Circle as VCircle,
  Ellipse as VEllipse,
  Rect as VRect,
  RegularPolygon as VRegularPolygon,
  Text as VText,
} from 'vue-konva';
import type Konva from 'konva';
import type { VueKonvaRef } from 'vue-konva';
import { useTheme } from '../../composables/useTheme';

export type TokenShape = 'disc' | 'cube' | 'cylinder' | 'meeple';
export type TokenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  x?: number;
  y?: number;
  shape?: TokenShape;
  size?: TokenSize;
  color?: string;
  /** Optional label text (fallback when no #label slot). */
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
  shape: 'disc',
  size: 'md',
  color: undefined,
  label: undefined,
});

const theme = useTheme();
const nodeRef = ref<VueKonvaRef<Konva.Group> | null>(null);

const dim = computed(() => theme.sizes[props.size]);
const fill = computed(() => props.color ?? theme.accents.blue);

const rootConfig = computed(() => ({ x: props.x, y: props.y }));

const shadowCommon = computed(() => ({
  shadowColor: theme.card.shadow.color,
  shadowBlur: theme.card.shadow.blur / 2,
  shadowOffsetY: 1,
  shadowOpacity: 0.8,
}));

const discConfig = computed(() => ({
  x: dim.value / 2,
  y: dim.value / 2,
  radius: dim.value / 2,
  fill: fill.value,
  stroke: theme.border,
  strokeWidth: 1,
  ...shadowCommon.value,
}));

const cubeConfig = computed(() => ({
  x: 0,
  y: 0,
  width: dim.value,
  height: dim.value,
  fill: fill.value,
  stroke: theme.border,
  strokeWidth: 1,
  cornerRadius: theme.radii.chamfer,
  ...shadowCommon.value,
}));

const cylinderBaseConfig = computed(() => ({
  x: 0,
  y: dim.value * 0.2,
  width: dim.value,
  height: dim.value * 0.8,
  fill: fill.value,
  stroke: theme.border,
  strokeWidth: 1,
  cornerRadius: dim.value / 2,
  ...shadowCommon.value,
}));
const cylinderTopConfig = computed(() => ({
  x: dim.value / 2,
  y: dim.value * 0.2,
  radiusX: dim.value / 2,
  radiusY: dim.value * 0.15,
  fill: fill.value,
  stroke: theme.border,
  strokeWidth: 1,
}));

const meepleConfig = computed(() => ({
  x: dim.value / 2,
  y: dim.value / 2,
  sides: 6,
  radius: dim.value / 2,
  fill: fill.value,
  stroke: theme.border,
  strokeWidth: 1,
  ...shadowCommon.value,
}));

const labelConfig = computed(() => ({
  x: 0,
  y: 0,
  width: dim.value,
  height: dim.value,
  text: props.label ?? '',
  fontSize: Math.max(8, Math.round(dim.value * 0.45)),
  fontStyle: 'bold',
  fill: '#0d1117',
  align: 'center',
  verticalAlign: 'middle',
  listening: false,
}));

defineExpose({
  node: computed(() => nodeRef.value?.getNode() ?? null),
});
</script>

<template>
  <v-group ref="nodeRef" :config="rootConfig">
    <v-circle v-if="shape === 'disc'" :config="discConfig" />
    <v-rect v-else-if="shape === 'cube'" :config="cubeConfig" />
    <template v-else-if="shape === 'cylinder'">
      <v-rect :config="cylinderBaseConfig" />
      <v-ellipse :config="cylinderTopConfig" />
    </template>
    <v-regular-polygon v-else-if="shape === 'meeple'" :config="meepleConfig" />

    <slot name="label" :w="dim" :h="dim">
      <v-text v-if="label" :config="labelConfig" />
    </slot>
  </v-group>
</template>
