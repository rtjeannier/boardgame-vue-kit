<script setup lang="ts">
/**
 * Card — a bordered canvas piece with named positioned slot regions.
 *
 * State props map directly to Konva visuals (no rules logic). Slots
 * are scoped and supply per-region `{ x, y, w, h }` in card-local
 * coordinates — consumer paints Konva nodes inside, using those
 * positions. Default prop-driven fallbacks (`name`, `costText`) render
 * when a slot is empty.
 *
 * Interior regions:
 *   #frame   — full-bleed (behind everything)
 *   #cost    — top-left strip
 *   #icon    — top-right strip
 *   #art     — middle region, upper half
 *   #name    — middle region, bold row
 *   #effect  — middle region, lower area
 *   #footer  — bottom strip
 *   #overlay — on top of the card, bled slightly outside the edge
 *
 * Size is intrinsic: `width` / `height` props, defaulting to theme
 * `card.w` / `card.h`. No `size` or `variant` prop.
 */
import { computed, ref } from 'vue';
import { Group as VGroup, Rect as VRect, Text as VText } from 'vue-konva';
import type Konva from 'konva';
import type { VueKonvaRef } from 'vue-konva';
import { useTheme } from '../composables/useTheme';

interface Props {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  selected?: boolean;
  tapped?: boolean;
  inactive?: boolean;
  activated?: boolean;
  /** Fallback text when #name slot is empty. */
  name?: string;
  /** Fallback text when #cost slot is empty. */
  costText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  x: 0,
  y: 0,
  width: undefined,
  height: undefined,
  selected: false,
  tapped: false,
  inactive: false,
  activated: false,
  name: undefined,
  costText: undefined,
});

const theme = useTheme();
const nodeRef = ref<VueKonvaRef<Konva.Group> | null>(null);

const w = computed(() => props.width ?? theme.card.w);
const h = computed(() => props.height ?? theme.card.h);
const pad = computed(() => theme.card.pad);

const rootConfig = computed(() => ({
  x: props.x,
  y: props.y + (props.selected ? -4 : 0),
  opacity: props.inactive ? 0.5 : 1,
  listening: !props.inactive,
}));

const tapConfig = computed(() => ({
  offsetX: w.value / 2,
  offsetY: h.value / 2,
  x: w.value / 2,
  y: h.value / 2,
  rotation: props.tapped ? 8 : 0,
}));

const bgConfig = computed(() => ({
  x: 0,
  y: 0,
  width: w.value,
  height: h.value,
  fill: theme.card.bg,
  stroke: props.activated ? theme.accents.green : theme.card.borderColor,
  strokeWidth: props.activated ? 2 : theme.card.borderW,
  cornerRadius: theme.radii.soft,
  shadowColor: theme.card.shadow.color,
  shadowBlur: theme.card.shadow.blur,
  shadowOffsetY: theme.card.shadow.offsetY,
  shadowOpacity: 1,
  shadowEnabled: !props.inactive,
}));

const selectedConfig = computed(() => ({
  x: 0,
  y: 0,
  width: w.value,
  height: h.value,
  stroke: theme.accents.blue,
  strokeWidth: 2,
  cornerRadius: theme.radii.soft,
  listening: false,
}));

const activatedGlow = computed(() => ({
  x: -2,
  y: -2,
  width: w.value + 4,
  height: h.value + 4,
  stroke: theme.accents.green,
  strokeWidth: 1,
  opacity: 0.4,
  cornerRadius: theme.radii.soft + 2,
  shadowColor: theme.accents.green,
  shadowBlur: 16,
  shadowOpacity: 0.8,
  listening: false,
}));

