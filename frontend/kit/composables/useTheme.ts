/**
 * useTheme — bridges CSS custom properties into canvas components.
 *
 * Canvas (Konva) can't read CSS, so this composable parses the subset
 * of `variables.css` tokens the physical kit needs at mount time and
 * provides them to descendants as a reactive object. A MutationObserver
 * on <html> refreshes values when a theme toggle changes class/style,
 * and `theme.refresh()` is available for explicit re-reads.
 *
 * Single source of truth: DOM components read the same CSS vars
 * directly in scoped CSS; canvas components read them through here.
 * A consumer who overrides `--accent-blue` in their own stylesheet
 * sees the change in both a <Card> (canvas) and a <Button> (DOM).
 */
import { inject, provide, reactive, onMounted, onBeforeUnmount, readonly, type InjectionKey } from 'vue';

export interface Theme {
  radii: { sharp: number; chamfer: number; rounded: number; soft: number; pill: number };
  sizes: { xs: number; sm: number; md: number; lg: number; xl: number };
  card: {
    w: number;
    h: number;
    pad: number;
    borderW: number;
    borderColor: string;
    bg: string;
    shadow: { blur: number; offsetY: number; color: string };
  };
  board: {
    fill: string;
    stroke: string;
    strokeW: number;
    radius: number;
  };
  slot: {
    stroke: string;
    strokeW: number;
    dash: [number, number];
  };
  stage: { bg: string };
  bg: {
    canvas: string;
    elevated: string;
    subtle: string;
    selected: string;
    card: string;
    cardHand: string;
    board: string;
    playerMat: string;
  };
  text: { primary: string; muted: string; dim: string; subtle: string };
  border: string;
  accents: {
    blue: string;
    orange: string;
    green: string;
    purple: string;
    red: string;
    yellow: string;
    violet: string;
    sky: string;
  };
  motion: { fast: number; base: number; slow: number };
  gaps: { tight: number; snug: number; normal: number; loose: number; wide: number };
  stackStep: number;
  /** Explicit re-read after a theme change that the observer missed. */
  refresh: () => void;
}

export const ThemeKey: InjectionKey<Theme> = Symbol('boardgame-vue-kit:theme');

const REM_PX_FALLBACK = 16;

function rootFontSize(): number {
  if (typeof document === 'undefined') return REM_PX_FALLBACK;
  const size = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(size) && size > 0 ? size : REM_PX_FALLBACK;
}

/** Parses a CSS length (px, rem, em) to a pixel number. */
function toPx(value: string, rem: number): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const match = trimmed.match(/^(-?\d*\.?\d+)(px|rem|em)?$/);
  if (!match) {
    const n = parseFloat(trimmed);
    return Number.isFinite(n) ? n : 0;
  }
  const n = parseFloat(match[1]);
  const unit = match[2] ?? 'px';
  if (unit === 'rem' || unit === 'em') return n * rem;
  return n;
}

/** Pulls a --motion-base value like "150ms ease" into a millisecond number. */
function toMs(value: string): number {
  const match = value.trim().match(/(-?\d*\.?\d+)(ms|s)?/);
  if (!match) return 0;
  const n = parseFloat(match[1]);
  return (match[2] ?? 'ms') === 's' ? n * 1000 : n;
}

/**
 * Parses a CSS box-shadow like `0 2px 4px rgb(0 0 0 / 0.30)` into the
 * shape Konva wants (shadowBlur/shadowOffsetY/shadowColor). Only the
 * first layer is read.
 */
function toShadow(value: string): { blur: number; offsetY: number; color: string } {
  // Strip the color portion first so spaces inside rgb(...) don't break splits.
  const colorMatch = value.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]+)/);
  const color = colorMatch ? colorMatch[1] : 'rgb(0 0 0 / 0.3)';
  const numeric = value.replace(color, '').trim();
  const parts = numeric.split(/\s+/).filter(Boolean);
  const offsetY = parts[1] ? parseFloat(parts[1]) : 0;
  const blur = parts[2] ? parseFloat(parts[2]) : 0;
  return { blur, offsetY, color };
}

