/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        skyLove: {
          dark: "#0c4a6e",
          pink: "#fb7185",
          softPink: "#fda4af",
          background: "#e0f2fe",
        },
      },
      boxShadow: {
        romantic: "0 10px 30px rgba(12, 74, 110, 0.12)",
        glass: "0 16px 46px rgba(12, 74, 110, 0.13)",
      },
      fontFamily: {
        heading: ["Fredoka", "ui-rounded", "system-ui", "sans-serif"],
        body: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}

