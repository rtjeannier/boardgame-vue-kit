/**
 * Kit's generic engine contract. Any rules engine (Pyodide, a WASM engine,
 * a remote server) implements this interface. UI code depends only on this
 * file, not on the concrete implementation.
 *
 * Generic over a game's state / action / result shapes — each board game
 * clones this kit and parameterizes with its own types.
 */

export interface GameEngine<GameState, Action, ActionResult, LegalActions, InitOptions = unknown> {
  /** Boot the engine and create the game. Idempotent; safe to call once per session. */
  init(options: InitOptions): Promise<void>;

  /** Snapshot the current game state. Pure — caller must re-call after apply(). */
  state(): GameState;

  /** Legal actions for the current acting seat, or null if none applicable. */
  legal(): LegalActions | null;

  /** Apply an action. Returns engine feedback (ok, detail, error). */
  apply(action: Action): ActionResult;

  /** Respond to a mid-event prompt (auction bid, etc.). M1 unused. */
  answerPrompt?(answer: unknown): ActionResult;

  /** True once the game has ended. */
  isOver(): boolean;
}
