# Dependencies, accounts and approvals

## Accounts

| Service | Status | Owner action needed | Cost |
| --- | --- | --- | --- |
| **Sanity** (content and files) | Project `krb5nty9` created on your account, dataset `production`, verified content loaded | Invite editors; create a Viewer token for Netlify; deploy the Studio | Free plan |
| **GitHub** (code) | Not created | Create a private repository and push this folder | Free |
| **Netlify** (hosting) | Not created | Import the GitHub repository, set environment variables, approve the first deploy | Free plan (300 credits/month) |
| **Domain name** | Not chosen | Approve a domain and give DNS access, or use `*.netlify.app` | Varies; usually paid yearly |

Nothing has been deployed publicly, pushed to any repository or purchased.

## What is in Sanity now

- 64 published items: site settings, homepage, programme page, 4 programme days, 23 sessions, participant information (page, 11 sections, 9 FAQs), about page, 6 partners (2 shown, 4 waiting for approval), 5 empty photo albums (hidden until photos are added and approved), 1 announcement.
- 5 drafts waiting for their PDF files: the 4 documents and the announcement that points to them.
- No images or files yet (uploads could not be made from the build environment).
- No speakers or moderators: none were named in the source documents.

## Approvals still needed

| Item | From | Where it is switched on |
| --- | --- | --- |
| Official WIRE / UNODC logo files | Communications | Site settings → Official WIRE logo |
| Photograph licences (incl. Visual Identity wildlife images) | Communications | Upload only after clearance |
| Funding partner acknowledgements (EU, Norway, USA, Canada) | Each partner / substantive office | About → Partners → Acknowledgement approved |
| Public release of the 4 documents | Substantive office | Documents → Approved for public release |
| Venue name for publication | Organizers / security | Site settings → Venue name |
| Practical contacts | Each contact | Site settings → Contacts |
| Each speaker/moderator | The person | People → consent box |
| Photo albums | Communications | Album → approval box |
| Domain name and launch date | UNODC | Netlify |
| A participant directory | Not built; would need separate data-protection approval | n/a |

## Software the site depends on

All open source, installed from npm, versions locked in `package-lock.json`.

| Package | Used for |
| --- | --- |
| Astro 7, @astrojs/netlify | Building and serving the website on Netlify |
| Tailwind CSS 4 | Styling |
| @sanity/client, @sanity/image-url | Reading published content and resizing images |
| @sanity/preview-url-secret, @sanity/webhook | Secure editor preview and instant refresh |
| @netlify/functions | Clearing the page cache after publishing |
| astro-portabletext | Displaying rich text from Sanity |
| groq-js | Offline development with sample content |
| Roboto (Fontsource) | The UN primary typeface, self-hosted (no Google Fonts tracking) |
| Sanity Studio 6, React 19 | The content editor |

## Data and privacy notes

- The website sets no analytics or tracking cookies. The only cookie is the editor preview cookie, used only by signed-in editors.
- Fonts and images are served from the site and Sanity's CDN; no third-party trackers are loaded.
- The participant (PAX) list was only checked to see what it contained. Because it holds personal data (dates of birth, passport numbers, contact details), nothing from it was copied, uploaded or stored anywhere in this project.
- If analytics are wanted later, choose a privacy-friendly option and add a privacy notice approved by UNODC first.
