<script setup lang="ts">
/**
 * Table — the drafting game screen.
 *
 * Canvas (physical): one Layer holds the whole play surface. Drafting
 * is a board-less game — cards float on the table — so there's no
 * <Board>; the top-level structure is nested Zones directly in the
 * Layer (Zone-in-Layer is a first-class pattern, not a fallback).
 *
 *   Stage
 *   └─ Layer
 *      ├─ Zone layout="row" — opponent mini-tableaus (3 cols)
 *      ├─ Zone layout="row" — player's own tableau
 *      └─ Zone layout="hand" — player's current hand (clickable)
 *
 * DOM (digital): header, "Confirm pick" button, and the end-of-game
 * Panel. The Panel is non-blocking — when the game ends, the player
 * can drag the summary aside and the final tableau stays visible on
 * the canvas underneath.
 */
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Button, Panel, Stage, Layer, Zone } from 'boardgame-vue-kit';
import { Text as VText } from 'vue-konva';
import { useDraftStore } from '../store';
import DraftCard from '../DraftCard.vue';

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

// Canvas dimensions — responsive to viewport.
const stageSize = ref({ w: 1000, h: 640 });
function measure() {
  const wrap = canvasWrap.value;
  if (!wrap) return;
  const rect = wrap.getBoundingClientRect();
  stageSize.value = {
    w: Math.max(720, Math.floor(rect.width)),
    h: Math.max(560, Math.floor(rect.height)),
  };
}
const canvasWrap = ref<HTMLElement | null>(null);
let resizeObs: ResizeObserver | undefined;
onMounted(() => {
  measure();
  if (typeof ResizeObserver !== 'undefined' && canvasWrap.value) {
    resizeObs = new ResizeObserver(measure);
    resizeObs.observe(canvasWrap.value);
  }
});
onBeforeUnmount(() => resizeObs?.disconnect());

// Layout constants.
const MARGIN = 24;
const OPPONENT_CARD_W = 60;
const OPPONENT_CARD_H = 84;
const PLAYER_TABLEAU_CARD_W = 100;
const PLAYER_TABLEAU_CARD_H = 140;

const layout = computed(() => {
  const { w, h } = stageSize.value;
  const opponentRowY = MARGIN;
  const opponentRowH = 120;
  const playerTableauY = opponentRowY + opponentRowH + MARGIN;
  const playerTableauH = PLAYER_TABLEAU_CARD_H + 12;
  const handY = h - 240;
  return {
    stageW: w,
    stageH: h,
    opponentRow: { x: MARGIN, y: opponentRowY, w: w - MARGIN * 2, h: opponentRowH },
    playerTableau: { x: MARGIN, y: playerTableauY, w: w - MARGIN * 2, h: playerTableauH },
    hand: { x: MARGIN, y: handY, w: w - MARGIN * 2, h: 220 },
  };
});

function pickCard(index: number) {
  store.pickCard(index);
}

// Panel is open while game is over.
const summaryOpen = computed({
  get: () => gameOver.value,
  set: () => { /* closing the summary is a no-op; user starts a new game */ },
});
const initialPanelX = computed(() => Math.max(20, stageSize.value.w - 320));
</script>

