<script setup lang="ts">
/**
 * Panel — in-game floating window. DOM, positioned above the canvas,
 * non-blocking: the board stays visible and interactable behind it.
 *
 * In-game popups (e.g., "pick a card to discard", end-of-game summary)
 * are part of the game experience. The player needs to see and reason
 * about the board while deciding — so Panel has no backdrop and does
 * not trap focus. Drag it by the header to move it out of the way.
 *
 * Panel supports:
 *   - `v-model:open` — open/close the window
 *   - draggable via the header (mouse + touch)
 *   - minimize to collapse to just the header bar (in place)
 *   - z-order: clicking a Panel raises it above any sibling Panels
 *   - keyboard: Escape closes (no focus trap — non-modal)
 *
 * For blocking dialogs (settings, credits, truly-pause-the-game chrome)
 * use a future `Modal` component. Panel is for in-game use.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface Props {
  open?: boolean;
  title?: string;
  /** Initial x in viewport px. */
  x?: number;
  /** Initial y in viewport px. */
  y?: number;
  width?: number | string;
  /** If set, minimize/close controls are hidden. */
  persistent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: true,
  title: '',
  x: 80,
  y: 80,
  width: 320,
  persistent: false,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  dragend: [pos: { x: number; y: number }];
}>();

const posX = ref(props.x);
const posY = ref(props.y);
const minimized = ref(false);
const rootRef = ref<HTMLElement | null>(null);

/** Monotonic counter so clicking a Panel raises it above siblings. */
const stackCounter = { value: 1 };
const z = ref(1);
function raise() {
  stackCounter.value += 1;
  z.value = stackCounter.value;
}

watch(() => [props.x, props.y], ([nx, ny]) => {
  posX.value = nx as number;
  posY.value = ny as number;
});

let dragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

function onHeaderPointerDown(e: PointerEvent) {
  if (props.persistent && e.target instanceof HTMLElement && e.target.closest('.panel__controls')) {
    return;
  }
  const target = e.currentTarget as HTMLElement;
  target.setPointerCapture(e.pointerId);
  dragging = true;
  dragOffsetX = e.clientX - posX.value;
  dragOffsetY = e.clientY - posY.value;
  raise();
}

function onHeaderPointerMove(e: PointerEvent) {
  if (!dragging) return;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
  const rootW = rootRef.value?.offsetWidth ?? 0;
  const rootH = rootRef.value?.offsetHeight ?? 0;
  const nx = e.clientX - dragOffsetX;
  const ny = e.clientY - dragOffsetY;
  posX.value = Math.max(0, Math.min(vw - rootW, nx));
  posY.value = Math.max(0, Math.min(vh - rootH, ny));
}

function onHeaderPointerUp(e: PointerEvent) {
  if (!dragging) return;
  const target = e.currentTarget as HTMLElement;
  target.releasePointerCapture(e.pointerId);
  dragging = false;
  emit('dragend', { x: posX.value, y: posY.value });
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open && !props.persistent) {
    emit('update:open', false);
  }
}

onMounted(() => {
  document.addEventListener('keydown', onEscape);
  void nextTick(() => raise());
});
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onEscape);
});

function close() { emit('update:open', false); }
function toggleMinimize() { minimized.value = !minimized.value; }

const style = computed(() => ({
  left: `${posX.value}px`,
  top: `${posY.value}px`,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  zIndex: String(z.value),
}));
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="rootRef"
      class="panel"
      role="dialog"
      :aria-label="title || undefined"
      :style="style"
      :data-minimized="minimized || null"
      @pointerdown="raise"
    >
      <div
        class="panel__header"
        @pointerdown="onHeaderPointerDown"
        @pointermove="onHeaderPointerMove"
        @pointerup="onHeaderPointerUp"
        @pointercancel="onHeaderPointerUp"
      >
        <div class="panel__title">{{ title }}</div>
        <div v-if="!persistent" class="panel__controls">
          <button
            type="button"
            class="panel__ctrl"
            :aria-label="minimized ? 'Expand panel' : 'Minimize panel'"
            @click="toggleMinimize"
          >
            {{ minimized ? '▢' : '–' }}
          </button>
          <button
            type="button"
            class="panel__ctrl"
            aria-label="Close panel"
            @click="close"
          >
            ×
          </button>
        </div>
      </div>

      <div v-show="!minimized" class="panel__body">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.panel {
  position: fixed;
  background: var(--panel-bg);
  color: var(--text-primary);
  border: 1px solid var(--panel-border);
  border-radius: var(--panel-radius);
  box-shadow: var(--panel-shadow);
  z-index: var(--z-panel);
  display: flex;
  flex-direction: column;
  min-width: 12rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  font-family: inherit;
}

.panel__header {
  display: flex;
  align-items: center;
  gap: var(--gap-normal);
  padding: var(--panel-header-pad-y) var(--panel-header-pad-x);
  background: var(--panel-header-bg);
  border-bottom: 1px solid var(--panel-border);
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.panel__header:active {
  cursor: grabbing;
}

.panel[data-minimized] .panel__header {
  border-bottom: 0;
}

.panel__title {
  flex: 1;
  font-weight: 600;
  font-size: 0.875rem;
}

.panel__controls {
  display: flex;
  gap: var(--gap-tight);
}

.panel__ctrl {
  width: 1.5rem;
  height: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-rounded);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  transition: background var(--motion-fast);
}

.panel__ctrl:hover {
  background: var(--bg-selected);
  color: var(--text-primary);
}

.panel__body {
  padding: var(--panel-body-pad);
  overflow: auto;
  flex: 1;
  min-height: 0;
}
</style>
