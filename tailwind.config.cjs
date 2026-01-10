module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        'ticker-move': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        'ticker-move': 'ticker-move 25s linear infinite'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
