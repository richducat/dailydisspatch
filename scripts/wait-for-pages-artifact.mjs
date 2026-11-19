import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

// Upload completion can precede discovery. Never deploy a different upload or
// proceed after the bounded wait, and leave permission failures actionable.
export async function waitForPagesArtifact({
  repository, runId, artifactId, token, apiUrl = 'https://api.github.com',
  fetchImpl = fetch, sleep = delay, log = console.log,
  maxAttempts = 12, intervalMs = 5000,
}) {
  if (!repository || !/^\d+$/.test(runId ?? '') || !/^\d+$/.test(artifactId ?? '') || !token) {
    throw new Error('Repository, run ID, uploaded artifact ID and GitHub token are required.');
  }
  const url = `${apiUrl}/repos/${repository}/actions/runs/${runId}/artifacts?name=github-pages&per_page=100`;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response;
    try {
      response = await fetchImpl(url, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      log(`Artifact discovery request failed (${attempt}/${maxAttempts}).`);
    }
    if (response) {
      if (!response.ok && response.status !== 429 && response.status < 500) {
        throw new Error(`Artifact discovery failed with HTTP ${response.status}; check Actions read permission and repository access.`);
      }
      if (response.ok) {
        const { artifacts } = await response.json();
        if (!Array.isArray(artifacts)) throw new Error('Artifact discovery returned an invalid response.');
        const matches = artifacts.filter(artifact => artifact.name === 'github-pages');
        if (matches.length > 1) throw new Error('Multiple github-pages artifacts found; refusing an ambiguous deployment.');
        const artifact = matches[0];
        if (artifact && String(artifact.id) === String(artifactId) && !artifact.expired && artifact.size_in_bytes > 0) {
          log(`Pages artifact ${artifactId} is discoverable in workflow run ${runId}.`);
          return artifact;
        }
      }
    }
    if (attempt < maxAttempts) {
      log(`Waiting for Pages artifact ${artifactId} (${attempt}/${maxAttempts}).`);
      await sleep(intervalMs);
    }
  }
  throw new Error(`Pages artifact ${artifactId} was not discoverable after ${maxAttempts} attempts; deployment stopped.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await waitForPagesArtifact({
    repository: process.env.GITHUB_REPOSITORY,
    runId: process.env.GITHUB_RUN_ID,
    artifactId: process.env.PAGES_ARTIFACT_ID,
    token: process.env.GH_TOKEN,
    apiUrl: process.env.GITHUB_API_URL,
  });
}
