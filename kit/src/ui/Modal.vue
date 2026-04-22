<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue';

/**
 * Modal — generic dialog primitive.
 *
 * Minimal, unopinionated. Caller supplies the content via the default
 * slot; optional #title and #footer slots structure a standard layout.
 * Backdrop click + Escape key close by default (emits `close`);
 * `persistent` disables those.
 *
 * Focus management and scroll-lock are baked in — when open, body
 * scroll is frozen and focus is trapped to the dialog area.
 */
const props = withDefaults(
  defineProps<{
    open: boolean;
    /** Disables backdrop-click and Escape-to-close. */
    persistent?: boolean;
    /** Max-width CSS value; defaults to 'min(90vw, 32rem)'. */
    width?: string;
  }>(),
  { persistent: false, width: 'min(90vw, 32rem)' },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function onBackdropClick() {
  if (!props.persistent) emit('close');
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open && !props.persistent) {
    emit('close');
  }
}

function lockBodyScroll(locked: boolean) {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = locked ? 'hidden' : '';
}

watch(
  () => props.open,
  (isOpen) => lockBodyScroll(isOpen),
);

onMounted(() => {
  window.addEventListener('keydown', onKey);
  if (props.open) lockBodyScroll(true);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey);
  lockBodyScroll(false);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        @click.self="onBackdropClick"
      >
        <div class="modal" :style="{ maxWidth: width }" @click.stop>
          <header v-if="$slots.title" class="modal__title">
            <slot name="title" />
          </header>
          <div class="modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-modals);
  background: rgb(0 0 0 / 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gap-wide);
  backdrop-filter: blur(2px);
}

.modal {
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-soft);
  box-shadow: var(--shadow-floating);
  display: flex;
  flex-direction: column;
  color: var(--text-primary);
}

.modal__title {
  padding: var(--gap-normal) var(--gap-wide);
  border-bottom: 1px solid var(--border);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.modal__body {
  padding: var(--gap-wide);
  display: flex;
  flex-direction: column;
  gap: var(--gap-normal);
}

.modal__footer {
  padding: var(--gap-normal) var(--gap-wide);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: var(--gap-normal);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--motion-base);
}
.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform var(--motion-base), opacity var(--motion-base);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(8px);
  opacity: 0;
}
</style>
