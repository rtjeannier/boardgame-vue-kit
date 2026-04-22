# boardgame-vue-kit

A Vue 3 + Tailwind component kit for board-game UIs. Primitives for pieces, boards, icons, and layouts — so consumers can prototype a digital board game without rebuilding the card/token/track wheel each time.

## Repo layout

```
kit/                    The published package (boardgame-vue-kit).
examples/drafting/      Sample consumer: solo card-drafting mini-game.
```

Monorepo via npm workspaces. The kit package has no runtime dependency on the example; the example consumes the kit as a workspace dep.

## Commands

```bash
npm install
npm run build           # kit library build (ESM + .d.ts)
npm run typecheck       # vue-tsc on kit + example
npm run story:dev       # Histoire playground at :6006
npm run story:build     # static Histoire site
npm run example:dev     # sample game at :5173
npm run example:build   # build sample game
```

## Kit architecture — the rules that matter

### Mental model — read this before editing anything

1. **This is a board-game UI kit, not a dashboard kit.** Every component maps to something physical or digital on the table: *pieces* (Card, Token, Deck), *boards* (Zone, Slot, Track, MultiTrack), *visuals* (Icon), *layout helpers* (FitText, Scaled), *UI chrome* (Button, Modal). Consumers compose these into screens.
2. **Kit is framework, consumer is composition.** The kit ships game-agnostic primitives. Nothing in `kit/` names a specific game mechanic, resource, or convention. Consumer apps wrap kit pieces with their game's identity and rules.
3. **Scoped CSS + CSS variables for pieces; Tailwind for arranging screens.** Pieces, boards, visuals, and layout primitives style themselves via `<style scoped>`, reading radius/shadow/motion/size values from `src/theme/variables.css`. Screens and UI chrome use Tailwind utility classes for *arranging* pieces (flex, gap, grid, padding). Tailwind never appears inside a piece's template. Scoped CSS never appears in a screen.
4. **Props describe the object; state lives on data attributes; vars decide the visual.** Props are the public API (`shape="cube"`, `selected`). Data attributes mirror state (`data-selected`, `data-tapped`). CSS variables execute the look (`var(--shadow-piece)`). All three layers are distinct — don't mix them.

### Kit-boundary test — run before writing any kit code

> *Would this word belong at home in Chess, Catan, Wingspan, Splendor, Ticket to Ride, or any other board game's rulebook?* If **yes** → kit. If **no** → consumer-layer.

Universal (kit-safe): `card`, `token`, `meeple`, `deck`, `hand`, `tableau`, `draft`, `market`, `track`, `slot`, `zone`, `pool`, `stack`, `tapped`, `flipped`, `counter`, `cube`, `chit`, `tile`, `hex`, `pawn`, `marker`, `round`, `turn`, `event`.

Kit primitives don't pre-enumerate visual conventions that are the *consumer's* choice. `<Icon>` has size + color + slot — it doesn't decide whether icons are circles or squares. That decision lives in a consumer wrapper.

### Taxonomy — five buckets

Components group by *what they are in the physical board game*, not by abstraction level. Every component can carry state (props or store) — state is not a classification axis.

| Bucket | Definition | Examples |
|---|---|---|
| `pieces/` | Things you'd find in the game box. | Card, CardZone, Token, Deck |
| `boards/` | Playing surfaces and the positions on them. | Zone, Slot, Track, MultiTrack |
| `ui/` | Digital chrome with no physical equivalent. | Button, Modal |
| `visuals/` | Rendering motifs smaller than a piece — things painted on a card/board that *look like something on their own*. | Icon |
| `layout/` | Content-shape helpers with no visual of their own. Plumbing under other components. | FitText, Scaled |

`composables/` holds cross-cutting behaviors (Vue composables, the `GameEngine` interface). Not a component bucket.

### Primitives and composition

1. Every gameplay object is a Vue SFC. If you're about to write an HTML string in JS, stop and make a component.
2. No direct DOM manipulation (`document.getElementById`, `innerHTML`, `classList.add`). Drive visuals through reactive state.
3. Variants that describe *what a thing is* are props, not separate components. `<Token shape="cube">`, not `<CubeToken>`. Variants that describe *how it's displayed* (scale, density) are NOT props — see "Physical modeling" below.
4. Tokens and Icons are distinct. A Token is a physical piece (chip, cube, meeple); an Icon is a glyph. A Token may wear an Icon. Not interchangeable.
5. Tokens live inside Slots. Slots live inside Boards. Placing a Token directly on a Board without a Slot is a missing Slot.
6. Stacking is a Slot property, not a separate component. Any Slot can stack with `stack="none|offset|fan|overlap|count"`.
7. `visuals/` holds things that render something visible of their own (Icon, Badge, Progress). `layout/` holds things that shape other content (FitText, Scaled). If a primitive has no look of its own, it goes in `layout/`.
8. Sizing uses container queries (`cqi`/`cqh`) for internal content scaling and the shared `xs|sm|md|lg|xl` CSS-variable scale (`--size-xs` through `--size-xl`) for external piece dimensions. No hardcoded pixels in component files. Cards use `--card-w` / `--card-h`.

### Physical modeling — intrinsic props only

