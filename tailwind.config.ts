import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Глибокий нічний синій — база, темні секції, текст
        ink: {
          DEFAULT: "#0B1F3A",
          800: "#13294a",
          700: "#1d3658",
          600: "#2b4a6e",
        },
        // Смарагдовий акцент — головний колір дій
        brand: {
          DEFAULT: "#1B5E4A",
          50: "#eef6f2",
          100: "#d4e9e0",
          500: "#1B5E4A",
          600: "#1B5E4A",
          700: "#154a3a",
          800: "#0f3a2d",
          900: "#0f3a2d",
        },
        emerald: {
          DEFAULT: "#1B5E4A",
          50: "#eef6f2",
          100: "#d4e9e0",
          600: "#1B5E4A",
          700: "#154a3a",
          800: "#0f3a2d",
        },
        // Приглушене золото — мінімальний проблиск
        gold: {
          DEFAULT: "#C9A227",
          50: "#faf6e8",
          400: "#E8C547",
          500: "#C9A227",
        },
        // Теплі нейтралі
        sand: {
          DEFAULT: "#F7F5F0",
          50: "#FBFAF7",
          100: "#F7F5F0",
          200: "#EFEBE3",
          300: "#E2DCD0",
        },
        slate: {
          500: "#6B7280",
          600: "#565d68",
          700: "#3f4651",
          900: "#1a1f29",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      container: {
        center: true,
        padding: "1.25rem",
        screens: { "2xl": "1180px" },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
