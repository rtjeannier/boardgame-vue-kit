<docs lang="md">
# Stage

Root of any canvas scene. Wraps `<v-stage>`, owns pixelRatio, and
calls `provideTheme()` so descendants can read CSS vars.

Expects one or more `<Layer>` children.
</docs>

<script setup lang="ts">
import Stage from './Stage.vue';
import Layer from './Layer.vue';
</script>

<template>
  <Story title="canvas/Stage" group="Canvas">
    <Variant title="Empty stage — paints --stage-bg">
      <Stage :width="400" :height="200">
        <Layer />
      </Stage>
    </Variant>

    <Variant title="Stage with a themed rect on a Layer">
      <Stage :width="400" :height="200">
        <Layer>
          <v-rect
            :config="{ x: 40, y: 40, width: 120, height: 120, fill: '#58a6ff', cornerRadius: 8 }"
          />
          <v-text
            :config="{ x: 180, y: 80, text: 'theme + vue-konva', fontSize: 16, fill: '#c9d1d9' }"
          />
        </Layer>
      </Stage>
    </Variant>
  </Story>
</template>
