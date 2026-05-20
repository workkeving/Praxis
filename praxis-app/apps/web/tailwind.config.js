/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        praxis: {
          // verde médico cálido (teal-green del logo)
          50: '#f0f9f6',
          100: '#daf1e9',
          200: '#b6e2d3',
          300: '#84cdb6',
          400: '#52b194',
          500: '#2d6a5f',
          600: '#225850',
          700: '#1c4842',
          800: '#193b37',
          900: '#162e2c',
        },
        warm: {
          50: '#fdfbf7',
          100: '#f9f3e8',
          200: '#f1e4ca',
        },
        urgent: {
          400: '#e76f51',
          500: '#d8553b',
          600: '#c4452e',
        },
      },
      fontFamily: {
        display: ['Quicksand', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pop-in': 'popIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        'shake': 'shake 400ms cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-4px)' },
          '40%, 60%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
};
