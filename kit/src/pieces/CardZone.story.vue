<docs lang="md">
# CardZone

A sized sub-region of a Card's `#effect` slot (or any bounded area).
Two composable modes + configurable padding.

## Props
- `height?: string` — any CSS length (`"2rem"`, `"50%"`,
  `"calc(var(--card-h-regular) / 3)"`). Mutex with `fill`.
- `fill?: boolean` — `flex: 1`, takes remaining vertical space.
  Mutex with `height`.
- `pad?: 'none'|'tight'|'snug'|'normal'|'loose'|'wide'` OR raw CSS
  string. Default `'snug'`.
- `alignEnd?: boolean` — anchor content to bottom/right.

## The idiomatic pattern

Any number of fixed-height zones + **one** `fill` zone. That
composition never overflows — fixed zones take their share, fill
absorbs whatever's left (including any change in the card's border
or padding).

```vue
<Card>
  <template #effect>
    <CardZone height="2rem">…top band…</CardZone>
    <CardZone fill>…body…</CardZone>
  </template>
</Card>
```

## Sizing mental models

- **Same physical height across card types** → use rem:
  `height="2rem"` is 2rem on mini / regular / tarot alike.
- **Fraction of this card's interior** → use a percent:
  `height="50%"` is half the parent content-box; auto-adjusts when
  the card's border or padding changes.
- **Reference a named size** → use a CSS var in the string:
  `height="calc(var(--card-h-regular) / 3)"`. For this pattern,
  predefine derived vars in your theme file so call sites stay clean.
</docs>

<script setup lang="ts">
import Card from './Card.vue';
import CardZone from './CardZone.vue';
</script>

<template>
  <Story title="kit/pieces/CardZone">
    <Variant title="Idiomatic — fixed band + fill body">
      <div class="row">
        <Card>
          <template #name>Ancient Forge</template>
          <template #effect>
            <CardZone height="2rem" style="background: rgb(88 166 255 / 0.12)">
              +2 GOLD · -1 WOOD
            </CardZone>
            <CardZone fill style="background: rgb(210 168 255 / 0.12); font-style: italic">
              When built, gain 1 victory point for each adjacent card.
            </CardZone>
          </template>
        </Card>
      </div>
      <p class="caption">
        Tinted backgrounds show zone boundaries. Top band is exactly
        2rem; body fills the rest.
      </p>
    </Variant>

    <Variant title="Same physical band size on mini / regular / tarot">
      <div class="row">
        <Card style="--card-w: var(--card-w-mini); --card-h: var(--card-h-mini)">
          <template #name>mini</template>
          <template #effect>
            <CardZone height="2rem" style="background: rgb(88 166 255 / 0.2)">2rem</CardZone>
            <CardZone fill style="background: rgb(210 168 255 / 0.1)" />
          </template>
        </Card>
        <Card>
          <template #name>regular</template>
          <template #effect>
            <CardZone height="2rem" style="background: rgb(88 166 255 / 0.2)">2rem</CardZone>
            <CardZone fill style="background: rgb(210 168 255 / 0.1)" />
          </template>
        </Card>
        <Card style="--card-w: var(--card-w-tarot); --card-h: var(--card-h-tarot)">
          <template #name>tarot</template>
          <template #effect>
            <CardZone height="2rem" style="background: rgb(88 166 255 / 0.2)">2rem</CardZone>
            <CardZone fill style="background: rgb(210 168 255 / 0.1)" />
          </template>
        </Card>
      </div>
      <p class="caption">
        The blue band is 2rem tall on every card, regardless of card
        size. The purple fill body absorbs the rest.
      </p>
    </Variant>

    <Variant title="Fraction of interior (auto-adjusts to border)">
      <div class="row">
        <Card>
          <template #name>1px border</template>
          <template #effect>
            <CardZone height="50%" style="background: rgb(63 185 80 / 0.2)">50%</CardZone>
            <CardZone fill style="background: rgb(210 168 255 / 0.1)" />
          </template>
        </Card>
        <Card style="--card-border-w: 8px">
          <template #name>8px border</template>
          <template #effect>
            <CardZone height="50%" style="background: rgb(63 185 80 / 0.2)">50%</CardZone>
            <CardZone fill style="background: rgb(210 168 255 / 0.1)" />
          </template>
        </Card>
      </div>
      <p class="caption">
        `height="50%"` is half of the parent's content-box. Bumping
        the card's <code>--card-border-w</code> from 1px to 8px
        shrinks the content-box — the green band shrinks with it,
        the purple fill absorbs the difference.
      </p>
    </Variant>

    <Variant title="Bottom-anchored zone (reward-style)">
      <div class="row">
        <Card style="--card-w: var(--card-w-mini); --card-h: var(--card-h-mini)">
          <template #name>Contract</template>
          <template #effect>
            <CardZone fill style="background: rgb(88 166 255 / 0.12)">
              requirements…
            </CardZone>
            <CardZone height="1.5rem" align-end style="background: rgb(63 185 80 / 0.2)">
              Reward: <strong>$8</strong>
            </CardZone>
          </template>
        </Card>
      </div>
    </Variant>

    <Variant title="Padding variants">
      <div class="row">
        <Card>
          <template #name>pad="none"</template>
          <template #effect>
            <CardZone fill pad="none" style="background: rgb(88 166 255 / 0.15)">
              edge-to-edge
            </CardZone>
          </template>
        </Card>
        <Card>
          <template #name>pad="normal"</template>
          <template #effect>
            <CardZone fill pad="normal" style="background: rgb(88 166 255 / 0.15)">
              normal
            </CardZone>
          </template>
        </Card>
        <Card>
          <template #name>pad="1rem 0.25rem"</template>
          <template #effect>
            <CardZone fill pad="1rem 0.25rem" style="background: rgb(88 166 255 / 0.15)">
              custom CSS
            </CardZone>
          </template>
        </Card>
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
.row {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-start;
}
.caption {
  padding: 0 1.5rem 1.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  max-width: 48rem;
}
.caption code {
  background: var(--bg-subtle);
  padding: 0.125rem 0.25rem;
  border-radius: var(--radius-chamfer);
}
</style>
