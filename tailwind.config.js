/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './layouts/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dm: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#9B5CF6',
          'purple-light': '#C084FC',
          'purple-bg': '#F5F0FF',
          'purple-soft': '#EDE9FE',
          pink: '#EC4899',
          border: '#E9E4F5',
          sidebar: '#FFFFFF',
          content: '#FDF4FF',
        },
      },
      boxShadow: {
        card: '0 1px 4px rgba(139,92,246,0.08)',
        'card-hover': '0 8px 32px rgba(139,92,246,0.16)',
        btn: '0 4px 20px rgba(139,92,246,0.35)',
        'btn-hover': '0 8px 28px rgba(139,92,246,0.45)',
        modal: '0 24px 64px rgba(139,92,246,0.2)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #9B5CF6, #C084FC)',
        'brand-gradient-dark': 'linear-gradient(135deg, #7C3AED, #9B5CF6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
