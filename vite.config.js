import { resolve } from 'path'
import { defineConfig } from 'vite'

import { viteStaticCopy } from 'vite-plugin-static-copy'

export default {
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'Govspeak Visual Editor',
      fileName: 'govspeak-visual-editor',
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        includePaths: [
          'node_modules/govuk-frontend',
          'node_modules/govuk_publishing_components/app/assets/stylesheets',
        ]
      }
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/govuk-frontend/govuk/assets/*',
          dest: 'assets'
        },
        {
          src: 'node_modules/govuk_publishing_components/app/assets/images/govuk_publishing_components/*',
          dest: 'assets/govuk_publishing_components'
        }
      ]
    })
  ],
  test: {
    exclude: [
      '**/node_modules/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/e2e/**',
    ],
  },
}
