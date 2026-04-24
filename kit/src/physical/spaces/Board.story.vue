<docs lang="md">
# Board

A Zone with a rendered playing-surface preset. Thin wrapper: Board
forwards all props to Zone and fills `#surface` with a themed rect
(`--board-surface-*`). Pass your own `#surface` slot to override.
</docs>

<script setup lang="ts">
import Stage from '../../canvas/Stage.vue';
import Layer from '../../canvas/Layer.vue';
import Board from './Board.vue';
</script>

<template>
  <Story title="physical/spaces/Board" group="Physical">
    <Variant title="Default surface preset">
      <Stage :width="500" :height="220">
        <Layer>
          <Board
            :count="3"
            layout="row"
            :x="20"
            :y="20"
            :width="460"
            :height="180"
            :cell-width="120"
            :cell-height="160"
            :gap="10"
            :padding="20"
            v-slot="{ x, y, w, h, index }"
          >
            <v-rect :config="{ x, y, width: w, height: h, fill: '#1c2332', cornerRadius: 4 }" />
            <v-text :config="{ x, y: y + h/2 - 6, width: w, text: `zone ${index}`, align: 'center', fill: '#c9d1d9', fontSize: 12 }" />
          </Board>
        </Layer>
      </Stage>
    </Variant>

    <Variant title="Custom surface via override">
      <Stage :width="500" :height="220">
        <Layer>
          <Board
            :count="2"
            layout="row"
            :x="20"
            :y="20"
            :width="460"
            :height="180"
            :cell-width="200"
            :cell-height="140"
            :gap="20"
            :padding="20"
            :surface-fill="'#2d1b4e'"
            :surface-stroke="'#a371f7'"
            v-slot="{ x, y, w, h }"
          >
            <v-rect :config="{ x, y, width: w, height: h, fill: '#1c2332', cornerRadius: 6 }" />
          </Board>
        </Layer>
      </Stage>
    </Variant>
  </Story>
</template>
