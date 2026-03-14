/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playwrite: ['"Playwrite AU VIC"', 'cursive'],
        quicksand: ['"Quicksand"', 'sans-serif'],
        caveat: ['"Caveat"', 'cursive']
        }
      }
  },
  plugins: [],
};


