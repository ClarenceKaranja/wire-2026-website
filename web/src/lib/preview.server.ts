// Server-only helpers for the editor preview cookie.
import {createHmac, timingSafeEqual} from 'node:crypto'
import {getSecret} from 'astro:env/server'

export const PREVIEW_COOKIE = 'wire_preview'
const MAX_AGE_SECONDS = 60 * 60 // one hour

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

/** Creates a signed cookie value that expires after one hour. */
export function createPreviewToken(): string | undefined {
  const secret = getSecret('PREVIEW_COOKIE_SECRET')
  if (!secret) return undefined
  const expires = String(Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS)
  return `${expires}.${sign(expires, secret)}`
}

export function isValidPreviewToken(token: string | undefined): boolean {
  const secret = getSecret('PREVIEW_COOKIE_SECRET')
  if (!secret || !token) return false
  const [expires, mac] = token.split('.')
  if (!expires || !mac || Number(expires) < Date.now() / 1000) return false
  const expected = Buffer.from(sign(expires, secret))
  const given = Buffer.from(mac)
  return expected.length === given.length && timingSafeEqual(expected, given)
}

export const previewCookieOptions = {
  path: '/',
  httpOnly: true,
  secure: true,
  // The preview runs inside Sanity Studio (a different site), so the cookie
  // must be allowed in that frame; "partitioned" keeps it isolated there.
  sameSite: 'none' as const,
  partitioned: true,
  maxAge: MAX_AGE_SECONDS,
}
