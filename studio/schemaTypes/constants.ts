export const API_VERSION = '2026-10-01'

export const MB = 1024 * 1024

/** Documents larger than this show a warning (slow on mobile data). */
export const FILE_WARN_BYTES = 25 * MB
/** Documents larger than this cannot be published. */
export const FILE_MAX_BYTES = 100 * MB
/** Photos larger than this show a warning. */
export const IMAGE_WARN_BYTES = 20 * MB
/** Photos larger than this cannot be published. */
export const IMAGE_MAX_BYTES = 40 * MB

export const DOCUMENT_FILE_TYPES = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.odt,.odp,.ods,.txt,.csv,.zip'

export const SESSION_TYPES = [
  {title: 'Registration', value: 'registration'},
  {title: 'Ceremony (opening / closing)', value: 'ceremony'},
  {title: 'Plenary', value: 'plenary'},
  {title: 'Panel discussion', value: 'panel'},
  {title: 'Presentation', value: 'presentation'},
  {title: 'Break', value: 'break'},
  {title: 'Meal', value: 'meal'},
  {title: 'Networking / reception', value: 'networking'},
  {title: 'Site visit / excursion', value: 'visit'},
  {title: 'Restricted access meetings (no details shown)', value: 'restricted'},
  {title: 'Other', value: 'other'},
]

export const RESOURCE_CATEGORIES = [
  {title: 'Agenda', value: 'agenda'},
  {title: 'Information note', value: 'information-note'},
  {title: 'Logistics and travel', value: 'logistics'},
  {title: 'Participant guidance', value: 'guidance'},
  {title: 'Presentation', value: 'presentation'},
  {title: 'Report', value: 'report'},
  {title: 'Publication', value: 'publication'},
  {title: 'Media and communications', value: 'media'},
  {title: 'Other', value: 'other'},
]

export const ANNOUNCEMENT_CATEGORIES = [
  {title: 'Programme change', value: 'programme'},
  {title: 'Transport', value: 'transport'},
  {title: 'Room or venue change', value: 'venue'},
  {title: 'Practical notice', value: 'practical'},
  {title: 'New document', value: 'document'},
  {title: 'Post-event', value: 'post-event'},
  {title: 'General', value: 'general'},
]

export const ALBUM_ACTIVITIES = [
  {title: 'Opening ceremony', value: 'opening'},
  {title: 'Forum sessions', value: 'sessions'},
  {title: 'Networking and partnerships', value: 'networking'},
  {title: 'Nairobi National Park visit', value: 'park-visit'},
  {title: 'Closing and outcomes', value: 'closing'},
  {title: 'Other', value: 'other'},
]
