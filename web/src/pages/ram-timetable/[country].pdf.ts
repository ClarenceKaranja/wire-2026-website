import type {APIRoute} from 'astro'
import {PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB} from 'pdf-lib'
import {getSettings} from '../../lib/content'
import {getRamSchedule, type RamCountry} from '../../lib/ram'
import {formatDateTime, formatRange, TZ_LABEL} from '../../lib/time'

export const prerender = false

// A one-page, landscape A4 timetable for one country. The font size shrinks
// until everything fits on the page; a timetable too long for that continues
// on a second page rather than becoming unreadable.
const PAGE = {w: 841.89, h: 595.28, margin: 30}
const HEADER = 84
const FOOTER = 22
const MAX_SIZE = 9.5
const MIN_SIZE = 6.5

const INK = rgb(0.043, 0.047, 0.055)
const MUTED = rgb(0.36, 0.4, 0.44)
const LINE = rgb(0.89, 0.9, 0.92)
const UN_BLUE = rgb(0, 0.62, 0.86)
const BLUE_INK = rgb(0, 0.447, 0.682)
const AMBER = rgb(0.478, 0.294, 0)
const SAND = rgb(0.957, 0.965, 0.973)

type Fonts = {regular: PDFFont; bold: PDFFont; italic: PDFFont}
type Style = 'regular' | 'bold' | 'italic'
type Text = {text: string; style?: Style; color?: RGB}
type Line = {text: string; font: PDFFont; color: RGB}

// Widths add up to the printable width (841.89 - 2 × 30).
const COLUMNS = [
  {label: 'Time and table', width: 70},
  {label: 'Meeting', width: 76},
  {label: 'Meeting with', width: 244},
  {label: 'From your delegation', width: 168},
  {label: 'Requested by', width: 166},
  {label: 'Interpretation', width: 57.89},
]

/** Standard PDF fonts only cover Western European characters; fall back to the letter without its accent. */
function encoder(font: PDFFont) {
  const supported = new Set(font.getCharacterSet())
  return (s: string) =>
    [...s.replace(/[‐‑]/g, '-')]
      .map((ch) => {
        if (supported.has(ch.codePointAt(0)!)) return ch
        const base = ch.normalize('NFD').replace(/[̀-ͯ]/g, '')
        return [...base].every((c) => supported.has(c.codePointAt(0)!)) ? base : '?'
      })
      .join('')
}

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) <= width) {
      line = candidate
      continue
    }
    if (line) lines.push(line)
    // A single word wider than the column is broken by character.
    let rest = word
    while (rest.length > 1 && font.widthOfTextAtSize(rest, size) > width) {
      let n = rest.length - 1
      while (n > 1 && font.widthOfTextAtSize(rest.slice(0, n), size) > width) n--
      lines.push(rest.slice(0, n))
      rest = rest.slice(n)
    }
    line = rest
  }
  lines.push(line)
  return lines
}

function cellsFor(m: RamCountry['days'][number]['meetings'][number]): Text[][] {
  return [
    [{text: `${m.start}–${m.end}`, style: 'bold'}, {text: m.table ?? '', style: 'bold', color: BLUE_INK}],
    [{text: m.meetingId, style: 'bold'}, {text: m.format ?? ''}],
    (m.meetingWith ?? []).map((text) => ({text})),
    // A clash note sits under who attends, since it says who goes where.
    [{text: m.attending ?? '', style: 'bold'}, ...(m.clash ? [{text: m.clash, style: 'italic' as const, color: AMBER}] : [])],
    (m.requestedBy ?? []).map((text) => ({text})),
    [{text: m.interpretation ?? ''}],
  ]
}

function layout(country: RamCountry, fonts: Fonts, size: number, safe: (s: string) => string) {
  const lh = size * 1.25
  const pad = size * 0.5
  const lines = (texts: Text[], width: number): Line[] =>
    texts.flatMap((t) => {
      const font = fonts[t.style ?? 'regular']
      return wrap(safe(t.text), font, size, width).map((text) => ({text, font, color: t.color ?? INK}))
    })
  const days = country.days.map((d) => ({
    label: d.label,
    meetings: d.meetings.map((m) => {
      const cells = cellsFor(m).map((texts, i) => lines(texts, COLUMNS[i].width - 6))
      const height = Math.max(...cells.map((c) => c.length)) * lh + pad * 2
      return {cells, height}
    }),
  }))
  const dayHeading = size * 2.3
  const tableHeading = size * 2
  const height = tableHeading + days.reduce((s, d) => s + dayHeading + d.meetings.reduce((t, m) => t + m.height, 0), 0)
  return {days, size, lh, pad, dayHeading, tableHeading, height}
}

