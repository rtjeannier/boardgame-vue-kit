<script setup lang="ts">
/**
 * Icon — a sized, colored container for a glyph.
 *
 * Intentionally tiny. It knows three things:
 *   - how big it is (size scale),
 *   - what color it is (background + foreground),
 *   - what's inside (slot — any content: text, <img>, <svg>, <FitText>…).
 *
 * It does NOT know what shape it is. No border-radius, no clip-path, no
 * enumerated variants. Shape is whatever the caller styles via class or
 * CSS vars. Want a circle? `class="rounded-full"`. A rounded square?
 * `class="rounded"`. A hex? apply your own `clip-path`. Kit stays out of
 * it because different board games have different icon conventions.
 *
 * Label fallback: if the default slot is empty and `label` is set, label
 * renders inside. Auto-fit isn't built in — wrap `<FitText>` around your
 * content if you want text to squeeze.
 */
defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  textColor?: string;
  label?: string;
}>();
</script>

<template>
  <span
    class="icon"
    :data-size="size ?? 'md'"
    :style="{ background: color, color: textColor }"
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<style scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  line-height: 1;
  font-weight: 700;
  user-select: none;
}

.icon[data-size='xs'] { width: var(--size-xs); height: var(--size-xs); font-size: 0.55rem; }
.icon[data-size='sm'] { width: var(--size-sm); height: var(--size-sm); font-size: 0.65rem; }
.icon[data-size='md'] { width: var(--size-md); height: var(--size-md); font-size: 0.75rem; }
.icon[data-size='lg'] { width: var(--size-lg); height: var(--size-lg); font-size: 0.90rem; }
.icon[data-size='xl'] { width: var(--size-xl); height: var(--size-xl); font-size: 1.10rem; }
</style>
