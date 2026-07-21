// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],

  // Global SCSS file - holds variables/mixins used across components,
  // on top of Tailwind's utility classes.
  css: ['~/assets/scss/main.scss'],

  typescript: {
    strict: true
  }
})
