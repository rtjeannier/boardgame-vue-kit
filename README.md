# boardgame-vue-kit

A polyglot template for prototyping digital board games. Vue 3 + Konva on the frontend for rendering; Python on the backend for rules; Jupyter for analysis. Ships as a devcontainer + Claude Code scaffolding so you can clone, open in VS Code, and start building.

## Why

Board game UIs aren't dashboards. Pieces overlap, hands fan, tokens stack, drag-ghosts follow the cursor — all painful in DOM and native in canvas. Dialogs and buttons are the opposite. So the kit renders **physical things** (cards, tokens, boards) on Konva canvas, **digital chrome** (buttons, panels) on DOM, and shares one design-token vocabulary so the seams don't show. Game rules live in Python so they're testable, simulatable, and don't tangle with rendering.

## Use this template

1. Click **Use this template** → **Create a new repository** on GitHub.
2. In VS Code: **Dev Containers: Clone Repository in Container Volume…** with the new repo URL.
3. The container builds; `uv sync` and `npm install` run automatically.

Then:
- Rename the Python package (`engine/` + `pyproject.toml`'s `name`) to your project.
- Describe your game in `context/DESIGN-DOC.md`.
- Start talking to Claude Code.

## Repo layout

```
frontend/         Vue 3 + Konva — thin rendering layer
├── kit/          Reusable UI primitives (canvas / physical / digital)
├── App.vue       Starter screen — replace with your game
├── main.ts       Entry point
├── index.html, index.css, vite.config.ts, ...
engine/           Python — game rules, state, AI, scoring
analysis/         Jupyter notebooks
context/          Design docs
.devcontainer/    Dev container config
pyproject.toml    Python config (engine deps)
```

The frontend stays thin on purpose: it renders whatever `engine/` produces. Game rules never live in `frontend/`.

## Commands

```bash
# Frontend
cd frontend
npm install
npm run dev             # App at http://127.0.0.1:5173
npm run story:dev       # Kit playground (Histoire) at :6006
npm run build           # Production app build
npm run typecheck

# Engine (Python)
uv sync                 # Install deps (pyproject.toml)
uv run pytest           # Run tests
uv add <pkg>            # Add runtime dep
uv add --dev <pkg>      # Add dev dep

# Analysis
uv run jupyter lab      # Notebooks
```

## Architecture at a glance

```
        ┌───────────────────────────────────────────────┐
engine/ │  Rules, state transitions, AI, scoring        │  ←── testable, simulatable
        └──────────────────────┬────────────────────────┘
                               │  GameEngine interface
        ┌──────────────────────▼────────────────────────┐
        │  kit/                    (reusable primitives)│
frontend│  ┌─────────┐  ┌─────────────┐  ┌───────────┐ │
/       │  │ canvas/ │  │ physical/   │  │ digital/  │ │
        │  │ Konva   │  │ Konva+theme │  │ DOM+CSS   │ │
        │  └─────────┘  └─────────────┘  └───────────┘ │
        │         (shared theme: kit/theme/variables.css)│
        └───────────────────────────────────────────────┘
```

- **`engine/`** decides. **`frontend/`** renders.
- The kit's three buckets each have a distinct rendering model. Stage/Layer are Konva scaffolding. Cards, tokens, boards render on Konva and read the shared theme through `useTheme()`. Buttons and panels are DOM + scoped CSS that read the same theme via CSS variables directly.

See [CLAUDE.md](./CLAUDE.md) for the architectural rules in full.

## Using the kit

```vue
<!-- frontend/App.vue — replace this with your game. -->
<script setup lang="ts">
import { ref } from 'vue';
import { Stage, Layer, Zone, Card, Button, Panel } from './kit';

const hand = ref([{ id: 1, name: 'Ironbrand' }, { id: 2, name: 'Moonarc' }]);
const picked = ref<number | null>(null);
</script>

<template>
  <Stage :width="800" :height="400">
    <Layer>
      <Zone
        :count="hand.length"
        layout="hand"
        :x="40" :y="60" :width="720" :height="260"
        v-slot="{ index, x, y }"
      >
        <Card
          :x="x" :y="y"
          :name="hand[index].name"
          :selected="picked === index"
          @click="picked = index"
        />
      </Zone>
    </Layer>
  </Stage>

  <Panel v-model:open title="Pick a card" :x="500" :y="80" :width="240">
    <Button intent="primary" :disabled="picked === null">Confirm</Button>
  </Panel>
</template>
```

## What's in the kit

| Bucket | Renders on | Components |
|---|---|---|
| `canvas/` | Konva infra | `Stage`, `Layer` |
| `physical/` | Konva pieces | `Zone`, `Board`, `Slot`, `Card`, `Token`, `Icon` |
| `digital/` | DOM + scoped CSS | `Button`, `Panel` |

Plus `composables/` (`useTheme`, the `GameEngine` interface) and `theme/variables.css` (the design-token vocabulary shared by both rendering models).

Every component has a Histoire story. `npm run story:dev` to browse.

## License

MIT
