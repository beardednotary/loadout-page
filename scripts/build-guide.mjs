// Builds guide.html from the extension repo's user manual: `node scripts/build-guide.mjs`
// Expects the extension project next to this repo (../project-command-center).
import { readFile, writeFile } from 'node:fs/promises';

const source = new URL('../../project-command-center/docs/user-manual.html', import.meta.url);
const manual = await readFile(source, 'utf8');

// The manual is written as a fragment: <title>/<meta>/<link>/<style> first, then the page body.
const splitAt = manual.indexOf('</style>') + '</style>'.length;
const head = manual.slice(0, splitAt).trim();
const body = manual
  .slice(splitAt)
  .trim()
  .replace('<span class="tag">User guide</span>', '<a class="tag" href="/">LoadOut · User guide</a>');

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#1e1f21">
<link rel="canonical" href="https://loadout.page/guide">
<link rel="icon" href="/assets/loadout-icon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/icon-32.png" sizes="32x32" type="image/png">
<meta property="og:title" content="Getting around LoadOut">
<meta property="og:description" content="A friendly, sit-beside-you tour of LoadOut, the project workspace new tab for Chrome.">
<meta property="og:image" content="https://loadout.page/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
${head}
<style>a.tag { text-decoration: none; }</style>
</head>
<body>
${body}
</body>
</html>
`;

await writeFile(new URL('../guide.html', import.meta.url), page);
console.log('guide.html written from', source.pathname);
