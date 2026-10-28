import {test} from 'node:test'
import assert from 'node:assert/strict'
import {buildSchedule, cleanNote, language, parseDay, parseTime, peopleFreeLines, slugify, stripPeople} from './sanitize.mjs'

test('removes people but keeps agencies, acronyms and "online"', () => {
  assert.equal(stripPeople('Customs (AGT) (Abel Gamba)'), 'Customs (AGT)')
  assert.equal(stripPeople('Kenya – KRA Customs (Tabitha Shikanda, Paul Mburu); DCI (Josphine Korir)'), 'Kenya – KRA Customs; DCI')
  assert.equal(stripPeople('Portugal – GNR – EMPACT Africa (Carlos Manuel Gonçalves Fernandes)'), 'Portugal – GNR – EMPACT Africa')
  assert.equal(stripPeople('Dutch Police (Ayke Haller (Eelco van Riel is in NLD-03 at the same time))'), 'Dutch Police')
  assert.equal(stripPeople('Forest Department (R.S.M. Munirul Islam)'), 'Forest Department')
  assert.equal(
    stripPeople('Congo, Democratic Republic of the (online) – Customs (DGDA) (online – names to be confirmed); ICCN (online – names to be confirmed)'),
    'Congo, Democratic Republic of the (online) – Customs (DGDA) (online); ICCN (online)',
  )
  assert.equal(stripPeople('Entire delegation'), 'Entire delegation')
})

test('keeps explanatory lines', () => {
  assert.deepEqual(peopleFreeLines('Angola – Customs (AGT) (Abel Gamba)\nNamibia – Prosecutor-General (Johannes Kalipi)\n(combined: both sides asked to meet)'), [
    'Angola – Customs (AGT)',
    'Namibia – Prosecutor-General',
    '(combined: both sides asked to meet)',
  ])
})

test('interpretation shows the language only', () => {
  assert.equal(language('French – Assane'), 'French')
  assert.equal(language('Portuguese – Portuguese 1'), 'Portuguese')
  assert.equal(language('French (Ale)'), 'French')
  assert.equal(language(null), undefined)
})

test('notes lose names', () => {
  assert.equal(
    cleanNote('Same time as GAB-02 – Customs (Franklin Ijomah, Michael Osong) attend that one; Same time as NGA-01 – NFIU (Caroline Nwafor) attends that one'),
    'Same time as GAB-02 – Customs attend that one; Same time as NGA-01 – NFIU attends that one',
  )
})

test('days, times and slugs', () => {
  assert.equal(parseDay('Thu 5 Nov', 2026), '2026-11-05')
  assert.deepEqual(parseTime('9:00–10:30'), {start: '09:00', end: '10:30'})
  assert.equal(slugify('Congo, Democratic Republic of the (online)'), 'congo-democratic-republic-of-the')
  assert.equal(slugify("Côte d'Ivoire"), 'cote-d-ivoire')
})

test('builds the document from sheet rows', () => {
  const rows = [
    ['WIRE 2026 – Restricted Access Meetings by Country'],
    ['Country', 'Day', 'Time', 'Table', 'Meeting', 'Format', 'Your role', 'Requested by', 'Meeting with', 'Who attends from your delegation', 'Interpretation', 'Note'],
    ['Kenya', 'Fri 6 Nov', '09:00–10:00', 'Table 6', 'GAB-01', 'Multilateral', '', 'Gabon – PGO (A B)', 'Gabon – PGO (A B)', 'ODPP (C D)', 'French – Assane', ''],
    ['Kenya', 'Thu 5 Nov', '09:00–09:30', 'Table 5', 'KEN-01', 'Bilateral', '', 'Kenya – KWS (E)', 'Madagascar – Entire delegation', 'KWS (E)', '', ''],
  ]
  const {doc, warnings} = buildSchedule(rows)
  assert.deepEqual(warnings, [])
  assert.deepEqual(doc.meetings.map((m) => m.meetingId), ['KEN-01', 'GAB-01'])
  assert.equal(doc.meetings[1].attending, 'ODPP')
  assert.equal(doc.meetings[1].interpretation, 'French')
  assert.doesNotMatch(JSON.stringify(doc), /Assane|\(A B\)|\(E\)/)
})
