import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { DECK, shuffled, type DraftCard } from './cards';

/**
 * Drafting store — 4 seats (1 human + 3 random AIs), each dealt 5
 * cards. Players all pick simultaneously; after each round, hands
 * rotate clockwise. Continues until hands are empty.
 *
 * Human at seat 0. AIs at 1, 2, 3 — they pick the highest-points
 * card in their hand (deterministic, good enough for a demo).
 */

const SEATS = 4;
const CARDS_PER_SEAT = 5;

export const useDraftStore = defineStore('draft', () => {
  const hands = ref<DraftCard[][]>([]);
  const tableaus = ref<DraftCard[][]>([[], [], [], []]);
  const roundNumber = ref(1);
  const humanPick = ref<number | null>(null);
  const gameOver = ref(false);
  const seats = ['You', 'Gwen', 'Maris', 'Thom'];

  function start(seed = Math.floor(Math.random() * 1_000_000)) {
    const deck = shuffled(DECK, seed).slice(0, SEATS * CARDS_PER_SEAT);
    hands.value = [];
    for (let i = 0; i < SEATS; i++) {
      hands.value.push(deck.slice(i * CARDS_PER_SEAT, (i + 1) * CARDS_PER_SEAT));
    }
    tableaus.value = [[], [], [], []];
    roundNumber.value = 1;
    humanPick.value = null;
    gameOver.value = false;
  }

  /** AI pick: highest-points card in their hand, ties go to first. */
  function aiPick(handIdx: number): number {
    const hand = hands.value[handIdx];
    let best = 0;
    for (let i = 1; i < hand.length; i++) {
      if (hand[i].points > hand[best].points) best = i;
    }
    return best;
  }

  /** Human locks in their pick; AIs pick, tableaus update, hands pass. */
  function confirmPick() {
    if (humanPick.value === null || gameOver.value) return;
    const picks = [humanPick.value];
    for (let i = 1; i < SEATS; i++) picks.push(aiPick(i));

    // Each player adds their pick to their tableau and removes it from hand.
    const newHands: DraftCard[][] = [];
    for (let i = 0; i < SEATS; i++) {
      const card = hands.value[i][picks[i]];
      tableaus.value[i] = [...tableaus.value[i], card];
      newHands.push(hands.value[i].filter((_, idx) => idx !== picks[i]));
    }

    // Pass remaining hands clockwise (seat N gets seat N-1's leftovers).
    const rotated: DraftCard[][] = [];
    for (let i = 0; i < SEATS; i++) {
      rotated[i] = newHands[(i - 1 + SEATS) % SEATS];
    }
    hands.value = rotated;

    humanPick.value = null;
    roundNumber.value += 1;

    if (hands.value[0].length === 0) gameOver.value = true;
  }

  function pickCard(index: number) {
    if (gameOver.value) return;
    humanPick.value = index;
  }

  const scores = computed(() =>
    tableaus.value.map((t) => t.reduce((sum, c) => sum + c.points, 0)),
  );

  const winnerIdx = computed(() => {
    if (!gameOver.value) return null;
    let best = 0;
    for (let i = 1; i < scores.value.length; i++) {
      if (scores.value[i] > scores.value[best]) best = i;
    }
    return best;
  });

  return {
    hands,
    tableaus,
    roundNumber,
    humanPick,
    gameOver,
    seats,
    scores,
    winnerIdx,
    start,
    pickCard,
    confirmPick,
  };
});
