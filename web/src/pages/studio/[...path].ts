import type {APIRoute} from 'astro'

export const prerender = false

// The Studio is a single-page app: its files are served from /studio/, and any
// deeper Studio address (e.g. /studio/structure/session) gets the same page.
// The page only loads the editor; signing in with Sanity is required to see or
// change anything.
const files = import.meta.glob('/public/studio/index.html', {query: '?raw', import: 'default', eager: true})
const html = files['/public/studio/index.html'] as string | undefined

export const GET: APIRoute = () => {
  if (!html) return new Response('The content editor is not part of this build.', {status: 404})
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Netlify-CDN-Cache-Control': 'public, s-maxage=300',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
