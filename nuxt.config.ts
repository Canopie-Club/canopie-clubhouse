import { defineNuxtConfig } from 'nuxt/config'
import fs from 'fs'
import path from 'path'

// import { fileURLToPath } from 'node:url'
// import { dirname, join } from 'node:path'
//
// const currentDir = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@nuxtjs/mdc",
    // "@nuxthub/core",
    "@canopie-club/toolbox",
    "@nuxt/ui",
    "@nuxt/fonts",
    "@vueuse/nuxt",
    "shadcn-nuxt"
  ],

  components: [
    {
      path: '~/components/Editor',
      pathPrefix: false,
      extensions: ['.vue'],
    },
    {
      path: '~/components/Explorer',
      pathPrefix: false,
      extensions: ['.vue'],
    },
    {
      path: '~/components/ui',
      pathPrefix: false,
      extensions: ['.vue'],
      prefix: 'Ui',
    },
    '~/components'
  ],

  ui: {
    // global: true
    // @ts-expect-error
    primary: 'amber',
    safelistColors: ['amber', 'stone']
  },

  uiPro: {

  },

  nitro: {
    experimental: {
      openAPI: true,
      tasks: true
    },

    rollupConfig: {
      external: ['papaparse']
    }
  },

  hub: {
    database: true,
    blob: true
  },

  i18n: {
    locales: [
      {
        code: "en",
        name: "English",
        file: "assets/lang/en.json",
      },
      {
        code: "fr",
        name: "Français",
        file: "assets/lang/fr.json",
      },
    ],
    defaultLocale: "en",
    // vueI18n: {
    //   messages: {
    //     en: {
    //       welcome: 'Welcome to the club'
    //     },
    //     fr: {
    //       welcome: 'Bienvenue au club'
    //     }
    //   }
    // },
    strategy: "no_prefix",
  },

  css: [
    // '@canopie-club/toolbox/dist/runtime/common/app/assets/tailwind.css'
  ],

  // components: [
  //   {
  //     path: join(currentDir, './components/ui'),
  //     // this is required else Nuxt will autoImport `.ts` file
  //     extensions: ['.vue', '.ts'],
  //   },
  // ]

  vite: {
    optimizeDeps: {
      exclude: ['vee-validate']
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },

    plugins: [
      // {
      //   name: 'log-css-virtual-file',
      //   transform(code, id) {
      //     if (id.includes('virtual:nuxt') && id.endsWith('css.mjs')) {
      //       // Optionally write to a file for easier inspection
      //       fs.writeFileSync(path.join(process.cwd(), 'virtual-css-content.mjs'), code)
      //     }
      //     return null
      //   }
      // }
    ]
  }
});