import {defineField, defineType} from 'sanity'
import {BellIcon} from '@sanity/icons/Bell'
import {ANNOUNCEMENT_CATEGORIES} from '../constants'

export const announcement = defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required().max(120)}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {list: ANNOUNCEMENT_CATEGORIES},
      initialValue: 'general',
    }),
    defineField({name: 'message', title: 'Message', type: 'blockContent', validation: (r) => r.required()}),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      description: 'Shown on the website and used to sort announcements, newest first.',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expiry date (optional)',
      description:
        'After this moment the announcement leaves the homepage and moves to "Past announcements". It is never deleted.',
      type: 'datetime',
      validation: (r) =>
        r.custom((v, ctx) => {
          const p = (ctx.document as {publishedAt?: string})?.publishedAt
          return !v || !p || v > p ? true : 'The expiry must be after the publication date.'
        }),
    }),
    defineField({
      name: 'featured',
      title: 'Highlight on the homepage',
      description: 'Highlighted announcements appear first and stand out.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'link',
      title: 'Related link (optional)',
      type: 'linkItem',
    }),
    defineField({
      name: 'relatedDocument',
      title: 'Related document (optional)',
      type: 'reference',
      to: [{type: 'resource'}],
      weak: true,
    }),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', date: 'publishedAt', featured: 'featured', expires: 'expiresAt'},
    prepare: ({title, date, featured, expires}) => ({
      title: `${featured ? '★ ' : ''}${title}`,
      subtitle: `${date ? new Date(date).toLocaleDateString('en-GB', {timeZone: 'Africa/Nairobi'}) : 'No date'}${
        expires ? ` · expires ${new Date(expires).toLocaleDateString('en-GB', {timeZone: 'Africa/Nairobi'})}` : ''
      }`,
    }),
  },
})
