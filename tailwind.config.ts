import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: "#9b2226",
        gold: "#e9c46a",
        ink: "#372034",
        inkdeep: "#281725",
        bone: "#f0ede8",
        // Tournament status colors
        advance: "#2dd4bf", // teal
        eliminate: "#ef4444", // red
        wildcard: "#a855f7", // purple
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      letterSpacing: {
        cinematic: "0.15em",
        wide2: "0.25em",
      },
      borderColor: {
        hair: "rgba(255,255,255,0.15)",
      },
      maxWidth: {
        page: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
