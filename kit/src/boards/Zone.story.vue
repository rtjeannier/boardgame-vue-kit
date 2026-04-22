<docs lang="md">
# Zone

A named region that holds pieces. Zones own **arrangement** — how
pieces are positioned relative to one another — not sizing. Pieces
render at their own intrinsic size; the zone's `layout` policy
decides the stacking / spacing.

## Props
- `layout?: 'row' | 'hand' | 'stack' | 'tableau' | 'draft' | 'column'`
- `role?: string` — ARIA role, defaults to `group`
- `label?: string` — accessibility label

## Layouts
- `row` — even horizontal row
- `hand` — overlapping row; cards lift on hover
- `stack` — pile with `--stack-step` offset per child
- `tableau` — wrapping grid on a flat surface
- `draft` — spaced-out row for card-picking
- `column` — vertical stack

Games can add their own by writing scoped CSS against
`.zone[data-layout='my-layout']`.
</docs>

<script setup lang="ts">
import Zone from './Zone.vue';
import Token from '../pieces/Token.vue';
import Card from '../pieces/Card.vue';
</script>

<template>
  <Story title="kit/boards/Zone">
    <Variant title="row — even horizontal line">
      <Zone layout="row">
        <Token v-for="i in 5" :key="i" shape="disc" color="#58a6ff" size="md" :label="String(i)" />
      </Zone>
    </Variant>

    <Variant title="hand — overlap + hover-lift (hover the cards)">
      <Zone layout="hand">
        <Card v-for="i in 5" :key="i">
          <template #name>Card {{ i }}</template>
        </Card>
      </Zone>
    </Variant>

    <Variant title="stack — pile with --stack-step offset">
      <Zone layout="stack">
        <Card v-for="i in 4" :key="i">
          <template #name>#{{ i }}</template>
        </Card>
      </Zone>
    </Variant>

    <Variant title="tableau — wrap grid">
      <Zone layout="tableau">
        <Card v-for="i in 9" :key="i">
          <template #name>Building {{ i }}</template>
        </Card>
      </Zone>
    </Variant>

    <Variant title="draft — spotlight spacing">
      <Zone layout="draft">
        <Card v-for="i in 3" :key="i">
          <template #name>Draft {{ i }}</template>
        </Card>
      </Zone>
    </Variant>

    <Variant title="column — vertical stack">
      <Zone layout="column" style="max-width: 12rem">
        <Token v-for="i in 4" :key="i" shape="cube" color="#3fb950" size="md" :label="String(i)" />
      </Zone>
    </Variant>
  </Story>
</template>