1. Components in `pieces/` and `boards/` represent specific physical things. Their props describe what's **intrinsic to the object** — content and current state (selected, tapped, activated, flipped, counters). Props do NOT describe how the object is being displayed at the moment.
2. Display concerns — scale, zoom, compact-vs-full density — are **not** piece props. They go through `layout/` primitives (`<Scaled>`, etc.) or a separate view-component. If you catch yourself adding `size` or `variant` to a piece to render it smaller, the prop belongs somewhere else.
3. A piece **mirrors the engine's state; it never enforces rules**. "Can this card be tapped right now?" is engine business; the card just renders whatever state the engine produced. Kit components are trivial to reason about: state in → visual out.
4. **Zone-driven layout**: how a group of pieces is arranged (hand, tableau, stack, draft, row, column) is owned by the `<Zone layout="...">` containing them, not by the piece. Kit ships the named policies; consumers add more via scoped CSS targeting `.zone[data-layout='...']`.
5. A piece has its own intrinsic size set on its root via CSS vars (`--card-w` / `--card-h` for cards, `--size-md` etc. for tokens/icons). Kit `<Card>` reads those vars. Consumer wrapper components set their own size in scoped CSS. There is no `variant` or `size` prop on Card. For ad-hoc resize wrap in `<Scaled :to="..." />` from `layout/`.

### Styling — scoped CSS + CSS vars for pieces; Tailwind for arranging screens

Two strict lanes:

- **Pieces, boards, visuals, layout primitives** (anything in `kit/pieces/`, `kit/boards/`, `kit/visuals/`, `kit/layout/`): styled via `<style scoped>`. State lives on `data-*` attributes; scoped CSS selects on them. Every radius, shadow, motion, size value comes from a named CSS var in `src/theme/variables.css`. No magic numbers in scoped CSS. No Tailwind utility strings.
- **Screens, UI chrome, menus, sidebars** (`kit/ui/` chrome, consumer screens): Tailwind utility classes directly in the template for *arranging* pieces — `flex`, `gap-4`, `p-6`, `grid`. Tailwind is the layout tool, not the styling tool.

Rules that follow:

1. Do not write `<style>` blocks in screen-level composition files. Compose with Tailwind.
2. Do not write Tailwind utility strings in piece/board/visual/layout components. Use scoped CSS + CSS vars.
3. Every named value in kit scoped CSS (`box-shadow`, `border-radius`, `transition`) references a var from `src/theme/variables.css`. Magic numbers (`9999px`, `0.15s ease`, hex colors, raw pixel shadows) are bugs. Add a new named variable if the vocabulary is missing.
4. Consumers override kit defaults by redefining CSS vars in their own theme file (loaded after the kit's variables), or on a wrapping component's scoped selector. Don't pass Tailwind classes into kit components expecting them to override internal styling.
5. State → styling belongs in CSS, never `<script>`. Components declare state via `data-*` attributes; scoped CSS decides the visual. No computed class strings in `<script setup>`.
6. Text that must fit a container uses `<FitText>` (`layout/`). Don't hand-tune per-length font-size scales at the call site.

### Card slots

`<Card>` slots (`#frame`, `#art`, `#icon`, `#name`, `#cost`, `#effect`, `#footer`, `#overlay`) accept any Vue content — a composition of kit primitives, an `<img>`, or nothing. Data-driven fallback renders when a slot is empty. The `#effect` slot is deliberately neutral: consumer wrappers structure game-specific ideas (rates, abilities, bonuses) inside it. For cards with multiple effect kinds, wrap each in `<CardZone height="..." />` or `<CardZone fill />` so every card of that type has its effect kinds in identical positions — a card that leaves one zone empty still has a stable layout.

### Theming

`src/theme/variables.css` owns the shared design vocabulary (radii, shadows, motion, sizes, depths, z-index, default surfaces/text/accents). Consumers override individual vars in their own theme file and add game-specific ones (resource palettes, player colors). Kit components never read game-specific vars.

## Consumer quickstart

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import 'boardgame-vue-kit/variables.css';  // kit design tokens
import './index.css';                        // your Tailwind + any overrides
createApp(App).mount('#app');
```

```vue
<script setup lang="ts">
import { Card, CardZone, Token, Zone } from 'boardgame-vue-kit';
</script>

<template>
  <Zone layout="hand">
    <Card v-for="c in hand" :key="c.id" :selected="c.id === picked">
      <template #name>{{ c.name }}</template>
      <template #effect>
        <CardZone height="2rem">{{ c.keyword }}</CardZone>
        <CardZone fill>{{ c.flavor }}</CardZone>
      </template>
    </Card>
  </Zone>
</template>
```

Override any design token in your app's theme file:

```css
/* my-theme.css — loaded after boardgame-vue-kit/variables.css */
:root {
  --accent-blue: #ff6699;     /* your brand color */
  --card-border-w: 3px;        /* thicker card borders */
}
```

## Style guide for AI collaborators

- **Don't hardcode magic numbers** in scoped CSS. Every value should come from `variables.css`. If the vocabulary is missing, extend it.
- **Don't add Mars-specific (or any-game-specific) vocabulary** to kit components. If the word only makes sense in one game, it belongs in a consumer wrapper.
- **Don't add a `size` / `variant` prop to a piece** that isn't about what the piece *is*. If it's about display scale, that's a layout concern.
- **Do write a Histoire story** for any new component or meaningful variant. Stories are how consumers discover what kit can do.
- **Do keep the public API small.** Export from `src/index.ts` only things consumers need. Internal helpers stay internal.
