# physical/

Game-box primitives rendered on canvas via vue-konva. These components
mirror engine state into Konva shapes; they do not enforce rules.

## Buckets

- **`spaces/`** — `Zone`, `Board`, `Slot`. Containers for pieces. Zone
  is the universal primitive; Board and Slot are thin wrappers.
- **`pieces/`** — `Card`, `Token`. Things you'd pick up off the table.
- **`visuals/`** — `Icon`. Rendering motifs smaller than a piece.

## Contract

- **Props describe what the piece *is*.** Intrinsic content and state
  (`selected`, `tapped`, `inactive`, `name`). Never display concerns
  like scale or density.
- **Layout is owned by the parent Zone.** Pieces don't know what
  layout they're in. Zones compute positions; scoped slots pass
  `{ index, x, y, w, h }` into each child's render.
- **State → visual happens in computed configs**, not scoped CSS.
  Scoped CSS doesn't reach canvas. Components translate `selected`,
  `tapped`, etc. into Konva config values (`stroke`, `rotation`,
  `opacity`).
- **All visual constants come from the theme composable.** No magic
  numbers in component scripts. Add a token to `variables.css` if
  the vocabulary is missing.

## Slots

Canvas slots are positioned: each named slot receives `{ x, y, w, h }`
in parent-local coordinates. Consumers paint Konva nodes (`<v-text>`,
`<v-image>`, `<v-rect>`, nested physical components) inside, using
those coordinates to place content.

Leaving a slot empty is fine; components provide data-prop fallbacks
for common cases (e.g., `<Card name="…">` renders default name text
when `#name` isn't filled).

## Imperative escape hatch

Every physical component calls `defineExpose({ node })` with its root
Konva shape. When the declarative API can't express a need — a tween,
a custom hit region, direct canvas drawing — grab the ref:

```vue
<Card ref="cardRef" :selected="picked" />
<script setup>
import { ref } from 'vue';
const cardRef = ref();
function flipIt() {
  cardRef.value?.node?.to({ rotation: 180, duration: 0.3 });
}
</script>
```

The primary model is declarative. The imperative handle is a footnote
for cases the template can't express.
