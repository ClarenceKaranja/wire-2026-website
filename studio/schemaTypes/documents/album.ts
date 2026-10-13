import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons/Images'
import {ALBUM_ACTIVITIES, IMAGE_MAX_BYTES, IMAGE_WARN_BYTES} from '../constants'
import {assetSizeLimit} from '../validation'

/** One photograph inside an album. */
export const galleryPhoto = defineArrayMember({
  name: 'galleryPhoto',
  title: 'Photo',
  type: 'image',
  options: {hotspot: true, accept: 'image/jpeg,image/png,image/webp', storeOriginalFilename: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      description: 'Describe what the photo shows for people using screen readers. Required.',
      type: 'string',
      validation: (r) => r.required().error('Add alternative text before publishing.'),
    }),
    defineField({name: 'caption', title: 'Caption', type: 'string', validation: (r) => r.max(220)}),
    defineField({name: 'credit', title: 'Photo credit', type: 'string'}),
    defineField({
      name: 'visible',
      title: 'Show on website',
      description: 'Untick to hide just this photo without deleting it.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'isCover',
      title: 'Use as album cover',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the homepage',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  validation: (rule) => [
    rule.custom(assetSizeLimit(IMAGE_MAX_BYTES, 'This photo is too large. Export it at a smaller size and upload again')),
    rule.custom(assetSizeLimit(IMAGE_WARN_BYTES, 'Large photo: it will work, but uploads are slow')).warning(),
  ],
  preview: {
    select: {title: 'caption', alt: 'alt', media: 'asset', visible: 'visible', cover: 'isCover', featured: 'featured'},
    prepare: ({title, alt, media, visible, cover, featured}) => ({
      title: `${visible === false ? '[Hidden] ' : ''}${cover ? '[Cover] ' : ''}${featured ? '★ ' : ''}${title || alt || 'No caption'}`,
      media,
    }),
  },
})

export const album = defineType({
  name: 'album',
  title: 'Photo album',
  type: 'document',
  icon: ImagesIcon,
  groups: [
    {name: 'photos', title: 'Photos', default: true},
    {name: 'details', title: 'Album details'},
  ],
  fields: [
    defineField({name: 'title', title: 'Album title', type: 'string', group: ['photos', 'details'], validation: (r) => r.required().max(80)}),
    defineField({
      name: 'slug',
      title: 'Web address',
      description: 'Click "Generate" to create it from the title.',
      type: 'slug',
      group: 'details',
      options: {source: 'title', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({name: 'description', title: 'Short description', type: 'text', rows: 3, group: 'details', validation: (r) => r.max(400)}),
    defineField({
      name: 'activity',
      title: 'Activity',
      type: 'string',
      group: 'details',
      options: {list: ALBUM_ACTIVITIES},
    }),
    defineField({
      name: 'day',
      title: 'Programme day (optional)',
      type: 'reference',
      to: [{type: 'programmeDay'}],
      group: 'details',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Position in the gallery',
      description: 'Lower numbers appear first.',
      type: 'number',
      group: 'details',
      initialValue: 10,
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      description:
        'Drag several photos here at once, or click Upload and select several files. Drag photos to reorder. Click a photo to add alternative text and a caption, replace it, or hide it.',
      type: 'array',
      group: 'photos',
      of: [galleryPhoto],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'approvalConfirmed',
      title: 'All visible photos in this album are approved for public release',
      description:
        'Tick only when every visible photo has been cleared for publication, including consent from identifiable people where required. Albums with photos cannot be published without this.',
      type: 'boolean',
      group: 'photos',
      initialValue: false,
      validation: (r) =>
        r.custom((v, ctx) => {
          const photos = (ctx.document as {photos?: unknown[]})?.photos ?? []
          if (photos.length === 0 || v === true) return true
          return 'Confirm the photos are approved for public release before publishing.'
        }),
    }),
  ],
  orderings: [{title: 'Gallery order', name: 'gallery', by: [{field: 'sortOrder', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', photos: 'photos', media: 'photos.0.asset'},
    prepare: ({title, photos, media}) => {
      const list = Array.isArray(photos) ? photos : []
      const visible = list.filter((p: {visible?: boolean}) => p?.visible !== false).length
      return {title, subtitle: list.length ? `${visible} of ${list.length} photos visible` : 'No photos yet (hidden on website)', media}
    },
  },
})
