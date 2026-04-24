# boardgame-vue-kit

A polyglot board-game template. **`frontend/`** (Vue 3 + Konva) is a thin rendering layer. **`engine/`** (Python) owns all game rules, state, AI, and scoring. **`analysis/`** (Jupyter) explores engine output. The frontend never decides game outcomes — it renders whatever the engine produces.

## Repo layout

```
frontend/                    Vue 3 + Konva — rendering only
├── kit/                     Reusable UI primitives (canvas / physical / digital)
│   ├── canvas/              Stage, Layer (Konva infra)
│   ├── physical/            Zone, Board, Slot, Card, Token, Icon (Konva pieces)
│   ├── digital/             Button, Panel (DOM + scoped CSS)
│   ├── composables/         useTheme, GameEngine interface
│   ├── theme/variables.css  Design-token vocabulary
│   └── index.ts             Flat export surface
├── App.vue, main.ts, index.html, styles.css   App shell
├── histoire.config.ts, histoire.setup.ts       Component playground
└── package.json, vite.config.ts, tsconfig.json

engine/                      Python — rules, state, simulation, AI
└── (package source)

analysis/                    Jupyter notebooks

context/                     Design docs (DESIGN-DOC.md)
pyproject.toml               Python config
```

One JS workspace (`frontend/`), no monorepo scaffolding. Python via `uv` + `pyproject.toml` at the root.

## Commands

```bash
# Frontend — from frontend/
cd frontend
npm install
npm run dev             # App at :5173
npm run story:dev       # Histoire kit playground at :6006
npm run build           # Production build
npm run typecheck

# Engine — from repo root
uv sync                 # Install deps
uv run pytest           # Tests
uv add <pkg>            # Add runtime dep
uv add --dev <pkg>      # Add dev dep
```

## The architectural divide — rendering vs rules

The only test that matters for "does this belong in frontend or engine":

> *If I change the rendering (swap Konva for SVG, or build a CLI version), does this code still make sense?*

If **yes** → it's a rule. Lives in `engine/`.
If **no** → it's rendering. Lives in `frontend/`.

