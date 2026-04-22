<script setup lang="ts">
/**
 * Deck — a pile of cards (draw deck, discard pile, event deck).
 *
 * Sizing follows the same contract as <Card>: size comes from
 * --card-w / --card-h CSS vars set on a parent (usually the game-level
 * component wrapping Deck, or the Zone it sits in). Deck itself has no
 * size prop — size is intrinsic to the card type, not a knob on the
 * render.
 *
 * M1.5 stub: renders a stacked face placeholder + count badge. Real
 * implementation lands in Milestone 3 (debug panel + event deck viewer).
 *
 * Planned when fleshed out:
 *   - #top slot for the top-card preview (a <Card> component)
 *   - emits @peek, @draw, @shuffle for game-side interactions
 */
defineProps<{
  count?: number;
  faceUp?: boolean;
}>();
</script>

<template>
  <div class="deck" :data-face="faceUp ? 'up' : 'down'">
    <div class="deck__stack">
      <slot name="top" />
    </div>
    <span v-if="count !== undefined" class="deck__count">{{ count }}</span>
  </div>
</template>

<style scoped>
.deck {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--card-w);
  height: var(--card-h);
  border-radius: var(--radius-soft);
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-press);
}

.deck__stack {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deck__count {
  position: absolute;
  bottom: var(--gap-snug);
  right: var(--gap-snug);
  padding: var(--gap-tight) var(--gap-snug);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--bg-subtle);
  border-radius: var(--radius-rounded);
}
</style>
