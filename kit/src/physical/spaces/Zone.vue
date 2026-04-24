<script setup lang="ts">
/**
 * Zone — the universal container. "A space where components can be
 * placed." Zones have bounds, an optional rendered surface, and a
 * `layout` policy that positions children.
 *
 * Zones nest: pass Zones as children to build hierarchies that match
 * how games actually decompose — a player area Zone containing a
 * hand Zone and a tableau Zone; a market Zone containing per-row
 * Zones; etc.
 *
 * The default slot is **scoped** — it receives `{ index, x, y, w, h }`
 * and is rendered once per `count`. The consumer uses those values
 * to position their piece. This is the canonical pattern on canvas,
 * since Konva children don't reflow automatically.
 *
 *   <Zone :count="hand.length" layout="hand"
 *         :x="0" :y="480" :width="900" :height="180"
 *         v-slot="{ index, x, y }">
 *     <Card :card="hand[index]" :x="x" :y="y" />
 *   </Zone>
 *
 * The `#surface` slot is called once with `{ w, h }` — consumers
 * paint a background (v-rect, v-image, or composite). Leaving it
 * empty leaves the zone transparent.
 */
import { computed, ref } from 'vue';
import { Group as VGroup } from 'vue-konva';
import type Konva from 'konva';
import type { VueKonvaRef } from 'vue-konva';
import { useTheme } from '../../composables/useTheme';

export type ZoneLayout = 'row' | 'col' | 'hand' | 'stack' | 'grid' | 'free';

export interface ZoneProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  /** How many child slots to render. Zone calls the default slot once per index. */
  count?: number;
  layout?: ZoneLayout;
  /** Space between cells in px. Defaults to theme.gaps.normal. */
  gap?: number;
  /** Per-cell width. Defaults to theme.card.w. */
  cellWidth?: number;
  /** Per-cell height. Defaults to theme.card.h. */
  cellHeight?: number;
  /** For `grid` layout — columns per row. */
  cols?: number;
  /** Inset from zone bounds when laying out children. */
  padding?: number;
}

const props = withDefaults(defineProps<ZoneProps>(), {
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
});

const theme = useTheme();
const nodeRef = ref<VueKonvaRef<Konva.Group> | null>(null);

const gap = computed(() => props.gap ?? theme.gaps.normal);
const cellW = computed(() => props.cellWidth ?? theme.card.w);
const cellH = computed(() => props.cellHeight ?? theme.card.h);

interface Position {
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

const positions = computed<Position[]>(() => {
  const n = Math.max(0, props.count);
  if (n === 0) return [];
  const out: Position[] = [];
  const pad = props.padding;
  const g = gap.value;
  const boundsW = props.width ?? n * cellW.value + (n - 1) * g + pad * 2;

  for (let i = 0; i < n; i++) {
    let x = pad;
    let y = pad;
    let w = cellW.value;
    let h = cellH.value;

    switch (props.layout) {
      case 'row':
        x = pad + i * (cellW.value + g);
        break;
      case 'col':
        y = pad + i * (cellH.value + g);
        break;
      case 'hand': {
        // Spread if room, overlap if tight. Each card gets at most
        // cellW + gap; beyond that, step shrinks to fit all in.
        const innerW = boundsW - pad * 2;
        const spread = n === 1 ? 0 : (innerW - cellW.value) / (n - 1);
        const step = n === 1 ? 0 : Math.min(cellW.value + g, spread);
        x = pad + i * step;
        break;
      }
      case 'stack':
        x = pad + i * theme.stackStep;
        y = pad + i * theme.stackStep;
        break;
      case 'grid': {
        const cols = Math.max(1, props.cols ?? Math.ceil(Math.sqrt(n)));
        const col = i % cols;
        const row = Math.floor(i / cols);
        x = pad + col * (cellW.value + g);
        y = pad + row * (cellH.value + g);
        break;
      }
      case 'free':
      default:
        x = pad;
        y = pad;
        break;
    }
    out.push({ index: i, x, y, w, h });
  }
  return out;
});

const resolvedWidth = computed(() => {
  if (props.width !== undefined) return props.width;
  const last = positions.value[positions.value.length - 1];
  if (!last) return cellW.value + props.padding * 2;
  return last.x + last.w + props.padding;
});
const resolvedHeight = computed(() => {
  if (props.height !== undefined) return props.height;
  let maxBottom = cellH.value + props.padding * 2;
  for (const p of positions.value) {
    maxBottom = Math.max(maxBottom, p.y + p.h + props.padding);
  }
  return maxBottom;
});

const groupConfig = computed(() => ({ x: props.x, y: props.y }));

defineExpose({
  node: computed(() => nodeRef.value?.getNode() ?? null),
  width: resolvedWidth,
  height: resolvedHeight,
});
</script>

<template>
  <v-group ref="nodeRef" :config="groupConfig">
    <slot name="surface" :w="resolvedWidth" :h="resolvedHeight" />
    <template v-for="pos in positions" :key="pos.index">
      <slot :index="pos.index" :x="pos.x" :y="pos.y" :w="pos.w" :h="pos.h" />
    </template>
  </v-group>
</template>
