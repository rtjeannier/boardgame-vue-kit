# boardgame-vue-kit

A Vue 3 + Tailwind component kit for board-game UIs, scaffolded as a full-stack vibe-coding template: Python rules engine + Vue kit + devcontainer + Claude Code, ready to go.

Opinionated primitives for pieces, boards, icons, and layouts — so you can prototype a digital board game without rebuilding the card/token/track wheel every time. A Python package is included for rules / simulation / analysis, alongside the Vue kit.

## Use this template

1. Click **"Use this template"** > **"Create a new repository"** on GitHub
2. In VS Code, run **"Dev Containers: Clone Repository in Container Volume..."** and paste your new repo URL
3. The container builds, `uv sync` and `npm install` run automatically — you're ready to go

### First steps

1. Rename `my_project/` to your Python package name; update `name` and `packages` in `pyproject.toml` to match
2. Fill in `CLAUDE.md` with your project description and game-specific conventions
3. Write your idea in `context/DESIGN-DOC.md`
4. Start talking to Claude Code

## Repo layout

```
kit/                   The Vue component kit (boardgame-vue-kit)
examples/drafting/     Sample consumer app: solo card-drafting
my_project/            Python package (rules engine / simulation — rename on use)
notebooks/             Jupyter notebooks
context/               Design docs and requirements
```

## Commands

```bash
# Vue kit
npm install
npm run story:dev      # Histoire playground at http://127.0.0.1:6006
npm run example:dev    # Sample card-drafting game at http://127.0.0.1:5173
npm run build          # Kit library build (ESM + .d.ts)
npm run typecheck      # vue-tsc on kit + example

# Python
uv sync                # Install dependencies
uv run pytest          # Run tests
uv run python <script> # Run a script
uv add <package>       # Add a runtime dependency
uv add --dev <package> # Add a dev dependency
```

## Using the kit in a consumer app

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
