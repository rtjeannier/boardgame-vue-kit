<script setup lang="ts">
import { computed, ref } from 'vue';
import { Group as VGroup } from 'vue-konva';
import { useTheme } from '../composables/useTheme';

const props = withDefaults(
  defineProps<{
    x?: number;
    y?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
  }>(),
  { x: 0, y: 0, size: 'sm', color: undefined },
);

const theme = useTheme();
const nodeRef = ref<InstanceType<typeof VGroup> | null>(null);

const dim = computed(() => theme.sizes[props.size]);
const fill = computed(() => props.color ?? theme.text.primary);
const rootConfig = computed(() => ({ x: props.x, y: props.y }));

defineExpose({
  node: computed(() =>
    (nodeRef.value as unknown as { getNode?: () => unknown })?.getNode?.() ?? null,
  ),
  dim,
});
</script>

<template>
  <v-group ref="nodeRef" :config="rootConfig">
    <slot :w="dim" :h="dim" :color="fill" />
  </v-group>
</template>
