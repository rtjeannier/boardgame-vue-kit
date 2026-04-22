<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

/**
 * FitText — squeeze text to fit its container.
 *
 * Measures the slot content at its natural size and picks the largest
 * font-size that fits both the container's width and height. The CSS
 * platform has no native "fit text to box" feature; this is the
 * declarative primitive that fills the gap.
 *
 * Use wherever a label is constrained by a shape (Icon in a pip, Token
 * labels, score chips, counter bubbles). Turn off with `:fit="false"`
 * to fall back to normal text rendering.
 *
 * Lives in kit/layout/ because it has no visual of its own — it only
 * shapes content geometry, like AspectBox or Clamp will later.
 */
const props = withDefaults(
  defineProps<{
    fit?: boolean;
    /** Smallest font-size (px) to attempt before giving up. */
    min?: number;
    /** Largest font-size (px) to attempt before giving up. */
    max?: number;
  }>(),
  { fit: true, min: 4, max: 96 },
);

const container = ref<HTMLElement>();
const inner = ref<HTMLElement>();

function fitOnce() {
  if (!props.fit || !container.value || !inner.value) return;
  const c = container.value;
  const i = inner.value;
  const cRect = c.getBoundingClientRect();
  const w = cRect.width;
  const h = cRect.height;
  if (w <= 0 || h <= 0) return;

  // Binary-search the largest integer font-size (px) whose rendered
  // text fits the container. Use getBoundingClientRect (fractional
  // pixels) + a 0.5px tolerance so zoom-induced sub-pixel jitter
  // doesn't make the binary search land on different answers each
  // time ResizeObserver fires.
  const TOL = 0.5;
  let lo = props.min;
  let hi = props.max;
  let best = props.min;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    i.style.fontSize = mid + 'px';
    const iRect = i.getBoundingClientRect();
    if (iRect.width <= w + TOL && iRect.height <= h + TOL) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  i.style.fontSize = best + 'px';
}

let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined' && container.value) {
    resizeObserver = new ResizeObserver(fitOnce);
    resizeObserver.observe(container.value);
  }
  if (typeof MutationObserver !== 'undefined' && inner.value) {
    mutationObserver = new MutationObserver(fitOnce);
    mutationObserver.observe(inner.value, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
  fitOnce();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
});

watch(() => [props.fit, props.min, props.max], fitOnce);
</script>

<template>
  <span ref="container" class="fit-text" :data-fit="fit ? 'true' : 'false'">
    <span ref="inner" class="fit-text__inner"><slot /></span>
  </span>
</template>

<style scoped>
.fit-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  line-height: 1;
}
.fit-text__inner {
  white-space: nowrap;
  line-height: 1;
  /* Trim the line-box down to the visible glyph metrics (cap-height
   * at the top, alphabetic baseline at the bottom). This makes the
   * containing flexbox center the actual text rather than the
   * asymmetric line-box — no more drift-up on small pips. */
  text-box: trim-both cap alphabetic;
}
/* Off-mode: honor the inherited font-size and let text render naturally.
 * Overflow still clips via the container's overflow:hidden above. */
.fit-text[data-fit='false'] .fit-text__inner {
  font-size: inherit !important;
}
</style>
