<docs lang="md">
# Scaled

Wrap a piece to render it at a different visual scale. Scale is a
*display* concern, not a property of the piece itself (see CLAUDE.md
rule 22). A `<BuildingCard>` is always building-card sized; wrap in
`<Scaled :to="0.5">` to render it half-size.

Uses CSS `transform: scale()` plus a shrunken layout box so the
scaled content occupies proportional flex/grid space.

## Props
- `to?: number` — scale factor, 1.0 = natural, 0.5 = half, 2.0 = double
- `origin?: string` — `transform-origin`, default `top left`

## Use for
- Tooltip / hover previews of cards
- Opponent tableau miniatures
- Zoom interactions
</docs>

<script setup lang="ts">
import { reactive } from 'vue';
import Scaled from './Scaled.vue';
import Card from '../pieces/Card.vue';

const playground = reactive({
  to: 0.7,
});
</script>

<template>
  <Story title="kit/layout/Scaled">
    <Variant title="Same Card, different scales">
      <div class="row">
        <Scaled :to="1">
          <Card><template #name>100%</template></Card>
        </Scaled>
        <Scaled :to="0.7">
          <Card><template #name>70%</template></Card>
        </Scaled>
        <Scaled :to="0.5">
          <Card><template #name>50%</template></Card>
        </Scaled>
        <Scaled :to="0.3">
          <Card><template #name>30%</template></Card>
        </Scaled>
      </div>
    </Variant>

    <Variant title="Upscaled">
      <div class="row">
        <Scaled :to="1.5">
          <Card><template #name>150%</template></Card>
        </Scaled>
      </div>
    </Variant>

    <Variant title="Playground">
      <div class="row">
        <Scaled :to="playground.to">
          <Card><template #name>{{ Math.round(playground.to * 100) }}%</template></Card>
        </Scaled>
      </div>
      <template #controls>
        <HstSlider v-model="playground.to" title="Scale" :min="0.1" :max="2" :step="0.05" />
      </template>
    </Variant>
  </Story>
</template>

<style scoped>
.row {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  align-items: flex-start;
}
</style>
