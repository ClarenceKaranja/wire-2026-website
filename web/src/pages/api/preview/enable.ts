import type {APIRoute} from 'astro'
import {validatePreviewUrl} from '@sanity/preview-url-secret'
import {getPreviewClient} from '../../../lib/sanity.server'
import {createPreviewToken, PREVIEW_COOKIE, previewCookieOptions} from '../../../lib/preview.server'

export const prerender = false

// Sanity Studio's Preview tab calls this with a short-lived secret that only a
// logged-in editor can create. We check that secret with Sanity, then set a
// signed cookie so this browser sees drafts for one hour.
export const GET: APIRoute = async ({request, cookies, redirect}) => {
  const client = getPreviewClient()
  const token = createPreviewToken()
  if (!client || !token) return new Response('Preview is not configured on this site.', {status: 501})

  const {isValid, redirectTo = '/'} = await validatePreviewUrl(client, request.url)
  if (!isValid) return new Response('Invalid or expired preview link. Open the preview again from Sanity Studio.', {status: 401})

  cookies.set(PREVIEW_COOKIE, token, previewCookieOptions)
  return redirect(redirectTo.startsWith('/') ? redirectTo : '/', 307)
}
