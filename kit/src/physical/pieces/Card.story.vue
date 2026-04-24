<docs lang="md">
# Card

Bordered canvas piece with named positioned slot regions. State
props drive state→visual via computed Konva configs. Slots receive
`{ x, y, w, h }` in card-local coordinates.

## State props
- `selected` — blue outline, 4px translate-up
- `tapped` — 8° rotation (around center)
- `inactive` — 50% opacity, pointer-disabled
- `activated` — green glow + accent stroke
</docs>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type Konva from 'konva';
import Stage from '../../canvas/Stage.vue';
import Layer from '../../canvas/Layer.vue';
import Card from './Card.vue';

const playground = reactive({
  selected: false,
  tapped: false,
  inactive: false,
  activated: false,
});

const tweenRef = ref<{ node: Konva.Group | null } | null>(null);
function flip() {
  const node = tweenRef.value?.node;
  if (!node) return;
  node.to({ rotation: (node.rotation() + 180) % 360, duration: 0.3 });
}
</script>

<template>
  <Story title="physical/pieces/Card" group="Physical">
    <Variant title="Default — intrinsic size, empty slots">
      <Stage :width="260" :height="260">
        <Layer>
          <Card :x="50" :y="20" name="Ancient Forge" cost-text="GGW" />
        </Layer>
      </Stage>
    </Variant>

    <Variant title="States (transforms compose)">
      <Stage :width="900" :height="280">
        <Layer>
          <Card :x="20" :y="40" name="Default" />
          <Card :x="200" :y="40" name="Selected" selected />
          <Card :x="380" :y="40" name="Tapped" tapped />
          <Card :x="560" :y="40" name="Sel + Tap" selected tapped />
          <Card :x="740" :y="40" name="Activated" activated />
        </Layer>
      </Stage>
    </Variant>

    <Variant title="Slot content">
      <Stage :width="260" :height="260">
        <Layer>
          <Card :x="50" :y="20" name="Ancient Forge">
            <template #cost="{ x, y, h }">
              <v-circle :config="{ x: x + 8, y: y + h/2, radius: 8, fill: '#d29922' }" />
              <v-text :config="{ x, y: y + h/2 - 6, width: 24, text: '3', align: 'center', fill: '#000', fontSize: 12, fontStyle: 'bold' }" />
            </template>
            <template #effect="{ x, y, w }">
              <v-text :config="{ x, y, width: w, text: '+2 GOLD / turn', fontSize: 11, fill: '#58a6ff', fontStyle: 'bold' }" />
              <v-text :config="{ x, y: y + 16, width: w, text: 'Adjacent cards gain +1 VP when scored.', fontSize: 10, fill: '#8b949e', fontStyle: 'italic' }" />
            </template>
            <template #footer="{ x, y, w, h }">
              <v-text :config="{ x, y: y + h/2 - 6, width: w, text: '5 pts', align: 'right', fill: '#3fb950', fontSize: 12, fontStyle: 'bold' }" />
            </template>
          </Card>
        </Layer>
      </Stage>
    </Variant>

    <Variant title="Imperative handle — runs a Konva tween">
      <Stage :width="260" :height="260">
        <Layer>
          <Card ref="tweenRef" :x="50" :y="20" name="Click flip →" />
        </Layer>
      </Stage>
      <template #controls>
        <button type="button" class="ctrl" @click="flip">Flip (0.3s tween)</button>
      </template>
    </Variant>

    <Variant title="Playground">
      <Stage :width="260" :height="260">
        <Layer>
          <Card
            :x="50"
            :y="20"
            name="Toggle states"
            :selected="playground.selected"
            :tapped="playground.tapped"
            :inactive="playground.inactive"
            :activated="playground.activated"
          />
        </Layer>
      </Stage>
      <template #controls>
        <HstCheckbox v-model="playground.selected" title="selected" />
        <HstCheckbox v-model="playground.tapped" title="tapped" />
        <HstCheckbox v-model="playground.inactive" title="inactive" />
        <HstCheckbox v-model="playground.activated" title="activated" />
      </template>
    </Variant>
  </Story>
</template>

<style scoped>
.ctrl {
  padding: 0.25rem 0.75rem;
  background: var(--accent-blue);
  color: #000;
  border: 0;
  border-radius: var(--radius-rounded);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
