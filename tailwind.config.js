/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector", '[class="p-dark"]'],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-motion")],
};
