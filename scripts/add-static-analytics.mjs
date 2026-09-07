import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Both the scheduled publisher and normal Pages deployment run npm run build.
// Cover copied public pages here, including future generated articles.
export async function addStaticAnalytics(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      count += await addStaticAnalytics(filename);
    } else if (entry.name.endsWith('.html')) {
      const html = await readFile(filename, 'utf8');
      if (!/<\/head>/i.test(html) || /<script\b[^>]*\bsrc=["'][^"']*\/site-analytics\.js(?:\?[^"']*)?["']/i.test(html)) continue;
      await writeFile(filename, html.replace(/<\/head>/i, '<script defer src="/site-analytics.js"></script>\n</head>'));
      count += 1;
    }
  }
  return count;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const count = await addStaticAnalytics(fileURLToPath(new URL('../dist/', import.meta.url)));
  console.log(`Added analytics to ${count} standalone pages.`);
}
