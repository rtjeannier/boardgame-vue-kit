<script setup lang="ts">
import { computed } from 'vue';

/**
 * CardZone — a sized sub-region, typically inside a Card's `#effect`
 * slot. Two composable modes + configurable padding.
 *
 * API:
 *   height="2rem"        absolute CSS height (any length unit)
 *   height="50%"          fraction of parent content-box (auto-adjusts to border/padding)
 *   fill                   takes remaining vertical space (flex: 1)
 *   pad="normal"          named preset → var(--gap-normal)
 *   pad="0.75rem 0.25rem"  raw CSS → passes through as `padding`
 *   align-end              anchor content to the bottom/right of the zone
 *
 * Idiomatic composition — any number of fixed zones + one `fill`:
 *
 *   <Card>
 *     <template #effect>
 *       <CardZone height="2rem">…rates…</CardZone>
 *       <CardZone fill>…rules text…</CardZone>
 *     </template>
 *   </Card>
 *
 * That pattern never overflows: fixed zones take their share, the
 * fill zone absorbs whatever's left (including any change in border
 * or padding on the containing Card).
 *
 * For "same physical size on every card", use a raw rem value —
 * `height="2rem"` is 2rem on every card type. For "fraction of the
 * current card's interior", use a percent — `height="50%"` reads
 * from the parent content-box (auto-adjusts with border changes).
 */
type PadPreset = 'none' | 'tight' | 'snug' | 'normal' | 'loose' | 'wide';

const PAD_PRESETS: Record<PadPreset, string> = {
  none:   '0',
  tight:  'var(--gap-tight)',
  snug:   'var(--gap-snug)',
  normal: 'var(--gap-normal)',
  loose:  'var(--gap-loose)',
  wide:   'var(--gap-wide)',
};

const props = withDefaults(
  defineProps<{
    /** Absolute CSS height (any length). Mutex with `fill`. */
    height?: string;
    /** Fill remaining vertical space (flex: 1). Mutex with `height`. */
    fill?: boolean;
    /** Padding: preset name or raw CSS value. Default 'snug'. */
    pad?: PadPreset | string;
    /** Align content to the bottom/right of the zone. */
    alignEnd?: boolean;
  }>(),
  { fill: false, pad: 'snug', alignEnd: false },
);

const style = computed<Record<string, string>>(() => {
  const s: Record<string, string> = {};
  if (!props.fill && props.height) s.height = props.height;
  const preset = PAD_PRESETS[props.pad as PadPreset];
  s.padding = preset ?? (props.pad as string);
  return s;
});
</script>

<template>
  <div
    class="card-zone"
    :data-fill="fill || null"
    :data-align-end="alignEnd || null"
    :style="style"
  >
    <slot />
  </div>
</template>

<style scoped>
.card-zone {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--gap-snug);
  /* Content taller than the zone clips rather than pushing siblings. */
  overflow: hidden;
  /* Sized zones hold their height. */
  flex-shrink: 0;
  box-sizing: border-box;
}

/* Fill — absorb remaining vertical space. */
.card-zone[data-fill] {
  flex: 1;
  flex-shrink: 1;
  min-height: 0;
}

/* Align content to bottom/right — useful for reward-style bottom bands. */
.card-zone[data-align-end] {
  align-items: flex-end;
  justify-content: flex-end;
}
</style>
