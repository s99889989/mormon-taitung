/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./node_modules/flowbite/**/*.{js,ts}"
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1800px', // 超寬螢幕，顯示 6 欄
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

