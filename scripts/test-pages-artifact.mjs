import test from 'node:test';
import assert from 'node:assert/strict';
import { waitForPagesArtifact } from './wait-for-pages-artifact.mjs';

const artifact = { id: 42, name: 'github-pages', expired: false, size_in_bytes: 123 };
const ok = artifacts => ({ ok: true, json: async () => ({ artifacts }) });
const options = {
  repository: 'owner/repo', runId: '123', artifactId: '42', token: 'test-token',
  maxAttempts: 3, sleep: async () => {}, log: () => {},
};

test('an uploaded artifact may need multiple discovery requests', async () => {
  let requests = 0;
  const result = await waitForPagesArtifact({
    ...options,
    fetchImpl: async url => {
      assert.match(url, /\/repos\/owner\/repo\/actions\/runs\/123\/artifacts\?/);
      requests++;
      return ok(requests < 3 ? [] : [artifact]);
    },
  });
  assert.equal(result.id, 42);
  assert.equal(requests, 3);
});

test('missing, wrong and expired artifacts stop deployment after a bounded wait', async () => {
  for (const artifacts of [[], [{ ...artifact, id: 41 }], [{ ...artifact, expired: true }]]) {
    let requests = 0;
    await assert.rejects(waitForPagesArtifact({
      ...options, fetchImpl: async () => { requests++; return ok(artifacts); },
    }), /not discoverable after 3 attempts/);
    assert.equal(requests, 3);
  }
});

test('authorization failures and ambiguous artifacts fail without retrying', async () => {
  for (const response of [{ ok: false, status: 403 }, ok([artifact, { ...artifact, id: 43 }])]) {
    let requests = 0;
    await assert.rejects(waitForPagesArtifact({
      ...options, fetchImpl: async () => { requests++; return response; },
    }), /HTTP 403|ambiguous deployment/);
    assert.equal(requests, 1);
  }
});

test('temporary service and network errors can recover', async () => {
  let requests = 0;
  await waitForPagesArtifact({
    ...options, fetchImpl: async () => {
      requests++;
      if (requests === 1) throw new Error('temporary connection failure');
      return requests === 2 ? { ok: false, status: 503 } : ok([artifact]);
    },
  });
  assert.equal(requests, 3);
});
