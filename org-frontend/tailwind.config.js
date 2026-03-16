/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        "primary-hover": "var(--color-primaryHover)",
        "primary-border": "var(--color-primaryBorder)",
        text: "var(--color-text)",
      },
    },
  },
  plugins: [],
};