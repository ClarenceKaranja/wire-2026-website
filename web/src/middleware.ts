import {defineMiddleware} from 'astro:middleware'
import {PUBLIC_SANITY_STUDIO_URL} from 'astro:env/client'
import {isValidPreviewToken, PREVIEW_COOKIE} from './lib/preview.server'

const frameAncestors = ["'self'", 'https://*.sanity.studio', PUBLIC_SANITY_STUDIO_URL].filter(Boolean).join(' ')

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.preview = context.isPrerendered ? false : isValidPreviewToken(context.cookies.get(PREVIEW_COOKIE)?.value)

  const response = await next()
  const headers = response.headers

  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
  // Only the site itself and Sanity Studio (for editor previews) may show the site in a frame.
  headers.set('Content-Security-Policy', `frame-ancestors ${frameAncestors}; base-uri 'self'; object-src 'none'`)

  if (__NOINDEX__) headers.set('X-Robots-Tag', 'noindex, nofollow')

  if (context.isPrerendered) return response

  // Caching: published pages are cached on Netlify's CDN for 60 seconds and then
  // refreshed in the background, so Sanity changes appear without a rebuild.
  // Editor previews (drafts) are never cached.
  headers.set('Netlify-Vary', `cookie=${PREVIEW_COOKIE}`)
  if (context.url.pathname.startsWith('/api/') || context.locals.preview || response.status >= 500) {
    headers.set('Cache-Control', 'private, no-store')
    headers.set('Netlify-CDN-Cache-Control', 'no-store')
    if (context.locals.preview) headers.set('X-Robots-Tag', 'noindex, nofollow')
  } else if (!headers.has('Cache-Control')) {
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    headers.set('Netlify-CDN-Cache-Control', 'public, durable, s-maxage=60, stale-while-revalidate=604800')
    headers.set('Netlify-Cache-Tag', 'content')
  }
  return response
})
