import {hasSanity} from './sanity'
import {getClient} from './sanity.server'
import {localFetch} from './local-dataset'
import {nairobiToday} from './time'
import * as Q from './queries'

/** Runs a GROQ query against Sanity, or against the local sample content when Sanity is not configured. */
export async function fetchContent<T>(query: string, preview = false, params: Record<string, unknown> = {}): Promise<T> {
  const now = new Date()
  const allParams = {now: now.toISOString(), today: nairobiToday(now), ...params}
  if (!hasSanity) return localFetch<T>(query, allParams)
  return getClient(preview).fetch<T>(query, allParams)
}

export type PortableTextValue = unknown[]

export type Settings = {
  shortTitle: string
  eventName: string
  edition?: string
  startDate: string
  endDate: string
  city: string
  country: string
  venueName?: string
  eventPhase?: string
  organizerLine?: string
  contactEmail: string
  contacts?: Array<{_key: string; label: string; name?: string; email?: string; phone?: string; note?: string}>
  footerNote?: string
  logo?: import('./image').SanityImage
  socialImage?: import('./image').SanityImage
  notice?: {active?: boolean; message?: string; href?: string; until?: string}
}

const FALLBACK_SETTINGS: Settings = {
  shortTitle: 'WIRE 2026',
  eventName: 'Wildlife Inter-Regional Enforcement (WIRE) Forum',
  edition: '10th',
  startDate: '2026-11-03',
  endDate: '2026-11-06',
  city: 'Nairobi',
  country: 'Kenya',
  contactEmail: 'unodc-wire@un.org',
}

export async function getSettings(preview = false): Promise<Settings> {
  const s = await fetchContent<Settings | null>(Q.SETTINGS_QUERY, preview)
  return {...FALLBACK_SETTINGS, ...(s ?? {})}
}

export {Q}
