<script setup lang="ts">
/**
 * Layer — a z-ordered rendering surface inside a Stage. Konva gives
 * each Layer its own `<canvas>` element; keep total Layer count
 * reasonable (3-5 is Konva's guidance).
 *
 * Typical pattern: one Layer for physical pieces (Board + Zones +
 * Cards + Tokens), another above it for overlays (drag-ghosts,
 * floating indicators). Most small games need only one.
 */
import { computed, ref } from 'vue';
import { Layer as VLayer } from 'vue-konva';
import type Konva from 'konva';
import type { VueKonvaRef } from 'vue-konva';

const layerRef = ref<VueKonvaRef<Konva.Layer> | null>(null);

defineExpose({
  node: computed(() => layerRef.value?.getNode() ?? null),
});
</script>

<template>
  <v-layer ref="layerRef">
    <slot />
  </v-layer>
</template>
