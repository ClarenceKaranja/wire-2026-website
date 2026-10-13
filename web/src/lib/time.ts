// All event times are local Nairobi time (East Africa Time, UTC+3, no daylight saving).
export const EVENT_TZ = 'Africa/Nairobi'
export const TZ_LABEL = 'East Africa Time (EAT, UTC+3)'

/** Today's date in Nairobi as YYYY-MM-DD. */
export function nairobiToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {timeZone: EVENT_TZ, year: 'numeric', month: '2-digit', day: '2-digit'}).format(now)
}

/** Formats a YYYY-MM-DD date as e.g. "Tuesday 3 November 2026". Dates are calendar dates, so format in UTC. */
export function formatDate(date: string, opts: Intl.DateTimeFormatOptions = {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}) {
  return new Intl.DateTimeFormat('en-GB', {...opts, timeZone: 'UTC'}).format(new Date(`${date.slice(0, 10)}T00:00:00Z`))
}

/** Formats an ISO date-time in Nairobi time, e.g. "13 October 2026, 09:00". */
export function formatDateTime(iso: string, withTime = true) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: EVENT_TZ,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(withTime ? {hour: '2-digit', minute: '2-digit', hourCycle: 'h23'} : {}),
  }).format(new Date(iso))
}

/** Date range such as "3–6 November 2026". */
export function formatRange(start: string, end: string) {
  const s = new Date(`${start}T00:00:00Z`)
  const e = new Date(`${end}T00:00:00Z`)
  const month = (d: Date) => d.toLocaleString('en-GB', {month: 'long', timeZone: 'UTC'})
  if (start === end) return formatDate(start, {day: 'numeric', month: 'long', year: 'numeric'})
  if (s.getUTCFullYear() === e.getUTCFullYear() && s.getUTCMonth() === e.getUTCMonth())
    return `${s.getUTCDate()}–${e.getUTCDate()} ${month(e)} ${e.getUTCFullYear()}`
  return `${formatDate(start, {day: 'numeric', month: 'long'})} – ${formatDate(end, {day: 'numeric', month: 'long', year: 'numeric'})}`
}

/** ISO instant for a Nairobi date and HH:MM time. */
export function nairobiInstant(date: string, time: string) {
  return `${date.slice(0, 10)}T${time}:00+03:00`
}

export type EventPhase = 'before' | 'during' | 'after'

export function resolvePhase(setting: string | undefined, start: string, end: string, today = nairobiToday()): EventPhase {
  if (setting === 'before' || setting === 'during' || setting === 'after') return setting
  if (today < start) return 'before'
  if (today > end) return 'after'
  return 'during'
}
