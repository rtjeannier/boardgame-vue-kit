<docs lang="md">
# Panel

In-game floating window. Non-modal, draggable by header, minimizable,
no backdrop. The board behind stays visible and interactable —
in-game popups are part of the game experience.

Drag a panel by its header to move it. Click a panel to raise it
above any siblings. Escape closes (when not `persistent`).
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import Panel from './Panel.vue';
import Button from './Button.vue';

const openSingle = ref(true);
const openA = ref(true);
const openB = ref(true);
const openSummary = ref(true);
</script>

<template>
  <Story title="digital/chrome/Panel" group="Digital">
    <Variant title="Single panel (drag, minimize, close)">
      <div class="stage-like">
        <div class="stage-like__label">simulated board (stays visible behind panel)</div>
        <Panel
          v-model:open="openSingle"
          title="Choose a card to discard"
          :x="120"
          :y="120"
          :width="300"
        >
          <p class="muted">Pick one card from your hand. Board stays visible — drag this panel aside to see it.</p>
          <div class="row">
            <Button intent="primary">Discard</Button>
            <Button intent="ghost" @click="openSingle = false">Cancel</Button>
          </div>
        </Panel>
        <Button
          v-if="!openSingle"
          intent="ghost"
          class="reopen"
          @click="openSingle = true"
        >
          Reopen panel
        </Button>
      </div>
    </Variant>

    <Variant title="Two stacked panels (click raises z-order)">
      <div class="stage-like">
        <div class="stage-like__label">simulated board</div>
        <Panel v-model:open="openA" title="Panel A" :x="80" :y="120" :width="260">
          <p class="muted">Click either panel to raise it above the other.</p>
        </Panel>
        <Panel v-model:open="openB" title="Panel B" :x="200" :y="220" :width="260">
          <p class="muted">Drag from the header to move.</p>
        </Panel>
      </div>
    </Variant>

    <Variant title="Game-over summary (drag aside to see final board)">
      <div class="stage-like stage-like--tableau">
        <div class="stage-like__label">final tableau visible behind summary</div>
        <Panel
          v-model:open="openSummary"
          title="Game over"
          :x="240"
          :y="80"
          :width="280"
        >
          <p><strong>You win — 38 pts</strong></p>
          <ul class="scores">
            <li>You — 38 pts</li>
            <li>Gwen — 34 pts</li>
            <li>Maris — 29 pts</li>
            <li>Thom — 25 pts</li>
          </ul>
          <Button intent="primary">New game</Button>
        </Panel>
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
.stage-like {
  position: relative;
  width: 100%;
  height: 480px;
  background:
    repeating-linear-gradient(
      45deg,
      var(--bg-elevated),
      var(--bg-elevated) 10px,
      var(--bg-subtle) 10px,
      var(--bg-subtle) 20px
    );
  border-radius: var(--radius-soft);
  overflow: hidden;
}

.stage-like--tableau {
  background:
    linear-gradient(var(--bg-board), var(--bg-board)),
    radial-gradient(circle, var(--accent-blue) 0, transparent 40%);
  background-blend-mode: multiply;
}

.stage-like__label {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: var(--text-subtle);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.muted {
  color: var(--text-muted);
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
}

.scores {
  list-style: none;
  padding: 0;
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.reopen {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
}
</style>
