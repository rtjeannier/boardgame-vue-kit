<script setup lang="ts">
/**
 * Button — interaction primitive.
 *
 * `intent` drives visual weight; use `primary` for the main
 * call-to-action of a surface, `danger` for destructive ops, `ghost`
 * (default) for secondary actions.
 *
 * State (intent, disabled) lives on data-* attributes; scoped CSS
 * below decides the visual.
 */
defineProps<{
  intent?: 'primary' | 'danger' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}>();
</script>

<template>
  <button
    class="btn"
    :type="type ?? 'button'"
    :disabled="disabled"
    :data-intent="intent ?? 'ghost'"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-normal);
  border-radius: var(--radius-rounded);
  padding: var(--gap-snug) var(--gap-loose);
  font-size: 0.875rem;
  font-weight: 500;
  transition: background var(--motion-base), filter var(--motion-base);
  cursor: pointer;
  border: 1px solid transparent;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn[data-intent='primary'] {
  background: var(--accent-blue);
  color: #000;
}
.btn[data-intent='primary']:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn[data-intent='danger'] {
  background: var(--accent-red);
  color: #000;
}
.btn[data-intent='danger']:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn[data-intent='ghost'] {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border-color: var(--border);
}
.btn[data-intent='ghost']:hover:not(:disabled) {
  background: var(--bg-selected);
}
</style>
