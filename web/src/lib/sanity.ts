import {createClient, type SanityClient} from '@sanity/client'
import {PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID} from 'astro:env/client'

export const API_VERSION = '2026-10-01'
export const projectId = PUBLIC_SANITY_PROJECT_ID
export const dataset = PUBLIC_SANITY_DATASET
/** True when the site reads from Sanity; false when it shows the bundled sample content. */
export const hasSanity = Boolean(projectId)

let publishedClient: SanityClient | undefined

/** Read-only client for published content. Uses no token, so it can never see drafts. */
export function getPublishedClient(): SanityClient {
  if (!projectId) throw new Error('Sanity project ID is not configured')
  publishedClient ??= createClient({projectId, dataset, apiVersion: API_VERSION, useCdn: true, perspective: 'published'})
  return publishedClient
}
