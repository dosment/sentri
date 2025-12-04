/** @type {import('tailwindcss').Config} */
/*
 * Design System (Jonathan Ive craft standards)
 *
 * SPACING SCALE (base: 4px):
 *   1 = 4px   (micro gaps)
 *   2 = 8px   (tight spacing)
 *   3 = 12px  (standard spacing)
 *   4 = 16px  (comfortable spacing)
 *   5 = 20px  (section padding)
 *   6 = 24px  (card padding)
 *   8 = 32px  (large gaps)
 *
 * TIMING SCALE:
 *   micro  = 150ms (button press, micro-interactions)
 *   small  = 200ms (hover states, small transitions)
 *   medium = 300ms (panels, overlays)
 *   large  = 400ms (modals, page transitions)
 *
 * TOUCH TARGETS: Minimum 44x44px
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sentri-blue': '#1E3A5F',
        'guardian-navy': '#0F2340',
        'canvas': '#F3F4F6',
        success: '#10B981',
        warning: '#F59E0B',
        alert: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tight-brand': '-0.02em',
      },
      // Timing scale: micro (150), small (200), medium (300), large (400-500)
      transitionDuration: {
        'micro': '150ms',
        'small': '200ms',
        'medium': '300ms',
        'large': '400ms',
      },
      animation: {
        'shimmer': 'shimmer 1.2s infinite ease-in-out',
        'pulse-subtle': 'pulse-subtle 1s infinite ease-in-out',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)', opacity: '0.5' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0.5' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
