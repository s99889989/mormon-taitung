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
    storesDirs: ['./stores/**'],
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:8080',
    },
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '耶穌基督後期聖徒教會-台東一支會',
      meta: [
        { name: 'description', content: '台東一支會' },
        { name: 'og:title', content: '台東一支會' },
        { name: 'og:description', content: '台東一支會' },
        { name: 'og:image', content: '/assets/icon/hat.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          href: 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.css',
          rel: 'stylesheet'
        },
      ],
      script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.0.0/datepicker.min.js' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js' },
        { src: 'https://kit.fontawesome.com/168d3a888b.js', crossorigin: 'anonymous' },
      ]
    }
  },


})