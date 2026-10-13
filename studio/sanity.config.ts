import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes, SINGLETONS} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'krb5nty9'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
// The public website address, used for the "Preview" tab. Example: https://wire2026.netlify.app
const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_URL

export default defineConfig({
  name: 'default',
  title: 'WIRE website',
  projectId,
  dataset,
  plugins: [
    structureTool({structure}),
    ...(previewOrigin
      ? [
          presentationTool({
            title: 'Preview',
            previewUrl: {
              origin: previewOrigin,
              previewMode: {enable: '/api/preview/enable', disable: '/api/preview/disable'},
            },
          }),
        ]
      : []),
    // Query tool for developers; only administrators see it.
    visionTool({defaultApiVersion: '2026-10-01'}),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
      {
        id: 'session-for-day',
        title: 'Session on this day',
        schemaType: 'session',
        parameters: [{name: 'dayId', type: 'string'}],
        value: (params: {dayId: string}) => ({day: {_type: 'reference', _ref: params.dayId}}),
      },
    ],
  },
  document: {
    // Singletons cannot be duplicated or deleted.
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
    newDocumentOptions: (prev) => prev.filter((item) => !SINGLETONS.includes(item.templateId)),
  },
})
