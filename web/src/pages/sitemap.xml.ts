import type {APIRoute} from 'astro'
import {fetchContent, Q} from '../lib/content'

const PAGES = ['/', '/agenda', '/participant-information', '/participant-information/fr', '/participant-information/pt', '/resources', '/gallery', '/announcements', '/about']

export const GET: APIRoute = async ({site}) => {
  const data = await fetchContent<{albums: Array<{slug: string; _updatedAt?: string}>}>(Q.SITEMAP_QUERY)
  const urls = [
    ...PAGES.map((p) => ({loc: new URL(p, site).toString()})),
    ...(data.albums ?? []).map((a) => ({loc: new URL(`/gallery/${a.slug}`, site).toString(), lastmod: a._updatedAt})),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`
  return new Response(xml, {headers: {'Content-Type': 'application/xml; charset=utf-8'}})
}
