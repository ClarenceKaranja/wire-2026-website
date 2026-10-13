// Server-only: reads secrets. Never import this from client-side scripts.
import {createClient, type SanityClient} from '@sanity/client'
import {getSecret} from 'astro:env/server'
import {API_VERSION, dataset, getPublishedClient, projectId} from './sanity'

let previewClient: SanityClient | undefined

/** Client that can read drafts, used only for logged-in editor previews. */
export function getPreviewClient(): SanityClient | undefined {
  const token = getSecret('SANITY_API_READ_TOKEN')
  if (!projectId || !token) return undefined
  previewClient ??= createClient({
    projectId,
    dataset,
    apiVersion: API_VERSION,
    useCdn: false,
    token,
    perspective: 'drafts',
  })
  return previewClient
}

export function getClient(preview: boolean): SanityClient {
  return (preview && getPreviewClient()) || getPublishedClient()
}
