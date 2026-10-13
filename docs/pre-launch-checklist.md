# Pre-launch checklist

Tick each line before the site address is shared publicly. Owner in brackets.

## Approvals (communications / substantive office)

- [ ] Final wording of every page approved by UNODC and ODPP Kenya.
- [ ] Official WIRE and UNODC logos supplied and uploaded in Site settings (until then the text wordmark is shown).
- [ ] Licensing confirmed for any photograph used on the site. The six wildlife photos in `seed/assets/` were taken from the Visual Identity PDF and are used only in the offline sample content (the rhino as homepage and sharing image); their web licence is unconfirmed, so do not upload them to Sanity until it is.
- [ ] Funding partner acknowledgements (EU, Norway, USA, Canada) confirmed, then **Acknowledgement approved** ticked for each.
- [ ] The four documents (draft agenda, information note, two logistics notes) cleared for public release.
- [ ] Venue name cleared for publication (Site settings → Venue name is empty until then).
- [ ] Practical contacts confirmed as official or consented.
- [ ] Domain name approved (or decision to use the `*.netlify.app` address).

## Content (editors)

- [ ] Upload the four PDFs (in `seed/assets/`) into their waiting draft entries in **Documents**, check the details, and publish. The drafts already have **Approved for public release** ticked because you supplied these files for the site; untick any that is not cleared. Then publish the waiting announcement "Draft agenda and logistics notes available".
- [ ] Upload a cleared homepage main image (Homepage → Main image) and a social sharing image (Site settings), both with alternative text. Neither is set in Sanity yet.
- [ ] Check every programme session against the latest agenda.
- [ ] Add speakers/moderators only with consent.
- [ ] Read every page on a phone.

## Technical (site administrator)

- [ ] Studio deployed and editors invited with the Editor role.
- [ ] Netlify environment variables set; the read token has the **Viewer** role only.
- [ ] Preview tested from the Studio: a draft change is visible in Preview but not on the public site.
- [ ] Publishing tested end to end: publish a small change, see it live within about a minute; unpublish it, see it disappear.
- [ ] Webhook (if used) tested: Sanity → Webhooks → the attempts log shows `200`.
- [ ] `https://<site>/robots.txt` shows `Allow: /` and a sitemap line on production.
- [ ] `https://<site>/sitemap.xml` lists the pages with the real domain.
- [ ] A missing page (e.g. `/test-404`) shows the friendly 404 page.
- [ ] Sharing a link on WhatsApp/LinkedIn shows the right title and image.
- [ ] Accessibility spot check: keyboard-only navigation of the programme tabs and gallery lightbox; zoom to 200%.
- [ ] Netlify **Usage** page reviewed and someone named to watch it during Forum week.

## Already verified during the build

These were checked on a local production build with sample content (13 October 2026):

- All pages return correctly; unknown pages return a real 404.
- No automated accessibility (axe, WCAG 2.2 A/AA rules) violations on any page at phone and desktop widths, and no sideways scrolling.
- No secrets in the browser files.
- Restricted Access Meetings: with a room and description deliberately added to them in test data, neither appeared in the site's data.
- Deploy-preview builds send `noindex` and a blocking `robots.txt`; production builds do not.

**Not yet tested** (needs the live accounts): fetching live content from Sanity on Netlify, Studio preview, the webhook, the gallery lightbox with real photos, and publishing from the Studio through to the live site.
