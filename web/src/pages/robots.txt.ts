import type {APIRoute} from 'astro'

export const GET: APIRoute = ({site}) => {
  if (__NOINDEX__) {
    return new Response('User-agent: *\nDisallow: /\n', {headers: {'Content-Type': 'text/plain; charset=utf-8'}})
  }
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /seed-assets/',
    'Disallow: /studio/',
    '',
    `Sitemap: ${new URL('/sitemap.xml', site)}`,
    '',
  ].join('\n')
  return new Response(body, {headers: {'Content-Type': 'text/plain; charset=utf-8'}})
}
