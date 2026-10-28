// Reads the RAM scheduling workbook (only its "Participant Schedule" sheet) or
// a CSV export of that sheet, and writes the website's ramSchedule document.
//
// Usage (from this folder, after `npm install`):
//   node import.mjs "WIRE 2026 RAM Scheduling Plan.xlsx"            check and write ../../seed/ram-schedule.json
//   node import.mjs schedule.csv --out other.json                    a CSV export works too
//   SANITY_AUTH_TOKEN=… node import.mjs file.xlsx --publish          also publish it to the live site
//
// The other sheets in the workbook hold internal notes and are never read.
import {readFileSync, writeFileSync} from 'node:fs'
import {basename, dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import ExcelJS from 'exceljs'
import {buildSchedule} from './sanitize.mjs'

const SHEET = 'Participant Schedule'
const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'krb5nty9'
const DATASET = process.env.SANITY_DATASET || 'production'

const here = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const file = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--out')
const out = args.includes('--out') ? args[args.indexOf('--out') + 1] : join(here, '../../seed/ram-schedule.json')
const publish = args.includes('--publish')
if (!file) {
  console.error('Usage: node import.mjs <schedule.xlsx|schedule.csv> [--out file.json] [--publish]')
  process.exit(1)
}

/** Plain text of an ExcelJS cell value (rich text, formulas, hyperlinks). */
function text(v) {
  if (v == null) return ''
  if (v instanceof Date) return v
  if (typeof v === 'object') {
    if (Array.isArray(v.richText)) return v.richText.map((t) => t.text).join('')
    if ('result' in v) return text(v.result)
    if ('text' in v) return text(v.text)
  }
  return String(v)
}

async function readXlsx(path) {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(path)
  const ws = wb.getWorksheet(SHEET)
  if (!ws) throw new Error(`No sheet called "${SHEET}". Sheets found: ${wb.worksheets.map((w) => w.name).join(', ')}`)
  const rows = []
  ws.eachRow({includeEmpty: true}, (row) => rows.push(row.values.slice(1).map(text)))
  return rows
}

/** Minimal CSV reader (quoted fields, embedded commas and line breaks). */
function readCsv(path) {
  const src = readFileSync(path, 'utf8').replace(/^﻿/, '')
  const rows = [[]]
  let field = ''
  let quoted = false
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') (field += '"'), i++
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') rows.at(-1).push(field), (field = '')
    else if (c === '\n') rows.at(-1).push(field.replace(/\r$/, '')), (field = ''), rows.push([])
    else field += c
  }
  rows.at(-1).push(field)
  return rows
}

const rows = /\.csv$/i.test(file) ? readCsv(file) : await readXlsx(file)
const {doc, warnings} = buildSchedule(rows, {sourceFile: basename(file)})

const countries = [...new Set(doc.meetings.map((m) => m.country))]
console.log(`${doc.meetings.length} meetings for ${countries.length} countries and organizations.`)
if (warnings.length) {
  console.log(`\n${warnings.length} thing(s) to check:`)
  for (const w of warnings) console.log(`  - ${w}`)
}

// _updatedAt is only for the local sample copy; Sanity sets its own when publishing.
writeFileSync(out, `${JSON.stringify({...doc, _updatedAt: new Date().toISOString()}, null, 2)}\n`)
console.log(`\nWrote ${out}`)

if (publish) {
  const token = process.env.SANITY_AUTH_TOKEN
  if (!token) throw new Error('Set SANITY_AUTH_TOKEN to a Sanity token with write access to publish.')
  const res = await fetch(`https://${PROJECT_ID}.api.sanity.io/v2026-10-01/data/mutate/${DATASET}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
    body: JSON.stringify({mutations: [{createOrReplace: doc}, {delete: {id: `drafts.${doc._id}`}}]}),
  })
  if (!res.ok) throw new Error(`Sanity refused the update: ${res.status} ${await res.text()}`)
  console.log('Published. The website shows the new timetable within about a minute.')
}
