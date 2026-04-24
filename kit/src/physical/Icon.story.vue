<docs lang="md">
# Icon

Sized container for a glyph. Caller supplies the shape (v-path,
v-text, v-image, or composition) via the default slot, which
receives `{ w, h, color }`.
</docs>

<script setup lang="ts">
import Stage from '../canvas/Stage.vue';
import Layer from '../canvas/Layer.vue';
import KIcon from './Icon.vue';
</script>

<template>
  <Story title="physical/Icon" group="Physical">
    <Variant title="Sizes (consumer paints any glyph inside)">
      <Stage :width="360" :height="120">
        <Layer>
          <KIcon :x="20" :y="50" size="xs" color="#58a6ff">
            <template #default="{ w, h, color }">
              <v-circle :config="{ x: w/2, y: h/2, radius: w/2, fill: color }" />
            </template>
          </KIcon>
          <KIcon :x="60" :y="46" size="sm" color="#3fb950">
            <template #default="{ w, h, color }">
              <v-circle :config="{ x: w/2, y: h/2, radius: w/2, fill: color }" />
            </template>
          </KIcon>
          <KIcon :x="120" :y="40" size="md" color="#d29922">
            <template #default="{ w, h, color }">
              <v-circle :config="{ x: w/2, y: h/2, radius: w/2, fill: color }" />
            </template>
          </KIcon>
          <KIcon :x="200" :y="32" size="lg" color="#f0883e">
            <template #default="{ w, h, color }">
              <v-circle :config="{ x: w/2, y: h/2, radius: w/2, fill: color }" />
            </template>
          </KIcon>
          <KIcon :x="280" :y="20" size="xl" color="#f85149">
            <template #default="{ w, h, color }">
              <v-circle :config="{ x: w/2, y: h/2, radius: w/2, fill: color }" />
            </template>
          </KIcon>
        </Layer>
      </Stage>
    </Variant>

    <Variant title="Glyphs as text (suit letter)">
      <Stage :width="360" :height="120">
        <Layer>
          <KIcon :x="20" :y="40" size="lg" color="#58a6ff">
            <template #default="{ w, h, color }">
              <v-circle :config="{ x: w/2, y: h/2, radius: w/2, fill: color }" />
              <v-text :config="{ x: 0, y: 0, width: w, height: h, text: 'W', fontSize: w * 0.6, fontStyle: 'bold', align: 'center', verticalAlign: 'middle', fill: '#000' }" />
            </template>
          </KIcon>
          <KIcon :x="120" :y="40" size="lg" color="#d29922">
            <template #default="{ w, h, color }">
              <v-circle :config="{ x: w/2, y: h/2, radius: w/2, fill: color }" />
              <v-text :config="{ x: 0, y: 0, width: w, height: h, text: 'G', fontSize: w * 0.6, fontStyle: 'bold', align: 'center', verticalAlign: 'middle', fill: '#000' }" />
            </template>
          </KIcon>
          <KIcon :x="220" :y="40" size="lg" color="#3fb950">
            <template #default="{ w, h, color }">
              <v-circle :config="{ x: w/2, y: h/2, radius: w/2, fill: color }" />
              <v-text :config="{ x: 0, y: 0, width: w, height: h, text: 'M', fontSize: w * 0.6, fontStyle: 'bold', align: 'center', verticalAlign: 'middle', fill: '#000' }" />
            </template>
          </KIcon>
        </Layer>
      </Stage>
    </Variant>
  </Story>
</template>
