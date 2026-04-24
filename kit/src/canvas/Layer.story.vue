<docs lang="md">
# Layer

z-ordered rendering surface inside a Stage. Each Layer is its own
`<canvas>`; keep Layer count small (Konva guidance: 3-5 max).
Typical pattern: one Layer for physical pieces, one above it for
overlays.
</docs>

<script setup lang="ts">
import Stage from './Stage.vue';
import Layer from './Layer.vue';
</script>

<template>
  <Story title="canvas/Layer" group="Canvas">
    <Variant title="Two layers — second paints above the first">
      <Stage :width="400" :height="240">
        <Layer>
          <v-rect :config="{ x: 40, y: 40, width: 160, height: 160, fill: '#58a6ff' }" />
          <v-text
            :config="{ x: 50, y: 50, text: 'Layer 1\n(physical pieces)', fontSize: 14, fill: '#000' }"
          />
        </Layer>
        <Layer>
          <v-circle :config="{ x: 240, y: 120, radius: 60, fill: '#f0883e', opacity: 0.85 }" />
          <v-text
            :config="{ x: 200, y: 190, text: 'Layer 2 (overlay)', fontSize: 14, fill: '#c9d1d9' }"
          />
        </Layer>
      </Stage>
    </Variant>
  </Story>
</template>
