/**
 * boardgame-vue-kit — public entry.
 *
 * Consumers import components by name:
 *   import { Card, CardZone, Token, Zone, FitText } from 'boardgame-vue-kit';
 *   import 'boardgame-vue-kit/variables.css';
 */

// Pieces — things from the game box.
export { default as Card } from './pieces/Card.vue';
export { default as CardZone } from './pieces/CardZone.vue';
export { default as Deck } from './pieces/Deck.vue';
export { default as Token } from './pieces/Token.vue';

// Boards — playing surfaces and positions.
export { default as MultiTrack } from './boards/MultiTrack.vue';
export { default as Slot } from './boards/Slot.vue';
export { default as Track } from './boards/Track.vue';
export { default as Zone } from './boards/Zone.vue';

// Visuals — glyphs / rendering motifs.
export { default as Icon } from './visuals/Icon.vue';

// Layout — content-shape helpers.
export { default as FitText } from './layout/FitText.vue';
export { default as Scaled } from './layout/Scaled.vue';

// UI chrome.
export { default as Button } from './ui/Button.vue';
export { default as Modal } from './ui/Modal.vue';

// Composables / types.
export type { GameEngine } from './composables/engine';
