/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        custom: {
          50: () => 'var(--color-custom-50)',
          100: () => 'var(--color-custom-100)',
          200: () => 'var(--color-custom-200)',
          300: () => 'var(--color-custom-300)',
          400: () => 'var(--color-custom-400)',
          500: () => 'var(--color-custom-500)',
          600: () => 'var(--color-custom-600)',
          700: () => 'var(--color-custom-700)',
          800: () => 'var(--color-custom-800)',
          900: () => 'var(--color-custom-900)',
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
    require("daisyui")
  ],
  daisyui: {
    themes: []
  }
}

