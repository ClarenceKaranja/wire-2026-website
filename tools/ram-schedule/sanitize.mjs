// Pure functions that turn rows of the "Participant Schedule" sheet into the
// website's ramSchedule document. Everything that leaves this file is public,
// so people's names are removed here: the website shows countries, agencies
// and languages only.

const MONTHS = {jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12}

/** Maps each field to its column index, given the heading row. */
export function findColumns(headings) {
  const h = headings.map((v) => String(v ?? '').trim().toLowerCase())
  const find = (...prefixes) => h.findIndex((x) => prefixes.some((p) => x.startsWith(p)))
  const cols = {
    country: find('country'),
    day: find('day'),
    time: find('time'),
    table: find('table'),
    meetingId: h.findIndex((x) => x.startsWith('meeting') && !x.startsWith('meeting with')),
    format: find('format'),
    meetingWith: find('meeting with'),
    attending: find('who attends', 'attending'),
    requestedBy: find('requested by'),
    interpretation: find('interpretation'),
    note: find('note'),
  }
  const required = ['country', 'day', 'time', 'meetingId', 'meetingWith']
  const missing = required.filter((k) => cols[k] < 0)
  if (missing.length) throw new Error(`Missing column(s): ${missing.join(', ')}. Found: ${headings.filter(Boolean).join(' | ')}`)
  return cols
}

const clean = (v) =>
  String(v ?? '')
    .replace(/\r/g, '')
    .replace(/[ \t ]+/g, ' ')
    .trim()

/** Index of the "(" matching a trailing ")", or -1. */
function trailingParen(s) {
  if (!s.endsWith(')')) return -1
  let depth = 0
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === ')') depth++
    else if (s[i] === '(' && --depth === 0) return i
  }
  return -1
}

/** Removes the trailing "(names)" from one agency, keeping acronyms such as "(AGT)" and "(online)". */
function stripAgency(agency) {
  const a = agency.trim()
  const open = trailingParen(a)
  if (open <= 0) return a
  const inner = a.slice(open + 1, -1).trim()
  const before = a.slice(0, open).trimEnd()
  if (/^online\b/i.test(inner)) return `${before} (online)`
  if (/^[A-Z0-9&./-]{2,10}$/.test(inner)) return a // an acronym such as "(AGT)", not a name
  return before
}

/** "Kenya – KRA Customs (Tabitha Shikanda, Paul Mburu); DCI (Josphine Korir)" → "Kenya – KRA Customs; DCI" */
export function stripPeople(text) {
  return clean(text)
    .split(/\s*;\s*/)
    .map(stripAgency)
    .filter(Boolean)
    .join('; ')
}

/** Splits a multi-line cell into lines, removing names from each. Lines such as "(combined: …)" are kept as they are. */
export function peopleFreeLines(cell) {
  return String(cell ?? '')
    .split('\n')
    .map(clean)
    .filter(Boolean)
    .map((line) => (line.startsWith('(') ? line : stripPeople(line)))
}

