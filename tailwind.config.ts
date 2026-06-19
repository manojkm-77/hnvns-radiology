import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#111111',
        border: '#222222',
        text: '#f0f0f0',
        muted: '#888888',
        accent: '#2dd4bf',
        'accent-dim': '#1a4a44'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'radial-accent': 'radial-gradient(circle at center, rgba(45, 212, 191, 0.16), transparent 58%)',
        'linear-gradient-accent': 'linear-gradient(135deg, rgba(45, 212, 191, 0.95), rgba(20, 184, 166, 0.72))'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(45, 212, 191, 0.12), 0 0 60px rgba(45, 212, 191, 0.08)'
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        'page-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        ticker: 'ticker 34s linear infinite',
        'page-fade': 'page-fade 0.45s ease-out both'
      }
    }
  },
  plugins: []
};

export default config;
