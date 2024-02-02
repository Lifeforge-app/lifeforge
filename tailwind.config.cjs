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
          50: 'rgb(var(--color-bg-50) / <alpha-value>)',
          100: 'rgb(var(--color-bg-100) / <alpha-value>)',
          200: 'rgb(var(--color-bg-200) / <alpha-value>)',
          300: 'rgb(var(--color-bg-300) / <alpha-value>)',
          400: 'rgb(var(--color-bg-400) / <alpha-value>)',
          500: 'rgb(var(--color-bg-500) / <alpha-value>)',
          600: 'rgb(var(--color-bg-600) / <alpha-value>)',
          700: 'rgb(var(--color-bg-700) / <alpha-value>)',
          800: 'rgb(var(--color-bg-800) / <alpha-value>)',
          900: 'rgb(var(--color-bg-900) / <alpha-value>)',
          950: () => 'rgb(var(--color-bg-950) / <alpha-value>)',
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

