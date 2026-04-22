<docs lang="md">
# Button

Generic interaction primitive. Intent drives visual weight.

## Props
- `intent?: 'primary' | 'danger' | 'ghost'` — default `ghost`
- `disabled?: boolean`
- `type?: 'button' | 'submit' | 'reset'`

## Intents
- `primary` — the main call-to-action of a surface (blue)
- `danger` — destructive operations (red)
- `ghost` — secondary actions (outlined, neutral)
</docs>

<script setup lang="ts">
import { reactive } from 'vue';
import Button from './Button.vue';

const playground = reactive({
  intent: 'primary' as 'primary' | 'danger' | 'ghost',
  disabled: false,
  label: 'Click me',
});
</script>

<template>
  <Story title="kit/ui/Button">
    <Variant title="Intents">
      <div class="row">
        <Button intent="primary">Primary</Button>
        <Button intent="ghost">Ghost</Button>
        <Button intent="danger">Danger</Button>
      </div>
    </Variant>

    <Variant title="Disabled">
      <div class="row">
        <Button intent="primary" disabled>Primary</Button>
        <Button intent="ghost" disabled>Ghost</Button>
        <Button intent="danger" disabled>Danger</Button>
      </div>
    </Variant>

    <Variant title="Long labels">
      <div class="row">
        <Button intent="primary">Start a new solo game</Button>
        <Button intent="ghost">Cancel and return to lobby</Button>
      </div>
    </Variant>

    <Variant title="Playground">
      <div class="row">
        <Button :intent="playground.intent" :disabled="playground.disabled">
          {{ playground.label }}
        </Button>
      </div>
      <template #controls>
        <HstSelect
          v-model="playground.intent"
          title="Intent"
          :options="['primary', 'ghost', 'danger']"
        />
        <HstCheckbox v-model="playground.disabled" title="Disabled" />
        <HstText v-model="playground.label" title="Label" />
      </template>
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
</style>
