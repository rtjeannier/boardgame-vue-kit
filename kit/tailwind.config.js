/** @type {import('tailwindcss').Config} */
export default {
  // Scans story files + component templates so Histoire has what it needs.
  content: ['./src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Kit tokens exposed as Tailwind utilities for convenience in
        // stories (e.g. `bg-bg-subtle text-text-muted`).
        'bg-canvas':    'var(--bg-canvas)',
        'bg-elevated':  'var(--bg-elevated)',
        'bg-subtle':    'var(--bg-subtle)',
        'bg-card':      'var(--bg-card)',
        'text-primary': 'var(--text-primary)',
        'text-muted':   'var(--text-muted)',
        'text-subtle':  'var(--text-subtle)',
        border:         'var(--border)',
        'accent-blue':  'var(--accent-blue)',
        'accent-red':   'var(--accent-red)',
        'accent-green': 'var(--accent-green)',
      },
    },
  },
  plugins: [],
};
