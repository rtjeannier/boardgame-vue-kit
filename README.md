# boardgame-vue-kit

A Vue 3 + Tailwind component kit for board-game UIs. Opinionated primitives for pieces, boards, icons, and layouts — so you can prototype a digital board game without rebuilding the card/token/track wheel every time.

## Repo layout

```
kit/                   The published package (boardgame-vue-kit)
examples/drafting/     A sample consumer app: solo card-drafting
```

## Quickstart

### Inside the monorepo

```bash
npm install
npm run story:dev      # Histoire playground at http://127.0.0.1:6006
npm run example:dev    # Sample card-drafting game at http://127.0.0.1:5173
```

### In a consumer app (when published)

```bash
npm install boardgame-vue-kit
```

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import 'boardgame-vue-kit/variables.css';  // design tokens
import './index.css';                        // your Tailwind entry
createApp(App).mount('#app');
```

```vue
<!-- A card with a rates band + rules text -->
<script setup lang="ts">
import { Card, CardZone, Token } from 'boardgame-vue-kit';
</script>
<template>
  <Card>
    <template #name>Power Plant</template>
    <template #cost>...</template>
    <template #effect>
      <CardZone height="2rem">Rates go here</CardZone>
      <CardZone fill>Flavor / rules text</CardZone>
    </template>
  </Card>
</template>
```

## What's in the kit

| Bucket | Components |
|---|---|
| `pieces/` | `Card`, `CardZone`, `Token`, `Deck` |
| `boards/` | `Zone`, `Slot`, `Track`, `MultiTrack` |
| `visuals/` | `Icon` |
| `layout/` | `FitText`, `Scaled` |
| `ui/` | `Button`, `Modal` |
| `composables/` | `GameEngine` interface |

Every component has a Histoire story — run `npm run story:dev` to browse.

## Contributing

Rules and architectural principles live in [CLAUDE.md](./CLAUDE.md). Read it before adding components or changing the token system.

## License

MIT
