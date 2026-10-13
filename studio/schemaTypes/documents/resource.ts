import {defineField, defineType} from 'sanity'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {DOCUMENT_FILE_TYPES, FILE_MAX_BYTES, FILE_WARN_BYTES, RESOURCE_CATEGORIES} from '../constants'
import {assetSizeLimit} from '../validation'

export const resource = defineType({
  name: 'resource',
  title: 'Document',
  type: 'document',
  icon: DocumentsIcon,
  groups: [
    {name: 'content', title: 'Document', default: true},
    {name: 'publishing', title: 'Publishing'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: 'content', validation: (r) => r.required().max(140)}),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (r) => r.max(400),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {list: RESOURCE_CATEGORIES},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      description:
        'PDF, Word, PowerPoint or Excel. Files over 25 MB show a warning; files over 100 MB cannot be published. To publish a new version, upload the new file here (use the ⋯ menu → Replace) and update the version label.',
      type: 'file',
      group: 'content',
      options: {accept: DOCUMENT_FILE_TYPES, storeOriginalFilename: true},
      validation: (rule) => [
        rule.custom((value, ctx) => {
          const doc = ctx.document as {externalUrl?: string}
          return value?.asset || doc?.externalUrl ? true : 'Upload a file or add an external link.'
        }),
        rule.custom(assetSizeLimit(FILE_MAX_BYTES, 'This file is too large to publish. Compress it or split it')),
        rule.custom(assetSizeLimit(FILE_WARN_BYTES, 'Large file: visitors on mobile data may struggle to download it')).warning(),
      ],
    }),
    defineField({
      name: 'externalUrl',
      title: 'Or link to an external page',
      description: 'For media coverage or publications hosted elsewhere, for example on unodc.org.',
      type: 'url',
      group: 'content',
    }),
    defineField({
      name: 'versionLabel',
      title: 'Version label',
      description: 'For example "Draft", "Version 2" or "Final, 28 October 2026".',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      group: 'content',
      options: {list: ['English', 'French', 'Portuguese', 'Other']},
      initialValue: 'English',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'date',
      group: 'publishing',
      options: {dateFormat: 'D MMMM YYYY'},
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Where it appears',
      type: 'string',
      group: 'publishing',
      options: {
        list: [
          {title: 'Current: listed in the document library', value: 'current'},
          {title: 'Archived: listed under "Earlier versions and archive"', value: 'archived'},
          {title: 'Hidden: not listed anywhere on the website', value: 'hidden'},
        ],
        layout: 'radio',
      },
      initialValue: 'current',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Feature at the top of the library and on the homepage',
      type: 'boolean',
      group: 'publishing',
      initialValue: false,
    }),
    defineField({
      name: 'expiresAt',
      title: 'Archive automatically on (optional)',
      description: 'From this date the document moves to the archive section by itself.',
      type: 'date',
      group: 'publishing',
      options: {dateFormat: 'D MMMM YYYY'},
    }),
    defineField({
      name: 'approved',
      title: 'Approved for public release',
      description:
        'Tick only when this document has been cleared for anyone on the internet to read. Unticked documents cannot be published.',
      type: 'boolean',
      group: 'publishing',
      initialValue: false,
      validation: (r) => r.custom((v) => (v === true ? true : 'Confirm approval for public release before publishing.')),
    }),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', category: 'category', status: 'status', version: 'versionLabel', ext: 'file.asset.extension'},
    prepare: ({title, category, status, version, ext}) => ({
      title,
      subtitle: [category, version, ext?.toUpperCase(), status !== 'current' ? status?.toUpperCase() : null]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
