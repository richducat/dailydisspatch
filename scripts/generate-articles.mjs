#!/usr/bin/env node
/**
 * The Daily Diss-patch — autonomous satire article generator.
 * Generates static, crawlable article pages in public/articles/,
 * rebuilds the archive page and sitemap.xml.
 *
 * Usage: node scripts/generate-articles.mjs [--count N]
 * State: data/articles.json
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data', 'articles.json');
const OUT = join(ROOT, 'public', 'articles');
const SITE = 'https://dailydisspatch.com';
const COUNT = (() => { const i = process.argv.indexOf('--count'); return i > -1 ? parseInt(process.argv[i + 1], 10) : 2; })();

// ---------- The voice (lifted from the live satire engine, expanded) ----------
const SUBJECTS = ['Tech Billionaire', 'Local Man', 'Senior Politician', 'New AI Model', 'Smart Fridge', 'Corporate HR Department', 'Finance Bro', 'HOA President', 'Florida Man', 'Gen Z Intern', 'Local Algorithm', 'Mid-Tier Influencer', 'Fortune 500 CEO', 'My Dentist', 'Anonymous Pentagon Source', 'Crypto Whale', 'Federal Reserve Insider', 'Self-Aware Chatbot', 'Regional Middle Manager', 'Venture Capitalist'];
const ACTIONS = [
  ['accidentally deletes', 'accidentally deleted'], ['vows to disrupt', 'vowed to disrupt'], ['forgets to cancel', 'forgot to cancel'],
  ['demands an apology from', 'demanded an apology from'], ['invests $40B into', 'invested $40B into'], ['refuses to acknowledge', 'refused to acknowledge'],
  ['writes a 40-page manifesto about', 'written a 40-page manifesto about'], ['gets into a heated standoff with', 'gotten into a heated standoff with'],
  ['rebrands as', 'rebranded as'], ['attempts to unionize against', 'attempted to unionize against'], ['blames the supply chain for', 'blamed the supply chain for'],
  ['launches an NFT collection based on', 'launched an NFT collection based on'], ['declares total victory over', 'declared total victory over'],
  ['schedules an emergency meeting about', 'scheduled an emergency meeting about'], ['quietly pivots to', 'quietly pivoted to'],
  ['files a formal complaint against', 'filed a formal complaint against'], ['live-streams an apology to', 'live-streamed an apology to'],
  ['announces a strategic partnership with', 'announced a strategic partnership with']
];
const TARGETS = ['the concept of time', 'a moderately sized puddle', '14 different subscription services', "a rival's tweet", 'the concept of sleep', 'organic avocados', 'the breakroom microwave', 'a sentient Roomba', 'the entire middle class', 'mathematics itself', 'the concept of linear progression', 'the housing market', 'a suspiciously calm pigeon', 'quarterly earnings expectations', 'the office thermostat', 'an abandoned group chat', 'daylight saving time', 'the metaverse'];
const OPENERS = ['In a move that completely baffled experts but made perfect sense to your uncle,', 'Following a rigorous 4-minute Google search,', 'In an unprecedented display of corporate synergy,', 'Against the advice of literally every adult in the room,', 'During a press conference nobody asked for,', 'In a development that surprised absolutely no one,'];
const MIDDLES = ['Analysts believe this is essentially a very expensive mistake masquerading as innovation.', 'A spokesperson frantically clarified that it was intended as a feature, not a bug.', 'Everyone involved firmly agreed to blame the intern.', 'Legal teams on both sides have reportedly started a group chat just to vent.', 'Shareholders responded with a standing ovation and zero follow-up questions.', 'An internal memo described the situation as "fine, probably."'];
const CLOSERS = ['We suggest turning it off and turning it back on again.', 'Society is expected to collapse shortly after lunch.', 'The market responded by doing absolutely nothing, as usual.', 'A consulting firm has already been hired to study why a consulting firm was hired.', 'Sources confirm the situation remains both unprecedented and extremely predictable.'];
const EXPERTS = ['Dr. Brenda Hindsight, Professor of Applied Panic', 'Chad Equity, Senior Vibes Analyst', 'a man named Gary who was just standing nearby', 'the Institute for Studies', 'Dr. Lorem Ipsum of the Placeholder Foundation', 'three economists sharing one trench coat', 'an unpaid intern with surprising authority'];
const QUOTES = ['"Frankly, we expected worse," ', '"This is either genius or a cry for help," ', '"I have been saying this since Tuesday," ', '"The fundamentals remain strong, whatever that means," ', '"Nobody could have predicted this, except everyone," ', '"We are cautiously optimistic and openly terrified," '];
const STATS = ['87% of people surveyed did not read past the headline', 'engagement is up 4,000% among confused users', 'an estimated $2.3 billion in imaginary value was created overnight', 'productivity dipped 12% as employees refreshed the news', 'the announcement was viewed 11 million times, mostly by bots', 'analysts revised their forecasts from "shrug" to "concerned shrug"'];
const FALLOUT = ['Congress has promised hearings, pending the discovery of a working microphone.', 'A rival firm immediately announced the same idea with a worse logo.', 'The comment section has reached a level of confidence unsupported by any evidence.', 'Three podcasts have already been launched to explain the situation incorrectly.', 'A documentary crew has been spotted ordering coffee nearby.', 'The HOA has issued a statement of concern, citing bylaw 7, subsection vibes.'];
const CATEGORIES = ['Politics', 'Finance', 'Defense', 'Technology', 'Culture'];

// ---------- deterministic rng per slug-date ----------
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };

const build = (seedStr) => {
  const rnd = mulberry32(hash(seedStr));
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const sub = pick(SUBJECTS), [act, actPast] = pick(ACTIONS), tar = pick(TARGETS);
  const title = `${sub} ${act} ${tar}`;
  const category = pick(CATEGORIES);
  const expert = pick(EXPERTS), expert2 = pick(EXPERTS);
  const dek = `${pick(OPENERS)} ${sub.toLowerCase()} took drastic measures regarding ${tar}. Experts call it a very expensive mistake masquerading as innovation.`;
  const paras = [
    `${pick(OPENERS)} ${sub.toLowerCase()} has officially ${actPast} ${tar}, sending shockwaves through an industry that runs almost entirely on shockwaves. The official narrative is simple and entirely underwhelming. But if you believe the official narrative, we have a digital bridge in the metaverse to sell you at 15% APR.`,
    `Insiders familiar with the matter — who asked to remain anonymous because they made all of this up in the breakroom — suggest there is a much deeper layer to the story. ${pick(MIDDLES)} The socio-economic implications are staggering when you consider that nobody actually knows what is going on, but everyone is extremely angry about it online.`,
    `${pick(QUOTES)}said ${expert}, pausing dramatically for a camera that was not rolling. According to figures we did not verify because verifying things is exhausting, ${pick(STATS)}. The remaining holdouts are currently drafting a furious comment in all caps.`,
    `The history here matters. Long-time observers will remember that ${tar} has been at the center of controversy before, most notably during the incident nobody agreed on and the follow-up incident everyone pretended to understand. ${pick(MIDDLES)}`,
    `${pick(QUOTES)}countered ${expert2}, who disagrees with the first expert primarily for branding reasons. The establishment wants you to focus on minor details — facts, logic, basic physics — while ignoring the glaring truth that the entire situation is a circus with a quarterly earnings call.`,
    `Meanwhile, the fallout has begun. ${pick(FALLOUT)} ${pick(FALLOUT)}`,
    `Where do we go from here? Some experts suggest hiding your assets in offshore accounts or physical gold bullion. Others recommend turning off your router and walking calmly into the woods. A third group has already moved on to being wrong about something else.`,
    `In conclusion: ${pick(CLOSERS)} ${pick(CLOSERS)} The Daily Diss-patch will continue to follow this story until something shinier happens.`
  ];
  return { title, dek, category, paras };
};

const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const STYLE = `<style>body{background:#020617;color:#cbd5e1;font-family:Georgia,serif;max-width:720px;margin:0 auto;padding:40px 20px;line-height:1.75}h1,h2{color:#f8fafc;font-family:Arial,Helvetica,sans-serif;line-height:1.2}a{color:#60a5fa}header a{font-weight:bold;text-decoration:none;font-size:14px;letter-spacing:1px;text-transform:uppercase}.kicker{color:#f59e0b;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase}.meta{color:#64748b;font-size:14px;font-family:Arial,sans-serif}.satire{background:#1e293b;border-left:4px solid #f59e0b;padding:10px 14px;font-size:13px;font-family:Arial,sans-serif;color:#94a3b8;margin:24px 0}.more{border-top:1px solid #1e293b;margin-top:40px;padding-top:16px}footer{margin-top:48px;border-top:1px solid #1e293b;padding-top:16px;font-size:13px;color:#64748b}</style>`;
const NAV = '<header><a href="/">&larr; The Daily Diss-patch</a> &nbsp;&middot;&nbsp; <a href="/articles/">All Articles</a></header>';
const FOOT = '<footer><a href="/about/">About</a> &middot; <a href="/contact/">Contact</a> &middot; <a href="/privacy-policy/">Privacy Policy</a> &middot; <a href="/terms/">Terms</a><br>&copy; 2026 The Daily Diss-patch. Satire and commentary. Not affiliated with reality.</footer>';
const DISCLAIMER = '<div class="satire"><strong>SATIRE:</strong> This article is fiction and humor. Any resemblance to real persons or events is coincidental and played for laughs. Nothing here is news reporting or advice.</div>';

const renderArticle = (a, others) => {
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.dek, datePublished: a.date, dateModified: a.date, author: { '@type': 'Organization', name: 'The Daily Diss-patch' }, publisher: { '@type': 'Organization', name: 'The Daily Diss-patch', logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` } }, mainEntityOfPage: `${SITE}/articles/${a.slug}.html`, isAccessibleForFree: true, genre: 'satire' };
  const more = others.map((o) => `<li><a href="/articles/${o.slug}.html">${esc(o.title)}</a></li>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(a.title)} | The Daily Diss-patch</title>
<meta name="description" content="${esc(a.dek)}">
<link rel="canonical" href="${SITE}/articles/${a.slug}.html">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(a.title)}"><meta property="og:description" content="${esc(a.dek)}"><meta property="og:url" content="${SITE}/articles/${a.slug}.html"><meta property="og:site_name" content="The Daily Diss-patch">
<script type="application/ld+json">${JSON.stringify(ld)}</script>${STYLE}</head><body>${NAV}
<p class="kicker">${a.category} &middot; Satire</p>
<h1>${esc(a.title)}</h1>
<p class="meta">By The Daily Diss-patch Staff &middot; ${new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
${DISCLAIMER}
${a.paras.map((p) => `<p>${esc(p)}</p>`).join('\n')}
<div class="more"><h2>More from the Diss-patch</h2><ul>${more}</ul></div>
${FOOT}</body></html>`;
};

const renderIndex = (articles) => {
  const items = articles.map((a) => `<li style="margin-bottom:18px"><a href="/articles/${a.slug}.html"><strong>${esc(a.title)}</strong></a><br><span class="meta">${a.category} &middot; ${a.date}</span><br>${esc(a.dek)}</li>`).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Articles | The Daily Diss-patch</title>
<meta name="description" content="The full archive of original satire and commentary from The Daily Diss-patch.">
<link rel="canonical" href="${SITE}/articles/">${STYLE}</head><body>${NAV}
<h1>The Archive</h1>
<p>Original satire, dispatched daily. ${articles.length} articles and counting.</p>
${DISCLAIMER}
<ul style="list-style:none;padding:0">${items}</ul>
${FOOT}</body></html>`;
};

const renderSitemap = (articles) => {
  const today = new Date().toISOString().slice(0, 10);
  const fixed = [
    { loc: `${SITE}/`, lastmod: today, freq: 'daily', pri: '1.0' },
    { loc: `${SITE}/articles/`, lastmod: today, freq: 'daily', pri: '0.8' },
    { loc: `${SITE}/about/`, lastmod: '2026-06-12', freq: 'monthly', pri: '0.5' },
    { loc: `${SITE}/contact/`, lastmod: '2026-06-12', freq: 'monthly', pri: '0.4' },
    { loc: `${SITE}/privacy-policy/`, lastmod: '2026-06-12', freq: 'monthly', pri: '0.3' },
    { loc: `${SITE}/terms/`, lastmod: '2026-06-12', freq: 'monthly', pri: '0.3' }
  ];
  const urls = fixed.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`)
    .concat(articles.map((a) => `  <url><loc>${SITE}/articles/${a.slug}.html</loc><lastmod>${a.date}</lastmod><changefreq>yearly</changefreq><priority>0.6</priority></url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
};

// ---------- main ----------
mkdirSync(OUT, { recursive: true });
mkdirSync(dirname(DATA), { recursive: true });
const state = existsSync(DATA) ? JSON.parse(readFileSync(DATA, 'utf8')) : { articles: [] };
const today = new Date().toISOString().slice(0, 10);
const have = new Set(state.articles.map((a) => a.slug));

let made = 0, attempt = 0;
while (made < COUNT && attempt < COUNT * 30) {
  attempt += 1;
  const a = build(`${today}#${attempt}`);
  const slug = slugify(a.title);
  if (have.has(slug)) continue;
  have.add(slug);
  state.articles.unshift({ slug, title: a.title, dek: a.dek, category: a.category, date: today, paras: a.paras });
  made += 1;
}

// re-render every article so "More from" links stay fresh
for (const a of state.articles) {
  const others = state.articles.filter((o) => o.slug !== a.slug).slice(0, 4);
  writeFileSync(join(OUT, `${a.slug}.html`), renderArticle(a, others));
}
writeFileSync(join(OUT, 'index.html'), renderIndex(state.articles));
writeFileSync(join(ROOT, 'public', 'sitemap.xml'), renderSitemap(state.articles));
writeFileSync(DATA, JSON.stringify(state, null, 2));
console.log(`Generated ${made} new article(s). Total: ${state.articles.length}.`);
