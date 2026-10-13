import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

export const partner = defineType({
  name: 'partner',
  title: 'Partner or organizer',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          {title: 'Organizer', value: 'organizer'},
          {title: 'Co-organizer / host', value: 'host'},
          {title: 'Funding partner', value: 'funder'},
          {title: 'Partner', value: 'partner'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'acknowledgement',
      title: 'Acknowledgement wording (optional)',
      description: 'Exact approved wording, for example "Co-funded by the European Union".',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Official logo (optional)',
      description:
        'Upload only the official logo file supplied or approved by the organization. Do not redraw, recolour or crop it. PNG or SVG preferred.',
      type: 'image',
      options: {accept: 'image/png,image/svg+xml,image/jpeg,image/webp'},
      fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string', initialValue: 'Logo'})],
    }),
    defineField({name: 'url', title: 'Website', type: 'url'}),
    defineField({name: 'sortOrder', title: 'Position', type: 'number', initialValue: 10}),
    defineField({
      name: 'approved',
      title: 'Acknowledgement approved for the website',
      description: 'Unapproved partners are never shown on the website.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [{title: 'Position', name: 'pos', by: [{field: 'sortOrder', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', role: 'role', approved: 'approved', media: 'logo'},
    prepare: ({title, role, approved, media}) => ({
      title,
      subtitle: `${role ?? ''}${approved ? '' : ' · NOT APPROVED (hidden)'}`,
      media,
    }),
  },
})
