import toolboxConfig from '@canopie-club/toolbox/dist/runtime/common/tailwind.config.js'

// TODO: Integrate the following into the toolbox config

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Extend the toolbox configuration
  presets: [toolboxConfig],
  // ...toolboxConfig,
  // You can add your own customizations here
  theme: {
    extend: {
      colors: {
        linen: {
          '50': '#fbf6f1',
          '100': '#f7ede4',
          '200': '#ebd2bd',
          '300': '#deb293',
          '400': '#cf8c68',
          '500': '#c5704a',
          '600': '#b75c3f',
          '700': '#984836',
          '800': '#7b3d31',
          '900': '#64332a',
          '950': '#351915',
          DEFAULT: '#f7ede4'
        },
        olive: {
          '50': '#f4f5f0',
          '100': '#e6e8df',
          '200': '#d0d4c2',
          '300': '#b2b99d',
          '400': '#969e7d',
          '500': '#798360',
          '600': '#5d664a',
          '700': '#49503b',
          '800': '#3d4232',
          '900': '#353a2d',
          '950': '#1b1d16',
          DEFAULT: '#798360'
        },
        snow: {
          '50': '#eefbfd',
          '100': '#d5f2f8',
          '200': '#b0e5f1',
          '300': '#79d1e7',
          '400': '#3bb4d5',
          '500': '#1f97bb',
          '600': '#1d799d',
          '700': '#1c5d79',
          '800': '#215269',
          '900': '#1f455a',
          '950': '#0f2c3d',
          DEFAULT: '#1c5d79'
        },
        terracotta: {
          '50': '#fef4f2',
          '100': '#fde6e3',
          '200': '#fcd2cc',
          '300': '#f9b3a8',
          '400': '#f38676',
          '500': '#e85f4b',
          '600': '#d5432d',
          '700': '#b33522',
          '800': '#9d3222',
          '900': '#7b2d21',
          '950': '#43130c',
          DEFAULT: '#9d3222'
        },
      },
      screens: {
        'xxs': '320px',
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      }
    },
  },
  // Add any additional plugins or configurations
}