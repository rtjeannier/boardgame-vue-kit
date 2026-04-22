<script setup lang="ts">
import { provide, toRef } from 'vue';

/**
 * Track — a linear positional axis with N ordered slots.
 *
 * The generic primitive for anything that lays pieces out along a
 * single dimension: score tracks, price tracks, progress meters, round
 * markers, turn order, phase dials. A 2D grid of positions uses <Grid>;
 * multiple parallel axes use <MultiTrack>.
 *
 * How positioning works:
 *   - Track creates an N-cell CSS grid (horizontal or vertical).
 *   - Slots placed inside with `:position="n"` claim cell `n` via a
 *     `--position` CSS variable. Multiple slots at the same position
 *     overlap naturally (useful when several pieces share a step).
 *
 *   <Track orientation="horizontal" :length="9">
 *     <Slot v-for="(n, i) in pieces" :key="i" :position="n">
 *       <Token :color="pieceColors[i]" />
 *     </Slot>
 *   </Track>
 *
 * Track provides its orientation to descendants via provide/inject so
 * Slot knows whether to bind its position to grid-column or grid-row.
 */
const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical';
    /** Number of cells on the axis. Positions are 0..length-1. */
    length: number;
    /** ARIA role; defaults to 'group'. */
    role?: string;
    label?: string;
  }>(),
  { orientation: 'horizontal' },
);

provide('track-orientation', toRef(props, 'orientation'));
</script>

<template>
  <div
    class="track"
    :data-orientation="orientation"
    :style="{ '--track-length': length }"
    :role="role ?? 'group'"
    :aria-label="label"
  >
    <slot />
  </div>
</template>

<style scoped>
.track {
  display: grid;
  gap: var(--gap-normal);
  align-items: center;
  justify-items: center;
}

.track[data-orientation='horizontal'] {
  grid-template-columns: repeat(var(--track-length), 1fr);
  grid-auto-rows: auto;
}

.track[data-orientation='vertical'] {
  grid-template-rows: repeat(var(--track-length), 1fr);
  grid-auto-columns: auto;
}
</style>
