import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

for (const [label, failures, attempts, status] of [
  ['successful push is not repeated', 0, 1, 0],
  ['transient remote failures recover', 2, 3, 0],
  ['persistent failure stops deployment', 3, 3, 1],
]) {
  test(label, () => {
    const dir = mkdtempSync(join(tmpdir(), 'article-push-test-'));
    const counter = join(dir, 'attempts');
    writeFileSync(join(dir, 'git'), `#!/bin/bash\n[[ "$*" == push ]] || exit 99\nn=0\n[[ ! -f "$COUNTER" ]] || n=$(cat "$COUNTER")\nn=$((n + 1))\necho "$n" > "$COUNTER"\n[[ "$n" -gt "$FAILURES" ]]\n`);
    writeFileSync(join(dir, 'sleep'), '#!/bin/bash\nexit 0\n');
    chmodSync(join(dir, 'git'), 0o755);
    chmodSync(join(dir, 'sleep'), 0o755);
    const result = spawnSync('bash', ['scripts/push-articles.sh'], {
      env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, COUNTER: counter, FAILURES: String(failures) },
      encoding: 'utf8',
    });
    assert.equal(result.status, status, result.stderr);
    assert.equal(Number(readFileSync(counter, 'utf8')), attempts);
  });
}
