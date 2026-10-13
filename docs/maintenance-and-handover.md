# Maintenance and handover

## Who does what

| Role | Responsible for | Needs |
| --- | --- | --- |
| Content editors | Programme, documents, photos, announcements | Sanity **Editor** role |
| Communications focal point | Approving photos, wording, partner acknowledgements | Sanity Editor or Viewer |
| Site administrator | Netlify, domain, tokens, webhook, Studio deploys, removing files | Sanity **Administrator**, Netlify owner, GitHub write access |

Name at least two administrators so the site is never dependent on one person.

## During Forum week (3–6 November)

- One editor on duty each day for programme changes and announcements.
- For a programme change: set the session to **Changed** with a note, publish, and consider an announcement or the urgent notice bar.
- Check Netlify **Usage** once a day.
- Upload photos at the end of each day; publish albums only after approval.

## After the Forum

The site switches to "after" mode on 7 November by itself.

1. Fill in Homepage → **After the Forum** (outcomes heading and summary) and publish.
2. Publish final documents (outcome statement, presentations if cleared) and set superseded versions to **Archived**.
3. Finish the photo albums.
4. Switch off any notice bar and expire event-week announcements.
5. Decide how long the site stays online and who keeps the domain renewed.

## Monthly, while the site is live

- Remove editors who no longer need access (sanity.io/manage → Members).
- Check that documents marked Current are still current.
- Apply security updates: in `web/` and `studio/` run `npm outdated` and `npm audit`; update, test locally, push. Netlify rebuilds automatically.

## Removing a file completely

Unpublishing a document or album hides it on the website, but the file stays in Sanity's file storage and its direct link keeps working. To delete it:

1. Make sure nothing still uses it (unpublish and delete the document, or remove the photo from the album, then publish).
2. In the Studio, an administrator opens **Vision** (top menu) and runs `*[_type in ["sanity.fileAsset","sanity.imageAsset"] && originalFilename match "name-of-file*"]{_id, originalFilename, url}` to find it.
3. Delete it with the Sanity CLI: `npx sanity documents delete <asset id>` from the `studio` folder. Sanity refuses if something still references it.
4. Cached copies at Sanity's CDN may take a short while to expire.

## Rotating secrets

If a token may have leaked: sanity.io/manage → API → Tokens → delete it, create a new **Viewer** token, update `SANITY_API_READ_TOKEN` in Netlify, redeploy. For `PREVIEW_COOKIE_SECRET` or `SANITY_WEBHOOK_SECRET`, generate a new value, update it in Netlify (and in the Sanity webhook), and redeploy.

## Where things are in the code

| Need to change | File |
| --- | --- |
| Studio fields and validation | `studio/schemaTypes/` |
| Studio menu | `studio/structure.ts` |
| What the website fetches (and what it filters out) | `web/src/lib/queries.ts` |
| Page layouts | `web/src/pages/` |
| Colours (UN black, white and UN Blue), Roboto font, buttons | `web/src/styles/global.css` |
| Security and cache headers | `web/src/middleware.ts` |
| Netlify build settings | `netlify.toml` |

Local development works with no accounts: `cd web && npm install && npm run dev` uses the sample content in `seed/`. If the seed content changes, regenerate it with `node seed/build-seed.mjs`.
