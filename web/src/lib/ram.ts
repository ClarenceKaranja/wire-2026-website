// Restricted access meeting (RAM) timetables, one per country or organization.
// The data is one Sanity document ("ramSchedule"), written by
// tools/ram-schedule/import.mjs from the organizers' Excel file. People's and
// interpreters' names are removed by that script before anything is published.
import {fetchContent, Q} from './content'
import {formatDate} from './time'

export type RamMeeting = {
  _key: string
  country: string
  date: string
  start: string
  end: string
  table?: string
  meetingId: string
  format?: string
  meetingWith?: string[]
  attending?: string
  requestedBy?: string[]
  interpretation?: string
  note?: string
}

export type RamCountry = {
  name: string
  slug: string
  meetings: RamMeeting[]
  days: {date: string; label: string; meetings: (RamMeeting & {clash?: string})[]}[]
}

export type RamSchedule = {updatedAt?: string; countries: RamCountry[]}

/** URL-friendly id, e.g. "Congo, Democratic Republic of the (online)" → "congo-democratic-republic-of-the". Same rule as the import script. */
export function ramSlug(name: string) {
  return name
    .replace(/\([^)]*\)/g, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Other names people may type when searching, keyed by slug. */
export const RAM_ALIASES: Record<string, string[]> = {
  'congo-democratic-republic-of-the': ['DRC', 'DR Congo', 'Congo-Kinshasa'],
  'congo-republic-of-the': ['Congo-Brazzaville'],
  'viet-nam': ['Vietnam'],
  'lao-pdr': ['Laos'],
  'hong-kong-sar-china': ['HKSAR'],
  'united-states': ['USA', 'US', 'America'],
  'netherlands': ['Holland'],
  'unodc': ['United Nations'],
  'wildlife-justice-commission': ['WJC'],
}

/** Explains a clash: the organizers' note if there is one, otherwise which meetings overlap. */
function clashNote(m: RamMeeting, all: RamMeeting[]) {
  if (m.note) return m.note
  const others = all.filter((o) => o !== m && o.date === m.date && o.start < m.end && m.start < o.end).map((o) => o.meetingId)
  if (!others.length) return undefined
  return `Same time as ${others.join(' and ')}: different people from your delegation attend each.`
}

export function groupRamSchedule(meetings: RamMeeting[]): RamCountry[] {
  const byCountry = new Map<string, RamMeeting[]>()
  for (const m of meetings) byCountry.set(m.country, [...(byCountry.get(m.country) ?? []), m])
  return [...byCountry.entries()]
    .map(([name, list]) => {
      const sorted = [...list].sort((a, b) => (a.date + a.start + a.end).localeCompare(b.date + b.start + b.end) || a.meetingId.localeCompare(b.meetingId))
      const dates = [...new Set(sorted.map((m) => m.date))]
      return {
        name,
        slug: ramSlug(name),
        meetings: sorted,
        days: dates.map((date) => ({
          date,
          label: formatDate(date, {weekday: 'long', day: 'numeric', month: 'long'}),
          meetings: sorted.filter((m) => m.date === date).map((m) => ({...m, clash: clashNote(m, sorted)})),
        })),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'en', {sensitivity: 'base'}))
}

export async function getRamSchedule(preview = false): Promise<RamSchedule> {
  const doc = await fetchContent<{_updatedAt?: string; meetings?: RamMeeting[]} | null>(Q.RAM_SCHEDULE_QUERY, preview)
  return {updatedAt: doc?._updatedAt, countries: groupRamSchedule(doc?.meetings ?? [])}
}

/** "Bilateral" or "Multilateral" (or whatever the file says), with a fallback. */
export const formatLabel = (m: RamMeeting) => m.format || 'Meeting'

/** Splits "Kenya – KRA Customs; DCI" into its country and agencies for display. */
export function splitParty(line: string): {country?: string; agencies: string} {
  const i = line.indexOf(' – ')
  if (line.startsWith('(') || i < 0) return {agencies: line}
  return {country: line.slice(0, i), agencies: line.slice(i + 3)}
}
