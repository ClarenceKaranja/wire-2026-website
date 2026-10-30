import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {ClockIcon} from '@sanity/icons/Clock'
import {BellIcon} from '@sanity/icons/Bell'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {ImagesIcon} from '@sanity/icons/Images'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {ArchiveIcon} from '@sanity/icons/Archive'
import {UsersIcon} from '@sanity/icons/Users'
import {StartHere} from './components/StartHere'

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string, icon: React.ComponentType) =>
  S.listItem()
    .title(title)
    .id(type)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('WIRE website')
    .items([
      S.listItem()
        .title('Start here: how to edit')
        .id('start-here')
        .icon(HelpCircleIcon)
        .child(S.component(StartHere).title('How to edit the website')),
      S.divider(),
      singleton(S, 'homePage', 'Homepage', HomeIcon),
      S.listItem()
        .title('Announcements')
        .id('announcements')
        .icon(BellIcon)
        .child(S.documentTypeList('announcement').title('Announcements').defaultOrdering([{field: 'publishedAt', direction: 'desc'}])),
      S.divider(),
      S.listItem()
        .title('Agenda')
        .id('programme')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Agenda')
            .items([
              singleton(S, 'programmePage', 'Agenda page and agenda download', CalendarIcon),
              S.listItem()
                .title('Sessions by day')
                .id('sessions-by-day')
                .icon(ClockIcon)
                .child(
                  S.documentTypeList('programmeDay')
                    .title('Choose a day')
                    .defaultOrdering([{field: 'date', direction: 'asc'}])
                    .child((dayId) =>
                      S.documentList()
                        .title('Sessions')
                        .schemaType('session')
                        .filter('_type == "session" && day._ref == $dayId')
                        .params({dayId})
                        .defaultOrdering([
                          {field: 'startTime', direction: 'asc'},
                          {field: 'sortOrder', direction: 'asc'},
                        ])
                        .initialValueTemplates([S.initialValueTemplateItem('session-for-day', {dayId})]),
                    ),
                ),
              S.documentTypeListItem('session').title('All sessions'),
              S.documentTypeListItem('programmeDay').title('Agenda days'),
              S.documentTypeListItem('person').title('Speakers and moderators'),
              singleton(S, 'ramSchedule', 'Restricted access meeting timetables', UsersIcon),
            ]),
        ),
      S.listItem()
        .title('Documents and downloads')
        .id('documents')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Documents')
            .items([
              S.listItem()
                .title('Current documents')
                .id('docs-current')
                .icon(DocumentsIcon)
                .child(
                  S.documentList()
                    .title('Current documents')
                    .schemaType('resource')
                    .filter('_type == "resource" && (status == "current" || !defined(status))')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Archived and hidden documents')
                .id('docs-archived')
                .icon(ArchiveIcon)
                .child(
                  S.documentList()
                    .title('Archived and hidden')
                    .schemaType('resource')
                    .filter('_type == "resource" && status in ["archived", "hidden"]')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
                ),
              S.documentTypeListItem('resource').title('All documents'),
            ]),
        ),
      S.listItem()
        .title('Photo gallery')
        .id('gallery')
        .icon(ImagesIcon)
        .child(S.documentTypeList('album').title('Photo albums').defaultOrdering([{field: 'sortOrder', direction: 'asc'}])),
      S.divider(),
      S.listItem()
        .title('Participant information')
        .id('participant-info')
        .icon(InfoOutlineIcon)
        .child(
          S.list()
            .title('Participant information')
            .items([
              singleton(S, 'participantInfoPage', 'Page introduction', InfoOutlineIcon),
              S.documentTypeListItem('infoSection').title('Information sections'),
              S.documentTypeListItem('faq').title('Frequently asked questions'),
            ]),
        ),
      S.listItem()
        .title('About WIRE and partners')
        .id('about')
        .icon(EarthGlobeIcon)
        .child(
          S.list()
            .title('About WIRE')
            .items([
              singleton(S, 'aboutPage', 'About WIRE page', EarthGlobeIcon),
              S.documentTypeListItem('partner').title('Organizers and partners'),
            ]),
        ),
      S.divider(),
      singleton(S, 'siteSettings', 'Site settings, contacts and logo', CogIcon),
    ])
