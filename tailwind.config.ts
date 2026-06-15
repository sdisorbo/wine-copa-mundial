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
        gold: "#b8862f", // readable amber accent on light surfaces
        goldlt: "#e9c46a", // bright gold for dark surfaces (header / hero)
        ink: "#372034", // deep wine-purple: header bg + primary text on light
        inkdeep: "#281725", // darker still: dark card hover
        paper: "#f0ede8", // off-white page background
        paper2: "#e6ded0", // subtle alternate light surface
        bone: "#f0ede8", // light text on dark surfaces
        shade: "#141414", // neutral dark for photo overlays (not purple)
        // Tournament status colors (tuned for light backgrounds)
        advance: "#0f766e", // teal
        eliminate: "#c0392b", // red
        wildcard: "#7c3aed", // purple
        runner: "#b8862f", // amber (runner-up)
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
