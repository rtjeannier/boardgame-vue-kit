<script setup lang="ts">
/**
 * Card — a bordered artifact with named content slots.
 *
 * Slots (each optional, each independently composable):
 *   #frame   — full-bleed background (skins, foils). Behind everything.
 *   #art     — illustration above the name.
 *   #icon    — corner emblem.
 *   #name    — title row (bold).
 *   #cost    — cost markers.
 *   #effect  — the card's effect body. Caller composes freely. For
 *              cards with multiple effect kinds (rates + rules text,
 *              or any combination), wrap each kind in <CardZone> so
 *              each zone has reserved vertical space — then a card
 *              that leaves one zone empty still renders the other
 *              zones at their fixed positions, keeping layout stable
 *              across every card of the same type.
 *   #footer  — below the effect body (extra pips, sell buttons, etc.).
 *   #overlay — content painted on top (counters, attached tokens). Lives
 *              OUTSIDE the clip region so tokens can hang off the edge
 *              (wound markers half-on/half-off a card, etc.). Pointer
 *              events disabled by default.
 *
 * SIZE is NOT a prop on Card. A physical card has one size — the size
 * of its card type. Game-level components (BuildingCard, ContractCard)
 * set their own intrinsic size via `--card-w` / `--card-h` CSS vars on
 * their root class. Ad-hoc resize uses a layout primitive wrapping the
 * card — never a prop on Card.
 *
 * STATE (selected / inactive / tapped / activated) lives on boolean
 * data attributes — the attribute is *present* when true, *absent*
 * when false. CSS selects on presence alone: `.card[data-tapped]`.
 * No `='true'` / `='false'` strings.
 *
 * Transforms use the modern independent `translate` / `rotate` / `scale`
 * properties so states compose automatically. Selected + tapped + lifted
 * stack without needing combinatorial selectors.
 */
defineProps<{
  selected?: boolean;
  inactive?: boolean;
  tapped?: boolean;
  activated?: boolean;
}>();

const isDev = import.meta.env.DEV;
</script>

<template>
  <div
    class="card"
    :data-selected="selected || null"
    :data-inactive="inactive || null"
    :data-tapped="tapped || null"
    :data-activated="activated || null"
  >
    <!-- Everything inside the clip-path is bounded by the card's
         rounded corners. Frame, art, body all live here. -->
    <div class="card__clip">
      <div v-if="$slots.frame" class="card__frame">
        <slot name="frame" />
      </div>

      <div class="card__body">
        <div class="card__top">
          <div class="card__costs">
            <slot name="cost">
              <span v-if="isDev && !$slots.cost" class="card__placeholder">#cost</span>
            </slot>
          </div>
          <div v-if="$slots.icon" class="card__icon">
            <slot name="icon" />
          </div>
        </div>

        <div class="card__middle">
          <div v-if="$slots.art" class="card__art">
            <slot name="art" />
          </div>
          <div class="card__name">
            <slot name="name">
              <span v-if="isDev && !$slots.name" class="card__placeholder">#name</span>
            </slot>
          </div>
          <div class="card__effect">
            <slot name="effect" />
          </div>
        </div>

        <div v-if="$slots.footer" class="card__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>

    <!-- Overlay sits OUTSIDE the clip-path so tokens can visually hang
         off the card's edge. Still positioned relative to the card root. -->
    <div v-if="$slots.overlay" class="card__overlay">
      <slot name="overlay" />
    </div>
  </div>
</template>

<style scoped>
.card {
  width: var(--card-w);
  height: var(--card-h);
  position: relative;
  border-radius: var(--radius-soft);
  border: var(--card-border-w) solid var(--border);
  background: var(--bg-card);
  /* NOTE: no overflow: hidden here — the clip region is a child. */
  box-shadow: var(--shadow-card);
  container-type: size;
  flex-shrink: 0;
  /* Independent transforms compose — selected + tapped + lifted stack
   * without combinatorial selectors. */
  transition:
    translate var(--motion-base),
    rotate    var(--motion-base),
    outline-color var(--motion-base),
    box-shadow    var(--motion-base);
}

.card[data-selected] {
  outline: var(--outline-selected);
  translate: 0 -4px;
}

.card[data-inactive] {
  opacity: 0.5;
}

.card[data-tapped] {
  rotate: 8deg;
}

.card[data-activated] {
  box-shadow: var(--glow-activated);
}

/* Clip region — keeps frame + art inside the rounded corners. */
.card__clip {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
}

.card__frame {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.card__body {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: var(--card-pad);
  gap: var(--gap-snug);
  box-sizing: border-box;
}

.card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--gap-snug);
  min-height: 12cqi;
}

.card__costs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--gap-tight);
}

.card__icon {
  flex-shrink: 0;
}

.card__middle {
  display: flex;
  flex-direction: column;
  gap: var(--gap-snug);
  min-height: 0;
}

.card__art {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card__name {
  /* cqi tracks the container's inline (width) axis — stable even if the
   * card's layout rotates. cqh would shift when tap-rotated if a future
   * variant ever changes orientation. */
  font-size: 8cqi;
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-primary);
}

.card__effect {
  /* The effect body. Game wrappers may add their own structure inside
   * (rate rows, multiple abilities, flavor). Kit just lays it out as
   * a vertical flex column with modest font size. */
  display: flex;
  flex-direction: column;
  gap: var(--gap-snug);
  font-size: 7cqi;
  color: var(--text-muted);
}

.card__footer {
  display: flex;
  align-items: center;
  gap: var(--gap-snug);
  min-height: 10cqi;
}

.card__placeholder {
  font-size: 0.5rem;
  color: var(--text-subtle);
  font-style: italic;
}

.card__overlay {
  position: absolute;
  /* Slight outward bleed so tokens can visually rest on the card edge
   * rather than being trapped inside. */
  inset: calc(var(--gap-loose) * -1);
  pointer-events: none;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: var(--gap-snug);
  gap: var(--gap-tight);
  flex-wrap: wrap;
}
.card__overlay > * {
  pointer-events: auto;
}
</style>
