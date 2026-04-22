/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts,tsx}',
    // Also scan the kit's source so its Tailwind utilities (used in
    // story files that happen to live in kit/) are picked up. In a
    // published-kit setup this wouldn't be necessary.
    '../../kit/src/**/*.{vue,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-canvas':    'var(--bg-canvas)',
        'bg-elevated':  'var(--bg-elevated)',
        'bg-subtle':    'var(--bg-subtle)',
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
