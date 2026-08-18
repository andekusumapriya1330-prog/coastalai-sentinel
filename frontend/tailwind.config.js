/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#070B14",
        ink: "#0B1220",
        panel: "#101A2C",
        line: "#1E2A40",
        chart: "#22D3EE",
        chart2: "#5EEAD4",
        coral: "#FB7185",
        amber: "#F5A524",
        parchment: "#E8E2D0",
        mute: "#7C8AA3",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        contour:
          "repeating-radial-gradient(circle at 20% 20%, rgba(94,234,212,0.05) 0, rgba(94,234,212,0.05) 1px, transparent 1px, transparent 34px)",
      },
    },
  },
  plugins: [],
};