This means:
- Card data (suit, points, cost, effect text) → engine
- Hand dealing, turn order, scoring, AI → engine
- Which card is visually selected, animation state, panel position → frontend
- How a card looks when tapped/activated → frontend (it's a visual mapping of engine state)

The `GameEngine` interface (`frontend/kit/composables/engine.ts`) is the contract between the two. The frontend holds a reference to an engine and mirrors its state into Konva. The engine is currently Python, but the interface is agnostic — a TS mock, a Pyodide bridge, or a remote server all satisfy the same shape.

**Don't** build game logic in Pinia stores, Vue components, or `.ts` files in `frontend/`. If you catch yourself writing "if the card's suit is X then Y" in a Vue file, that logic belongs in engine.

## Frontend — the rules that matter

### Three buckets, one per rendering model

| Bucket | Renders on | What lives here |
|---|---|---|
| `canvas/` | Konva (infra) | `Stage`, `Layer`. Scaffolding; every canvas scene starts with `<Stage><Layer>…</Layer></Stage>`. |
| `physical/` | Konva + theme | Things you'd find in the game box: `Zone`, `Board`, `Slot`, `Card`, `Token`, `Icon`. Style themselves via Konva configs that read `useTheme()`. |
| `digital/` | DOM + scoped CSS | Chrome with no physical equivalent: `Button`, `Panel`. Style themselves via `<style scoped>` reading the same `variables.css` directly. |

These are not subfolders-for-tidiness — each bucket has a different rendering model, and they don't mix. A Card doesn't render on DOM. A Panel doesn't render on canvas. The file tree enforces it.

### Kit-boundary test

Before writing any kit code:

> *Would this word belong at home in Chess, Catan, Wingspan, Splendor, Ticket to Ride, or any other board game's rulebook?*

- **Yes** → kit-safe (`card`, `token`, `meeple`, `deck`, `hand`, `tableau`, `zone`, `slot`, `track`, `tapped`, `flipped`, `cube`, `tile`, `pawn`, `marker`, `round`).
- **No** → consumer-layer. It lives in game-specific wrappers, not the kit.

Kit primitives don't pre-enumerate visual conventions that are the consumer's choice. `<Icon>` doesn't decide whether glyphs are circles or squares. That's a consumer wrapper's call.

### Intrinsic-props rule

Props describe what the piece **is** (intrinsic content and state), never how it's displayed.

- ✅ `selected`, `tapped`, `inactive`, `name`, `costText` — intrinsic
- ❌ `size`, `scale`, `variant`, `compact` — display concerns

A piece's size is intrinsic to its type (`<Card :width="…">`), not a display knob. For ad-hoc resize, wrap in a Konva `<v-group :config="{ scaleX, scaleY }">` — don't add a prop.

### State → visual

Components mirror engine state into visuals. They never enforce rules.

- **Canvas components** translate state into computed Konva configs (stroke color for `selected`, rotation for `tapped`, opacity for `inactive`). No scoped CSS — Konva doesn't read it.
- **DOM components** put state on `data-*` attributes; scoped CSS selects on presence (`.btn[data-intent='primary']`).

Either way: state in → visual out. No `if (rules.canTap(card))` in a component — the engine decides `tapped`, the component just renders it.

### Zone is the universal container

"A space where components can be placed." Zones nest freely, have bounds, a `layout` policy (`row` / `col` / `hand` / `stack` / `grid` / `free`), and an optional `#surface` slot for rendered backgrounds.

- **`Board`** is a thin wrapper over `Zone` that fills `#surface` with the themed playing-surface preset.
- **`Slot`** is a thin wrapper that holds exactly one piece and paints an empty-state outline when unfilled.

Zone's default slot is **scoped** — it gets called once per index with `{ index, x, y, w, h }`. Consumers use those positions to place pieces:

```vue
<Zone :count="hand.length" layout="hand" :x="0" :y="500" :width="900" :height="220"
      v-slot="{ index, x, y }">
  <Card :x="x" :y="y" :name="hand[index].name" />
</Zone>
```

Pieces don't know what layout they're in. Zone computes positions.

### Canvas slots are positioned

Named slots on canvas components (e.g., `#cost`, `#name`, `#effect`, `#footer` on Card) are scoped with `{ x, y, w, h }` in parent-local coordinates. Consumers paint Konva nodes (`<v-text>`, `<v-image>`, `<v-rect>`, nested kit components) inside, using those coords to place content.

Empty slots fall back to data-driven defaults (e.g., `<Card name="…">` renders default name text when `#name` isn't filled). Don't plumb rendering decisions into props — let the consumer fill a slot if they want custom.

### Panel, not Modal

In-game popups — pick-a-card prompts, end-of-game summaries, card-detail views — are **part of the game experience**. The player needs to see and reason about the board while the popup is open. So the primitive is `<Panel>`: DOM, draggable, minimizable, **no backdrop**, non-blocking. Click a panel to raise it; Escape to close (unless `persistent`).

A blocking `Modal` (backdrop + focus trap) would be for *website-level* chrome (settings, credits) and is not shipped yet. If that use case appears, add a separate component — don't jam both behaviors into one.

### Theme: one source of truth, two readers

`frontend/kit/theme/variables.css` owns every radius, shadow, motion, size, color, and z-index. It's the vocabulary.

- **DOM components** read CSS vars directly in scoped CSS: `background: var(--accent-blue)`.
- **Canvas components** read through `useTheme()`, which parses the same vars at mount and refreshes on theme-toggle changes via a `MutationObserver`. `<Stage>` calls `provideTheme()`; every descendant `inject`s.

Override `--accent-blue` once in a consumer stylesheet loaded after `variables.css`, and both a `<Card>` and a `<Button>` pick it up.

**No Tailwind.** The kit has no utility-class dependency. Tailwind is not installed. Base page styles live in `frontend/styles.css`.

### Imperative Konva handle

Every physical component exposes its root Konva node:

```vue
<Card ref="cardRef" :selected="picked" />
<script setup>
import { ref } from 'vue';
const cardRef = ref();
function flipIt() { cardRef.value?.node?.to({ rotation: 180, duration: 0.3 }); }
</script>
```

This is the escape hatch for things the declarative API can't express — tweens, custom hit regions, direct canvas drawing. Not a headline pattern; just there when needed.

### Flat exports

`frontend/kit/index.ts` re-exports everything flat. Consumers import from `./kit` (or the `@kit` alias) regardless of which bucket a component lives in. Buckets are a contributor concern.

## Engine (Python) conventions

- Python ≥ 3.10, modern syntax (type hints, match statements, dict union).
- `uv` for dependency management — never pip.
- One responsibility per module.
- Tests in `engine/tests/` or a top-level `tests/` directory, mirroring the package structure.
- The engine **never** imports from the frontend. The frontend imports the `GameEngine` interface type; an adapter implements it.

## Style guide for AI collaborators

- **Don't write game logic in `frontend/`.** Rules, scoring, AI, deal logic belong in `engine/`.
- **Don't hardcode magic numbers** in kit scoped CSS or Konva configs. Read from `variables.css` via `useTheme()`. If the vocabulary is missing, extend it.
- **Don't add game-specific words** to `kit/` components. "Gold", "combat", "prestige" belong in consumer wrappers.
- **Don't add display-variant props** to pieces (`size`, `compact`). Size is intrinsic or comes from a wrapping Konva group.
- **Do write a Histoire story** for any new kit component or meaningful variant. Stories are how consumers discover what the kit can do.
- **Do keep the public API small.** Export from `frontend/kit/index.ts` only what consumers need.
- **Do put popups in a `<Panel>`** unless a true website-level blocking dialog is specifically needed.

## Context

- `context/DESIGN-DOC.md` — fill in before making significant architectural decisions.
- `frontend/kit/physical/README.md` — the physical-layer contract in depth.
