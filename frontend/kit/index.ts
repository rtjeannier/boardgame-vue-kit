/**
 * Kit entry — every primitive the frontend consumes, re-exported flat.
 *
 *   import { Stage, Layer, Zone, Card, Button, Panel } from '@kit';
 *   import type { GameEngine, Theme } from '@kit';
 *
 * The `canvas/`, `physical/`, `digital/` directories are an
 * organizational concern (contributor file tree + story sidebar) —
 * not reflected in imports.
 */

// Canvas — digital rendering infrastructure.
export { default as Stage } from './canvas/Stage.vue';
export { default as Layer } from './canvas/Layer.vue';

// Physical — things from the game box (canvas).
export { default as Zone } from './physical/Zone.vue';
export { default as Board } from './physical/Board.vue';
export { default as Slot } from './physical/Slot.vue';
export { default as Card } from './physical/Card.vue';
export { default as Token } from './physical/Token.vue';
export { default as Icon } from './physical/Icon.vue';

// Digital — chrome with no physical equivalent (DOM).
export { default as Button } from './digital/Button.vue';
export { default as Panel } from './digital/Panel.vue';

// Composables and types.
export { provideTheme, useTheme, ThemeKey } from './composables/useTheme';
export type { Theme } from './composables/useTheme';
export type { GameEngine } from './composables/engine';
export type { ZoneLayout, ZoneProps } from './physical/Zone.vue';
export type { TokenShape, TokenSize } from './physical/Token.vue';
