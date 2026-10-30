import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

export const linkItem = defineType({
  name: 'linkItem',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required().max(60)}),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'string',
      validation: (r) => r.max(140),
    }),
    defineField({
      name: 'href',
      title: 'Link to',
      description: 'A page on this site such as /agenda or /participant-information, or a full https:// address.',
      type: 'string',
      validation: (r) =>
        r.required().custom((v) =>
          !v || /^(https?:\/\/|mailto:|\/)/.test(v) ? true : 'Start with / for a page on this site, or https://.',
        ),
    }),
  ],
})