async function buildPdf(country: RamCountry, opts: {event: string; when: string; updatedAt?: string; url: string}) {
  const pdf = await PDFDocument.create()
  pdf.setTitle(`Restricted access meetings: ${country.name}`)
  pdf.setSubject(opts.event)
  pdf.setCreator('WIRE participant website')
  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    italic: await pdf.embedFont(StandardFonts.HelveticaOblique),
  }
  const safe = encoder(fonts.regular)
  const {w, h, margin} = PAGE
  const bottom = margin + FOOTER
  const available = h - margin - HEADER - bottom

  let plan = layout(country, fonts, MAX_SIZE, safe)
  for (let size = MAX_SIZE - 0.25; plan.height > available && size >= MIN_SIZE; size -= 0.25) plan = layout(country, fonts, size, safe)
  const {size, lh, pad} = plan

  const pages: PDFPage[] = []
  let page: PDFPage
  let y = 0
  const text = (s: string, x: number, yy: number, sz: number, font: PDFFont, color = INK, p = page) =>
    p.drawText(safe(s), {x, y: yy, size: sz, font, color})

  const tableHeading = () => {
    page.drawRectangle({x: margin, y: y - plan.tableHeading, width: w - margin * 2, height: plan.tableHeading, color: SAND})
    let x = margin
    for (const col of COLUMNS) {
      text(col.label.toUpperCase(), x + 3, y - plan.tableHeading / 2 - size * 0.3, size * 0.78, fonts.bold, MUTED)
      x += col.width
    }
    y -= plan.tableHeading
  }
  const newPage = () => {
    page = pdf.addPage([w, h])
    pages.push(page)
    const top = h - margin
    text(opts.event, margin, top - 8, 8.5, fonts.regular, MUTED)
    text(opts.when, margin, top - 19, 8.5, fonts.regular, MUTED)
    text(`Restricted access meetings: ${country.name}`, margin, top - 43, 19, fonts.bold)
    const count = `${country.meetings.length} meeting${country.meetings.length === 1 ? '' : 's'}`
    text(`${count} · All times are ${TZ_LABEL}`, margin, top - 59, 9.5, fonts.regular)
    if (opts.updatedAt) {
      const label = `Last updated: ${opts.updatedAt} (Nairobi time)`
      const lw = fonts.bold.widthOfTextAtSize(safe(label), 10)
      page.drawRectangle({x: w - margin - lw - 16, y: top - 27, width: lw + 16, height: 22, color: SAND})
      text(label, w - margin - lw - 8, top - 19.5, 10, fonts.bold)
    }
    page.drawRectangle({x: margin, y: top - 72, width: w - margin * 2, height: 2.5, color: UN_BLUE})
    y = top - HEADER
    tableHeading()
  }

  newPage()
  for (const day of plan.days) {
    if (y - plan.dayHeading - (day.meetings[0]?.height ?? 0) < bottom) newPage()
    text(day.label, margin, y - plan.dayHeading + size * 0.7, size * 1.3, fonts.bold)
    y -= plan.dayHeading
    page!.drawLine({start: {x: margin, y}, end: {x: w - margin, y}, thickness: 1, color: INK})
    for (const m of day.meetings) {
      if (y - m.height < bottom) newPage()
      let x = margin
      m.cells.forEach((lines, i) => {
        lines.forEach((l, j) => page.drawText(l.text, {x: x + 3, y: y - pad - size * 0.8 - j * lh, size, font: l.font, color: l.color}))
        x += COLUMNS[i].width
      })
      y -= m.height
      page!.drawLine({start: {x: margin, y}, end: {x: w - margin, y}, thickness: 0.6, color: LINE})
    }
  }

  pages.forEach((p, i) => {
    text(`The schedule may change. Check the latest version at ${opts.url}`, margin, margin, 8, fonts.regular, MUTED, p)
    if (pages.length > 1) {
      const label = `Page ${i + 1} of ${pages.length}`
      text(label, w - margin - fonts.regular.widthOfTextAtSize(label, 8), margin, 8, fonts.regular, MUTED, p)
    }
  })
  return pdf.save()
}

export const GET: APIRoute = async ({params, url, locals}) => {
  const [{updatedAt, countries}, settings] = await Promise.all([getRamSchedule(locals.preview), getSettings(locals.preview)])
  const country = countries.find((c) => c.slug === params.country)
  if (!country) return new Response('Timetable not found', {status: 404, headers: {'Content-Type': 'text/plain; charset=utf-8'}})

  const pageUrl = new URL(`/ram-timetable?country=${country.slug}`, url.origin)
  const bytes = await buildPdf(country, {
    event: `${settings.edition ? `${settings.edition} ` : ''}${settings.eventName}`,
    when: [formatRange(settings.startDate, settings.endDate), [settings.venueName, settings.city, settings.country].filter(Boolean).join(', ')].join(' · '),
    updatedAt: updatedAt ? formatDateTime(updatedAt) : undefined,
    url: `${pageUrl.host}${pageUrl.pathname}${pageUrl.search}`,
  })
  return new Response(bytes as Uint8Array<ArrayBuffer>, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="WIRE-2026-RAM-timetable-${country.slug}.pdf"`,
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
