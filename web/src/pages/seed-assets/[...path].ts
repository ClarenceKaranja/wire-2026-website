import type {APIRoute} from 'astro'
import {readFile} from 'node:fs/promises'
import {join, normalize} from 'node:path'
import {hasSanity} from '../../lib/sanity'
import {SEED_ASSET_DIR} from '../../lib/local-dataset'

export const prerender = false

const TYPES: Record<string, string> = {jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf'}

// Serves the bundled sample images and PDFs, only while no Sanity project is connected.
export const GET: APIRoute = async ({params}) => {
  if (hasSanity) return new Response('Not found', {status: 404})
  const rel = normalize(params.path ?? '').replace(/^(\.\.(\/|\\|$))+/, '')
  if (!/^[\w.-]+$/.test(rel)) return new Response('Not found', {status: 404})
  try {
    const data = await readFile(join(SEED_ASSET_DIR, rel))
    return new Response(data, {headers: {'Content-Type': TYPES[rel.split('.').pop()!] ?? 'application/octet-stream'}})
  } catch {
    return new Response('Not found', {status: 404})
  }
}
