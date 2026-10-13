import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const person = defineType({
  name: 'person',
  title: 'Speaker or moderator',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'name', title: 'Full name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'position', title: 'Position or title', type: 'string'}),
    defineField({name: 'organization', title: 'Organization', type: 'string'}),
    defineField({name: 'country', title: 'Country', type: 'string'}),
    defineField({
      name: 'photo',
      title: 'Portrait (optional)',
      description: 'Only add a portrait if the person has agreed to it being published.',
      type: 'accessibleImage',
    }),
    defineField({name: 'bio', title: 'Short biography', type: 'text', rows: 4, validation: (r) => r.max(800)}),
    defineField({
      name: 'consent',
      title: 'This person has agreed to appear on the public website',
      type: 'boolean',
      initialValue: false,
      validation: (r) =>
        r.custom((v) => (v === true ? true : 'Confirm consent before publishing a speaker or moderator.')),
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'organization', media: 'photo'}},
})
