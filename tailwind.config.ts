import type { Config } from 'tailwindcss';

// Palette also mirrored as CSS variables in app/globals.css for non-Tailwind
// styling (LED readout glow, etc.). Change both together.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0c0e10',
        panel: '#14171a',
        raised: '#1b1f23',
        line: '#262c31',
        ink: '#f2f4f5',
        muted: '#8a939b',
        amber: '#ffb020',
        pos: '#2fbf71',
        neg: '#e5484d',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        data: ['var(--font-data)'],
      },
    },
  },
  plugins: [],
};
export default config;
