import type {APIRoute} from 'astro'
import {getSecret} from 'astro:env/server'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'

export const prerender = false

// Optional instant refresh. A Sanity webhook calls this when published content
// changes; we check the webhook's signature and clear Netlify's page cache so
// the next visitor sees the change immediately (instead of within ~60 seconds).
// On Cloudflare pages are not cached by the CDN, so there is nothing to clear.
export const POST: APIRoute = async ({request}) => {
  const secret = getSecret('SANITY_WEBHOOK_SECRET')
  if (!secret) return new Response('Webhook secret not configured', {status: 501})

  const body = await request.text()
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? ''
  if (!(await isValidSignature(body, signature, secret))) {
    return new Response('Invalid signature', {status: 401})
  }

  if (!__ON_NETLIFY__) return Response.json({ok: true, purged: []})
  try {
    const {purgeCache} = await import('@netlify/functions')
    await purgeCache({tags: ['content']})
  } catch (error) {
    console.error('Cache purge failed', error)
    return new Response('Cache purge failed; pages will still refresh within about a minute', {status: 500})
  }
  return Response.json({ok: true, purged: ['content']})
}
