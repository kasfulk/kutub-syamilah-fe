import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#012d1d",
        secondary: "#705c23",
        background: "#fcf9f0",
        surface: "#fcf9f0",
        "surface-container": "#f1eee5",
        "surface-container-low": "#f6f3ea",
        "on-surface": "#1c1c17",
        "on-surface-variant": "#414844",
      },
      fontFamily: {
        headline: ["Noto Serif Arabic", "serif"],
        body: ["Newsreader", "serif"],
        label: ["Inter", "sans-serif"],
      },
    },
  },
};

export default config;