/** "French – Assane" → "French". Only the language is published, never the interpreter. */
export function language(cell) {
  const s = clean(cell)
  if (!s) return undefined
  return s.split(/\s+[–—-]\s+|\s*[(:/,]/)[0].trim() || undefined
}

/** "Same time as KHM-02 – Forestry and Wildlife (Heng Kimchhay) attends that one; Same time as …" without the names. */
export function cleanNote(cell, warn = () => {}) {
  const s = clean(cell).replace(/\n/g, ' ')
  if (!s) return undefined
  return s
    .split(/\s*;\s*(?=Same time as\b)/i)
    .map((part) => {
      const m = part.match(/^Same time as (\S+(?: \/ \S+)?) [–—-] (.+?) (attends?) that one\.?$/i)
      if (m) return `Same time as ${m[1]} – ${stripPeople(m[2])} ${m[3]} that one`
      warn(`Note not in the usual "Same time as …" form, names removed as best as possible: "${part}"`)
      return stripPeople(part)
    })
    .join('; ')
}

/** "Thu 5 Nov" (or an Excel date) → "2026-11-05". */
export function parseDay(cell, year) {
  if (cell instanceof Date) return cell.toISOString().slice(0, 10)
  const m = clean(cell).match(/(\d{1,2})\s+([A-Za-z]{3})/)
  if (!m || !MONTHS[m[2].toLowerCase()]) return undefined
  return `${year}-${String(MONTHS[m[2].toLowerCase()]).padStart(2, '0')}-${m[1].padStart(2, '0')}`
}

/** "09:00–10:00" → {start: "09:00", end: "10:00"} */
export function parseTime(cell) {
  const m = clean(cell).match(/^(\d{1,2})[:.h](\d{2})\s*[–—-]\s*(\d{1,2})[:.h](\d{2})$/)
  if (!m) return undefined
  const t = (h, mm) => `${h.padStart(2, '0')}:${mm}`
  return {start: t(m[1], m[2]), end: t(m[3], m[4])}
}

/** URL-friendly id for a country or organization, e.g. "congo-democratic-republic-of-the". */
export function slugify(name) {
  return name
    .replace(/\([^)]*\)/g, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Builds the ramSchedule document from the sheet's rows (arrays of cell values,
 * heading row first). Returns the document and a list of warnings for the person importing.
 */
export function buildSchedule(rows, {year = 2026, sourceFile} = {}) {
  const warnings = []
  const headingIndex = rows.findIndex((r) => r && clean(r[0]).toLowerCase() === 'country')
  if (headingIndex < 0) throw new Error('Could not find the heading row (a row whose first cell is "Country").')
  const cols = findColumns(rows[headingIndex])
  const cell = (r, k) => (cols[k] >= 0 ? r[cols[k]] : undefined)

  const meetings = []
  rows.slice(headingIndex + 1).forEach((r, i) => {
    const rowNo = headingIndex + i + 2
    if (!r || r.every((v) => !clean(v))) return
    const warn = (msg) => warnings.push(`Row ${rowNo}: ${msg}`)
    const country = clean(cell(r, 'country'))
    const date = parseDay(cell(r, 'day'), year)
    const time = parseTime(cell(r, 'time'))
    const meetingId = clean(cell(r, 'meetingId'))
    if (!country || !date || !time || !meetingId) {
      warn(`skipped, missing or unreadable country/day/time/meeting (${[country, clean(cell(r, 'day')), clean(cell(r, 'time')), meetingId].join(' | ')})`)
      return
    }
    const format = clean(cell(r, 'format'))
    if (format && !/^(bilateral|multilateral)$/i.test(format)) warn(`unusual format "${format}"`)
    meetings.push({
      _key: `m${String(meetings.length + 1).padStart(3, '0')}`,
      _type: 'ramMeeting',
      country,
      date,
      start: time.start,
      end: time.end,
      table: clean(cell(r, 'table')) || undefined,
      meetingId,
      format: format || undefined,
      meetingWith: peopleFreeLines(cell(r, 'meetingWith')),
      attending: stripPeople(cell(r, 'attending')) || undefined,
      requestedBy: peopleFreeLines(cell(r, 'requestedBy')),
      interpretation: language(cell(r, 'interpretation')),
      note: cleanNote(cell(r, 'note'), warn),
    })
  })

  meetings.sort((a, b) => a.country.localeCompare(b.country, 'en') || (a.date + a.start).localeCompare(b.date + b.start) || a.meetingId.localeCompare(b.meetingId))
  meetings.forEach((m, i) => (m._key = `m${String(i + 1).padStart(3, '0')}`))

  // Checks worth a human look before publishing.
  const slugs = new Map()
  for (const m of meetings) {
    const s = slugify(m.country)
    if (slugs.has(s) && slugs.get(s) !== m.country) warnings.push(`"${m.country}" and "${slugs.get(s)}" would share a web address`)
    slugs.set(s, m.country)
  }
  for (const a of meetings)
    for (const b of meetings)
      if (a._key < b._key && a.country === b.country && a.date === b.date && a.start < b.end && b.start < a.end) {
        if (a.meetingId === b.meetingId) warnings.push(`${a.country}: ${a.meetingId} is listed twice at the same time`)
        else if (!a.note && !b.note) warnings.push(`${a.country}: ${a.meetingId} and ${b.meetingId} overlap but have no note`)
      }

  const doc = {_id: 'ramSchedule', _type: 'ramSchedule', sourceFile, meetingCount: meetings.length, meetings}
  return {doc, warnings}
}
