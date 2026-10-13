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
  "home": *[_id == "homePage"][0]{..., heroImage${IMAGE}},
  "announcements": *[${LIVE_ANNOUNCEMENT} && (!defined(expiresAt) || dateTime(expiresAt) > dateTime($now))] | order(featured desc, publishedAt desc)[0...3]${ANNOUNCEMENT},
  "featuredSessions": *[_type == "session" && featured == true] | order(day->date asc, startTime asc)${SESSION},
  "sessions": *[_type == "session" && status != "cancelled"] | order(day->date asc, startTime asc, sortOrder asc){_id, title, startTime, endTime, sessionType, status, "location": select(sessionType != "restricted" => location), "day": day->{_id, label, date}},
  "featuredDocuments": *[${PUBLIC_RESOURCE} && featured == true && status == "current" && (!defined(expiresAt) || expiresAt > $today)] | order(publishedAt desc)[0...4]${RESOURCE},
  "featuredPhotos": *[${PUBLIC_ALBUM}] | order(sortOrder asc){
    title, "slug": slug.current,
    "photos": photos[visible != false && featured == true]${IMAGE}
  },
  "albumCount": count(*[${PUBLIC_ALBUM}]),
  "programme": *[_id == "programmePage"][0]{statusNote, "agenda": *[_id == ^.agenda._ref && ${PUBLIC_RESOURCE}][0]${RESOURCE}}
}`

export const PROGRAMME_QUERY = `{
  "page": *[_id == "programmePage"][0]{intro, statusNote, restrictedNote, "agenda": *[_id == ^.agenda._ref && ${PUBLIC_RESOURCE}][0]${RESOURCE}},
  "days": *[_type == "programmeDay"] | order(date asc){
    _id, label, date, summary,
    "sessions": *[_type == "session" && day._ref == ^._id] | order(startTime asc, sortOrder asc)${SESSION}
  },
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
  "page": *[_id == "participantInfoPage"][0],
  "sections": *[_type == "infoSection"] | order(sortOrder asc){_id, title, "slug": slug.current, summary, body, toBeConfirmed},
  "faqs": *[_type == "faq"] | order(sortOrder asc){_id, question, answer, topic}
}`

export const ABOUT_QUERY = `{
  "page": *[_id == "aboutPage"][0],
  "partners": *[_type == "partner" && approved == true] | order(sortOrder asc){_id, name, role, acknowledgement, url, logo${IMAGE}}
}`

export const SITEMAP_QUERY = `{
  "albums": *[${PUBLIC_ALBUM}]{"slug": slug.current, _updatedAt}
}`
