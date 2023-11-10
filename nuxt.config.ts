// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=500, initial-scale=1',
      title: '台東一支會',
      meta: [
        { name: 'description', content: '台東一支會' },
        { name: 'og:title', content: '台東一支會' },
        { name: 'og:description', content: '台東一支會' },
        { name: 'og:image', content: '/logo.png' },

      ],
      link: [
        {
          rel: "icon",
          href: "/logo.png",
        },
        {
          href: "https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.css",
          rel: "stylesheet"
        }
      ],
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.0.0/datepicker.min.js",
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js",
        },
        {
          src: "https://cdn.jsdelivr.net/npm/marked@3.0.6/marked.min.js",
        },
        {
          src: "https://kit.fontawesome.com/168d3a888b.js",
          crossorigin: "anonymous"
        },
      ]
    }
  }

})
