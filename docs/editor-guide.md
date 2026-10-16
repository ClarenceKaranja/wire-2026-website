# Editor guide

For anyone updating the WIRE 2026 website. No technical knowledge needed.

## The basics

1. Open the Studio at **https://wire2026.netlify.app/studio** and sign in with the account you were invited with.
2. Pick an area from the left menu, such as **Programme** or **Documents**.
3. Make your change. Sanity saves a **draft** automatically as you type. Drafts are never shown on the public website.
4. Press **Publish** (bottom right). The change appears on the live website within about one minute.

Useful buttons in the menu at the bottom right:

- **Discard changes** throws away your unpublished edits and goes back to what is live.
- **Unpublish** removes an item from the website but keeps it in the Studio.
- **History** (clock icon, top right) shows every earlier version and lets you restore one.

If a field turns red, the Studio is telling you something is missing or wrong, and it will not let you publish until it is fixed. Yellow warnings are advice; you can still publish.

**Preview:** once the website is live and preview is configured, the **Preview** tab shows the website with your unpublished drafts, so you can check a change before publishing. Only signed-in editors can see drafts.

**All times are Nairobi time (EAT, UTC+3).** Type times exactly as they appear in the agenda; the site never converts them.

Before publishing anything, check [the content approval checklist](content-approval-checklist.md).

---

## Programme

Left menu: **Programme**.

- **Programme days** hold the date and label of each day (e.g. "Day 1: Tuesday 3 November"). You will rarely need to touch these.
- **Sessions by day** is the easiest way to work: open a day to see its sessions in time order. Use the **+** button there to add a session that is already linked to that day.

### Adding or editing a session

| Field | What to enter |
| --- | --- |
| Session title | As in the approved agenda. |
| Day, Start time, End time | 24-hour time, e.g. `09:30`. |
| Type of session | Plenary, panel, break, etc. Choose **Restricted access** for Restricted Access Meetings (see below). |
| Room or location | Only if approved for publication. Hidden for restricted sessions. |
| Status | **Confirmed**, **Details to be confirmed**, **Changed** or **Cancelled**. |
| What changed? | Shown when status is Changed, e.g. "Moved from 14:00 to 15:00". |
| Moderators / Speakers | Pick from **People**. A person only appears if their consent box is ticked. |
| Order within the same start time | Only needed when two sessions start at the same time. |

**Last-minute changes:** set the status to **Changed** and fill in **What changed?**. The session is highlighted on the programme page. Use **Cancelled** rather than deleting, so participants can see it was cancelled.

### Restricted Access Meetings

Choose **Restricted access** as the type and give it a neutral title (e.g. "Restricted Access Meeting"). The website shows only the time block and a short standard note. It never shows the room, description, speakers or anything else for these sessions, even if someone fills those fields in by mistake. Do not put participant lists, room assignments or schedules for these meetings anywhere in the Studio.

### People (speakers and moderators)

Add a person only when they have agreed to appear on the public website, and tick **This person has agreed to appear on the public website**. Without that tick they are never shown. A portrait is optional and needs alternative text.

### The PDF agenda

On **Programme page**, the **Downloadable agenda** field links to a document from **Documents**. It appears as a download button only once that document is marked **Approved for public release**.

---

## Documents (resources and downloads)

Left menu: **Documents**.

1. Create a new document, give it a clear **Title** and choose a **Category**.
2. Upload the **File** (PDF, Word, Excel, PowerPoint). Files over 25 MB get a warning; over 100 MB are refused. Or give a **Web address** if the document lives on another site.
3. Fill in **Version label** (e.g. "Version 2, 10 October 2026"), **Language** and **Publication date**.
4. Set **Status**:
   - **Current**: listed in the document library.
   - **Archived**: listed under "Earlier versions and archive".
   - **Hidden**: not listed anywhere.
5. Tick **Approved for public release** only once the document is cleared. Without this tick it never appears.
6. Publish.

**Replacing a document with a new version:** either upload the new file into the same document and update the version label, or create a new document and set the old one to **Archived**. The second keeps the old version available for reference.

