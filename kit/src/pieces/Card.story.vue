<docs lang="md">
# Card

A bordered artifact with named content slots. Size is intrinsic
(`--card-w` / `--card-h` CSS vars set by the game-level wrapper);
there is no `variant` or `size` prop.

State lives on boolean data attributes. Transforms use modern
independent `translate` / `rotate` properties so states compose
automatically — a tapped + selected card just rotates *and* lifts
without needing combinatorial selectors.

## Slots
- `#frame` — full-bleed background (skins, foils)
- `#art` — illustration above the name
- `#icon` — corner emblem
- `#name` — title row (bold)
- `#cost` — cost markers
- `#effect` — the effect body; caller composes (rate rows, stacked
  abilities, flavor text, whatever the game needs)
- `#footer` — below the effect body
- `#overlay` — content painted *on top* of the card; lives outside
  the clip region so tokens can hang off the edge

## Props
- `selected?: boolean` — blue outline + lift
- `inactive?: boolean` — 50% opacity
- `tapped?: boolean` — 8° rotation
- `activated?: boolean` — green glow (ability firing)

## Sizing

Game-level card components set `--card-w` / `--card-h` on their root
class. `<BuildingCard>` uses `9.75rem × 13.75rem`; `<ContractCard>`
uses the compact `7rem × 9.5rem`. For ad-hoc resize (tooltip preview,
opponent tableau) wrap in `<Scaled>`, don't add a prop.
</docs>

<script setup lang="ts">
import { reactive } from 'vue';
import Card from './Card.vue';
import CardZone from './CardZone.vue';
import Token from './Token.vue';

const playground = reactive({
  selected: false,
  inactive: false,
  tapped: false,
  activated: false,
});
</script>

<template>
  <Story title="kit/pieces/Card">
    <Variant title="Default — empty slots show dev placeholders">
      <div class="row">
        <Card />
      </div>
    </Variant>

    <Variant title="States (independent transforms compose)">
      <div class="row">
        <Card>
          <template #name>Default</template>
        </Card>
        <Card selected>
          <template #name>Selected</template>
        </Card>
        <Card tapped>
          <template #name>Tapped</template>
        </Card>
        <Card selected tapped>
          <template #name>Selected + Tapped</template>
        </Card>
        <Card activated>
          <template #name>Activated</template>
        </Card>
        <Card inactive>
          <template #name>Inactive</template>
        </Card>
      </div>
    </Variant>

    <Variant title="Filled slots">
      <div class="row">
        <Card>
          <template #name>Ancient Forge</template>
          <template #cost>
            <span class="cost-pip">GOLD</span>
            <span class="cost-pip">GOLD</span>
            <span class="cost-pip">WOOD</span>
          </template>
          <template #effect>
            <CardZone height="2rem">+2 GOLD · -1 WOOD</CardZone>
            <CardZone fill style="font-style: italic">
              When built, gain 1 victory point for each adjacent card.
            </CardZone>
          </template>
        </Card>
      </div>
    </Variant>

    <Variant title="Overlay — tokens hang off the corner">
      <div class="row">
        <Card tapped>
          <template #name>Ancient Forge</template>
          <template #overlay>
            <Token shape="cube" size="xs" label="3" color="#d29922" />
          </template>
        </Card>
      </div>
    </Variant>

    <Variant title="Playground">
      <div class="row">
        <Card
          :selected="playground.selected"
          :inactive="playground.inactive"
          :tapped="playground.tapped"
          :activated="playground.activated"
        >
          <template #name>Toggle states below</template>
        </Card>
      </div>
      <template #controls>
        <HstCheckbox v-model="playground.selected" title="selected" />
        <HstCheckbox v-model="playground.tapped" title="tapped" />
        <HstCheckbox v-model="playground.activated" title="activated" />
        <HstCheckbox v-model="playground.inactive" title="inactive" />
      </template>
    </Variant>
  </Story>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.5rem;
  align-items: flex-start;
}
.cost-pip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: var(--radius-pill);
  background: var(--accent-blue);
  color: #000;
  font-size: 0.6rem;
  font-weight: 700;
}
</style>
