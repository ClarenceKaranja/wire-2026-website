# Deploying with GitHub and Netlify

Nothing in this repository deploys itself. Each step below is done by an account owner, and the public launch should wait for the [pre-launch checklist](pre-launch-checklist.md).

## What you need

- A **GitHub** account or organization to hold the code (private repository recommended).
- A **Netlify** account (Free plan is enough; see costs below).
- The **Sanity** project `krb5nty9` (already created, content loaded) and an Administrator login.
- Optionally, an approved **custom domain** and someone who can edit its DNS.

## 1. Put the code on GitHub

1. Create a new **private** repository, e.g. `wire-2026-website`.
2. Push this folder to it (`git remote add origin …` then `git push -u origin main`).
3. Check that no `.env` file was pushed. `.gitignore` excludes them, but look once in GitHub's file list.

## 2. Create the Netlify site

1. Netlify → **Add new project → Import an existing project → GitHub**, and choose the repository.
2. Netlify reads `netlify.toml`, so the settings fill themselves in: base directory `web`, build command `npm run build`, publish directory `dist`, Node 22. Do not change them.
3. Before the first deploy, open **Site configuration → Environment variables** and add:

| Name | Value | Secret? |
| --- | --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | `krb5nty9` | No |
| `PUBLIC_SANITY_DATASET` | `production` | No |
| `PUBLIC_SITE_URL` | The final address, e.g. `https://wire2026.example.org` (or the `*.netlify.app` address until a domain is approved) | No |
| `PUBLIC_SANITY_STUDIO_URL` | e.g. `https://wire-2026.sanity.studio` | No |
| `SANITY_API_READ_TOKEN` | A Sanity token with the **Viewer** role (step 4) | **Yes**: tick "Contains secret values" |
| `PREVIEW_COOKIE_SECRET` | A random string of 32+ characters (`openssl rand -hex 32`) | **Yes** |
| `SANITY_WEBHOOK_SECRET` | Only if you set up the instant-refresh webhook (step 6) | **Yes** |

The build stops with a clear error if `PUBLIC_SANITY_PROJECT_ID` is missing, so a half-configured site can never go live with sample content.

4. Deploy. The site is now reachable at a `*.netlify.app` address. That address is **public**; anyone who guesses or receives it can open it. If the site must stay private before launch, enable Netlify's site password protection (available on paid plans; check current Netlify pricing) or keep the project unpublished until approval.

Deploy previews (for pull requests) and branch deploys automatically send `noindex` and a blocking `robots.txt`, so search engines ignore them. They are still publicly reachable by link.

## 3. Host the Studio (content editor)

The simplest option is Sanity's free hosting:

```bash
cd studio
npm install
npx sanity login
SANITY_STUDIO_PREVIEW_URL=https://<your site address> npx sanity deploy
```

This publishes the editor at `https://wire-2026.sanity.studio` (change the name with `SANITY_STUDIO_HOSTNAME`). The Studio itself requires a Sanity login, so the public cannot edit or see drafts. Redeploy it after any schema change.

Then invite editors: sanity.io/manage → project → **Members → Invite**. Give content staff the **Editor** role and only one or two people **Administrator**.

## 4. Create the preview token

sanity.io/manage → project → **API → Tokens → Add API token**, name it "Netlify preview (read only)", permission **Viewer**. Paste it into Netlify as `SANITY_API_READ_TOKEN` and redeploy. Never use an Editor or Deploy token here, and never paste a token into code, chat or email.

## 5. Custom domain (once approved)

1. Netlify → **Domain management → Add a domain**.
2. Follow Netlify's DNS instructions (a CNAME for `www`, or Netlify DNS). HTTPS certificates are issued automatically.
3. Update `PUBLIC_SITE_URL` to the new address, redeploy, and redeploy the Studio with the new `SANITY_STUDIO_PREVIEW_URL`.

## 6. Optional: instant refresh webhook

Without this, published changes appear within about a minute. With it, they appear immediately.

sanity.io/manage → project → **API → Webhooks → Create webhook**:

- URL: `https://<your site address>/api/revalidate`
- Dataset: `production`
- Trigger on: Create, Update, Delete
- Filter: leave empty. Drafts: off. HTTP method: POST
- Secret: the same value as `SANITY_WEBHOOK_SECRET` in Netlify

## Rolling back

- **Content mistake**: in the Studio open the item → **History** → choose an earlier version → **Restore** → Publish.
- **Code or design mistake**: Netlify → **Deploys** → open an earlier successful deploy → **Publish deploy**. This is instant and does not use build credits. Then fix the code in GitHub.
- **Stopping bad code from going live**: Netlify → **Deploys → Stop auto publishing** keeps the current deploy live while you fix things. Turn auto publishing back on afterwards.

## Costs on the free plans

- **Netlify Free**: 300 credits a month. A production deploy costs about 15 credits (about 20 deploys a month); bandwidth and function calls also use credits. Content changes do not trigger deploys, so normal editing costs nothing extra. If credits run out the site is paused until the next month, so keep an eye on **Usage** during Forum week and consider a paid month if traffic is high.
- **Sanity Free**: up to 20 users, 10,000 documents, 100 GB file storage and 100 GB bandwidth. No surprise overage charges; limits simply stop increasing.
