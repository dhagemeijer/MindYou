import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111318",       // primary text / light-mode ink
        slate: "#2A2D33",     // secondary dark
        cream: "#F6F4EF",     // light background / dark-mode text
        steel: "#4A4F58",     // dark-mode secondary
        gold: "#C9A66B",      // accent, both modes
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
