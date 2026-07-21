// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  // Global SCSS file - holds variables/mixins used across components,
  // on top of Tailwind's utility classes.
  css: ['~/assets/scss/main.scss'],

  app: {
    head: {
      title: 'Tasklist',
      meta: [{ name: 'description', content: 'A small task manager - track work, filter by status, and browse posts from a public API.' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap'
        }
      ]
    }
  },

  typescript: {
    strict: true
  }
})
