import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

export const programmeDay = defineType({
  name: 'programmeDay',
  title: 'Agenda day',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      description: 'The calendar date in Nairobi.',
      type: 'date',
      options: {dateFormat: 'D MMMM YYYY'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      description: 'Short name shown on the day tabs, for example "Day 1".',
      type: 'string',
      validation: (r) => r.required().max(20),
    }),
    defineField({
      name: 'summary',
      title: 'Summary of the day',
      description: 'Optional one or two sentences shown above the day’s sessions.',
      type: 'text',
      rows: 2,
      validation: (r) => r.max(300),
    }),
  ],
  orderings: [{title: 'Date', name: 'dateAsc', by: [{field: 'date', direction: 'asc'}]}],
  preview: {
    select: {title: 'label', date: 'date'},
    prepare: ({title, date}) => ({title, subtitle: date}),
  },
})
