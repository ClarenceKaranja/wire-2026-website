import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

// Filled from the organizers' Excel file by tools/ram-schedule/import.mjs,
// which removes people's and interpreters' names. Small fixes can be made
// here; a new Excel file replaces the whole list.
export const ramSchedule = defineType({
  name: 'ramSchedule',
  title: 'Restricted access meeting timetables',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'sourceFile',
      title: 'Imported from',
      description: 'The Excel or CSV file this timetable came from.',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'meetings',
      title: 'Meetings',
      description:
        'One entry per country per meeting. Do not type people\'s names here: the website is public. Country names must match exactly across entries.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'ramMeeting',
          title: 'Meeting',
          type: 'object',
          fields: [
            defineField({name: 'country', title: 'Country or organization', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'date', title: 'Date', type: 'date', validation: (r) => r.required()}),
            defineField({name: 'start', title: 'Start (HH:MM)', type: 'string', validation: (r) => r.required().regex(/^\d{2}:\d{2}$/)}),
            defineField({name: 'end', title: 'End (HH:MM)', type: 'string', validation: (r) => r.required().regex(/^\d{2}:\d{2}$/)}),
            defineField({name: 'table', title: 'Table', type: 'string'}),
            defineField({name: 'meetingId', title: 'Meeting ID', description: 'For example KEN-02', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'format', title: 'Format', type: 'string', options: {list: ['Bilateral', 'Multilateral']}}),
            defineField({
              name: 'meetingWith',
              title: 'Meeting with',
              description: 'One line per country, e.g. "Nigeria – Customs; NFIU"',
              type: 'array',
              of: [{type: 'string'}],
            }),
            defineField({name: 'attending', title: 'Who attends from the delegation', type: 'string'}),
            defineField({name: 'requestedBy', title: 'Requested by', type: 'array', of: [{type: 'string'}]}),
            defineField({name: 'interpretation', title: 'Interpretation (language only)', type: 'string'}),
            defineField({name: 'note', title: 'Note', type: 'string'}),
          ],
          preview: {
            select: {country: 'country', id: 'meetingId', date: 'date', start: 'start', table: 'table'},
            prepare: ({country, id, date, start, table}) => ({title: `${country}: ${id}`, subtitle: [date, start, table].filter(Boolean).join(' · ')}),
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Restricted access meeting timetables'})},
})
