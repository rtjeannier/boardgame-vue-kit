<docs lang="md">
# Slot

A Zone that holds at most one piece. When `filled` is false, paints
a dashed empty-state outline. Use for positions where "empty" reads
as a reserved spot (discard pile, tableau placeholder, Chess square).
</docs>

<script setup lang="ts">
import Stage from '../../canvas/Stage.vue';
import Layer from '../../canvas/Layer.vue';
import Slot from './Slot.vue';
</script>

<template>
  <Story title="physical/spaces/Slot" group="Physical">
    <Variant title="Empty vs filled">
      <Stage :width="500" :height="260">
        <Layer>
          <Slot :x="20" :y="20" :width="156" :height="220" />
          <Slot :x="200" :y="20" :width="156" :height="220" filled>
            <template #default="{ w, h }">
              <v-rect :config="{ x: 0, y: 0, width: w, height: h, fill: '#1c2332', stroke: '#30363d', strokeWidth: 1, cornerRadius: 8 }" />
              <v-text :config="{ x: 0, y: h/2 - 8, width: w, text: 'filled', align: 'center', fill: '#c9d1d9', fontSize: 14 }" />
            </template>
          </Slot>
        </Layer>
      </Stage>
    </Variant>
  </Story>
</template>
