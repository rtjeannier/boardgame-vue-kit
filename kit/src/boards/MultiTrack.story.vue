<docs lang="md">
# MultiTrack

A stack of parallel Tracks sharing an axis. Useful for rate trackers,
multi-stat comparisons, score tracks with one row per player.

Renders as a CSS grid: row labels in column 1, optional tick header
in row 1, then a cell per `(row, col)` pair. Children are
`<Slot :position="{ row, col }">`; MultiTrack cascades `--row-offset` /
`--col-offset` CSS vars so Slot children automatically shift past the
label column and tick row.

## Props
- `rows: string[]` — one label per parallel track (required)
- `length: number` — positions along the shared axis (required)
- `showTicks?: boolean` — add a header row of tick labels (default false)
- `role?`, `label?` — ARIA

## Slots
- `default` — `<Slot :position="{row, col}">` children
- `#tick` — custom tick label renderer `({ index }) => ...`
- `#row-label` — custom row-label renderer `({ label, index }) => ...`
</docs>

<script setup lang="ts">
import MultiTrack from './MultiTrack.vue';
import Slot from './Slot.vue';
import Token from '../pieces/Token.vue';

const rows = ['Gold', 'Wood', 'Stone'];
</script>

<template>
  <Story title="kit/boards/MultiTrack">
    <Variant title="3 rows, 11 positions, with tick header">
      <div class="pad">
        <MultiTrack :rows="rows" :length="11" show-ticks>
          <Slot :position="{ row: 0, col: 5 }">
            <Token shape="disc" color="#e74c3c" size="sm" />
          </Slot>
          <Slot :position="{ row: 1, col: 2 }">
            <Token shape="disc" color="#2c3e80" size="sm" />
          </Slot>
          <Slot :position="{ row: 2, col: 8 }">
            <Token shape="disc" color="#888" size="sm" />
          </Slot>
        </MultiTrack>
      </div>
    </Variant>

    <Variant title="No ticks">
      <div class="pad">
        <MultiTrack :rows="rows" :length="7">
          <Slot :position="{ row: 0, col: 3 }">
            <Token shape="cube" color="#e74c3c" size="sm" label="A" />
          </Slot>
          <Slot :position="{ row: 1, col: 5 }">
            <Token shape="cube" color="#2c3e80" size="sm" label="B" />
          </Slot>
        </MultiTrack>
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
.pad {
  padding: 1rem;
}
</style>
