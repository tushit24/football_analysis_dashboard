import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg, #071022)",
        panel: "var(--panel, #0e1b36)",
        panel2: "var(--panel2, #13244a)",
        line: "var(--line, #233559)",
        tx: "var(--tx, #eef3f8)",
        mut: "var(--mut, #8fa1c0)",
        pitch: {
          DEFAULT: "var(--g, #19c37d)",
          dark: "var(--g2, #0f8f5c)",
          light: "#2de396",
        },
        gold: "var(--gold, #f6c744)",
        alert: "var(--red, #ef5b5b)",
        club: "var(--club, #e4202c)",
      },
      fontFamily: {
        display: ["var(--font-barlow-condensed)", "Barlow Condensed", "sans-serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px var(--club, rgba(228, 32, 44, 0.35))",
        "pitch-glow": "0 0 25px -5px rgba(25, 195, 125, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
