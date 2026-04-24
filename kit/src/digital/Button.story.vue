<docs lang="md">
# Button

DOM interaction primitive. `intent` drives visual weight;
`primary` for the surface's main action, `danger` for destructive
ops, `ghost` (default) for secondary.
</docs>

<script setup lang="ts">
import Button from './Button.vue';
</script>

<template>
  <Story title="digital/Button" group="Digital">
    <Variant title="Intents">
      <div class="row">
        <Button intent="primary">Primary</Button>
        <Button intent="danger">Danger</Button>
        <Button intent="ghost">Ghost</Button>
        <Button>Default (ghost)</Button>
      </div>
    </Variant>

    <Variant title="Disabled">
      <div class="row">
        <Button intent="primary" disabled>Primary</Button>
        <Button intent="danger" disabled>Danger</Button>
        <Button intent="ghost" disabled>Ghost</Button>
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.5rem;
}
</style>
