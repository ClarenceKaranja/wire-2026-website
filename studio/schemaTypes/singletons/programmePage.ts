import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

export const programmePage = defineType({
  name: 'programmePage',
  title: 'Programme page',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 3}),
    defineField({
      name: 'statusNote',
      title: 'Programme status',
      description: 'For example "Draft programme, subject to change". Leave empty when final.',
      type: 'string',
    }),
    defineField({
      name: 'agenda',
      title: 'Downloadable agenda',
      description:
        'Choose the document (from Documents) that visitors download. To publish a new agenda, either replace the file inside that document, or create a new document and select it here.',
      type: 'reference',
      to: [{type: 'resource'}],
      weak: true,
    }),
    defineField({
      name: 'restrictedNote',
      title: 'Note shown on restricted access meetings',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {prepare: () => ({title: 'Programme page'})},
})
