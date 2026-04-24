/**
 * boardgame-vue-kit — public entry.
 *
 * Flat export surface. Consumers import by name from the single path:
 *
 *   import { Stage, Layer, Board, Zone, Slot, Card, Token, Icon,
 *            Button, Panel } from 'boardgame-vue-kit';
 *   import 'boardgame-vue-kit/variables.css';
 *   import type { GameEngine, Theme, ZoneLayout } from 'boardgame-vue-kit';
 *
 * File-tree buckets (canvas / physical / digital) are an organizational
 * concern for contributors and stories — not reflected in imports.
 */

// Canvas — digital rendering infrastructure.
export { default as Stage } from './canvas/Stage.vue';
export { default as Layer } from './canvas/Layer.vue';

// Physical — things from the game box (canvas).
export { default as Zone } from './physical/spaces/Zone.vue';
export { default as Board } from './physical/spaces/Board.vue';
export { default as Slot } from './physical/spaces/Slot.vue';
export { default as Card } from './physical/pieces/Card.vue';
export { default as Token } from './physical/pieces/Token.vue';
export { default as Icon } from './physical/visuals/Icon.vue';

// Digital — chrome with no physical equivalent (DOM).
export { default as Button } from './digital/chrome/Button.vue';
export { default as Panel } from './digital/chrome/Panel.vue';

// Composables and types.
export { provideTheme, useTheme, ThemeKey } from './composables/useTheme';
export type { Theme } from './composables/useTheme';
export type { GameEngine } from './composables/engine';
export type { ZoneLayout, ZoneProps } from './physical/spaces/Zone.vue';
export type { TokenShape, TokenSize } from './physical/pieces/Token.vue';
