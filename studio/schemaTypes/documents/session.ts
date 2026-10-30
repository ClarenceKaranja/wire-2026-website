import {defineArrayMember, defineField, defineType} from 'sanity'
import {ClockIcon} from '@sanity/icons/Clock'
import {SESSION_TYPES} from '../constants'
import {timeOfDay} from '../validation'

export const session = defineType({
  name: 'session',
  title: 'Agenda session',
  type: 'document',
  icon: ClockIcon,
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'people', title: 'Speakers'},
    {name: 'display', title: 'Display'},
  ],
  fields: [
    defineField({name: 'title', title: 'Session title', type: 'string', group: 'basics', validation: (r) => r.required().max(140)}),
    defineField({
      name: 'day',
      title: 'Day',
      type: 'reference',
      to: [{type: 'programmeDay'}],
      group: 'basics',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Start time (Nairobi time)',
      description: '24-hour clock, for example 09:15.',
      type: 'string',
      group: 'basics',
      validation: (r) => r.required().custom(timeOfDay),
    }),
    defineField({
      name: 'endTime',
      title: 'End time (Nairobi time)',
      description: '24-hour clock, for example 10:30. Leave empty for a single moment, such as a departure time.',
      type: 'string',
      group: 'basics',
      validation: (r) =>
        r.custom(timeOfDay).custom((end, ctx) => {
          const start = (ctx.document as {startTime?: string})?.startTime
          if (start && end && end <= start) return 'The end time must be after the start time.'
          return true
        }),
    }),
    defineField({
      name: 'sessionType',
      title: 'Type of session',
      type: 'string',
      group: 'basics',
      options: {list: SESSION_TYPES},
      initialValue: 'plenary',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle or sub-items',
      description: 'Optional short line under the title, for example "Welcome and opening remarks".',
      type: 'string',
      group: 'basics',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      group: 'basics',
    }),
    defineField({
      name: 'location',
      title: 'Room or location',
      description:
        'Leave empty until confirmed. Never enter rooms for restricted access meetings.',
      type: 'string',
      group: 'basics',
      hidden: ({document}) => document?.sessionType === 'restricted',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          {title: 'Confirmed', value: 'confirmed'},
          {title: 'Details to be confirmed', value: 'tbc'},
          {title: 'Changed (highlight the change)', value: 'changed'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
        layout: 'radio',
      },
      initialValue: 'confirmed',
    }),
    defineField({
      name: 'changeNote',
      title: 'What changed?',
      description: 'Shown next to the session, for example "Moved from 11:00 to 14:00".',
      type: 'string',
      group: 'basics',
      hidden: ({document}) => document?.status !== 'changed',
    }),
    defineField({
      name: 'hybrid',
      title: 'Hybrid session (also online)',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
    }),
    defineField({
      name: 'moderators',
      title: 'Moderators',
      description: 'Add only confirmed moderators.',
      type: 'array',
      group: 'people',
      of: [defineArrayMember({type: 'reference', to: [{type: 'person'}]})],
      validation: (r) => r.unique(),
    }),
    defineField({
      name: 'speakers',
      title: 'Speakers',
      description: 'Add only confirmed speakers.',
      type: 'array',
      group: 'people',
      of: [defineArrayMember({type: 'reference', to: [{type: 'person'}]})],
      validation: (r) => r.unique(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Order within the same start time',
      description: 'Only needed when two sessions start at the same time. Lower numbers appear first.',
      type: 'number',
      group: 'display',
      initialValue: 0,
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the homepage',
      type: 'boolean',
      group: 'display',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Day and time',
      name: 'dayTime',
      by: [
        {field: 'day.date', direction: 'asc'},
        {field: 'startTime', direction: 'asc'},
        {field: 'sortOrder', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'title', start: 'startTime', end: 'endTime', day: 'day.label', status: 'status'},
    prepare: ({title, start, end, day, status}) => ({
      title,
      subtitle: `${day ?? 'No day'} · ${start ?? '?'}${end ? `–${end}` : ''}${status === 'tbc' ? ' · TBC' : ''}${status === 'cancelled' ? ' · CANCELLED' : ''}`,
    }),
  },
})
