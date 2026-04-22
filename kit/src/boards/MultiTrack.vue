<script setup lang="ts">
/**
 * MultiTrack — a stack of parallel tracks sharing an axis.
 *
 * The generic primitive for rate trackers, score multitracks, stats
 * comparisons — anywhere you want multiple resources / players each
 * with their own linear position on a shared scale.
 *
 *   <MultiTrack :rows="['Gold', 'Wood', 'Stone']" :length="11" show-ticks>
 *     <Slot :position="{ row: 0, col: 5 }"><Token color="red" /></Slot>
 *     <Slot :position="{ row: 1, col: 3 }"><Token color="blue" /></Slot>
 *     <Slot :position="{ row: 2, col: 7 }"><Token color="gray" /></Slot>
 *   </MultiTrack>
 *
 * Grid columns: [label] [col 0] [col 1] ... [col length-1]
 * Grid rows:    [ticks?] [row 0] [row 1] ... [row N-1]
 *
 * Children use `:position="{row, col}"` from Slot; MultiTrack cascades
 * `--row-offset` / `--col-offset` CSS vars down so each Slot shifts
 * past the label column (and past the tick row when present).
 */
withDefaults(
  defineProps<{
    /** One entry per row. Length of array = number of parallel tracks. */
    rows: readonly string[];
    /** Number of positions along the shared axis. */
    length: number;
    /** Show a header row of tick labels (0..length-1). */
    showTicks?: boolean;
    role?: string;
    label?: string;
  }>(),
  { showTicks: false },
);
</script>

<template>
  <div
    class="multitrack"
    :data-ticks="showTicks || null"
    :style="{
      '--track-length': length,
      '--rows-count': rows.length,
    }"
    :role="role ?? 'group'"
    :aria-label="label"
  >
    <!-- Tick header (row 1). Each tick lives in column n+2 so col 0
         of the data maps to grid column 2 (column 1 holds labels). -->
    <template v-if="showTicks">
      <div
        v-for="n in length"
        :key="`tick-${n - 1}`"
        class="multitrack__tick"
        :style="{ gridRow: 1, gridColumn: n + 1 }"
      >
        <slot name="tick" :index="n - 1">{{ n - 1 }}</slot>
      </div>
    </template>

    <!-- Row labels in column 1. Shifted by tick row when present. -->
    <div
      v-for="(rowLabel, i) in rows"
      :key="`row-${i}`"
      class="multitrack__label"
      :style="{ gridRow: i + (showTicks ? 2 : 1), gridColumn: 1 }"
    >
      <slot name="row-label" :label="rowLabel" :index="i">{{ rowLabel }}</slot>
    </div>

    <!-- Content slots. Each positioned via :position="{row, col}";
         Slot's own CSS reads --grid-row/--grid-col plus the offsets
         we cascade below. -->
    <slot />
  </div>
</template>

<style scoped>
.multitrack {
  display: grid;
  /* Column 1 is label (auto width); N content columns share the rest. */
  grid-template-columns: auto repeat(var(--track-length), 1fr);
  /* Rows: optional tick header + N rate rows. auto lets each size to content. */
  grid-auto-rows: auto;
  gap: var(--gap-normal);
  align-items: center;

  /* Cascade: children with :position="{row, col}" get shifted by these
   * so row 0 → grid row 1 (no ticks) or 2 (with ticks); col 0 → grid
   * col 2 (past the label column). Slot's scoped CSS picks them up. */
  --row-offset: 0;
  --col-offset: 1;
}

.multitrack[data-ticks] {
  --row-offset: 1;
}

.multitrack__tick {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 600;
}

.multitrack__label {
  padding-right: var(--gap-normal);
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
  text-align: right;
}
</style>
