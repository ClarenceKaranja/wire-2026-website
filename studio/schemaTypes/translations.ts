import {defineField, type FieldDefinition} from 'sanity'

// French and Portuguese versions of the Participant information page and FAQs.
// Each document gets an "English / Français / Português" tab row. Anything left
// empty in French or Portuguese falls back to the English text on the website.

export const TRANSLATION_LANGUAGES = [
  {id: 'fr', title: 'Français'},
  {id: 'pt', title: 'Português'},
] as const

export const translationGroups = [
  {name: 'en', title: 'English', default: true},
  ...TRANSLATION_LANGUAGES.map((l) => ({name: l.id, title: l.title})),
]

/**
 * One object field per language ("fr", "pt"), each in its own tab, holding
 * the same fields as the English version (without their validation, so a
 * translation can be added later).
 */
export function translationFields(fields: () => FieldDefinition[]) {
  return TRANSLATION_LANGUAGES.map((l) =>
    defineField({
      name: l.id,
      title: `${l.title} version`,
      description: 'Leave a field empty to show the English text instead. Links and anchors work the same as in English.',
      type: 'object',
      group: l.id,
      options: {collapsible: false},
      fields: fields(),
    }),
  )
}

/** Short label for document lists, e.g. "FR ✓ PT –", so missing translations are easy to spot. */
export function translationStatus(...values: unknown[]) {
  return TRANSLATION_LANGUAGES.map((l, i) => `${l.id.toUpperCase()} ${values[i] ? '✓' : '–'}`).join(' ')
}
