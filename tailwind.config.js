/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./static/**/*.html"
  ],

  safelist: [
    // === AOS animations ===
    { pattern: /data-aos/ },
    { pattern: /fade-(up|down|left|right)/ },
    { pattern: /zoom-/ },
    { pattern: /flip-/ },

    // === Opacity utilities ===
    { pattern: /opacity-(0|50|75|80|100)/ },
    { pattern: /dark:opacity-(0|50|75|80|100)/ },
    { pattern: /group-hover:opacity-100/ },
    { pattern: /group-hover:lg:opacity-100/ },

    // === Z-index ===
    { pattern: /z-10/ },
    { pattern: /-z-10/ },
    { pattern: /group-hover:z-10/ },
    { pattern: /group-hover:-z-10/ },
    { pattern: /group-hover:lg:z-10/ },
    { pattern: /group-hover:lg:-z-10/ },

    // === Brightness utilities ===
    { pattern: /brightness-/ },
    { pattern: /hover:brightness-/ },

    // === Transition & animation ===
    { pattern: /transition/ },
    { pattern: /duration-/ },
    { pattern: /ease-in-out/ },

    // === Responsive layout ===
    { pattern: /lg:/ },

    // === Width and Height ===
    { pattern: /w-(full|fit|1\/2|1\/3|1\/4|2\/3|3\/4|80%|\[360px\])/ },
    { pattern: /lg:w-(70%|full)/ },
    { pattern: /h-(full|fit|60%|auto)/ },
    { pattern: /lg:h-(70%|full)/ },

    // === Text utilities ===
    { pattern: /text-(xs|sm|xl|2xl|5xl)/ },
    { pattern: /font-(light|extralight|normal|medium|semibold|bold)/ },
    { pattern: /uppercase/ },
    { pattern: /line-clamp-(1|2|3|4)/ },
    { pattern: /break-words/ },

    // === Text color utilities ===
    { pattern: /text-gray-(100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /dark:text-gray-(100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /hover:text-gray-(200|300|600)/ },
    { pattern: /dark:hover:text-gray-(800|900)/ },
    { pattern: /text-conime-/ },
    { pattern: /dark:text-conime-/ },
    { pattern: /hover:text-conime-/ },
    { pattern: /dark:hover:text-conime-/ },

    // === Background colors (including dark mode) ===
    { pattern: /bg-conime-/ },
    { pattern: /bg-gray-(100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /dark:bg-gray-(100|200|300|400|500|600|700|800|900|950)/ },
    { pattern: /hover:bg-gray-(200|300|600)/ },
    { pattern: /dark:hover:bg-gray-(800|900)/ },
    { pattern: /hover:bg-conime-600/ },
    { pattern: /dark:hover:bg-conime-300/ },
    { pattern: /bg-white/ },
    { pattern: /dark:bg-white/ },
    { pattern: /dark:bg-gray-900/ },
    { pattern: /dark:bg-gray-950/ },

    // === Border utilities ===
    { pattern: /border/ },
    { pattern: /border-gray-(300|400|600|800)/ },
    { pattern: /border-red-500/ },

    // === Rounded corners and shadow ===
    { pattern: /rounded/ },
    { pattern: /rounded-(t|tr|xl)/ },
    { pattern: /shadow/ },
    { pattern: /shadow-lg/ },
    { pattern: /dark:shadow-gray-950/ },

    // === Position and transform ===
    { pattern: /translate/ },
    { pattern: /-translate/ },
    { pattern: /scale-(95|100)/ },
    { pattern: /left-1\/2/ },
    { pattern: /top-1\/2/ },
    { pattern: /inset-0/ },

    // === Display, Flex, and Visibility ===
    { pattern: /hidden/ },
    { pattern: /block/ },
    { pattern: /flex/ },
    { pattern: /overflow/ },
    { pattern: /overflow-y-auto/ },
    { pattern: /overflow-x-auto/ },
    { pattern: /overflow-style-custom-(x|y)/ },
    { pattern: /cursor-not-allowed/ },

    // === Miscellaneous ===
    { pattern: /active/ },
    { pattern: /group/ },
    { pattern: /hover:/ },
    { pattern: /md:/ },
    { pattern: /px-/ },
    { pattern: /pb-/ },
    { pattern: /mb-/ },
    { pattern: /gap-/ },
    'scale-95',
    'scale-100',
    'opacity-0',
    'opacity-100',
    'translate-y-0',
    'translate-y-6',
     'z-[999]',
     '-z-[999]',
  ],

  theme: {
    extend: {},
  },

  plugins: [],
}
