<docs lang="md">
# Track

A linear positional axis with N ordered cells. Generic primitive for
score tracks, price tracks, progress meters, round markers, turn
order, phase dials.

Track creates an N-cell CSS grid. Children are `<Slot :position="n">`;
the Slot binds its position to `grid-column` (horizontal track) or
`grid-row` (vertical track) via injected orientation. Multiple Slots
at the same position overlap naturally.

## Props
- `orientation?: 'horizontal' | 'vertical'` — default `horizontal`
- `length: number` — number of cells on the axis (required)
- `role?`, `label?` — ARIA

## Composes well with
- `<Slot>` positions — click targets, stack modes
- `<MultiTrack>` — stack several Tracks sharing an axis
</docs>

<script setup lang="ts">
import Track from './Track.vue';
import Slot from './Slot.vue';
import Token from '../pieces/Token.vue';
</script>

<template>
  <Story title="kit/boards/Track">
    <Variant title="Horizontal, 11 positions">
      <div class="pad">
        <Track orientation="horizontal" :length="11">
          <Slot :position="0"><Token shape="disc" color="#e74c3c" size="sm" label="0" /></Slot>
          <Slot :position="3"><Token shape="disc" color="#3fb950" size="sm" label="3" /></Slot>
          <Slot :position="7"><Token shape="disc" color="#d29922" size="sm" label="7" /></Slot>
          <Slot :position="10"><Token shape="disc" color="#58a6ff" size="sm" label="10" /></Slot>
        </Track>
      </div>
    </Variant>

    <Variant title="Vertical, 5 positions">
      <div class="pad" style="height: 16rem">
        <Track orientation="vertical" :length="5" style="height: 100%">
          <Slot :position="0"><Token shape="disc" color="#e74c3c" size="sm" label="0" /></Slot>
          <Slot :position="2"><Token shape="disc" color="#3fb950" size="sm" label="2" /></Slot>
          <Slot :position="4"><Token shape="disc" color="#58a6ff" size="sm" label="4" /></Slot>
        </Track>
      </div>
    </Variant>

    <Variant title="Overlapping — two tokens share a position">
      <div class="pad">
        <Track orientation="horizontal" :length="9">
          <Slot :position="4" stack="offset">
            <Token shape="disc" color="#e74c3c" size="sm" label="A" />
            <Token shape="disc" color="#3fb950" size="sm" label="B" />
          </Slot>
          <Slot :position="7"><Token shape="disc" color="#58a6ff" size="sm" label="C" /></Slot>
        </Track>
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
.pad {
  padding: 1rem;
}
</style>
