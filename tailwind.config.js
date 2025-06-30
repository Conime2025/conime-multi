/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./**/*.html"
  ],
  safelist: [
    {
      pattern: /data-aos/,
    },
    {
      pattern: /fade-/,
    },
    {
      pattern: /zoom-/,
    },
    {
      pattern: /flip-/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
