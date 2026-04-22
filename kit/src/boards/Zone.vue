<script setup lang="ts">
/**
 * Zone — a named region that holds pieces (cards, tokens, anything).
 *
 * Zones own **arrangement**, not size. The pieces inside a zone render
 * at their own intrinsic size; the zone decides how they're positioned
 * relative to one another.
 *
 * Layouts are named policies. Kit ships the common ones; games can
 * extend via custom styles on a Zone instance (inheritance on the root
 * `data-layout` attribute lets scoped CSS layer on).
 *
 *   row      — even horizontal row.
 *   hand     — fanned horizontal row with overlap and hover-lift.
 *   stack    — vertical pile; children offset diagonally.
 *   tableau  — wrap-to-fill grid of pieces on a flat surface.
 *   draft    — large, spaced row for card-picking UX.
 *   column   — vertical stack with gap.
 *
 * All styling lives in the scoped block below; components inside the
 * zone don't need to know which layout they're in. If a piece needs
 * layout-conditional behavior (hand cards lift on hover), the Zone's
 * CSS decorates descendants via `.zone[data-layout='hand'] > *`.
 */
export type ZoneLayout =
  | 'row'
  | 'hand'
  | 'stack'
  | 'tableau'
  | 'draft'
  | 'column';

defineProps<{
  layout?: ZoneLayout;
  /** ARIA role for screen readers; defaults to 'group'. */
  role?: string;
  /** Human-readable label, exposed to assistive tech. */
  label?: string;
}>();
</script>

<template>
  <div
    class="zone"
    :data-layout="layout ?? 'row'"
    :role="role ?? 'group'"
    :aria-label="label"
  >
    <slot />
  </div>
</template>

<style scoped>
.zone {
  display: flex;
  gap: var(--gap-normal);
  align-items: center;
}

/* row — straightforward horizontal line. */
.zone[data-layout='row'] {
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
}

/* column — vertical. */
.zone[data-layout='column'] {
  flex-direction: column;
  align-items: stretch;
}

/* hand — a row with cards overlapping slightly and lifting on hover.
 * Negative gap produces the overlap; hover lifts for visibility. */
.zone[data-layout='hand'] {
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  gap: -1.25rem;
  padding: var(--gap-wide) calc(var(--gap-wide) * 2);
}
.zone[data-layout='hand'] > * {
  transition: translate var(--motion-base), z-index 0s;
  position: relative;
}
.zone[data-layout='hand'] > *:hover {
  translate: 0 calc(var(--gap-loose) * -1);
  z-index: 2;
}

/* stack — pile. First child is the base; subsequent offset progressively
 * via --stack-step. Independent `translate` so it composes with any
 * piece-level tap/select transforms. */
.zone[data-layout='stack'] {
  position: relative;
  min-width: var(--card-w);
  min-height: var(--card-h);
  display: block;
}
.zone[data-layout='stack'] > * {
  position: absolute;
  top: 0;
  left: 0;
}
.zone[data-layout='stack'] > *:nth-child(2)  { translate: var(--stack-step) var(--stack-step); }
.zone[data-layout='stack'] > *:nth-child(3)  { translate: calc(var(--stack-step) * 2) calc(var(--stack-step) * 2); }
.zone[data-layout='stack'] > *:nth-child(4)  { translate: calc(var(--stack-step) * 3) calc(var(--stack-step) * 3); }
.zone[data-layout='stack'] > *:nth-child(n+5) { translate: calc(var(--stack-step) * 4) calc(var(--stack-step) * 4); }

/* tableau — cards laid out flat on the table. Wrapping grid feel. */
.zone[data-layout='tableau'] {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--gap-loose);
  padding: var(--gap-normal);
}

/* draft — spotlight a few cards with breathing room. */
.zone[data-layout='draft'] {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: calc(var(--gap-wide) * 1.75);
  padding: calc(var(--gap-wide) * 2);
}
</style>