<template>
  <div class="page">
    <header class="page__header">
      <div>
        <h1 class="page__title">Card Drafting</h1>
        <p class="page__sub">
          Round {{ roundNumber }} — pick a card, the rest pass to the next seat.
        </p>
      </div>
      <Button intent="ghost" @click="store.start()">New game</Button>
    </header>

    <div ref="canvasWrap" class="page__canvas">
      <Stage :width="layout.stageW" :height="layout.stageH">
        <Layer>
          <!-- Opponent row: 3 opponents laid out horizontally, each with a mini-tableau. -->
          <Zone
            :count="3"
            layout="row"
            :x="layout.opponentRow.x"
            :y="layout.opponentRow.y"
            :width="layout.opponentRow.w"
            :height="layout.opponentRow.h"
            :cell-width="(layout.opponentRow.w - 32) / 3"
            :cell-height="layout.opponentRow.h"
            :gap="16"
            v-slot="{ x: seatX, y: seatY, w: seatW, h: seatH, index: seatOffset }"
          >
            <!-- Seat label + score. -->
            <v-text
              :config="{
                x: seatX,
                y: seatY,
                width: seatW,
                text: `${seats[seatOffset + 1]} — ${scores[seatOffset + 1]} pts`,
                fontSize: 14,
                fontStyle: 'bold',
                fill: '#c9d1d9',
              }"
            />
            <!-- Nested Zone: mini-tableau for this opponent. -->
            <Zone
              :count="tableaus[seatOffset + 1].length"
              layout="row"
              :x="seatX"
              :y="seatY + 20"
              :width="seatW"
              :height="seatH - 20"
              :cell-width="OPPONENT_CARD_W"
              :cell-height="OPPONENT_CARD_H"
              :gap="4"
              v-slot="{ x, y, index: cardIdx }"
            >
              <DraftCard
                :card="tableaus[seatOffset + 1][cardIdx]"
                :x="x"
                :y="y"
                :width="OPPONENT_CARD_W"
                :height="OPPONENT_CARD_H"
                inactive
              />
            </Zone>
          </Zone>

          <!-- Player's own tableau. -->
          <v-text
            :config="{
              x: layout.playerTableau.x,
              y: layout.playerTableau.y - 20,
              text: `Your tableau — ${scores[0]} pts`,
              fontSize: 14,
              fontStyle: 'bold',
              fill: '#3fb950',
            }"
          />
          <Zone
            :count="tableaus[0].length"
            layout="row"
            :x="layout.playerTableau.x"
            :y="layout.playerTableau.y"
            :width="layout.playerTableau.w"
            :height="layout.playerTableau.h"
            :cell-width="PLAYER_TABLEAU_CARD_W"
            :cell-height="PLAYER_TABLEAU_CARD_H"
            :gap="8"
            v-slot="{ x, y, index }"
          >
            <DraftCard
              :card="tableaus[0][index]"
              :x="x"
              :y="y"
              :width="PLAYER_TABLEAU_CARD_W"
              :height="PLAYER_TABLEAU_CARD_H"
            />
          </Zone>

          <!-- Player's current hand (if game isn't over). -->
          <template v-if="!gameOver && hands.length && hands[0].length">
            <v-text
              :config="{
                x: layout.hand.x,
                y: layout.hand.y - 20,
                text: 'Your hand — click to pick',
                fontSize: 14,
                fontStyle: 'bold',
                fill: '#58a6ff',
              }"
            />
            <Zone
              :count="hands[0].length"
              layout="hand"
              :x="layout.hand.x"
              :y="layout.hand.y"
              :width="layout.hand.w"
              :height="layout.hand.h"
              :gap="16"
              v-slot="{ x, y, index }"
            >
              <DraftCard
                :card="hands[0][index]"
                :x="x"
                :y="y"
                :selected="humanPick === index"
                @click="pickCard(index)"
              />
            </Zone>
          </template>
        </Layer>
      </Stage>
    </div>

    <footer class="page__footer">
      <Button
        v-if="!gameOver"
        intent="primary"
        :disabled="humanPick === null"
        @click="store.confirmPick()"
      >
        {{ humanPick === null ? 'Pick a card…' : 'Confirm pick' }}
      </Button>
    </footer>

    <!-- End-of-game summary: non-blocking Panel. Drag aside to see the
         final tableau on canvas. -->
    <Panel
      v-model:open="summaryOpen"
      title="Game over"
      :x="initialPanelX"
      :y="80"
      :width="300"
      persistent
    >
      <p class="summary__headline">
        {{ winnerIdx === 0 ? 'You win!' : `${seats[winnerIdx ?? 0]} wins` }}
      </p>
      <ul class="summary__scores">
        <li v-for="(s, i) in scores" :key="i" :class="{ 'summary__scores--me': i === 0 }">
          <span>{{ seats[i] }}</span>
          <span>{{ s }} pts</span>
        </li>
      </ul>
      <Button intent="primary" @click="store.start()">New game</Button>
    </Panel>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  gap: 1rem;
  padding: 1.5rem;
}

.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.page__title {
  margin: 0;
  color: var(--accent-blue);
  font-size: 1.25rem;
  font-weight: 700;
}

.page__sub {
  margin: 0.25rem 0 0;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.page__canvas {
  flex: 1;
  min-height: 560px;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.page__footer {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.summary__headline {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--accent-green);
}

.summary__scores {
  list-style: none;
  padding: 0;
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary__scores li {
  display: flex;
  justify-content: space-between;
}

.summary__scores--me {
  color: var(--accent-green);
  font-weight: 600;
}
</style>
