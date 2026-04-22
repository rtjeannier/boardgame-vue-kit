<docs lang="md">
# Icon

A sized, colored container for a glyph. Deliberately minimal — knows
three things: how big it is, what color it is, and what's inside
(slot: text, SVG, `<FitText>`, anything).

Kit `<Icon>` does **not** decide shape (no border-radius, no
clip-path, no shape enum). Shape is whatever the caller styles via
class or CSS var. This keeps kit game-agnostic; Mars's `<ResourceIcon>`
maps its own conventions (`market` → circle, `rate` → rounded) onto
the kit primitive.

## Props
- `size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` — from the shared size scale
- `color?: string` — CSS color for the background
- `textColor?: string` — CSS color for the foreground (label)
- `label?: string` — fallback text when default slot is empty

## Slots
- `default` — any Vue content (text, `<img>`, `<svg>`, `<FitText>`)
</docs>

<script setup lang="ts">
import { reactive } from 'vue';
import Icon from './Icon.vue';

const playground = reactive({
  size: 'md' as 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  color: '#58a6ff',
  textColor: '#000000',
  label: 'O2',
  round: true,
});
</script>

<template>
  <Story title="kit/visuals/Icon">
    <Variant title="Size scale">
      <div class="row">
        <Icon size="xs" color="#58a6ff" text-color="#000" label="xs" />
        <Icon size="sm" color="#58a6ff" text-color="#000" label="sm" />
        <Icon size="md" color="#58a6ff" text-color="#000" label="md" />
        <Icon size="lg" color="#58a6ff" text-color="#000" label="lg" />
        <Icon size="xl" color="#58a6ff" text-color="#000" label="xl" />
      </div>
    </Variant>

    <Variant title="Shape via class (caller styles)">
      <div class="row">
        <Icon size="md" color="#e74c3c" text-color="#fff" label="●" class="rounded-full" />
        <Icon size="md" color="#3fb950" text-color="#000" label="■" class="rounded" />
        <Icon size="md" color="#d29922" text-color="#000" label="▲" />
      </div>
    </Variant>

    <Variant title="No label / slot content">
      <div class="row">
        <Icon size="lg" color="#d2a8ff" class="rounded-full" />
        <Icon size="lg" color="#a5d6ff" text-color="#000" class="rounded">
          <strong>★</strong>
        </Icon>
      </div>
    </Variant>

    <Variant title="Playground">
      <div class="row">
        <Icon
          :size="playground.size"
          :color="playground.color"
          :text-color="playground.textColor"
          :label="playground.label"
          :class="playground.round ? 'rounded-full' : 'rounded'"
        />
      </div>
      <template #controls>
        <HstSelect
          v-model="playground.size"
          title="Size"
          :options="['xs', 'sm', 'md', 'lg', 'xl']"
        />
        <HstText v-model="playground.label" title="Label" />
        <HstText v-model="playground.color" title="Background" />
        <HstText v-model="playground.textColor" title="Text color" />
        <HstCheckbox v-model="playground.round" title="Circle (else rounded square)" />
      </template>
    </Variant>
  </Story>
</template>

<style scoped>
.row {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
}
</style>
