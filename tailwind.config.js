/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        theme: {
          primary: 'rgb(var(--theme-primary) / <alpha-value>)',
          'primary-dark': 'rgb(var(--theme-primary-dark) / <alpha-value>)',
          'primary-light': 'rgb(var(--theme-primary-light) / <alpha-value>)',
        },
      },
      animation: {
        fadeInSlide: 'fadeInSlide 500ms ease-out forwards',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeInSlide: {
          from: {
            opacity: '0',
            transform: 'translateX(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        shimmer: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
  },
  plugins: [],
};
