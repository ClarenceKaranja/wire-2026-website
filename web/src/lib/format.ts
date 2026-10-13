export function fileSize(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function fileLabel(ext?: string) {
  const e = (ext || '').toLowerCase()
  const map: Record<string, string> = {
    pdf: 'PDF',
    doc: 'Word',
    docx: 'Word',
    ppt: 'PowerPoint',
    pptx: 'PowerPoint',
    xls: 'Excel',
    xlsx: 'Excel',
    odt: 'Document',
    odp: 'Presentation',
    zip: 'ZIP',
    csv: 'CSV',
    txt: 'Text',
  }
  return map[e] ?? e.toUpperCase()
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** A download link that keeps a readable filename. Local sample files are served as-is. */
export function downloadUrl(file: {url: string; extension?: string}, title: string) {
  if (file.url.startsWith('/')) return file.url
  return `${file.url}?dl=${encodeURIComponent(`${slugify(title)}.${file.extension ?? 'pdf'}`)}`
}

export const RESOURCE_CATEGORY_LABELS: Record<string, string> = {
  agenda: 'Agenda',
  'information-note': 'Information note',
  logistics: 'Logistics and travel',
  guidance: 'Participant guidance',
  presentation: 'Presentations',
  report: 'Reports',
  publication: 'Publications',
  media: 'Media and communications',
  other: 'Other documents',
}

export const ANNOUNCEMENT_CATEGORY_LABELS: Record<string, string> = {
  programme: 'Programme change',
  transport: 'Transport',
  venue: 'Room or venue',
  practical: 'Practical notice',
  document: 'New document',
  'post-event': 'Post-event',
  general: 'Announcement',
}

export const SESSION_TYPE_LABELS: Record<string, string> = {
  registration: 'Registration',
  ceremony: 'Ceremony',
  plenary: 'Plenary',
  panel: 'Panel',
  presentation: 'Presentation',
  break: 'Break',
  meal: 'Meal',
  networking: 'Networking',
  visit: 'Site visit',
  restricted: 'Restricted access',
  other: 'Session',
}
