/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        "custom": "4px 4px 10px 0px rgba(0,0,0,0.05)"
      },
      colors: {
        custom: {
          50: 'rgb(var(--color-custom-50) / <alpha-value>)',
          100: 'rgb(var(--color-custom-100) / <alpha-value>)',
          200: 'rgb(var(--color-custom-200) / <alpha-value>)',
          300: 'rgb(var(--color-custom-300) / <alpha-value>)',
          400: 'rgb(var(--color-custom-400) / <alpha-value>)',
          500: 'rgb(var(--color-custom-500) / <alpha-value>)',
          600: 'rgb(var(--color-custom-600) / <alpha-value>)',
          700: 'rgb(var(--color-custom-700) / <alpha-value>)',
          800: 'rgb(var(--color-custom-800) / <alpha-value>)',
          900: 'rgb(var(--color-custom-900) / <alpha-value>)',
        },
        bg: {
          50: 'rgb(var(--color-bg-50) / <alpha-value>) !important',
          100: 'rgb(var(--color-bg-100) / <alpha-value>) !important',
          200: 'rgb(var(--color-bg-200) / <alpha-value>) !important',
          300: 'rgb(var(--color-bg-300) / <alpha-value>) !important',
          400: 'rgb(var(--color-bg-400) / <alpha-value>) !important',
          500: 'rgb(var(--color-bg-500) / <alpha-value>) !important',
          600: 'rgb(var(--color-bg-600) / <alpha-value>) !important',
          700: 'rgb(var(--color-bg-700) / <alpha-value>) !important',
          800: 'rgb(var(--color-bg-800) / <alpha-value>) !important',
          900: 'rgb(var(--color-bg-900) / <alpha-value>) !important',
          950: 'rgb(var(--color-bg-950) / <alpha-value>) !important',
        },
      }
    },
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: []
  }
}

