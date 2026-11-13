/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./admin/**/*.html", "./farmer/**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effaf3", 100: "#d8f3e1", 200: "#b4e6c8", 300: "#82d3a5", 400: "#4fb97f",
          500: "#2f9e65", 600: "#217f4f", 700: "#1d6542", 800: "#1b5136", 900: "#17432d",
        },
        milk: { 50: "#fffdf8", 100: "#fdf8ec", 200: "#f8eed3" },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: { card: "0 1px 3px rgba(23,67,45,.08), 0 1px 2px rgba(23,67,45,.06)" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};