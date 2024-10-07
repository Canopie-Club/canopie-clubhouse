import toolboxConfig from '@canopie-club/toolbox/dist/runtime/common/tailwind.config.js'

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Extend the toolbox configuration
  presets: [toolboxConfig],
  // ...toolboxConfig,
  // You can add your own customizations here
  theme: {
    extend: {
      // ... your custom theme extensions
    },
  },
  // Add any additional plugins or configurations
}