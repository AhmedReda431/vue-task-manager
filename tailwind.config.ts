  import type { Config } from 'tailwindcss'

  export default <Partial<Config>>{
    content: [
      './app/components/**/*.{vue,js,ts}',
      './app/layouts/**/*.vue',
      './app/pages/**/*.vue',
      './app/app.vue',
      './app/error.vue'
    ],
    theme: {
      extend: {
        colors: {
          ink: '#1b2430',
          paper: '#f1f1ec',
          accent: {
            DEFAULT: '#2f6f62',
            dark: '#296159'
          },
          gold: '#b8862b'
        },
        fontFamily: {
          display: ['"Fraunces"', 'Georgia', 'serif'],
          sans: ['"Inter"', 'system-ui', 'sans-serif']
        }
      }
    }
  }
