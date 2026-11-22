# Hosting on Cloudflare

The website runs on **Cloudflare Workers**. In the Cloudflare dashboard this sits under **Workers & Pages**. Cloudflare builds it from GitHub on every push to `main`.

Cloudflare now recommends Workers over the older "Pages" product. The Astro adapter (`@astrojs/cloudflare` v14) only supports Workers, and Workers works the same way: it connects to Git, gives a free `*.workers.dev` address, takes custom domains and issues HTTPS automatically.

Nothing here deploys itself. An account owner does each step, and each go-live needs approval.

## 1. Create the Worker from GitHub

1. Sign in at dash.cloudflare.com (or create a free account).
2. Go to **Workers & Pages → Create → Import a repository**, connect GitHub, and pick `wire-2026-website`.
3. Fill in the settings:
   - **Project name:** `wire-2026-website` (must match `name` in `web/wrangler.jsonc`)
   - **Production branch:** `main`
   - **Root directory (path):** `web`
   - **Build command:** `npm run build:studio && npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Non-production branch deploy command:** `npx wrangler versions upload` (preview links for pull requests)
4. Under **Build variables** (these are read while the site is built), add:

| Name | Value |
| --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | `krb5nty9` |
| `PUBLIC_SANITY_DATASET` | `production` |
| `PUBLIC_SITE_URL` | The final address, e.g. `https://wire2026.org`. Use the `*.workers.dev` address until the domain is connected. |
| `SANITY_STUDIO_PREVIEW_URL` | Same as `PUBLIC_SITE_URL` (the Studio's Preview tab) |
| `NODE_VERSION` | `22` |

5. Deploy. The build stops with a clear error if `PUBLIC_SANITY_PROJECT_ID` is missing, so the site can never go live with the sample content.

## 2. Secrets (read while the site runs)

Go to Worker → **Settings → Variables and Secrets** and add each of these as type **Secret**:

| Name | Value |
| --- | --- |
| `SANITY_API_READ_TOKEN` | A Sanity token with the **Viewer** role, for editor previews of drafts |
| `PREVIEW_COOKIE_SECRET` | A random string of 32+ characters |
| `SANITY_WEBHOOK_SECRET` | Only if a Sanity webhook calls `/api/revalidate` |

You can copy the same values from Netlify (Site configuration → Environment variables). On Cloudflare, pages are rendered fresh on every visit and are not cached, so Sanity changes show at once and the revalidate webhook isn't needed.

## 3. Custom domain

- **Domain bought in Cloudflare (Domain Registration → Register Domains):** go to Worker → **Settings → Domains & Routes → Add → Custom domain** and enter it, e.g. `wire2026.org`, and `www.wire2026.org` too if you want it. DNS and HTTPS are set up automatically.
- **Domain bought elsewhere (e.g. wire.art at HostGuru):** add it as a site in Cloudflare (**Add a domain**, Free plan). Change its nameservers at the registrar to the two Cloudflare gives you. Then add the custom domain to the Worker as above.

After the domain works:
1. Set `PUBLIC_SITE_URL` and `SANITY_STUDIO_PREVIEW_URL` to it and redeploy.
2. In sanity.io/manage → project → **API → CORS origins**, add `https://<domain>` with **Allow credentials**, so Studio sign-in works at `https://<domain>/studio`.

## 4. Retire the old Netlify address

Do this only once the Cloudflare site is live on its domain:

1. In Netlify → **Site configuration → Environment variables**, add `NEW_SITE_URL` = `https://<domain>` (no trailing slash).
2. Go to **Deploys → Trigger deploy → Deploy site**.

Netlify then stops building the website. It publishes a single redirect rule, so every `wire2026.netlify.app/...` link goes permanently (301) to the same page on the new domain. Keep the Netlify site, because deleting it would break the old links. To undo, delete `NEW_SITE_URL` and redeploy.

## Costs and limits

- Workers **Free** plan: 100,000 requests a day, and a limit on processing time per request (CPU time). If pages start failing with "exceeded CPU" errors under load, the Workers Paid plan (about USD 5 a month) removes the problem. Check current pricing.
- Domains through Cloudflare Registrar are sold at cost (about USD 10 a year for .org; check the price shown).
- Sanity and the PDFs are unchanged. Files are still served by Sanity's file server.

## Running it locally

```
cd web
npm install
npm run build && npx astro preview   # runs the site in Cloudflare's local runtime
```
