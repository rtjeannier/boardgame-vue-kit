<docs lang="md">
# Token

Physical piece: chip, cube, cylinder, meeple. Shape describes *what
the token is*, not how it's displayed. Size uses the `--size-*` scale.
</docs>

<script setup lang="ts">
import Stage from '../canvas/Stage.vue';
import Layer from '../canvas/Layer.vue';
import Token from './Token.vue';
</script>

<template>
  <Story title="physical/Token" group="Physical">
    <Variant title="Shapes">
      <Stage :width="420" :height="120">
        <Layer>
          <Token :x="20" :y="40" shape="disc" size="lg" color="#58a6ff" label="3" />
          <Token :x="120" :y="40" shape="cube" size="lg" color="#d29922" label="5" />
          <Token :x="220" :y="40" shape="cylinder" size="lg" color="#3fb950" label="1" />
          <Token :x="320" :y="40" shape="meeple" size="lg" color="#f85149" />
        </Layer>
      </Stage>
    </Variant>

    <Variant title="Sizes (disc)">
      <Stage :width="420" :height="120">
        <Layer>
          <Token :x="20" :y="50" shape="disc" size="xs" color="#58a6ff" />
          <Token :x="60" :y="46" shape="disc" size="sm" color="#58a6ff" />
          <Token :x="120" :y="40" shape="disc" size="md" color="#58a6ff" />
          <Token :x="200" :y="32" shape="disc" size="lg" color="#58a6ff" />
          <Token :x="300" :y="20" shape="disc" size="xl" color="#58a6ff" />
        </Layer>
      </Stage>
    </Variant>
  </Story>
</template>
