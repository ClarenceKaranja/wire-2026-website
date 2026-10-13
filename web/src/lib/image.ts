import {createImageUrlBuilder} from '@sanity/image-url'
import {dataset, projectId} from './sanity'

export type SanityImage = {
  alt?: string
  caption?: string
  credit?: string
  hotspot?: unknown
  crop?: unknown
  asset?: {_id: string; url: string; metadata?: {lqip?: string; dimensions?: {width: number; height: number; aspectRatio: number}}}
} | null | undefined

const builder = projectId ? createImageUrlBuilder({projectId, dataset}) : undefined

const isLocal = (img: SanityImage) => !img?.asset?._id || img.asset.url.startsWith('/')

/** URL for an image at a given width (and optional height for cropping), served as WebP/AVIF where supported. */
export function imageUrl(img: SanityImage, width: number, height?: number): string {
  if (!img?.asset) return ''
  if (isLocal(img) || !builder) return img.asset.url
  let b = builder.image(img as never).width(width).auto('format').quality(80).fit(height ? 'crop' : 'max')
  if (height) b = b.height(height)
  return b.url()
}

/** srcset string for responsive images. */
export function imageSrcSet(img: SanityImage, widths: number[], aspect?: number): string | undefined {
  if (!img?.asset || isLocal(img)) return undefined
  return widths.map((w) => `${imageUrl(img, w, aspect ? Math.round(w / aspect) : undefined)} ${w}w`).join(', ')
}

export function imageDimensions(img: SanityImage) {
  return img?.asset?.metadata?.dimensions
}
