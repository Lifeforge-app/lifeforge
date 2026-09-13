# Unified Kanban visual verification

- Browser: Playwright Chromium at `/home/rehem/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`
- Viewport: 1440x1000
- Isolated app: `http://127.0.0.1:15177`
- Account: `kanban-visual@example.invalid`

## Reproduction

[`visual-results/screenshots/unified-kanban-repro.png`](visual-results/screenshots/unified-kanban-repro.png) captures the pre-fix screen: module content rendered without Tailwind styling, `[MISSING LOCALE] title` and `[MISSING LOCALE] description` were visible, and `The board could not be refreshed` was shown.

## Causes and fixes

1. **Styling:** Tailwind content scanning was not the cause. A clean module build contained the utility selectors used by the board, but the federated module did not inject its generated CSS into the host because Module Federation's `bundleAllCSS` option was disabled. Enabled `bundleAllCSS` in the shared module Vite configuration. The generated expose now maps `./Manifest` to `src-Cr6IRM-Q.css` and injects it when loaded.
2. **Translations:** The module locale files only contained the `board` object. Added top-level `title` and `description` strings to all four locale files.
3. **Data:** The client contract requests `/board/get`, while the Nest controller exposed `GET /board`. Changed the controller route to `@Get('get')`.
4. **Accordion behavior:** The design system has no reusable accordion, disclosure, or collapsible component. Used the native HTML `<details>` and `<summary>` disclosure control in `AccordionLane`, with `nuqs` persisting collapsed lane names in the `collapsed` query parameter.

## Final proof

[`visual-results/screenshots/unified-kanban-final.png`](visual-results/screenshots/unified-kanban-final.png) captures the production-built host after the fixes.

Playwright assertions:

- Board request: HTTP `200` at `/modules/c4f2386009756b00b47bfc3a204ee944bfe6ecb9dd23769bcb691cffc59ea023/board/get`
- Correct title and description visible
- No `[MISSING LOCALE]` text
- No board refresh error
- `109 items` rendered from the board data source
- Six board columns rendered; computed column style was `display: flex`, rounded corners, and a non-transparent background
- [`visual-results/screenshots/unified-kanban-expanded.png`](visual-results/screenshots/unified-kanban-expanded.png) shows the Trabalho lane expanded at `/unified-kanban`; its three columns were visible.
- [`visual-results/screenshots/unified-kanban-work-collapsed.png`](visual-results/screenshots/unified-kanban-work-collapsed.png) shows the same lane collapsed at `/unified-kanban?collapsed=work`; its three columns were hidden.
- Reloading `/unified-kanban?collapsed=work` preserved the collapsed state, proving URL persistence.

The remaining browser console warnings/errors were unrelated existing runtime behavior (font authorization fallback, socket close during navigation, and SPA root 404s); none affected the Kanban request or rendered board.
