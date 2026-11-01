/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/*/.{js,ts,jsx,tsx,mdx}",
    "./components/*/.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",  // your background
        ink: "#0B1220",    // your text
      },
      fontFamily: {
        body: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      }
    },
  },
  plugins: [],
}