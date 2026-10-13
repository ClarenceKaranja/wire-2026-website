import type {APIRoute} from 'astro'
import {PREVIEW_COOKIE, previewCookieOptions} from '../../../lib/preview.server'

export const prerender = false

export const GET: APIRoute = ({cookies, redirect, url}) => {
  cookies.delete(PREVIEW_COOKIE, previewCookieOptions)
  const to = url.searchParams.get('redirect') || '/'
  return redirect(to.startsWith('/') && !to.startsWith('//') ? to : '/', 307)
}
