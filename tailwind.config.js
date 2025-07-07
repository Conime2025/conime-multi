/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./layouts/**/*.html",
  "./content/**/*.md",
  "./static/**/*.html"
],

  safelist: [
    {
      pattern: /data-aos/,
    },
    {
     pattern: /fade-(up|down|left|right)/,
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
