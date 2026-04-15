/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        swiss: {
          bg:      "#FFFFFF",
          fg:      "#000000",
          muted:   "#F2F2F2",
          accent:  "#FF3000",
          border:  "#000000",
        },
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        "10xl": ["10rem",  { lineHeight: "0.9" }],
        "11xl": ["12rem",  { lineHeight: "0.85" }],
      },
    },
  },
  plugins: [],
};

