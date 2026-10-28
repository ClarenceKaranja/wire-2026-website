# Restricted access meeting (RAM) timetables

Page: **/ram-timetable** (for example `https://wire2026.netlify.app/ram-timetable`). Participants pick their country or organization and see their meetings by day, with a one-page PDF download at `/ram-timetable/<country>.pdf`. A link such as `/ram-timetable?country=kenya` opens one timetable directly. The page is hidden from search engines but not password-protected: anyone with the link can see every country's timetable.

## Where the data comes from

Only the **Participant Schedule** sheet of the organizers' RAM scheduling workbook is used. The other sheets hold internal notes and are never read.

On import, people's names are removed. The site shows:

- countries and agencies (for example "Kenya – KRA Customs; DCI"), never the people in brackets;
- interpretation as the language only ("French"), never the interpreter;
- the "Same time as …" notes, without names. If two meetings overlap and the sheet has no note, the page adds one.

Short acronyms in brackets, such as "Customs (AGT)", are kept.

The timetable is stored in Sanity as one document, **Programme → Restricted access meeting timetables** in the Studio. Publishing it updates the website within about a minute, with no rebuild.

## Updating the timetable from a new Excel file

```bash
cd tools/ram-schedule
npm install
node import.mjs "WIRE 2026 RAM Scheduling Plan.xlsx"
```

This checks the file, prints anything worth a look (unreadable rows, overlaps without a note), and writes `seed/ram-schedule.json` for local development. A CSV export of the Participant Schedule sheet works too.

To publish, either:

- add `--publish` with a Sanity token that can write (`SANITY_AUTH_TOKEN=… node import.mjs file.xlsx --publish`; create the token in sanity.io/manage → API → Tokens, and do not save it in the repository), or
- send the file to whoever maintains the site, who runs the same script and publishes the resulting document.

The page's "Last updated" time is when the document was last published.

## Expected columns

Headings are matched by how they start, so small wording changes are fine: Country, Day ("Thu 5 Nov"), Time ("09:00–10:00"), Table, Meeting (ID such as KEN-02), Format, Requested by, Meeting with, Who attends / Attending from your delegation, Interpretation, Note. The first row whose first cell is "Country" is taken as the heading row.

## Small corrections

A single change (a table number, a time) can be made directly in the Studio document and published. The next Excel import replaces the whole list, so make the same change in the Excel file too.
