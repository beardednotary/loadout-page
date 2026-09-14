# loadout.page

Website for **LoadOut: Project Workspaces for Chrome**, by DahVio Studios.

Plain static HTML on Vercel — no framework, no build step.

| Path | What |
|---|---|
| `index.html` | Landing page with the early-access waitlist |
| `privacy.html` | Privacy policy (linked from the Chrome Web Store listing) |
| `guide.html` | User manual — **generated**, don't edit by hand (see below) |
| `404.html` | Not-found page |
| `assets/site.css` | Styles for the site pages |
| `assets/` | Icons (copied from the extension) and the social share image `og.png` |
| `vercel.json` | Clean URLs (`/privacy`, `/guide`) and security headers |

## Waitlist

Both forms post to Formspree (`https://formspree.io/f/xdeorwvl`) with a `source` field (`hero` / `footer`) and the `_gotcha` honeypot. They work without JavaScript; with it, the success message shows in place.

## Analytics

`assets/analytics.js` (loaded first in every page's `<head>`, including the generated guide) runs Google Analytics 4 (`G-J943N748QB`) with Consent Mode v2: analytics cookies are denied by default and only set after the visitor clicks **Allow** in the consent bar; ad consent is always denied. The choice lives in `localStorage` (`loadout-analytics-consent`); any `[data-consent-settings]` element reopens it, and choosing No thanks clears `_ga` cookies. Cookies expire after 13 months.

Events: `generate_lead` with `form_location` = `hero` | `footer` on a successful waitlist signup (mark it as a key event in GA).

## Updating the guide

The manual lives in the extension repo (`project-command-center/docs/user-manual.html`). After changing it there:

```bash
node scripts/build-guide.mjs
```

## Deploying

Import this repo into Vercel (Framework preset: **Other**, no build command, output directory = root), then add `loadout.page` under the project's Domains. Every push to `main` deploys.
