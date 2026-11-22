# WIRE participant website

Public website for participants of the 10th Wildlife Inter-Regional Enforcement (WIRE) Forum, 3–6 November 2026, Nairobi, Kenya. Organized by UNODC with the Office of the Director of Public Prosecutions (ODPP) Kenya.

| Part | Folder | What it is |
| --- | --- | --- |
| Website | `web/` | Astro + Tailwind. Hosted on Netlify. Reads content from Sanity. |
| Content editor (Studio) | `studio/` | Sanity Studio. Built into the website at `/studio`; sign-in required. |
| RAM timetable import | `tools/ram-schedule/` | Turns the RAM Excel schedule into the timetable shown at `/ram-timetable`. |
| Sample content | `seed/` | The verified content already loaded into Sanity, used for offline development. |
| Guides | `docs/` | Editor guides, deployment, checklists and handover. |

## How publishing works, in plain English

Editors change content in Sanity Studio and press **Publish**. The website does not need to be rebuilt: each page is produced on request and kept in Netlify's cache for about one minute, so a published change appears on the live site within roughly a minute. An optional webhook makes it instant. Code changes (rare) go through GitHub, and Netlify rebuilds automatically.

This design was chosen because Netlify's free plan allows about 20 production deploys a month, which a busy event week could use up if every content change triggered a rebuild. See [docs/publishing-workflow.md](docs/publishing-workflow.md).

## Run it on your computer

Requires Node.js 22 (see `.nvmrc`).

```bash
cd web
npm install
npm run dev          # http://localhost:4321
```

With no `web/.env` file, the site uses the sample content in `seed/`. To use the live Sanity content, copy `.env.example` to `web/.env` and set `PUBLIC_SANITY_PROJECT_ID=krb5nty9`.

Studio locally:

```bash
cd studio
npm install
npm run dev          # http://localhost:3333 (sign in with your Sanity account)
```

## Deploying

See [docs/cloudflare-deployment.md](docs/cloudflare-deployment.md) (the site is moving from Netlify to Cloudflare). Nothing is deployed until the steps there are carried out by an account owner.

## Documentation

- [Editor guide](docs/editor-guide.md): programme, documents, photos, announcements, everyday edits
- [Publishing workflow](docs/publishing-workflow.md): how changes reach the site, cache, preview, webhook
- [Content approval checklist](docs/content-approval-checklist.md): what must never be published
- [Cloudflare deployment](docs/cloudflare-deployment.md): setup, custom domain, retiring the Netlify address
- [Netlify deployment (old host)](docs/netlify-deployment.md)
- [Pre-launch checklist](docs/pre-launch-checklist.md)
- [Restricted access meeting timetables](docs/ram-timetables.md): updating the RAM lookup page from the Excel schedule
- [Maintenance and handover](docs/maintenance-and-handover.md): during and after the Forum
- [Dependencies, accounts and approvals](docs/dependencies-and-approvals.md)

## Security in one paragraph

The public website only ever reads **published** content. The only secret it holds is a read-only Sanity token used for editor previews, stored as a Netlify environment variable that never reaches the browser. No write token exists in this repository, the website, or Netlify. Approval switches in the Studio (documents, photo albums, people, partners) mean nothing appears publicly until someone ticks "approved". Restricted Access Meetings are shown as time blocks only in the programme; the website query never fetches their room, description or speakers. The separate RAM timetable page shows countries, agencies, tables and languages, with people's names removed on import (see [docs/ram-timetables.md](docs/ram-timetables.md)).
