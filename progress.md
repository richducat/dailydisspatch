Original prompt: finish this

- Started by inspecting `public/techkombat/techkombat.js` and `public/techkombat/index.html`.
- Initial read shows a playable prototype with title/select/fight flow, but no deterministic test hooks yet (`window.render_game_to_text`, `window.advanceTime`).
- Next step is to run the game locally with the web-game Playwright client, identify concrete issues, then implement the smallest fixes needed.
- Found the main gameplay bug in testing: the AI stopped advancing at about 120px, but only tried melee attacks inside about 80px, so rounds stalled.
- Reworked the game loop to support deterministic stepping and text-state export, added stable input handling, pause/fullscreen/title controls, a persistent post-match overlay with rematch flow, and cleaned up arena teardown when returning to title.
- Verified with `node --check public/techkombat/techkombat.js` and `npm run build`.
- Verified automated gameplay with the web-game Playwright client:
  - `output/web-game/postfix/` shows live attacks, health loss, and KO progression.
  - `output/web-game/longflow/` shows round progression into match over and rematch.
  - `output/web-game/pause-overlay.png` confirms the pause overlay renders correctly.
- Remaining note: the Playwright client only exposes arrows/enter/space, so human-only buttons like `z/x/c/p` were validated with a small deterministic Playwright script using the new `window.advanceTime` hook instead of the stock client payload map.
