<script setup lang="ts">
import { computed, inject, provide, unref, useSlots, type Ref } from 'vue';

/**
 * Slot — a spatial holder on a Board.
 *
 * A Slot is where Tokens (or Cards, or anything) physically sit. It
 * has an optional `size` footprint and a `stack` mode that controls
 * how multiple children visualize when they overlap.
 *
 * POSITIONING: when placed inside a <Track> or <Grid>, Slot reads the
 * parent board's axis (via inject) and binds its `position` to the
 * right CSS grid property:
 *   - Track horizontal: position → grid-column
 *   - Track vertical:   position → grid-row
 *   - Grid:             position.row / position.col → both
 *
 * When placed inside a <Zone> (which uses flex), position is decorative
 * (data attribute only); the Zone's layout policy handles arrangement.
 *
 * All visual decisions reference kit variables from kit/theme/variables.css.
 */
const props = defineProps<{
  /** Linear index for Track, {row, col} for Grid, free string for Zone. */
  position?: number | string | { row: number; col?: number };
  /** Override parent Board's default slot size. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  stack?: 'none' | 'offset' | 'fan' | 'overlap' | 'count';
  /** Enables drop-target behavior (wires up in kit/interactions at M4). */
  droppable?: boolean;
}>();

const trackOrientationRef = inject(
  'track-orientation',
  null,
) as Ref<'horizontal' | 'vertical'> | null;

// Unwrap to plain value for template binding; stays reactive since
// computed tracks the ref.
const trackOrientation = computed(() => (trackOrientationRef ? unref(trackOrientationRef) : null));

// Expose our size so a child <Token fill> (without its own size) can inherit.
provide('slot-size', computed(() => props.size));

const slots = useSlots();
const childCount = computed(() => (slots.default ? slots.default({}).length : 0));

/** CSS vars for grid positioning. Null when Slot is not in a positioned board. */
const positionStyle = computed<Record<string, string> | undefined>(() => {
  if (props.position === undefined || props.position === null) return undefined;

  // Grid: {row, col} — apply to both axes.
  if (typeof props.position === 'object') {
    const out: Record<string, string> = {
      '--grid-row': String(props.position.row + 1),
    };
    if (props.position.col !== undefined) {
      out['--grid-col'] = String(props.position.col + 1);
    }
    return out;
  }

  // Track: numeric index. Emits --position; axis decided by scoped CSS
  // based on data-track (set from injected orientation).
  if (typeof props.position === 'number') {
    return { '--position': String(props.position + 1) };
  }

  return undefined;
});

const positionAttr = computed(() =>
  typeof props.position === 'object' ? JSON.stringify(props.position) : props.position,
);
</script>

<template>
  <div
    class="slot"
    :data-size="size ?? 'inherit'"
    :data-stack="stack ?? 'none'"
    :data-droppable="droppable || null"
    :data-count="childCount"
    :data-track="trackOrientation"
    :data-position="positionAttr"
    :style="positionStyle"
  >
    <slot />
    <span
      v-if="stack === 'count' && childCount > 1"
      class="slot__count"
    >{{ childCount }}</span>
  </div>
</template>

<style scoped>
.slot {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* Size — only applies when explicitly set; otherwise inherits parent Board's. */
.slot[data-size='xs'] { width: var(--size-xs); height: var(--size-xs); }
.slot[data-size='sm'] { width: var(--size-sm); height: var(--size-sm); }
.slot[data-size='md'] { width: var(--size-md); height: var(--size-md); }
.slot[data-size='lg'] { width: var(--size-lg); height: var(--size-lg); }
.slot[data-size='xl'] { width: var(--size-xl); height: var(--size-xl); }

/* Track positioning — position binds to the track's axis. Parent may
 * cascade --col-offset / --row-offset to shift past label columns /
 * tick rows (MultiTrack does this). */
.slot[data-track='horizontal'] { grid-column: calc(var(--position) + var(--col-offset, 0)); }
.slot[data-track='vertical']   { grid-row:    calc(var(--position) + var(--row-offset, 0)); }

/* Grid / MultiTrack positioning — {row, col} shape. Same offset vars
 * cascade from the board (MultiTrack sets --col-offset: 1 to clear
 * the label column). */
.slot[style*='--grid-row'] { grid-row:    calc(var(--grid-row) + var(--row-offset, 0)); }
.slot[style*='--grid-col'] { grid-column: calc(var(--grid-col) + var(--col-offset, 0)); }

/* Stacking — multi-child layout modes (applies in any container). */
.slot[data-stack='offset'][data-count]:not([data-count='0']):not([data-count='1']) > *,
.slot[data-stack='overlap'][data-count]:not([data-count='0']):not([data-count='1']) > *,
.slot[data-stack='fan'][data-count]:not([data-count='0']):not([data-count='1']) > * {
  position: absolute;
}
.slot[data-stack='offset']  > *:nth-child(n+2) { translate: var(--stack-step) calc(var(--stack-step) * -1); }
.slot[data-stack='overlap'] > *:nth-child(n+2) { translate: 0 calc(var(--stack-step) * -1.5); }

/* Count mode: show only the first child; badge carries the total. */
.slot[data-stack='count'][data-count]:not([data-count='0']):not([data-count='1']) > *:not(:first-child) {
  display: none;
}

/* Droppable visual */
.slot[data-droppable] {
  outline: 1px dashed var(--border);
  outline-offset: 2px;
}

.slot__count {
  position: absolute;
  top: calc(var(--gap-snug) * -1);
  right: calc(var(--gap-snug) * -1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: var(--radius-pill);
  background: var(--accent-blue);
  color: #000;
  font-size: 0.5rem;
  font-weight: 700;
}
</style>
