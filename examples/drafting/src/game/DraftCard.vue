<script setup lang="ts">
import { Card, CardZone } from 'boardgame-vue-kit';
import { colorFor, type DraftCard } from './cards';

/**
 * DraftCard — a thin consumer wrapper over kit `<Card>`. Fills the
 * card's slots with DraftCard data (name, suit-colored icon,
 * keyword band, flavor text, points footer).
 *
 * This is the "game layer" for a drafting-style board game: the
 * card's identity comes from the data; the kit handles geometry,
 * states, slots, clip region, and size tokens.
 */
defineProps<{
  card: DraftCard;
  selected?: boolean;
  inactive?: boolean;
}>();
</script>

<template>
  <Card :selected="selected" :inactive="inactive" class="draft-card">
    <template #name>{{ card.name }}</template>

    <template #icon>
      <span class="draft-card__suit" :style="{ background: colorFor(card.suit) }">
        {{ card.suit.charAt(0).toUpperCase() }}
      </span>
    </template>

    <template #effect>
      <CardZone height="1.75rem" class="draft-card__keyword">
        {{ card.keyword }}
      </CardZone>
      <CardZone fill class="draft-card__flavor">
        {{ card.flavor }}
      </CardZone>
    </template>

    <template #footer>
      <span class="draft-card__points">{{ card.points }} pts</span>
    </template>
  </Card>
</template>

<style scoped>
.draft-card {
  cursor: pointer;
  transition: outline-color var(--motion-base);
}

.draft-card__suit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: var(--radius-pill);
  color: #000;
  font-weight: 700;
  font-size: 0.7rem;
}

.draft-card__keyword {
  font-weight: 600;
  color: var(--accent-blue);
  font-size: 7cqi;
}

.draft-card__flavor {
  font-style: italic;
  color: var(--text-muted);
  font-size: 6cqi;
  line-height: 1.3;
}

.draft-card__points {
  font-weight: 700;
  color: var(--accent-green);
  font-size: 8cqi;
}
</style>
