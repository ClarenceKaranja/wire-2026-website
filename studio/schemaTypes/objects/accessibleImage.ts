import {defineField, defineType} from 'sanity'
import {IMAGE_MAX_BYTES, IMAGE_WARN_BYTES} from '../constants'
import {assetSizeLimit} from '../validation'

/** An image with required alternative text, used for heroes and portraits. */
export const accessibleImage = defineType({
  name: 'accessibleImage',
  title: 'Image',
  type: 'image',
  options: {hotspot: true, accept: 'image/jpeg,image/png,image/webp'},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      description:
        'Describe the image for people who cannot see it, for example "Two rhinos grazing in Nairobi National Park". Required for accessibility.',
      type: 'string',
      validation: (r) => r.required().error('Add alternative text so screen-reader users know what the image shows.'),
    }),
    defineField({name: 'credit', title: 'Photo credit', type: 'string'}),
  ],
  validation: (rule) => [
    rule.custom(assetSizeLimit(IMAGE_MAX_BYTES, 'This image is too large to publish. Resize it and upload again')),
    rule
      .custom(assetSizeLimit(IMAGE_WARN_BYTES, 'Large image: it will still work, but uploads are slow'))
      .warning(),
  ],
})
