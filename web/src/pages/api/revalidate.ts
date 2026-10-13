import type {APIRoute} from 'astro'
import {getSecret} from 'astro:env/server'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {purgeCache} from '@netlify/functions'

export const prerender = false

// Optional instant refresh. A Sanity webhook calls this when published content
// changes; we check the webhook's signature and clear Netlify's page cache so
// the next visitor sees the change immediately (instead of within ~60 seconds).
export const POST: APIRoute = async ({request}) => {
  const secret = getSecret('SANITY_WEBHOOK_SECRET')
  if (!secret) return new Response('Webhook secret not configured', {status: 501})

  const body = await request.text()
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? ''
  if (!(await isValidSignature(body, signature, secret))) {
    return new Response('Invalid signature', {status: 401})
  }

  try {
    await purgeCache({tags: ['content']})
  } catch (error) {
    console.error('Cache purge failed', error)
    return new Response('Cache purge failed; pages will still refresh within about a minute', {status: 500})
  }
  return Response.json({ok: true, purged: ['content']})
}
