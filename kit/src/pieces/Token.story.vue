<docs lang="md">
# Token

A physical game piece. Distinct from `<Icon>` — Icons are glyphs;
Tokens are pieces. A Token has a shape and a color; it may wear an
Icon (or a label, or any content) via the default slot.

State (shape, size, color, fill) lives on data attributes; scoped CSS
references kit variables. Cylinders use `--shadow-cylinder` +
`--depth-chunky` for a faux-3D chip look.

## Props
- `shape?: 'disc' | 'cube' | 'meeple' | 'cylinder' | 'square' | 'custom'`
- `size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` — shared size scale
- `color?: string` — background
- `label?: string` — squeezed to fit via `<FitText>`
- `fill?: boolean` — scale to fill parent Slot instead of using `size`
</docs>

<script setup lang="ts">
import { reactive } from 'vue';
import Token from './Token.vue';

type Shape = 'disc' | 'cube' | 'meeple' | 'cylinder' | 'square' | 'custom';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const playground = reactive({
  shape: 'disc' as Shape,
  size: 'md' as Size,
  color: '#58a6ff',
  label: '',
});
</script>

<template>
  <Story title="kit/pieces/Token">
    <Variant title="All shapes">
      <div class="row">
        <Token shape="disc" color="#e74c3c" size="lg" />
        <Token shape="cube" color="#27ae60" size="lg" />
        <Token shape="square" color="#d29922" size="lg" />
        <Token shape="cylinder" color="#58a6ff" size="lg" />
        <Token shape="meeple" color="#d2a8ff" size="lg" />
      </div>
    </Variant>

    <Variant title="Size scale (disc)">
      <div class="row row--baseline">
        <Token shape="disc" color="#58a6ff" size="xs" />
        <Token shape="disc" color="#58a6ff" size="sm" />
        <Token shape="disc" color="#58a6ff" size="md" />
        <Token shape="disc" color="#58a6ff" size="lg" />
        <Token shape="disc" color="#58a6ff" size="xl" />
      </div>
    </Variant>

    <Variant title="Cylinder 3D lift">
      <div class="row">
        <Token shape="disc" color="#e74c3c" size="lg" label="flat" />
        <Token shape="cylinder" color="#e74c3c" size="lg" label="3D" />
      </div>
      <p class="caption">
        Cylinder has a layered side-shadow and lifts by
        <code>--depth-chunky</code>.
      </p>
    </Variant>

    <Variant title="With labels">
      <div class="row">
        <Token shape="disc" color="#58a6ff" size="md" label="1" />
        <Token shape="disc" color="#58a6ff" size="md" label="12" />
        <Token shape="cube" color="#3fb950" size="md" label="STR" />
        <Token shape="meeple" color="#d29922" size="md" label="VP" />
      </div>
    </Variant>

    <Variant title="Fill mode (scales to parent)">
      <div class="row">
        <div class="fill-slot">
          <Token shape="disc" color="#58a6ff" fill label="fill" />
        </div>
        <div class="fill-slot" style="width: 3rem; height: 3rem">
          <Token shape="cube" color="#3fb950" fill label="big" />
        </div>
      </div>
    </Variant>

    <Variant title="Playground">
      <div class="row">
        <Token
          :shape="playground.shape"
          :size="playground.size"
          :color="playground.color"
          :label="playground.label || undefined"
        />
      </div>
      <template #controls>
        <HstSelect
          v-model="playground.shape"
          title="Shape"
          :options="['disc', 'cube', 'meeple', 'cylinder', 'square']"
        />
        <HstSelect
          v-model="playground.size"
          title="Size"
          :options="['xs', 'sm', 'md', 'lg', 'xl']"
        />
        <HstText v-model="playground.color" title="Color" />
        <HstText v-model="playground.label" title="Label" placeholder="(optional)" />
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
.row--baseline {
  align-items: flex-end;
}
.caption {
  padding: 0 1rem 1rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}
.caption code {
  background: var(--bg-subtle);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}
.fill-slot {
  width: 2rem;
  height: 2rem;
  border: 1px dashed var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