/** Internal layout — region boxes in card-local coords. */
const regions = computed(() => {
  const P = pad.value;
  const W = w.value;
  const H = h.value;
  const topH = Math.min(H * 0.14, theme.sizes.md);
  const footerH = Math.min(H * 0.12, theme.sizes.sm);
  const innerW = W - P * 2;
  const artH = (H - topH - footerH - P * 2) * 0.55;
  const nameY = P + topH + P + artH + P;
  const nameH = Math.min(H * 0.1, theme.sizes.sm);
  const effectY = nameY + nameH + P;
  const effectH = H - footerH - P - effectY;

  return {
    frame: { x: 0, y: 0, w: W, h: H },
    cost: { x: P, y: P, w: innerW / 2, h: topH },
    icon: { x: P + innerW / 2, y: P, w: innerW / 2, h: topH },
    art: { x: P, y: P + topH + P, w: innerW, h: artH },
    name: { x: P, y: nameY, w: innerW, h: nameH },
    effect: { x: P, y: effectY, w: innerW, h: effectH },
    footer: { x: P, y: H - P - footerH, w: innerW, h: footerH },
    overlay: { x: -P, y: -P, w: W + P * 2, h: H + P * 2 },
  };
});

const nameFallbackConfig = computed(() => ({
  x: regions.value.name.x,
  y: regions.value.name.y,
  width: regions.value.name.w,
  height: regions.value.name.h,
  text: props.name ?? '',
  fontSize: Math.max(10, Math.round(regions.value.name.h * 0.85)),
  fontStyle: 'bold',
  fill: theme.text.primary,
  align: 'left',
  verticalAlign: 'middle',
  listening: false,
}));

const costFallbackConfig = computed(() => ({
  x: regions.value.cost.x,
  y: regions.value.cost.y,
  width: regions.value.cost.w,
  height: regions.value.cost.h,
  text: props.costText ?? '',
  fontSize: Math.max(10, Math.round(regions.value.cost.h * 0.6)),
  fill: theme.text.muted,
  verticalAlign: 'middle',
  listening: false,
}));

const clipFunc = (ctx: Konva.Context) => {
  const r = theme.radii.soft;
  const W = w.value;
  const H = h.value;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(W - r, 0);
  ctx.arcTo(W, 0, W, r, r);
  ctx.lineTo(W, H - r);
  ctx.arcTo(W, H, W - r, H, r);
  ctx.lineTo(r, H);
  ctx.arcTo(0, H, 0, H - r, r);
  ctx.lineTo(0, r);
  ctx.arcTo(0, 0, r, 0, r);
  ctx.closePath();
};

defineExpose({
  node: computed(() => nodeRef.value?.getNode() ?? null),
});

defineSlots<{
  frame(props: { x: number; y: number; w: number; h: number }): unknown;
  cost(props: { x: number; y: number; w: number; h: number }): unknown;
  icon(props: { x: number; y: number; w: number; h: number }): unknown;
  art(props: { x: number; y: number; w: number; h: number }): unknown;
  name(props: { x: number; y: number; w: number; h: number }): unknown;
  effect(props: { x: number; y: number; w: number; h: number }): unknown;
  footer(props: { x: number; y: number; w: number; h: number }): unknown;
  overlay(props: { x: number; y: number; w: number; h: number }): unknown;
}>();
</script>

<template>
  <v-group ref="nodeRef" :config="rootConfig">
    <v-group :config="tapConfig">
      <v-rect v-if="activated" :config="activatedGlow" />
      <v-rect :config="bgConfig" />

      <v-group :config="{ clipFunc }">
        <slot name="frame" v-bind="regions.frame" />
        <slot name="cost" v-bind="regions.cost">
          <v-text v-if="costText" :config="costFallbackConfig" />
        </slot>
        <slot name="icon" v-bind="regions.icon" />
        <slot name="art" v-bind="regions.art" />
        <slot name="name" v-bind="regions.name">
          <v-text v-if="name" :config="nameFallbackConfig" />
        </slot>
        <slot name="effect" v-bind="regions.effect" />
        <slot name="footer" v-bind="regions.footer" />
      </v-group>

      <v-rect v-if="selected" :config="selectedConfig" />
    </v-group>

    <slot name="overlay" v-bind="regions.overlay" />
  </v-group>
</template>
