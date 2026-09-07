import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { addStaticAnalytics } from './add-static-analytics.mjs';

const code = await readFile(new URL('../public/site-analytics.js', import.meta.url), 'utf8');

test('production initializes exactly once and preserves queued events', () => {
  for (const hostname of ['dailydisspatch.com', 'www.dailydisspatch.com']) {
    const scripts = [];
    const window = { location: { hostname }, dataLayer: [{ event: 'existing' }] };
    const document = { querySelector: () => null, createElement: () => ({}), head: { appendChild: s => scripts.push(s) } };
    const context = vm.createContext({ window, document });
    vm.runInContext(code, context);
    vm.runInContext(code, context);
    assert.equal(scripts.length, 1);
    assert.equal(window.dataLayer[0].event, 'existing');
    const configs = window.dataLayer.filter(event => event[0] === 'config');
    assert.equal(configs.length, 1);
    assert.equal(configs[0][1], 'G-E90B5KHBVV');
  }
});

test('preview and local hosts never initialize production analytics', () => {
  for (const hostname of ['localhost', '127.0.0.1', 'richducat.github.io', 'preview.example.com']) {
    const window = { location: { hostname } };
    vm.runInNewContext(code, { window, document: {} });
    assert.equal(window.gtag, undefined);
  }
});

test('build covers nested static articles, is repeatable, and leaves verification files intact', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'daily-analytics-'));
  try {
    await mkdir(path.join(root, 'articles'));
    await writeFile(path.join(root, 'index.html'), '<head><script defer src="/site-analytics.js"></script></head>');
    await writeFile(path.join(root, 'articles', 'story.html'), '<head><title>Story</title></head><body>Story</body>');
    await writeFile(path.join(root, 'google.html'), 'google-site-verification: example');
    assert.equal(await addStaticAnalytics(root), 1);
    assert.equal(await addStaticAnalytics(root), 0);
    assert.match(await readFile(path.join(root, 'articles', 'story.html'), 'utf8'), /src="\/site-analytics.js"/);
    assert.equal(await readFile(path.join(root, 'google.html'), 'utf8'), 'google-site-verification: example');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
