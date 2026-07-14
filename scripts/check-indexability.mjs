#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const SITE = 'https://dailydisspatch.com';
const sitemap = readFileSync(join(PUBLIC, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const failures = [];
const seenTitles = new Map();
const seenDescriptions = new Map();

const fileForUrl = (url) => {
  const pathname = new URL(url).pathname;
  if (pathname === '/') return join(ROOT, 'index.html');
  if (pathname.endsWith('/')) return join(PUBLIC, pathname.slice(1), 'index.html');
  return join(PUBLIC, pathname.slice(1));
};

const rememberUnique = (map, value, url, label) => {
  if (!value) {
    failures.push(`${url}: missing ${label}`);
    return;
  }
  if (map.has(value)) failures.push(`${url}: duplicate ${label} also used by ${map.get(value)}`);
  else map.set(value, url);
};

for (const url of urls) {
  if (!url.startsWith(`${SITE}/`)) failures.push(`${url}: URL is outside the canonical host`);
  const file = fileForUrl(url);
  if (!existsSync(file)) {
    failures.push(`${url}: sitemap target is missing (${file})`);
    continue;
  }

  const html = readFileSync(file, 'utf8');
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)?.[1]?.trim();
  const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)/i)?.[1]?.toLowerCase() || '';

  if (canonical !== url) failures.push(`${url}: canonical is ${canonical || 'missing'}`);
  if (robots.includes('noindex')) failures.push(`${url}: page is noindex`);
  rememberUnique(seenTitles, title, url, 'title');
  rememberUnique(seenDescriptions, description, url, 'meta description');
}

if (new Set(urls).size !== urls.length) failures.push('sitemap contains duplicate URLs');

if (failures.length) {
  console.error(`Indexability check failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Indexability check passed for ${urls.length} canonical URLs.`);
