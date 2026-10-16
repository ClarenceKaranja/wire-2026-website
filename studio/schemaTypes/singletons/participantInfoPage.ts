import {defineField, defineType} from 'sanity'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {translationFields, translationGroups} from '../translations'

export const participantInfoPage = defineType({
  name: 'participantInfoPage',
  title: 'Participant information page',
  type: 'document',
  icon: InfoOutlineIcon,
  groups: translationGroups,
  fields: [
    defineField({name: 'intro', group: 'en', title: 'Introduction', type: 'text', rows: 3}),
    ...translationFields(() => [defineField({name: 'intro', title: 'Introduction', type: 'text', rows: 3})]),
  ],
  preview: {prepare: () => ({title: 'Participant information page'})},
})
