// Builds seed/dataset.ndjson: the starting content for the WIRE 2026 website.
// Every fact here comes from the documents supplied by the organizers:
//   - WIRE 2026, Nairobi - (Draft) Agenda.pdf
//   - WIRE Information Note - Nairobi 2026 (updated 14-09)
//   - Logistics Notes for sponsored and self-sponsored participants
// Items that the documents mark as "to be confirmed" are shown as such.
//
// Usage: node seed/build-seed.mjs   (writes seed/dataset.ndjson)
// Import into Sanity: cd studio && npx sanity dataset import ../seed/dataset.ndjson production
import {writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
let keyCounter = 0
const key = () => `k${(++keyCounter).toString(36).padStart(5, '0')}`

/** Converts a small markdown-like string into Portable Text blocks.
 *  Supports paragraphs, "### " headings, "#### " sub-headings, "- " bullets,
 *  **bold**, and [label](href) links. */
function pt(src) {
  const blocks = []
  for (const raw of src.trim().split(/\n/)) {
    const line = raw.trim()
    if (!line) continue
    let style = 'normal'
    let listItem
    let text = line
    if (line.startsWith('#### ')) (style = 'h4'), (text = line.slice(5))
    else if (line.startsWith('### ')) (style = 'h3'), (text = line.slice(4))
    else if (line.startsWith('- ')) (listItem = 'bullet'), (text = line.slice(2))
    const markDefs = []
    const children = []
    const re = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g
    let last = 0
    let m
    while ((m = re.exec(text))) {
      if (m.index > last) children.push({_type: 'span', _key: key(), text: text.slice(last, m.index), marks: []})
      if (m[1]) children.push({_type: 'span', _key: key(), text: m[2], marks: ['strong']})
      else {
        const k = key()
        markDefs.push({_type: 'link', _key: k, href: m[5]})
        children.push({_type: 'span', _key: key(), text: m[4], marks: [k]})
      }
      last = m.index + m[0].length
    }
    if (last < text.length) children.push({_type: 'span', _key: key(), text: text.slice(last), marks: []})
    const block = {_type: 'block', _key: key(), style, markDefs, children}
    if (listItem) Object.assign(block, {listItem, level: 1})
    blocks.push(block)
  }
  return blocks
}

const ref = (id) => ({_type: 'reference', _ref: id})
const image = (file, alt, credit) => ({
  _type: 'image',
  _sanityAsset: `image@file://./assets/${file}`,
  alt,
  ...(credit ? {credit} : {}),
})
const file = (name) => ({_type: 'file', _sanityAsset: `file@file://./assets/${name}`})
const EMAIL = 'unodc-wire@un.org'
const docs = []
const add = (doc) => (docs.push(doc), doc._id)

// ---------------------------------------------------------------- settings
add({
  _id: 'siteSettings',
  _type: 'siteSettings',
  shortTitle: 'WIRE 2026',
  eventName: 'Wildlife Inter-Regional Enforcement (WIRE) Forum',
  edition: '10th',
  startDate: '2026-11-03',
  endDate: '2026-11-06',
  city: 'Nairobi',
  country: 'Kenya',
  eventPhase: 'auto',
  organizerLine:
    'Organized by the United Nations Office on Drugs and Crime (UNODC), in collaboration with the Office of the Director of Public Prosecutions (ODPP) of Kenya.',
  contactEmail: EMAIL,
  contacts: [
    {_type: 'contact', _key: key(), label: 'General enquiries, travel and logistics', name: 'WIRE Organizing Committee', email: EMAIL},
  ],
  footerNote: 'Chatham House Rule applies throughout WIRE unless otherwise expressly requested and authorized by participants.',
  socialImage: image('wildlife-rhino.jpg', 'A white rhinoceros walking towards the camera'),
  notice: {active: false},
})

// ---------------------------------------------------------------- documents
const agendaId = add({
  _id: 'resource-draft-agenda',
  _type: 'resource',
  title: 'WIRE 2026 draft agenda',
  description: 'Provisional four-day agenda for 3–6 November 2026. Subject to change.',
  category: 'agenda',
  file: file('wire-2026-draft-agenda.pdf'),
  versionLabel: 'Draft',
  language: 'English',
  publishedAt: '2026-10-13',
  status: 'current',
  featured: true,
  approved: true,
})
add({
  _id: 'resource-information-note',
  _type: 'resource',
  title: 'Information Note: 10th WIRE Forum, Nairobi 2026',
  description:
    'Pre-event information note: event details, Kenya eTA guidance, what to expect, guiding questions and restricted access meetings.',
  category: 'information-note',
  file: file('wire-2026-information-note.pdf'),
  versionLabel: 'Updated 14 September 2026',
  language: 'English',
  publishedAt: '2026-09-14',
  status: 'current',
  featured: true,
  approved: true,
})
add({
  _id: 'resource-logistics-sponsored',
  _type: 'resource',
  title: 'Logistics Note for sponsored participants',
  description: 'Travel, accommodation, Kenya eTA, health, currency and airport transfer information for sponsored participants.',
  category: 'logistics',
  file: file('wire-2026-logistics-note-sponsored.pdf'),
  language: 'English',
  publishedAt: '2026-10-13',
  status: 'current',
  featured: false,
  approved: true,
})
add({
  _id: 'resource-logistics-self',
  _type: 'resource',
  title: 'Logistics Note for self-sponsored participants',
  description: 'Practical information for participants arranging their own travel and accommodation.',
  category: 'logistics',
  file: file('wire-2026-logistics-note-self-sponsored.pdf'),
  language: 'English',
  publishedAt: '2026-10-13',
  status: 'current',
  featured: false,
  approved: true,
})

// ---------------------------------------------------------------- programme
const days = [
  ['day-1', '2026-11-03', 'Day 1', 'Registration, opening ceremony, moderated panels and the welcome dinner.'],
  ['day-2', '2026-11-04', 'Day 2', 'Moderated panels, followed by a visit to Kenya Wildlife Service headquarters and Nairobi National Park.'],
  ['day-3', '2026-11-05', 'Day 3', 'Restricted access meetings between delegations.'],
  ['day-4', '2026-11-06', 'Day 4', 'Restricted access meetings and the closing session.'],
]
for (const [id, date, label, summary] of days) add({_id: id, _type: 'programmeDay', date, label, summary})

const PANEL_TBC = 'Topic, moderator and panellists to be confirmed.'
const sessions = [
  // day, start, end, title, type, subtitle, description, status
  ['day-1', '08:00', '09:00', 'Registration', 'registration'],
  ['day-1', '09:15', '10:15', 'Opening ceremony', 'ceremony', 'Welcome and opening remarks'],
  ['day-1', '10:15', '10:30', 'Objectives, administrative and logistic arrangements', 'plenary'],
  ['day-1', '10:30', '11:00', 'Group photo and health break', 'break'],
  ['day-1', '11:00', '12:00', 'Moderated panel', 'panel', null, PANEL_TBC, 'tbc'],
  ['day-1', '12:00', '13:00', 'Lunch', 'meal'],
  ['day-1', '13:00', '14:00', 'Moderated panel', 'panel', null, PANEL_TBC, 'tbc'],
  ['day-1', '14:00', '15:00', 'Moderated panel', 'panel', null, PANEL_TBC, 'tbc'],
  ['day-1', '15:00', '15:15', 'Health break', 'break'],
  ['day-1', '15:15', '16:15', 'Storytelling / panel presentation', 'presentation', null, 'Details to be confirmed.', 'tbc'],
  ['day-1', '16:15', '16:30', 'Closing of Day 1', 'plenary', 'Logistics for Day 2'],
  ['day-1', '18:00', '20:00', 'Welcome dinner', 'networking', null, 'Location to be confirmed.', 'tbc'],
  ['day-2', '09:00', '10:30', 'Moderated panel', 'panel', null, PANEL_TBC, 'tbc'],
  ['day-2', '10:30', '11:00', 'Health break', 'break'],
  ['day-2', '11:00', '12:00', 'Moderated panel', 'panel', null, PANEL_TBC, 'tbc'],
  ['day-2', '12:00', '14:00', 'Drive to Nairobi National Park with takeaway lunch', 'visit'],
  ['day-2', '14:00', '16:30', 'Visit to Kenya Wildlife Service headquarters and Nairobi National Park', 'visit'],
  ['day-3', '09:00', '12:30', 'Restricted access meetings', 'restricted'],
  ['day-3', '12:30', '14:00', 'Lunch', 'meal'],
  ['day-3', '14:00', '16:30', 'Restricted access meetings (continued)', 'restricted'],
  ['day-4', '09:00', '12:00', 'Restricted access meetings (continued)', 'restricted'],
  ['day-4', '12:00', '12:30', 'Closing session', 'ceremony', 'Evaluation · Final thoughts and next steps'],
  ['day-4', '12:30', '14:00', 'Lunch and departure', 'meal'],
]
sessions.forEach(([day, startTime, endTime, title, sessionType, subtitle, description, status], i) =>
  add({
    _id: `session-${String(i + 1).padStart(2, '0')}`,
    _type: 'session',
    title,
    day: ref(day),
    startTime,
    endTime,
    sessionType,
    ...(subtitle ? {subtitle} : {}),
    ...(description ? {description: pt(description)} : {}),
    status: status ?? 'confirmed',
    hybrid: false,
    sortOrder: 0,
    featured: false,
  }),
)

add({
  _id: 'programmePage',
  _type: 'programmePage',
  intro:
    'WIRE runs from Tuesday 3 to Friday 6 November 2026 in Nairobi. Days 1 and 2 are open plenary days; Days 3 and 4 are dedicated to restricted access meetings between delegations.',
  statusNote: 'Draft programme, subject to change. Speakers and panel topics will be added as they are confirmed.',
  agenda: ref(agendaId),
  restrictedNote:
    'Closed-door meetings between delegations, arranged in advance. Meeting schedules and rooms are shared only with the delegations concerned and are not published on this website.',
})

// ---------------------------------------------------------------- announcements
add({
  _id: 'announcement-agenda-available',
  _type: 'announcement',
  title: 'Draft agenda and logistics notes available',
  category: 'document',
  message: pt(
    'The draft agenda, the updated Information Note and the logistics notes for sponsored and self-sponsored participants are available in [Resources](/resources). The programme is subject to change; this website will show the latest version.',
  ),
  publishedAt: '2026-10-13T06:00:00Z',
  featured: true,
  link: {_type: 'linkItem', label: 'Go to documents', href: '/resources'},
})
add({
  _id: 'announcement-eta-reminder',
  _type: 'announcement',
  title: 'Reminder: apply for your Kenya eTA before travelling',
  category: 'practical',
  message: pt(
    'Participants holding non-East African passports need an approved Kenya Electronic Travel Authorization (eTA) before travelling. Apply only through the official portal, [etakenya.go.ke](https://etakenya.go.ke/), at least 72 hours before departure. Please wait for your participation confirmation (or, for sponsored participants, your confirmed flight ticket) before applying.',
  ),
  publishedAt: '2026-10-13T06:05:00Z',
  featured: false,
  link: {_type: 'linkItem', label: 'Entry requirements', href: '/participant-information#kenya-eta'},
})

// ---------------------------------------------------------------- gallery (empty albums)
const albums = [
  ['opening-ceremony', 'Opening ceremony', 'opening', 'day-1', 10],
  ['forum-sessions', 'WIRE sessions', 'sessions', null, 20],
  ['networking-and-partnerships', 'Networking and partnerships', 'networking', null, 30],
  ['nairobi-national-park-visit', 'Nairobi National Park visit', 'park-visit', 'day-2', 40],
  ['closing-and-outcomes', 'Closing and outcomes', 'closing', 'day-4', 50],
]
for (const [slug, title, activity, day, sortOrder] of albums)
  add({
    _id: `album-${slug}`,
    _type: 'album',
    title,
    slug: {_type: 'slug', current: slug},
    activity,
    ...(day ? {day: ref(day)} : {}),
    sortOrder,
    photos: [],
    approvalConfirmed: false,
  })

// ---------------------------------------------------------------- participant information
add({
  _id: 'participantInfoPage',
  _type: 'participantInfoPage',
  intro:
    'Practical information for participants travelling to Nairobi. Where details are still being finalized, this page says so and will be updated. For anything not covered here, contact the WIRE Organizing Committee.',
})

const sections = [
  [
    'venue',
    'Venue and directions',
    'WIRE takes place in Nairobi, Kenya. Venue details to follow.',
    `WIRE will be held in Nairobi, Kenya, as an in-person event.
The venue name, address and meeting room information will be communicated in a final logistics note before the event, and will be added to this page.`,
    true,
  ],
  [
    'kenya-eta',
    'Entry to Kenya: Electronic Travel Authorization (eTA)',
    'Required for all non-East African passport holders.',
    `All participants holding non-East African passports must obtain a Kenya Electronic Travel Authorization (eTA) before travelling. Kenya has replaced physical visas with this digital system, and **boarding will be denied without an approved eTA**.
#### How to apply
- Apply only through the official Government of Kenya portal: [etakenya.go.ke](https://etakenya.go.ke/). Do not use third-party agencies or unofficial websites.
- Application type: **Standard eTA**.
- Purpose of visit: **Business / Meeting / Conference**.
- Submit your application at least **72 hours before departure**.
#### When to apply
- Sponsored participants: wait until you receive your confirmed flight ticket from the organizers, so the travel dates match your itinerary.
- Self-sponsored participants: wait until you receive confirmation of your participation.
#### After approval
The eTA is sent by email. Print a copy and keep an electronic copy on your phone to show on arrival.
#### Reimbursement (sponsored participants)
The cost of the eTA for sponsored participants is eligible for reimbursement in accordance with UNODC travel procedures. Keep the official payment receipt and the approved eTA confirmation. Reimbursement instructions will be given during WIRE.`,
    false,
  ],
  [
    'travel',
    'Flights and travel arrangements',
    'Who books flights for sponsored and self-sponsored participants.',
    `#### Sponsored participants
Flights are arranged by the organizers. Once your itinerary is finalized you will receive your electronic ticket, your itinerary and any additional travel instructions. Please do not make independent flight bookings. If your itinerary needs to change after the ticket is issued, notify the WIRE Organizing Committee immediately.
#### Self-sponsored participants
You are responsible for arranging and financing your own travel to and from Nairobi. Please make sure your travel dates match the official programme (3–6 November 2026).`,
    false,
  ],
  [
    'airport',
    'Arriving at Jomo Kenyatta International Airport (JKIA)',
    'Documents to keep at hand and getting from the airport.',
    `#### Arrival checklist
Keep these documents readily available:
- Passport valid for at least six months beyond the date of entry
- Approved Kenya eTA (where applicable)
- Flight itinerary
- Hotel confirmation
- Invitation letter (if requested by immigration authorities)
#### Airport transfers: sponsored participants
Transfers between JKIA and the official WIRE hotel are arranged by the organizers. Detailed transfer instructions, including meeting points and emergency contact numbers, will be shared before WIRE.
#### Airport transfers: self-sponsored participants
Please arrange your own transport between JKIA and your accommodation. Options include registered airport taxis, Uber, Bolt, Little Cab and hotel shuttle services where available. Use only licensed transport providers and avoid unofficial taxi services.`,
    false,
  ],
  [
    'accommodation',
    'Accommodation',
    'Hotel arrangements for sponsored and self-sponsored participants.',
    `#### Sponsored participants
Accommodation is arranged and paid for by the organizers for the official duration of WIRE. Hotel confirmation details, including check-in and check-out dates, will be shared once travel arrangements are finalized. Incidental expenses (such as room service, minibar, laundry, telephone calls or other personal expenses) are the participant’s responsibility.
#### Self-sponsored participants
Please arrange and pay for your own accommodation. Information on recommended hotels near the venue will be shared before the event. Book early, as hotel availability in Nairobi may be limited.`,
    false,
  ],
  [
    'park-visit',
    'Nairobi National Park visit',
    'Day 2 afternoon, Wednesday 4 November.',
    `On the afternoon of Day 2 (Wednesday 4 November), participants will travel to Nairobi National Park, with a takeaway lunch (12:00–14:00), for a visit to the Kenya Wildlife Service headquarters offices and Nairobi National Park (14:00–16:30).
Meeting point, transport and other arrangements for the visit will be shared closer to the date.`,
    true,
  ],
  [
    'meals',
    'Meals and receptions',
    'Breaks, lunches and the welcome dinner.',
    `According to the draft programme:
- Health breaks are scheduled in the morning and afternoon of the plenary days.
- Lunch is provided on Days 1, 3 and 4, and a takeaway lunch on Day 2 during the drive to Nairobi National Park.
- A **welcome dinner** takes place on Day 1, Tuesday 3 November, from 18:00 to 20:00. The location will be confirmed.`,
    true,
  ],
  [
    'interpretation-accessibility',
    'Interpretation and accessibility',
    'Arrangements to be confirmed.',
    `Information on interpretation and accessibility arrangements will be published here once confirmed.
If you have accessibility requirements, please contact the WIRE Organizing Committee at [${EMAIL}](mailto:${EMAIL}) so that arrangements can be made.`,
    true,
  ],
  [
    'health',
    'Health and insurance',
    'Vaccinations, yellow fever certificate and travel insurance.',
    `There are currently no COVID-19 vaccination or testing requirements for entry into Kenya. Please make sure your routine vaccinations are up to date before travel.
Vaccinations commonly recommended for travellers to Kenya include Hepatitis A, Hepatitis B, Typhoid, Tetanus-Diphtheria-Pertussis (Td/Tdap), Measles-Mumps-Rubella (MMR) and Polio (where applicable).
#### Yellow fever
A yellow fever vaccination certificate is required only for travellers arriving from, or transiting for more than 12 hours through, countries with a risk of yellow fever transmission, in accordance with Kenya Ministry of Health regulations.
Consult your national health authorities or a travel medicine provider before departure, and make sure you have adequate travel and medical insurance for your stay.`,
    false,
  ],
  [
    'practical',
    'Money, power and weather',
    'Currency, plugs, climate and dress code.',
    `#### Currency
The Kenyan Shilling (KES) is the official currency (indicatively 1 USD = 130 KES). Major international credit and debit cards are widely accepted and ATMs are readily available in Nairobi. Foreign currency can be exchanged at banks, licensed foreign exchange bureaus and at JKIA. Mobile payments such as M-Pesa are widely used.
#### Electricity
Kenya uses plug Type G (British three-pin), 240 volts, 50 hertz. Bring a travel adaptor if your devices use a different plug.
#### Weather and dress
November in Nairobi is generally warm with occasional rain: typically 22–27°C during the day and 14–18°C in the evening. Bring business attire or national dress for WIRE sessions, and a light jacket or sweater for the evenings.`,
    false,
  ],
  [
    'ground-rules',
    'Chatham House Rule',
    'How information shared at WIRE may be used.',
    `The Chatham House Rule applies throughout WIRE, unless otherwise expressly requested and authorized by participants. Participants are free to use the information received, but neither the identity nor the affiliation of the speaker(s), nor that of any other participant, may be revealed.`,
    false,
  ],
]
sections.forEach(([slug, title, summary, body, tbc], i) =>
  add({
    _id: `info-${slug}`,
    _type: 'infoSection',
    title,
    slug: {_type: 'slug', current: slug},
    summary,
    body: pt(body),
    toBeConfirmed: tbc,
    sortOrder: (i + 1) * 10,
  }),
)

const faqs = [
  [
    'Travel and entry',
    'Do I need a visa to travel to Kenya?',
    'Participants holding non-East African passports need an approved Kenya Electronic Travel Authorization (eTA), applied for through [etakenya.go.ke](https://etakenya.go.ke/). Boarding will be denied without it. See [Entry to Kenya](/participant-information#kenya-eta).',
  ],
  [
    'Travel and entry',
    'Will the cost of my eTA be reimbursed?',
    'For sponsored participants, yes: the eTA cost is eligible for reimbursement in accordance with UNODC travel procedures. Keep your official payment receipt and the approved eTA confirmation. Instructions will be given during WIRE.',
  ],
  [
    'Travel and entry',
    'Who books my flight?',
    'Flights for sponsored participants are arranged by the organizers; please do not book independently. Self-sponsored participants arrange and pay for their own travel.',
  ],
  [
    'Travel and entry',
    'Will someone meet me at the airport?',
    'Airport transfers between JKIA and the official WIRE hotel are arranged for sponsored participants; meeting points will be shared before WIRE. Self-sponsored participants arrange their own transport using licensed providers.',
  ],
  [
    'Venue and programme',
    'Where exactly will WIRE take place?',
    'The venue name and address will be communicated in a final logistics note and added to this website. WIRE is an in-person event in Nairobi.',
  ],
  [
    'Venue and programme',
    'Is WIRE open to the media or recorded?',
    'The Chatham House Rule applies throughout WIRE unless participants expressly request and authorize otherwise.',
  ],
  [
    'Practical matters',
    'What should I wear?',
    'Business attire or national dress for WIRE sessions, and a light jacket or sweater for cooler evenings (typically 14–18°C).',
  ],
  [
    'Practical matters',
    'What plugs and currency are used in Kenya?',
    'Plug Type G (British three-pin), 240 V. The currency is the Kenyan Shilling (KES); cards are widely accepted and ATMs are easy to find.',
  ],
  ['General', 'Who do I contact with questions?', `The WIRE Organizing Committee: [${EMAIL}](mailto:${EMAIL}).`],
]
faqs.forEach(([topic, question, answer], i) =>
  add({_id: `faq-${String(i + 1).padStart(2, '0')}`, _type: 'faq', topic, question, answer: pt(answer), sortOrder: (i + 1) * 10}),
)

// ---------------------------------------------------------------- about
add({
  _id: 'aboutPage',
  _type: 'aboutPage',
  intro: pt(
    `The Wildlife Inter-Regional Enforcement (WIRE) Forum is an annual event that brings together law enforcement and criminal justice practitioners; wildlife, forest and fisheries management authorities; policymakers; and regional and international partners to strengthen cross-regional collaboration in combating wildlife crime.
The 10th WIRE takes place in Nairobi, Kenya, from 3 to 6 November 2026.`,
  ),
  objectives: [
    'Share information on ongoing and emerging wildlife trafficking trends.',
    'Coordinate operational responses.',
    'Identify cross-regional synergies and challenges.',
    'Strengthen partnerships and capacity for collective action.',
  ],
  body: pt(
    `### What to expect
A highly collaborative, solutions-oriented environment, with open plenary sessions and restricted access meetings that allow for more sensitive discussions among criminal justice practitioners.
### Restricted access meetings
Restricted access meetings are closed-door discussions between agencies or delegations with an ongoing investigation, operation, prosecution or other case or query. They provide an informal setting to share information and intelligence, work through bottlenecks and agree next steps together. UNODC and other partners do not attend these meetings unless previously agreed with the delegations, under conditions of confidentiality.
### Who takes part
Participants come from law enforcement and criminal justice agencies across Africa and Asia, including police, customs, prosecutors, and wildlife and forestry authorities, together with government representatives, international organizations and partner institutions.`,
  ),
  organizersText: pt(
    `The 10th WIRE is organized by the **United Nations Office on Drugs and Crime (UNODC)**, in collaboration with the **Office of the Director of Public Prosecutions (ODPP) of Kenya**.`,
  ),
})

const partners = [
  ['United Nations Office on Drugs and Crime (UNODC)', 'organizer', null, 'https://www.unodc.org', 10, true],
  ['Office of the Director of Public Prosecutions (ODPP), Kenya', 'host', null, 'https://www.odpp.go.ke', 20, true],
  // Shown in the footer of the Information Note and logistics notes. Hidden until the organizers approve the wording.
  ['European Union', 'funder', 'Co-funded by the European Union', null, 30, false],
  ['Norway', 'funder', null, null, 40, false],
  ['United States of America', 'funder', null, null, 50, false],
  ['Canada', 'partner', 'In partnership with Canada', null, 60, false],
]
partners.forEach(([name, role, acknowledgement, url, sortOrder, approved], i) =>
  add({
    _id: `partner-${i + 1}`,
    _type: 'partner',
    name,
    role,
    ...(acknowledgement ? {acknowledgement} : {}),
    ...(url ? {url} : {}),
    sortOrder,
    approved,
  }),
)

// ---------------------------------------------------------------- homepage
add({
  _id: 'homePage',
  _type: 'homePage',
  heroLead:
    'Law enforcement and criminal justice practitioners from Africa and Asia meet in Nairobi to strengthen cross-regional cooperation against wildlife crime.',
  heroImage: image('wildlife-rhino.jpg', 'A white rhinoceros walking towards the camera'),
  welcomeHeading: 'Welcome to the 10th WIRE',
  welcomeMessage: pt(
    `Dear participant, welcome to the participant website of the 10th Wildlife Inter-Regional Enforcement (WIRE) Forum, held in Nairobi from 3 to 6 November 2026.
This site is your single source for the official programme, practical information, documents, announcements and, after WIRE, photographs and outcomes. It is updated as arrangements are confirmed, so please check back before you travel.`,
  ),
  quickLinks: [
    {_type: 'linkItem', _key: key(), label: 'Programme', description: 'Four-day agenda, 3–6 November', href: '/programme'},
    {_type: 'linkItem', _key: key(), label: 'Entry to Kenya (eTA)', description: 'Apply at least 72 hours before departure', href: '/participant-information#kenya-eta'},
    {_type: 'linkItem', _key: key(), label: 'Arriving in Nairobi', description: 'Airport checklist and transfers', href: '/participant-information#airport'},
    {_type: 'linkItem', _key: key(), label: 'Documents', description: 'Agenda, Information Note, logistics notes', href: '/resources'},
    {_type: 'linkItem', _key: key(), label: 'Frequently asked questions', description: 'Quick answers', href: '/participant-information#faq'},
    {_type: 'linkItem', _key: key(), label: 'Contact', description: EMAIL, href: `mailto:${EMAIL}`},
  ],
  showUpcomingSessions: true,
  outcomesHeading: 'Outcomes of WIRE',
})

const out = docs.map((d) => JSON.stringify(d)).join('\n') + '\n'
writeFileSync(join(here, 'dataset.ndjson'), out)
console.log(`Wrote ${docs.length} documents to seed/dataset.ndjson`)
