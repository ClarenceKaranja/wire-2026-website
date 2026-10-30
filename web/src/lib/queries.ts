// All GROQ queries in one place. Every query takes $now (ISO date-time) and
// $today (YYYY-MM-DD in Nairobi) so that expiry rules behave the same
// locally and live.

const IMAGE = `{alt, caption, credit, hotspot, crop, "asset": asset->{_id, url, metadata{lqip, dimensions}}}`

const PERSON = `{name, position, organization, country, photo${IMAGE}}`

export const SESSION = `{
  _id, title, startTime, endTime, sessionType, status, changeNote, featured,
  "day": day->{_id, label, date},
  // Restricted Access Meetings are published as time blocks only: no room,
  // description, speakers or other detail ever leaves Sanity for them.
  sessionType != "restricted" => {
    subtitle, description, location, hybrid,
    "moderators": moderators[@->consent == true]->${PERSON},
    "speakers": speakers[@->consent == true]->${PERSON}
  }
}`

export const RESOURCE = `{
  _id, title, description, category, versionLabel, language, publishedAt, featured, externalUrl,
  "status": select(status == "archived" || (defined(expiresAt) && expiresAt <= $today) => "archived", "current"),
  "file": file.asset->{url, size, extension, mimeType, originalFilename}
}`

/** Documents the public may see: approved, not hidden. */
const PUBLIC_RESOURCE = `_type == "resource" && approved == true && status != "hidden"`

const LIVE_ANNOUNCEMENT = `_type == "announcement" && dateTime(publishedAt) <= dateTime($now)`

export const ANNOUNCEMENT = `{
  _id, title, category, message, publishedAt, expiresAt, featured,
  link,
  "relatedDocument": *[_id == ^.relatedDocument._ref && ${PUBLIC_RESOURCE}][0]${RESOURCE}
}`

const PUBLIC_ALBUM = `_type == "album" && approvalConfirmed == true && count(photos[visible != false]) > 0`

export const SETTINGS_QUERY = `*[_id == "siteSettings"][0]{
  ..., logo${IMAGE}, logoOnDark${IMAGE}, socialImage${IMAGE}
}`

export const HOME_QUERY = `{
  "home": *[_id == "homePage"][0]{heroLead, heroImage${IMAGE}, outcomesHeading, outcomesSummary},
  "latest": *[${LIVE_ANNOUNCEMENT} && (!defined(expiresAt) || dateTime(expiresAt) > dateTime($now))] | order(featured desc, publishedAt desc)[0]{_id, title, publishedAt}
}`

export const PROGRAMME_QUERY = `{
  "page": *[_id == "programmePage"][0]{intro, statusNote, restrictedNote, "agenda": *[_id == ^.agenda._ref && ${PUBLIC_RESOURCE}][0]${RESOURCE}},
  "days": *[_type == "programmeDay"] | order(date asc){
    _id, label, date, summary,
    "sessions": *[_type == "session" && day._ref == ^._id] | order(startTime asc, sortOrder asc)${SESSION}
  },
  // Current agenda PDFs in other languages, shown next to the main download.
  "translations": *[${PUBLIC_RESOURCE} && category == "agenda" && language in ["French", "Portuguese"] && status != "archived" && (!defined(expiresAt) || expiresAt > $today)] | order(language asc)${RESOURCE},
  "lastUpdated": *[_type in ["session", "programmeDay", "programmePage", "person"]] | order(_updatedAt desc)[0]._updatedAt
}`

export const RESOURCES_QUERY = `*[${PUBLIC_RESOURCE}] | order(featured desc, publishedAt desc)${RESOURCE}`

export const ANNOUNCEMENTS_QUERY = `*[${LIVE_ANNOUNCEMENT}] | order(publishedAt desc)${ANNOUNCEMENT}`

export const ALBUMS_QUERY = `*[${PUBLIC_ALBUM}] | order(sortOrder asc){
  _id, title, description, activity, "slug": slug.current, "day": day->{label, date},
  "count": count(photos[visible != false]),
  "cover": coalesce(photos[visible != false && isCover == true][0], photos[visible != false][0])${IMAGE}
}`

export const ALBUM_QUERY = `*[${PUBLIC_ALBUM} && slug.current == $slug][0]{
  _id, title, description, activity, "slug": slug.current, "day": day->{label, date},
  "photos": photos[visible != false]{_key, ...${IMAGE}}
}`

export const INFO_QUERY = `{
  "page": *[_id == "participantInfoPage"][0]{intro, fr{intro}, pt{intro}},
  "sections": *[_type == "infoSection"] | order(sortOrder asc){
    _id, title, "slug": slug.current, summary, body, toBeConfirmed,
    fr{title, summary, body}, pt{title, summary, body}
  },
  "faqs": *[_type == "faq"] | order(sortOrder asc){_id, question, answer, topic, fr{question, answer}, pt{question, answer}}
}`

export const ABOUT_QUERY = `{
  "page": *[_id == "aboutPage"][0],
  "partners": *[_type == "partner" && approved == true] | order(sortOrder asc){_id, name, role, acknowledgement, url, logo${IMAGE}}
}`

export const SITEMAP_QUERY = `{
  "albums": *[${PUBLIC_ALBUM}]{"slug": slug.current, _updatedAt}
}`

// Restricted access meeting timetables (see lib/ram.ts). Names were removed on import.
export const RAM_SCHEDULE_QUERY = `*[_id == "ramSchedule"][0]{_updatedAt, meetings}`
