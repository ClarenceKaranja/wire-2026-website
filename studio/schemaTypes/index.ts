import {blockContent} from './objects/blockContent'
import {linkItem} from './objects/linkItem'
import {accessibleImage} from './objects/accessibleImage'
import {programmeDay} from './documents/programmeDay'
import {session} from './documents/session'
import {person} from './documents/person'
import {announcement} from './documents/announcement'
import {resource} from './documents/resource'
import {album} from './documents/album'
import {infoSection} from './documents/infoSection'
import {faq} from './documents/faq'
import {partner} from './documents/partner'
import {siteSettings} from './singletons/siteSettings'
import {homePage} from './singletons/homePage'
import {programmePage} from './singletons/programmePage'
import {participantInfoPage} from './singletons/participantInfoPage'
import {aboutPage} from './singletons/aboutPage'
import {ramSchedule} from './singletons/ramSchedule'

export const SINGLETONS = ['siteSettings', 'homePage', 'programmePage', 'participantInfoPage', 'aboutPage', 'ramSchedule']

export const schemaTypes = [
  blockContent,
  linkItem,
  accessibleImage,
  programmeDay,
  session,
  person,
  announcement,
  resource,
  album,
  infoSection,
  faq,
  partner,
  siteSettings,
  homePage,
  programmePage,
  participantInfoPage,
  aboutPage,
  ramSchedule,
]
