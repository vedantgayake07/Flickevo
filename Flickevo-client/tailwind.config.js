/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flickBg: "#14151A",
        flickSurface: "#1D1F27",
        flickSurface2: "#22242E",
        flickText: "#F2EEE6",
        flickMuted: "#9C9A96",
        flickCyan: "#64def5",
        flickCyanGlow: "#9ef0ff",
        flickRed: "#C1443C",
        flickBorder: "rgba(242, 238, 230, 0.08)",
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
