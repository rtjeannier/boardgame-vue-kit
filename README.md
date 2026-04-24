# boardgame-vue-kit

A Vue 3 component kit for building digital board games. Physical pieces render on canvas (via Konva); chrome renders on DOM; both share a single design-token vocabulary. Ships as a full-stack template: Vue kit + Python rules/analysis package + devcontainer + Claude Code config, ready to clone and start prototyping.

The idea is that a board game UI isn't a dashboard UI. Cards overlap, tokens stack, hands fan, drag-ghosts need to follow the cursor — all of that is painful in DOM and native in canvas. At the same time, dialogs and buttons are a solved problem in DOM and a pain in canvas. The kit puts each kind of thing where it belongs and gives them a shared theme so the seams don't show.

## Use this template

1. Click **Use this template** → **Create a new repository** on GitHub.
2. In VS Code, run **Dev Containers: Clone Repository in Container Volume…** with the new repo URL.
3. The container builds; `npm install` and `uv sync` run automatically.

Then:
- Rename `my_project/` to your Python package name; update `pyproject.toml`.
- Describe what you're building in `context/DESIGN-DOC.md`.
- Start talking to Claude Code.

## Repo layout

```
kit/                   The Vue component kit (boardgame-vue-kit)
examples/drafting/     Sample consumer: solo card-drafting game
my_project/            Python package (rules engine / simulation — rename on use)
notebooks/             Jupyter notebooks for analysis
context/               Design docs and requirements
```

Monorepo via npm workspaces on the JS side; `uv` manages Python.

## Commands

```bash
# JavaScript / Vue
npm install
npm run story:dev       # Histoire playground at http://127.0.0.1:6006
npm run example:dev     # Drafting example at http://127.0.0.1:5173
npm run build           # Kit library build (ESM + .d.ts)
npm run typecheck       # vue-tsc on kit + example

# Python
uv sync                 # Install dependencies
uv run pytest           # Run tests
uv add <package>        # Add a runtime dependency
```

## Using the kit

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import 'boardgame-vue-kit/variables.css';   // design tokens — load first
import './app.css';                          // your overrides + base styles
createApp(App).mount('#app');
```

```vue
<!-- Table.vue — a minimal canvas scene with a hand of cards and a prompt. -->
<script setup lang="ts">
import { ref } from 'vue';
import { Stage, Layer, Zone, Card, Button, Panel } from 'boardgame-vue-kit';
import { Text as VText } from 'vue-konva';

const hand = ref([
  { id: 1, name: 'Ironbrand', points: 3 },
  { id: 2, name: 'Moonarc',   points: 4 },
  { id: 3, name: 'Stormward', points: 3 },
]);
const picked = ref<number | null>(null);
const promptOpen = ref(true);
</script>

<template>
  <Stage :width="900" :height="400">
    <Layer>
      <Zone
        :count="hand.length"
        layout="hand"
        :x="40" :y="40" :width="820" :height="320"
        v-slot="{ index, x, y }"
      >
        <Card
          :x="x" :y="y"
          :name="hand[index].name"
          :selected="picked === index"
          @click="picked = index"
        >
          <template #footer="{ x: fx, y: fy, w, h }">
            <v-text :config="{
              x: fx, y: fy, width: w, height: h,
              text: `${hand[index].points} pts`,
              fontSize: 16, fontStyle: 'bold',
              fill: '#3fb950', align: 'right', verticalAlign: 'middle',
            }" />
          </template>
        </Card>
      </Zone>
    </Layer>
  </Stage>

  <Panel v-model:open="promptOpen" title="Pick a card" :x="600" :y="100">
    <p>Click a card to select it, then confirm.</p>
    <Button intent="primary" :disabled="picked === null">Confirm</Button>
  </Panel>
</template>
```

## What's in the kit

Three top-level buckets, one per rendering model:

| Bucket | Renders on | Components |
|---|---|---|
| `canvas/` | Konva infra | `Stage`, `Layer` |
| `physical/` | Konva pieces | `Zone`, `Board`, `Slot`, `Card`, `Token`, `Icon` |
| `digital/` | DOM + scoped CSS | `Button`, `Panel` |

Plus `composables/` (`useTheme`, `GameEngine` interface) and `theme/variables.css` (the shared design-token vocabulary).

Imports are flat — the buckets are a file-tree concern, not a packaging one:

```ts
import { Stage, Layer, Card, Button, Panel } from 'boardgame-vue-kit';
import type { GameEngine, Theme } from 'boardgame-vue-kit';
```

Every component has a Histoire story. Run `npm run story:dev` to browse.

## Architecture highlights

- **Physical ≠ digital.** Cards, tokens, boards render on Konva; buttons, panels render on DOM. You can't accidentally put a button on a board or model a card like a dialog — they live in different trees.
- **Zone is the universal container.** Everything that holds pieces is a Zone; it has bounds, a `layout` policy (`row` / `hand` / `stack` / `grid` / `free` / `col`), and an optional `#surface`. Zones nest freely. `Board` is just a Zone with a rendered surface; `Slot` is just a Zone that holds one piece with an empty-state affordance.
- **One theme, two rendering models.** `variables.css` is the source of truth. DOM components read CSS vars directly. Canvas components read them through `useTheme()`, which parses values at mount and refreshes on theme-toggle changes via a MutationObserver. Override `--accent-blue` once, both a Card and a Button update.
- **Panel, not Modal.** In-game popups (prompts, summaries) need the board visible behind them — so the popup primitive is a non-blocking draggable `Panel`, not a backdrop-blocking Modal. A true Modal is a follow-up if a website-level use case appears.
- **Escape hatch to raw Konva.** Every physical component exposes its root Konva node via `defineExpose({ node })`. When the declarative API can't express something — a tween, a custom hit region — grab the ref and work imperatively.

See [CLAUDE.md](./CLAUDE.md) for the architectural rules in full, and [`kit/src/physical/README.md`](./kit/src/physical/README.md) for the physical-layer contract.

## License

MIT
