// @ts-check
import {defineConfig, envField} from 'astro/config'
import netlify from '@astrojs/netlify'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import {loadEnv} from 'vite'

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')

// The site is hosted on Cloudflare (Workers). Netlify builds still work while
// the old Netlify address is being retired (see docs/cloudflare-deployment.md).
const onNetlify = process.env.NETLIFY === 'true'
// Cloudflare's Git builds set WORKERS_CI=1.
const onCloudflare = process.env.WORKERS_CI === '1' || process.env.CF_PAGES === '1'

// On a host the site must be connected to Sanity; refuse to build a site
// that would silently show the local sample content instead.
if ((onNetlify || onCloudflare) && !env.PUBLIC_SANITY_PROJECT_ID) {
  throw new Error(
    'PUBLIC_SANITY_PROJECT_ID is not set. Add it as a build variable in Cloudflare (Worker → Settings → Build → Variables) — see docs/cloudflare-deployment.md.',
  )
}

// Netlify sets CONTEXT to "production", "deploy-preview" or "branch-deploy".
// On Cloudflare, only builds of the main branch are the public site.
const noIndex = onNetlify
  ? Boolean(process.env.CONTEXT && process.env.CONTEXT !== 'production')
  : Boolean(process.env.WORKERS_CI_BRANCH && process.env.WORKERS_CI_BRANCH !== 'main')

export default defineConfig({
  site: env.PUBLIC_SITE_URL || 'http://localhost:4321',
  // Pages are rendered on request, so content published in Sanity appears
  // without rebuilding the site.
  output: 'server',
  adapter: onNetlify ? netlify({imageCDN: false}) : cloudflare({imageService: 'passthrough'}),
  // Old addresses kept working after pages were renamed (Programme → Agenda on
  // 30 Oct 2026, Resources → Downloads on 2 Nov 2026). Browsers keep any #anchor.
  redirects: {
    '/programme': '/agenda',
    '/programme/[...rest]': '/agenda',
    '/resources': '/downloads',
    '/resources/[...rest]': '/downloads',
  },
  // The site does not use Astro sessions (no KV store needed on Cloudflare).
  session: false,
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
    define: {__NOINDEX__: JSON.stringify(noIndex), __ON_NETLIFY__: JSON.stringify(onNetlify)},
  },
})
