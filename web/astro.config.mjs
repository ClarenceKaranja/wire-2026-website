// @ts-check
import {defineConfig, envField} from 'astro/config'
import netlify from '@astrojs/netlify'
import tailwindcss from '@tailwindcss/vite'
import {loadEnv} from 'vite'

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')

// On Netlify the site must be connected to Sanity; refuse to build a site
// that would silently show the local sample content instead.
if (process.env.NETLIFY === 'true' && !env.PUBLIC_SANITY_PROJECT_ID) {
  throw new Error(
    'PUBLIC_SANITY_PROJECT_ID is not set. Add it in Netlify → Site configuration → Environment variables (see docs/netlify-deployment.md).',
  )
}

// Netlify sets CONTEXT to "production", "deploy-preview" or "branch-deploy".
// Anything other than the production site is hidden from search engines.
const noIndex = Boolean(process.env.CONTEXT && process.env.CONTEXT !== 'production')

export default defineConfig({
  site: env.PUBLIC_SITE_URL || 'http://localhost:4321',
  // Pages are rendered on request and cached by Netlify's CDN, so content
  // published in Sanity appears without rebuilding the site.
  output: 'server',
  adapter: netlify({imageCDN: false}),
  trailingSlash: 'ignore',
  compressHTML: true,
  security: {checkOrigin: true},
  devToolbar: {enabled: false},
  env: {
    schema: {
      PUBLIC_SANITY_PROJECT_ID: envField.string({context: 'client', access: 'public', optional: true}),
      PUBLIC_SANITY_DATASET: envField.string({context: 'client', access: 'public', default: 'production'}),
      PUBLIC_SANITY_STUDIO_URL: envField.string({context: 'client', access: 'public', optional: true}),
      PUBLIC_SITE_URL: envField.string({context: 'client', access: 'public', optional: true}),
      // Server-only secrets. Never prefix these with PUBLIC_.
      SANITY_API_READ_TOKEN: envField.string({context: 'server', access: 'secret', optional: true}),
      SANITY_WEBHOOK_SECRET: envField.string({context: 'server', access: 'secret', optional: true}),
      PREVIEW_COOKIE_SECRET: envField.string({context: 'server', access: 'secret', optional: true}),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    define: {__NOINDEX__: JSON.stringify(noIndex)},
  },
})
