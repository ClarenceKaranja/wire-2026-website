import {defineField, defineType} from 'sanity'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'

export const participantInfoPage = defineType({
  name: 'participantInfoPage',
  title: 'Participant information page',
  type: 'document',
  icon: InfoOutlineIcon,
  fields: [
    defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 3}),
  ],
  preview: {prepare: () => ({title: 'Participant information page'})},
})
