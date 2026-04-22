<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { Button, Zone, Scaled } from 'boardgame-vue-kit';
import { useDraftStore } from '../store';
import DraftCard from '../DraftCard.vue';

/**
 * Table — the game screen. Opponents across the top (miniature
 * tableaus via <Scaled>), player hand + pick controls at bottom,
 * running scores on the right.
 *
 * All UI chrome here uses Tailwind utilities — this is the screen
 * composition layer, not a piece. Cards themselves are <DraftCard>
 * (a thin kit-Card wrapper).
 */
const store = useDraftStore();
const {
  hands,
  tableaus,
  roundNumber,
  humanPick,
  gameOver,
  seats,
  scores,
  winnerIdx,
} = storeToRefs(store);

onMounted(() => {
  store.start();
});
</script>

<template>
  <div class="min-h-screen flex flex-col gap-4 p-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-accent-blue">Card Drafting</h1>
        <p class="text-sm text-text-muted">
          Round {{ roundNumber }} — pick a card, the rest pass to the next seat.
        </p>
      </div>
      <Button intent="ghost" @click="store.start()">New game</Button>
    </header>

    <!-- Opponent row: miniature tableaus for the 3 AIs. -->
    <section class="flex gap-4 flex-wrap">
      <div
        v-for="(name, seatIdx) in seats.slice(1)"
        :key="seatIdx + 1"
        class="flex-1 min-w-[14rem] p-3 rounded-md bg-bg-elevated border border-border"
      >
        <div class="flex items-baseline justify-between mb-2">
          <span class="font-semibold text-text-primary">{{ name }}</span>
          <span class="text-sm text-text-muted">{{ scores[seatIdx + 1] }} pts</span>
        </div>
        <div v-if="tableaus[seatIdx + 1].length" class="flex gap-1 flex-wrap">
          <Scaled
            v-for="(card, i) in tableaus[seatIdx + 1]"
            :key="i"
            :to="0.4"
          >
            <DraftCard :card="card" inactive />
          </Scaled>
        </div>
        <div v-else class="text-sm text-text-subtle italic">No picks yet</div>
      </div>
    </section>

    <!-- Own tableau. -->
    <section class="p-3 rounded-md bg-bg-elevated border border-border">
      <div class="flex items-baseline justify-between mb-2">
        <span class="font-semibold text-accent-green">Your tableau</span>
        <span class="text-sm text-text-muted">{{ scores[0] }} pts</span>
      </div>
      <Zone v-if="tableaus[0].length" layout="tableau" class="gap-2">
        <Scaled
          v-for="(card, i) in tableaus[0]"
          :key="i"
          :to="0.6"
        >
          <DraftCard :card="card" />
        </Scaled>
      </Zone>
      <div v-else class="text-sm text-text-subtle italic">
        No picks yet — click a card below, then Confirm.
      </div>
    </section>

    <div class="flex-1" />

    <!-- Current hand + pick controls. -->
    <footer class="flex flex-col items-center gap-4">
      <div v-if="gameOver" class="text-center">
        <div
          class="text-lg font-semibold"
          :class="winnerIdx === 0 ? 'text-accent-green' : 'text-text-primary'"
        >
          Game over — {{ winnerIdx === 0 ? 'You win!' : `${seats[winnerIdx ?? 0]} wins` }}
        </div>
        <div class="text-sm text-text-muted">
          Final score: {{ scores[0] }} pts
        </div>
      </div>

      <Zone
        v-else-if="hands.length && hands[0].length"
        layout="hand"
        label="Your hand"
      >
        <DraftCard
          v-for="(card, i) in hands[0]"
          :key="card.id"
          :card="card"
          :selected="humanPick === i"
          @click="store.pickCard(i)"
        />
      </Zone>

      <div class="flex gap-3">
        <Button
          v-if="!gameOver"
          intent="primary"
          :disabled="humanPick === null"
          @click="store.confirmPick()"
        >
          {{ humanPick === null ? 'Pick a card…' : 'Confirm pick' }}
        </Button>
      </div>
    </footer>
  </div>
</template>
