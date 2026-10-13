import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'event', title: 'Event', default: true},
    {name: 'branding', title: 'Branding'},
    {name: 'contact', title: 'Contacts and footer'},
    {name: 'notice', title: 'Urgent notice bar'},
  ],
  fields: [
    defineField({name: 'shortTitle', title: 'Short title', description: 'Shown in the header, for example "WIRE 2026".', type: 'string', group: 'event', validation: (r) => r.required().max(30)}),
    defineField({name: 'eventName', title: 'Full event name', type: 'string', group: 'event', validation: (r) => r.required()}),
    defineField({name: 'edition', title: 'Edition', description: 'For example "10th".', type: 'string', group: 'event'}),
    defineField({name: 'startDate', title: 'First day', type: 'date', group: 'event', validation: (r) => r.required()}),
    defineField({
      name: 'endDate',
      title: 'Last day',
      type: 'date',
      group: 'event',
      validation: (r) =>
        r.required().custom((v, ctx) => {
          const s = (ctx.document as {startDate?: string})?.startDate
          return !v || !s || v >= s ? true : 'The last day must be on or after the first day.'
        }),
    }),
    defineField({name: 'city', title: 'City', type: 'string', group: 'event', validation: (r) => r.required()}),
    defineField({name: 'country', title: 'Country', type: 'string', group: 'event', validation: (r) => r.required()}),
    defineField({
      name: 'venueName',
      title: 'Venue name',
      description: 'Leave empty until the venue is confirmed for publication.',
      type: 'string',
      group: 'event',
    }),
    defineField({
      name: 'eventPhase',
      title: 'Website mode',
      description:
        '"Automatic" switches the homepage wording by date. Choose "After the Forum" to show the outcomes summary and stop presenting the Forum as upcoming.',
      type: 'string',
      group: 'event',
      options: {
        list: [
          {title: 'Automatic (by date)', value: 'auto'},
          {title: 'Before the Forum', value: 'before'},
          {title: 'During the Forum', value: 'during'},
          {title: 'After the Forum', value: 'after'},
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'organizerLine',
      title: 'Organizer statement',
      description: 'Shown in the header area and footer.',
      type: 'text',
      rows: 2,
      group: 'event',
    }),
    defineField({
      name: 'logo',
      title: 'Official WIRE logo (optional)',
      description:
        'Upload only the approved official logo file. While this is empty, the site shows a plain text "WIRE" wordmark.',
      type: 'image',
      group: 'branding',
      options: {accept: 'image/png,image/svg+xml,image/webp'},
      fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string', initialValue: 'WIRE 2026'})],
    }),
    defineField({
      name: 'logoOnDark',
      title: 'Logo for dark backgrounds (optional)',
      type: 'image',
      group: 'branding',
      options: {accept: 'image/png,image/svg+xml,image/webp'},
    }),
    defineField({
      name: 'socialImage',
      title: 'Social sharing image',
      description: 'Shown when the link is shared on WhatsApp, LinkedIn, email and so on. Best size 1200 × 630 pixels.',
      type: 'accessibleImage',
      group: 'branding',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Main contact email',
      type: 'string',
      group: 'contact',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'contacts',
      title: 'Practical event contacts',
      description: 'Only add contacts approved for public display. Do not add personal mobile numbers unless agreed.',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contact',
          fields: [
            defineField({name: 'label', title: 'What for', description: 'For example "General enquiries".', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'name', title: 'Name or team', type: 'string'}),
            defineField({name: 'email', title: 'Email', type: 'string', validation: (r) => r.email()}),
            defineField({name: 'phone', title: 'Phone', type: 'string'}),
            defineField({name: 'note', title: 'Note', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'email'}},
        }),
      ],
    }),
    defineField({name: 'footerNote', title: 'Footer note', type: 'text', rows: 3, group: 'contact'}),
    defineField({
      name: 'notice',
      title: 'Urgent notice bar',
      description: 'A short message shown at the top of every page, for example a room change today.',
      type: 'object',
      group: 'notice',
      fields: [
        defineField({name: 'active', title: 'Show the notice', type: 'boolean', initialValue: false}),
        defineField({name: 'message', title: 'Message', type: 'string', validation: (r) => r.max(160)}),
        defineField({name: 'href', title: 'Link (optional)', description: 'For example /announcements', type: 'string'}),
        defineField({name: 'until', title: 'Hide automatically after', type: 'datetime'}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
