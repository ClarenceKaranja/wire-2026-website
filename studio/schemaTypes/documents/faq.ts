import {defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'

export const faq = defineType({
  name: 'faq',
  title: 'Frequently asked question',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (r) => r.required().max(200)}),
    defineField({name: 'answer', title: 'Answer', type: 'blockContent', validation: (r) => r.required()}),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      options: {list: ['Travel and entry', 'Venue and programme', 'Practical matters', 'General']},
      initialValue: 'General',
    }),
    defineField({name: 'sortOrder', title: 'Position', type: 'number', initialValue: 10}),
  ],
  orderings: [{title: 'Position', name: 'pos', by: [{field: 'sortOrder', direction: 'asc'}]}],
  preview: {select: {title: 'question', subtitle: 'topic'}},
})
