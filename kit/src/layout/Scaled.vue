<script setup lang="ts">
/**
 * Scaled — wrap a piece to render it at a different visual scale.
 *
 * The primitive for "I want this card smaller as a tooltip preview" or
 * "opponent tableau shows mini versions of their cards." Scale is a
 * *display* concern, not a property of the piece itself (see CLAUDE.md
 * rule 22). A BuildingCard is always building-card sized; wrap it in
 * <Scaled :to="0.5"> to render it half-size, not by toggling a prop.
 *
 * Uses CSS `transform: scale()` + shrunken bounding box so the scaled
 * piece occupies proportional layout space (not its natural size with
 * a scaled transform overflowing).
 */
withDefaults(
  defineProps<{
    /** Scale factor: 1.0 = natural, 0.5 = half, 2.0 = double. */
    to?: number;
    /** Transform origin. Defaults to top-left so scaled content aligns
     *  to the top-left of its layout box. */
    origin?: string;
  }>(),
  { to: 1, origin: 'top left' },
);
</script>

<template>
  <span
    class="scaled"
    :style="{
      '--scale': to,
      '--origin': origin,
    }"
  >
    <span class="scaled__inner">
      <slot />
    </span>
  </span>
</template>

<style scoped>
/* Outer span reserves proportional layout space by shrinking in both
 * axes; inner span holds the natural-size child but applies the
 * scale() transform. Gives correct flex/grid sizing with a
 * visually-scaled child. */
.scaled {
  display: inline-block;
  /* Math: child occupies scale * natural width, scale * natural height. */
  transform-origin: var(--origin);
}

.scaled__inner {
  display: inline-block;
  transform: scale(var(--scale));
  transform-origin: var(--origin);
  /* Shrink our layout box by the same factor so parents lay us out
   * at the scaled size. Works because transform + this trick aligns
   * visual bounds to layout bounds. */
  width: calc(100% / var(--scale));
  height: calc(100% / var(--scale));
}
</style>
