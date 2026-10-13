// Local sample content, used only when no Sanity project is configured
// (for example when running the site on a laptop before Sanity is set up).
// It reads the same seed file that is imported into Sanity, and runs the
// same GROQ queries over it with groq-js, so local and live behave alike.
import {readFileSync, statSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {evaluate, parse} from 'groq-js'
import seedRaw from '../../../seed/dataset.ndjson?raw'

type Doc = Record<string, unknown> & {_id: string; _type: string}

export const SEED_ASSET_DIR = resolve(process.cwd(), '../seed/assets')

const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
}

function jpegSize(buf: Buffer): {width: number; height: number} | undefined {
  let i = 2
  while (i < buf.length) {
    if (buf[i] !== 0xff) return undefined
    const marker = buf[i + 1]
    const len = buf.readUInt16BE(i + 2)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return {height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7)}
    }
    i += 2 + len
  }
  return undefined
}

let cache: Doc[] | undefined

function load(): Doc[] {
  if (cache) return cache
  const docs: Doc[] = seedRaw
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
  const assets = new Map<string, Doc>()

  const walk = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(walk)
    if (!node || typeof node !== 'object') return node
    const obj = node as Record<string, unknown>
    if (typeof obj._sanityAsset === 'string') {
      const [kind, path] = obj._sanityAsset.split('@file://./assets/')
      const ext = path.split('.').pop()!.toLowerCase()
      const id = `${kind}-local-${path.replace(/\W+/g, '-')}`
      if (!assets.has(id)) {
        const full = join(SEED_ASSET_DIR, path)
        let size = 0
        let dimensions
        try {
          size = statSync(full).size
          if (kind === 'image' && (ext === 'jpg' || ext === 'jpeg')) dimensions = jpegSize(readFileSync(full))
        } catch {
          /* missing file: still render, link will 404 */
        }
        assets.set(id, {
          _id: id,
          _type: kind === 'image' ? 'sanity.imageAsset' : 'sanity.fileAsset',
          url: `/seed-assets/${path}`,
          originalFilename: path,
          extension: ext,
          mimeType: MIME[ext] ?? 'application/octet-stream',
          size,
          metadata: dimensions ? {dimensions: {...dimensions, aspectRatio: dimensions.width / dimensions.height}} : {},
        })
      }
      const {_sanityAsset, ...rest} = obj
      return {...walkObject(rest), asset: {_type: 'reference', _ref: id}}
    }
    return walkObject(obj)
  }
  const walkObject = (obj: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, walk(v)]))

  const converted = docs.map(
    (d) => ({_createdAt: '2026-10-13T06:00:00Z', _updatedAt: '2026-10-13T06:00:00Z', ...(walk(d) as Doc)}) as Doc,
  )
  cache = [...converted, ...assets.values()]
  return cache
}

export async function localFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const tree = parse(query, {params})
  const result = await evaluate(tree, {dataset: load(), params})
  return (await result.get()) as T
}
