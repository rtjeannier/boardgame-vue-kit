<script setup lang="ts">
import FitText from '@kit/layout/FitText.vue';

/**
 * Token — a physical game piece.
 *
 * Distinct from Icon. Icons are glyphs; Tokens are pieces. A Token has
 * a shape and a color; it may wear an Icon (or a label, or anything)
 * via the default slot.
 *
 * State (shape, size, color, fill) lives on data-* attributes; all
 * visual decisions reference variables from kit/theme/variables.css. Override
 * by setting a more specific CSS var on the wrapping component.
 */
defineProps<{
  shape?: 'disc' | 'cube' | 'meeple' | 'cylinder' | 'square' | 'custom';
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  /** Scale to fill parent Slot instead of using `size`. */
  fill?: boolean;
}>();
</script>

<template>
  <span
    class="token"
    :data-shape="shape ?? 'disc'"
    :data-size="size ?? 'md'"
    :data-fill="fill || null"
    :style="{ background: color }"
  >
    <slot>
      <FitText v-if="label" class="token__label">{{ label }}</FitText>
    </slot>
  </span>
</template>

<style scoped>
.token {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  user-select: none;
  box-shadow: var(--shadow-piece);
  background: var(--border);
}

/* Size + interior padding so labels don't touch the edge. Padding
 * is a concrete px value per size (% and cqi don't compose cleanly
 * for a small primitive; see Icon.vue). */
.token[data-fill]                       { width: 100%; height: 100%; padding: 4px; }
.token:not([data-fill])[data-size='xs'] { width: var(--size-xs); height: var(--size-xs); padding: 2px; }
.token:not([data-fill])[data-size='sm'] { width: var(--size-sm); height: var(--size-sm); padding: 2px; }
.token:not([data-fill])[data-size='md'] { width: var(--size-md); height: var(--size-md); padding: 3px; }
.token:not([data-fill])[data-size='lg'] { width: var(--size-lg); height: var(--size-lg); padding: 4px; }
.token:not([data-fill])[data-size='xl'] { width: var(--size-xl); height: var(--size-xl); padding: 6px; }

/* Shape — every radius / clip-path comes from named tokens. */
.token[data-shape='disc']     { border-radius: var(--radius-pill); }
.token[data-shape='cube']     { border-radius: var(--radius-chamfer); }
.token[data-shape='square']   { border-radius: var(--radius-sharp); }
.token[data-shape='cylinder'] {
  /* Faux-3D: chip/poker look. The side-shadow in --shadow-cylinder is
   * --depth-chunky pixels tall; we translate up by the same amount so
   * the element sits at the visual top of the chip and the shadow
   * reads as its physical thickness. Override --depth-chunky at the
   * game level to get thicker casino chips or thinner dime-sized
   * markers — both the side and the lift update together. */
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-cylinder);
  translate: 0 calc(var(--depth-chunky) * -1);
}
.token[data-shape='meeple']   { border-radius: var(--radius-pill); clip-path: var(--clip-meeple); }
.token[data-shape='custom']   { /* caller applies their own shape via class */ }

.token__label {
  color: rgb(0 0 0 / 0.8);
  font-weight: 700;
  width: 100%;
  height: 100%;
}
</style>
