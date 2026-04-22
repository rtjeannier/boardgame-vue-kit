<docs lang="md">
# FitText

Squeezes text to fit its container. Binary-searches the largest
integer `font-size` (in px) where `scrollWidth` and `scrollHeight`
stay within the container. Re-runs on `ResizeObserver` +
`MutationObserver` so it stays correct as content or box change.

The CSS platform has no native "fit text to box" feature; this is the
declarative primitive that fills the gap.

## Props
- `fit?: boolean` — default `true`. Set `false` to fall back to normal
  text rendering with the inherited `font-size`.
- `min?: number` — smallest font-size (px) to attempt. Default `4`.
- `max?: number` — largest font-size (px) to attempt. Default `96`.

## Use for
Any label constrained by a shape: Icon in a pip, Token labels, score
chips, counter bubbles.
</docs>

<script setup lang="ts">
import FitText from './FitText.vue';
</script>

<template>
  <Story title="kit/layout/FitText">
    <Variant title="Same box, different text lengths">
      <div class="row">
        <div class="box box--sm"><FitText>X</FitText></div>
        <div class="box box--sm"><FitText>VP</FitText></div>
        <div class="box box--sm"><FitText>WIN</FitText></div>
        <div class="box box--sm"><FitText>GOLD</FitText></div>
        <div class="box box--sm"><FitText>SILVER</FitText></div>
      </div>
    </Variant>

    <Variant title="Larger box scales up">
      <div class="row row--end">
        <div class="box box--sm"><FitText>GOLD</FitText></div>
        <div class="box box--md"><FitText>GOLD</FitText></div>
        <div class="box box--lg"><FitText>GOLD</FitText></div>
      </div>
    </Variant>

    <Variant title="Opt out with :fit='false'">
      <div class="row">
        <div class="box box--sm"><FitText :fit="false">GOLD</FitText></div>
        <div class="box box--sm"><FitText>GOLD</FitText></div>
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
.row {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  align-items: center;
}
.row--end {
  align-items: flex-end;
}
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-blue);
  color: #000;
  font-weight: 700;
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.box--sm { width: 1.5rem; height: 1.5rem; }
.box--md { width: 2.5rem; height: 2.5rem; }
.box--lg { width: 4rem; height: 4rem; }
</style>
