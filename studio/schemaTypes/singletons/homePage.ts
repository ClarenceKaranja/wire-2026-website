import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Top of page', default: true},
    {name: 'welcome', title: 'Welcome message'},
    {name: 'featured', title: 'Featured content'},
    {name: 'after', title: 'After the Forum'},
  ],
  fields: [
    defineField({
      name: 'heroLead',
      title: 'Introductory sentence',
      description: 'One sentence under the event title.',
      type: 'text',
      rows: 2,
      group: 'hero',
      validation: (r) => r.max(260),
    }),
    defineField({name: 'heroImage', title: 'Main image', type: 'accessibleImage', group: 'hero'}),
    defineField({name: 'welcomeHeading', title: 'Welcome heading', type: 'string', group: 'welcome'}),
    defineField({name: 'welcomeMessage', title: 'Welcome message', type: 'blockContent', group: 'welcome'}),
    defineField({name: 'welcomeSignature', title: 'Signed by (optional)', type: 'string', group: 'welcome'}),
    defineField({
      name: 'quickLinks',
      title: 'Quick links',
      description: 'Up to six shortcuts shown on the homepage.',
      type: 'array',
      group: 'featured',
      of: [defineArrayMember({type: 'linkItem'})],
      validation: (r) => r.max(6),
    }),
    defineField({
      name: 'showUpcomingSessions',
      title: 'Show featured or upcoming sessions',
      description:
        'Sessions marked "Feature on the homepage" are shown. If none are marked, the next sessions on the programme are shown.',
      type: 'boolean',
      group: 'featured',
      initialValue: true,
    }),
    defineField({
      name: 'outcomesHeading',
      title: 'Outcomes heading',
      type: 'string',
      group: 'after',
      initialValue: 'Outcomes of the Forum',
    }),
    defineField({
      name: 'outcomesSummary',
      title: 'Outcomes summary',
      description: 'Shown at the top of the homepage when Site settings → Website mode is "After the Forum" (or automatically after the last day).',
      type: 'blockContent',
      group: 'after',
    }),
  ],
  preview: {prepare: () => ({title: 'Homepage'})},
})
