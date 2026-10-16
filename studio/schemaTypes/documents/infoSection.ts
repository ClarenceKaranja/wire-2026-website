import {defineField, defineType} from 'sanity'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {translationFields, translationGroups, translationStatus} from '../translations'

export const infoSection = defineType({
  name: 'infoSection',
  title: 'Participant information section',
  type: 'document',
  icon: InfoOutlineIcon,
  groups: translationGroups,
  fields: [
    defineField({name: 'title', group: 'en', title: 'Heading', type: 'string', validation: (r) => r.required().max(80)}),
    defineField({
      name: 'slug',
      group: 'en',
      title: 'Anchor',
      description: 'Used for direct links such as /participant-information#venue. Click "Generate".',
      type: 'slug',
      options: {source: 'title', maxLength: 40},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      group: 'en',
      title: 'One-line summary',
      description: 'Shown in the page’s table of contents.',
      type: 'string',
      validation: (r) => r.max(140),
    }),
    defineField({name: 'body', group: 'en', title: 'Text', type: 'blockContent', validation: (r) => r.required()}),
    defineField({
      name: 'toBeConfirmed',
      group: 'en',
      title: 'Details still to be confirmed',
      description: 'Shows a "To be confirmed" label next to the heading.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      group: 'en',
      title: 'Position on the page',
      description: 'Lower numbers appear first.',
      type: 'number',
      initialValue: 10,
      validation: (r) => r.required(),
    }),
    ...translationFields(() => [
      defineField({name: 'title', title: 'Heading', type: 'string', validation: (r) => r.max(80)}),
      defineField({name: 'summary', title: 'One-line summary', type: 'string', validation: (r) => r.max(140)}),
      defineField({name: 'body', title: 'Text', type: 'blockContent'}),
    ]),
  ],
  orderings: [{title: 'Page order', name: 'page', by: [{field: 'sortOrder', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', summary: 'summary', fr: 'fr.title', pt: 'pt.title'},
    prepare: ({title, summary, fr, pt}) => ({title, subtitle: [translationStatus(fr, pt), summary].filter(Boolean).join(' · ')}),
  },
})
