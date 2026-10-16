// French and Portuguese versions of the Participant information page (sections
// and FAQs). The rest of the site is English only. Translated text comes from
// the "fr" and "pt" fields in Sanity; anything left empty falls back to English.

export const LANGS = ['en', 'fr', 'pt'] as const
export type Lang = (typeof LANGS)[number]

export const LANG_NAMES: Record<Lang, string> = {en: 'English', fr: 'Français', pt: 'Português'}

export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang)

export const infoPath = (lang: Lang) => (lang === 'en' ? '/participant-information' : `/participant-information/${lang}`)

type Strings = {
  title: string
  description: string
  eyebrow: string
  onThisPage: string
  faq: string
  contacts: string
  toBeConfirmed: string
  englishOnly: string
  emptyTitle: string
  emptyBody: string
  languages: string
  topics: Record<string, string>
}

export const UI: Record<Lang, Strings> = {
  en: {
    title: 'Participant information',
    description:
      'Venue, travel, Kenya eTA, airport arrival, accommodation, Nairobi National Park visit, meals, FAQs and contacts for WIRE participants.',
    eyebrow: 'Participants',
    onThisPage: 'On this page',
    faq: 'Frequently asked questions',
    contacts: 'Contacts',
    toBeConfirmed: 'Details to be confirmed',
    englishOnly: 'Not yet translated',
    emptyTitle: 'Information will be published soon',
    emptyBody: 'Contact {email} with any questions.',
    languages: 'Language',
    topics: {},
  },
  fr: {
    title: 'Informations pour les participants',
    description:
      'Lieu, voyage, eTA du Kenya, arrivée à l’aéroport, hébergement, visite du parc national de Nairobi, repas, FAQ et contacts pour les participants au WIRE.',
    eyebrow: 'Participants',
    onThisPage: 'Sur cette page',
    faq: 'Questions fréquentes',
    contacts: 'Contacts',
    toBeConfirmed: 'Détails à confirmer',
    englishOnly: 'Disponible en anglais uniquement',
    emptyTitle: 'Les informations seront publiées prochainement',
    emptyBody: 'Pour toute question, écrivez à {email}.',
    languages: 'Langue',
    topics: {
      'Travel and entry': 'Voyage et entrée au Kenya',
      'Venue and programme': 'Lieu et programme',
      'Practical matters': 'Informations pratiques',
      General: 'Général',
    },
  },
  pt: {
    title: 'Informações para os participantes',
    description:
      'Local, viagem, eTA do Quénia, chegada ao aeroporto, alojamento, visita ao Parque Nacional de Nairobi, refeições, perguntas frequentes e contactos para os participantes no WIRE.',
    eyebrow: 'Participantes',
    onThisPage: 'Nesta página',
    faq: 'Perguntas frequentes',
    contacts: 'Contactos',
    toBeConfirmed: 'Detalhes a confirmar',
    englishOnly: 'Disponível apenas em inglês',
    emptyTitle: 'As informações serão publicadas em breve',
    emptyBody: 'Para qualquer questão, escreva para {email}.',
    languages: 'Idioma',
    topics: {
      'Travel and entry': 'Viagem e entrada no Quénia',
      'Venue and programme': 'Local e programa',
      'Practical matters': 'Informações práticas',
      General: 'Geral',
    },
  },
}

const hasText = (v: unknown) => (Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim() !== '' : v != null)

/**
 * Returns the document's fields in the chosen language, falling back to
 * English field by field. `translated` says whether the main field (heading
 * or question) has a translation, so the page can mark English-only items.
 */
export function localize<T extends Record<string, any>>(doc: T, lang: Lang, fields: (keyof T & string)[]) {
  const t = lang === 'en' ? undefined : doc[lang]
  const out: Record<string, unknown> = {...doc}
  for (const f of fields) if (t && hasText(t[f])) out[f] = t[f]
  const translated = lang === 'en' || Boolean(t && hasText(t[fields[0]]))
  return {...(out as T), translated}
}

/**
 * Rich text links to "/participant-information#anchor" point to the same
 * language version of the page, so readers stay in their language.
 */
export function localizeLinks(blocks: unknown, lang: Lang): unknown {
  if (lang === 'en' || !Array.isArray(blocks)) return blocks
  return blocks.map((block: any) =>
    Array.isArray(block?.markDefs)
      ? {
          ...block,
          markDefs: block.markDefs.map((m: any) =>
            typeof m?.href === 'string' && /^\/participant-information\/?(#|$)/.test(m.href)
              ? {...m, href: m.href.replace(/^\/participant-information\/?/, infoPath(lang))}
              : m,
          ),
        }
      : block,
  )
}
