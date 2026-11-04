#!/usr/bin/env bash
set -euo pipefail

# A remote commit_refs/internal error can reject a valid push temporarily.
# Retry the same commit; never force-push or regenerate articles on failure.
for attempt in 1 2 3; do
  if git push; then
    exit 0
  fi
  if [[ "$attempt" -eq 3 ]]; then
    echo 'Article push failed after 3 attempts; stopping before deployment.' >&2
    exit 1
  fi
  echo "Article push failed; retrying in $((attempt * 5)) seconds." >&2
  sleep "$((attempt * 5))"
done
