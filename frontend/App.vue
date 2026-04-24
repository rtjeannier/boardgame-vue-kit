<script setup lang="ts">
/**
 * Template starter screen. Replace this with your game.
 *
 * The frontend is meant to be thin: it renders whatever the engine
 * produces. Game rules, state transitions, AI — all of that lives in
 * `engine/`, not here. This file is the shell that mounts the
 * rendering and hands user input back to the engine.
 */
import { ref } from 'vue';
import { Stage, Layer, Zone, Card, Panel, Button } from './kit';

const demoHand = [
  { id: 1, name: 'Ironbrand' },
  { id: 2, name: 'Moonarc' },
  { id: 3, name: 'Stormward' },
];
const picked = ref<number | null>(null);
const promptOpen = ref(true);
</script>

<template>
  <main class="welcome">
    <header class="welcome__head">
      <h1>boardgame-vue-kit</h1>
      <p>
        Replace <code>frontend/App.vue</code> with your game's root screen.
        Run <code>npm run story:dev</code> to browse the kit components.
      </p>
    </header>

    <Stage :width="720" :height="360">
      <Layer>
        <Zone
          :count="demoHand.length"
          layout="hand"
          :x="40" :y="60" :width="640" :height="260"
          v-slot="{ index, x, y }"
        >
          <Card
            :x="x" :y="y"
            :name="demoHand[index].name"
            :selected="picked === index"
            @click="picked = index"
          />
        </Zone>
      </Layer>
    </Stage>

    <Panel
      v-model:open="promptOpen"
      title="Pick a card"
      :x="480"
      :y="100"
      :width="240"
    >
      <p class="muted">Click a card, then confirm.</p>
      <Button intent="primary" :disabled="picked === null">Confirm</Button>
    </Panel>
  </main>
</template>

<style scoped>
.welcome {
  padding: 2rem;
  max-width: 64rem;
  margin: 0 auto;
}

.welcome__head {
  margin-bottom: 1.5rem;
}

.welcome__head h1 {
  margin: 0 0 0.25rem;
  color: var(--accent-blue);
  font-size: 1.5rem;
}

.welcome__head p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.welcome__head code {
  background: var(--bg-subtle);
  padding: 0.1rem 0.35rem;
  border-radius: var(--radius-rounded);
  font-size: 0.85em;
}

.muted {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0 0 0.75rem;
}
</style>