function parseTheme(): Omit<Theme, 'refresh'> {
  const rem = rootFontSize();
  const styles = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const read = (name: string, fallback = ''): string =>
    (styles?.getPropertyValue(name).trim() ?? '') || fallback;
  const len = (name: string, fallback = 0): number => {
    const raw = read(name);
    return raw ? toPx(raw, rem) : fallback;
  };

  return {
    radii: {
      sharp: len('--radius-sharp'),
      chamfer: len('--radius-chamfer'),
      rounded: len('--radius-rounded'),
      soft: len('--radius-soft'),
      pill: len('--radius-pill', 9999),
    },
    sizes: {
      xs: len('--size-xs'),
      sm: len('--size-sm'),
      md: len('--size-md'),
      lg: len('--size-lg'),
      xl: len('--size-xl'),
    },
    card: {
      w: len('--card-w'),
      h: len('--card-h'),
      pad: len('--card-pad'),
      borderW: len('--card-border-w'),
      borderColor: read('--border'),
      bg: read('--bg-card'),
      shadow: toShadow(read('--shadow-card')),
    },
    board: {
      fill: read('--board-surface-fill') || read('--bg-board'),
      stroke: read('--board-surface-stroke') || read('--border'),
      strokeW: len('--board-surface-stroke-w', 1),
      radius: len('--board-surface-radius') || len('--radius-soft'),
    },
    slot: {
      stroke: read('--slot-empty-stroke') || read('--text-subtle'),
      strokeW: len('--slot-empty-stroke-w', 1),
      dash: [len('--slot-empty-dash', 6), len('--slot-empty-gap', 4)],
    },
    stage: { bg: read('--stage-bg') || read('--bg-canvas') },
    bg: {
      canvas: read('--bg-canvas'),
      elevated: read('--bg-elevated'),
      subtle: read('--bg-subtle'),
      selected: read('--bg-selected'),
      card: read('--bg-card'),
      cardHand: read('--bg-card-hand'),
      board: read('--bg-board'),
      playerMat: read('--bg-player-mat'),
    },
    text: {
      primary: read('--text-primary'),
      muted: read('--text-muted'),
      dim: read('--text-dim'),
      subtle: read('--text-subtle'),
    },
    border: read('--border'),
    accents: {
      blue: read('--accent-blue'),
      orange: read('--accent-orange'),
      green: read('--accent-green'),
      purple: read('--accent-purple'),
      red: read('--accent-red'),
      yellow: read('--accent-yellow'),
      violet: read('--accent-violet'),
      sky: read('--accent-sky'),
    },
    motion: {
      fast: toMs(read('--motion-fast')),
      base: toMs(read('--motion-base')),
      slow: toMs(read('--motion-slow')),
    },
    gaps: {
      tight: len('--gap-tight'),
      snug: len('--gap-snug'),
      normal: len('--gap-normal'),
      loose: len('--gap-loose'),
      wide: len('--gap-wide'),
    },
    stackStep: len('--stack-step'),
  };
}

/**
 * Creates and provides a reactive theme. Call once at the top of a
 * canvas tree (Stage does this). Child canvas components call
 * useTheme() to read values.
 */
export function provideTheme(): Theme {
  const state = reactive(parseTheme()) as Theme;
  state.refresh = () => Object.assign(state, parseTheme());

  let observer: MutationObserver | undefined;
  onMounted(() => {
    state.refresh();
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver(() => state.refresh());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });
  });
  onBeforeUnmount(() => observer?.disconnect());

  provide(ThemeKey, readonly(state) as Theme);
  return state;
}

/**
 * Reads the provided theme. Returns a sensible default if called
 * outside a Stage — canvas stories can render standalone.
 */
export function useTheme(): Theme {
  const injected = inject(ThemeKey, null);
  if (injected) return injected;
  const fallback = reactive(parseTheme()) as Theme;
  fallback.refresh = () => Object.assign(fallback, parseTheme());
  return fallback;
}
