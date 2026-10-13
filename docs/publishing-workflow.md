# Publishing workflow

## From Studio to live site

1. An editor changes content in Sanity Studio. Sanity saves a **draft**. The public site never reads drafts.
2. The editor presses **Publish**.
3. The next visitor to an affected page gets a freshly built page from Netlify, which reads the published content from Sanity's CDN.
4. Netlify keeps each page cached for **60 seconds**, then quietly refreshes it in the background. So a change is visible to everyone within about a minute.
5. If the instant-refresh webhook is configured, Sanity tells the site to clear its cache the moment something is published, and the change is visible immediately.

No rebuild or code change is involved, so Netlify build credits are not used.

## What can delay a change

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| Change not visible after 2 minutes | Your browser cached the page | Reload with Ctrl+F5 (Cmd+Shift+R on Mac), or try a private window |
| Still not visible | It is still a draft | Check the Studio: the Publish button should be greyed out |
| An item never appears | An approval box is unticked, the status is Hidden, or the publication date is in the future | See the editor guide for that content type |
| Document disappeared | Its expiry date passed | Clear or extend the expiry date |

## Approval gates built into the site

The website only shows an item when all its conditions are met:

| Content | Shown only when |
| --- | --- |
| Document | **Approved for public release** ticked, status not Hidden |
| Photo album | approval box ticked **and** at least one photo visible |
| Person (speaker/moderator) | consent box ticked |
| Partner | **Acknowledgement approved** ticked |
| Announcement | publication date reached and not expired |
| Restricted Access Meeting | always time block only; details never fetched |

## Previewing drafts

With preview configured (see [deployment guide](netlify-deployment.md) steps 3–4), the **Preview** tab in the Studio shows the real website with drafts included. Preview works through a signed, one-hour cookie that only the Studio can create, and preview pages are never cached or indexed. Closing the Preview tab does not end it in that browser; visit `/api/preview/disable` to leave preview mode early.

## Automatic changes over time

The website reads the current Nairobi date on each request, so these happen by themselves:

- Before 3 November: "before the Forum" homepage.
- 3–6 November: "during the Forum" mode; the programme opens on today's tab and marks the session happening now.
- From 7 November: "after the Forum" mode; the homepage shows the outcomes summary and gallery.
- Scheduled announcements appear at their publication time; documents and announcements disappear after their expiry date.

Because pages are cached for a minute, a time-based change can lag by up to a minute.
