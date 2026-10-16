import {defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {translationFields, translationGroups, translationStatus} from '../translations'

export const faq = defineType({
  name: 'faq',
  title: 'Frequently asked question',
  type: 'document',
  icon: HelpCircleIcon,
  groups: translationGroups,
  fields: [
    defineField({name: 'question', group: 'en', title: 'Question', type: 'string', validation: (r) => r.required().max(200)}),
    defineField({name: 'answer', group: 'en', title: 'Answer', type: 'blockContent', validation: (r) => r.required()}),
    defineField({
      name: 'topic',
      group: 'en',
      title: 'Topic',
      type: 'string',
      options: {list: ['Travel and entry', 'Venue and programme', 'Practical matters', 'General']},
      initialValue: 'General',
    }),
    defineField({name: 'sortOrder', group: 'en', title: 'Position', type: 'number', initialValue: 10}),
    ...translationFields(() => [
      defineField({name: 'question', title: 'Question', type: 'string', validation: (r) => r.max(200)}),
      defineField({name: 'answer', title: 'Answer', type: 'blockContent'}),
    ]),
  ],
  orderings: [{title: 'Position', name: 'pos', by: [{field: 'sortOrder', direction: 'asc'}]}],
  preview: {
    select: {title: 'question', topic: 'topic', fr: 'fr.question', pt: 'pt.question'},
    prepare: ({title, topic, fr, pt}) => ({title, subtitle: [translationStatus(fr, pt), topic].filter(Boolean).join(' · ')}),
  },
})