**Important:** removing a document from the website does not delete the file from Sanity's file storage, and anyone who already has the direct file link can still open it. If a file was published by mistake and must disappear, unpublish the document **and** ask the site administrator to delete the file asset (see [maintenance guide](maintenance-and-handover.md#removing-a-file-completely)).

---

## Photo gallery

Left menu: **Photo gallery**. One album per activity (Opening ceremony, Forum sessions, etc.). Five empty albums are ready.

1. Open the album and drag photos into **Photos**. JPEG is best; up to 20 MB per photo is fine, 40 MB is the limit.
2. For each photo fill in **Alternative text** (what the photo shows, for screen-reader users; required), and optionally **Caption** and **Photo credit**.
3. Tick **Use as album cover** on one photo, and **Feature on the homepage** on a few strong ones.
4. Untick **Show on website** to hide a single photo without deleting it.
5. When every visible photo has been approved by the communications focal point, tick **All visible photos in this album are approved for public release**, then Publish.

An album does not appear on the website until it has at least one visible photo **and** the approval box is ticked.

Do not upload photos of Restricted Access Meetings, badges, documents on tables, screens with personal data, or people who have asked not to be photographed.

---

## Announcements

Left menu: **Announcements**.

- **Title** and **Message**: keep it short and clear.
- **Publication date**: the announcement appears from this moment (Nairobi time). You can schedule ahead by choosing a future time.
- **Expiry date** (optional): it disappears after this.
- **Highlight on the homepage**: shows it on the homepage.
- **Related document** or **Related link**: optional button.

For something urgent that every visitor must see (e.g. a venue change on the day), use **Site settings → Urgent notice bar** instead. Tick **Show the notice**; it shows a coloured bar at the top of every page. Set **Hide automatically after** or remember to switch it off.

---

## Participant information, FAQs and contacts

Left menu: **Participant information**.

- **Page introduction** is the text at the top.
- **Sections** are the headed blocks (venue, visas/eTA, travel, accommodation, meals, etc.). Change the order with **Position on the page**. Tick **Details still to be confirmed** if a section is provisional.
- **FAQs** appear as expandable questions at the bottom.
- Practical contacts are in **Site settings → Contacts and footer**. Use role-based or official addresses only, never private personal numbers unless that person has agreed.

### French and Portuguese versions

The Participant information page (sections, FAQs and introduction) is also published in French at **/participant-information/fr** and in Portuguese at **/participant-information/pt**, with an English / Français / Português switcher at the top. The rest of the website is English only.

- Each section, each FAQ and the **Participant information page** has three tabs at the top: **English**, **Français** and **Português**. The heading, summary and text are filled in separately on each tab. Anchor, position, topic and "to be confirmed" are set once on the English tab and apply to all three.
- **When you change the English text, update the Français and Português tabs too**, then publish. The list of sections and FAQs shows "FR ✓ PT ✓" when both translations exist.
- If a tab is left empty, the website shows the English text there with a small "not yet translated" label, so a new section can be published in English first and translated later.
- Portuguese follows the spelling used in Angola (as in the translated logistics notes), for example *Quénia*, *contacto*, *actualizado*.
- Links to other parts of this page (such as `/participant-information#kenya-eta`) can be copied as they are; the website keeps readers in their language automatically.

## Homepage and About

- **Homepage**: introductory sentence, main image, welcome message, quick links, and the **After the Forum** outcomes summary (shown only once the Forum is over).
- **About**: description of WIRE and of the partners. A partner appears only when **Acknowledgement approved for the website** is ticked. Four funding partners are loaded but unticked until their acknowledgement wording is confirmed.

## Site settings

- **Website mode**: leave on **Automatic (by date)**. The site switches itself to "during the Forum" on 3 November and to "after the Forum" on 7 November (Nairobi time). You can force a mode if needed.
- **Official WIRE logo**: upload only an approved, official file. Until then the site shows a text wordmark.
- **Social sharing image**: 1200 × 630 pixels.

## Getting help

The **Start here** item at the top of the Studio menu has a short version of this guide. For anything that looks broken on the website, contact the site administrator named in the handover note.
