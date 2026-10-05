/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flickBg: "#0d0e12",
        flickSurface: "#15171e",
        flickSurface2: "#1c1e27",
        flickText: "#f5f3ee",
        flickMuted: "#9ea2ad",
        flickCyan: "#f3b236",
        flickCyanGlow: "#ffd066",
        flickAmber: "#f3b236",
        flickRed: "#e53935",
        flickBorder: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      screens: {
        xs: "480px",
      }
    },
  },
  plugins: [],
}
