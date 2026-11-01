---
name: module-screenshots
description: >
  Use when capturing screenshots of LifeForge modules for a module's
  screenshots/ folder, README, or store listing. Triggers on "screenshot the
  module", "take screenshots of <module>", "add module screenshots", "re-shoot
  the module screenshots", or "crop out the sidebar". Covers the logged-in
  Chrome/CDP workflow, collapsing the sidebar, full-display capture, and
  cropping. Do NOT use for portfolio site projects (see add-portfolio-project).
---

# LifeForge module screenshots

Capture clean, full-resolution screenshots of a running LifeForge module and drop
them in `modules/<module>/screenshots/`.

Typical output set:

| File | Content |
|---|---|
| `grid-view.png` | grid view (`?view=grid`) |
| `list-view.png` | list view (`?view=list`) |
| `schematic-viewer.png` / modal name | primary feature modal |
| `materials-checklist.png` / modal name | second feature modal |

## Preconditions

1. Web dev server: `http://localhost:5173`.
2. API server: `http://localhost:3636` (check `lsof -iTCP:3636 -sTCP:LISTEN`).
   If it is down, ask the user to start it rather than starting it yourself.
3. A logged-in browser session (see "Getting a logged-in session").

## Why Chrome + CDP

Use **Google Chrome with `--remote-debugging-port`**. Do not use Zen/Firefox:

- Zen's `--screenshot`/headless mode hangs and writes no file.
- Chrome refuses DevTools on the default profile directory
  (`DevTools remote debugging requires a non-default data directory`), so the
  live profile cannot be driven directly. Use a copy or a visible login window.

## Getting a logged-in session

Auth is a `refresh_token` cookie (`path=/auth`, httpOnly) + an in-memory access
token. Do **one** of these:

- **Copy the profile** (fastest if Chrome is closed):
  ```sh
  SRC="$HOME/Library/Application Support/Google/Chrome"
  T="<temp>/chrome-shots"
  mkdir -p "$T/Default"
  cp -p "$SRC/Local State" "$T/"
  cp -p "$SRC/Default/Cookies" "$T/Default/"
  ```
  Cookies are encrypted with a Keychain key, not with the profile path, so the
  copy decrypts fine.
- **Visible login window**: launch Chrome with `--new-window` and a temp
  `--user-data-dir`, let the user log in once, then drive that same instance.

### Session rules (critical)

- **Never inject an old `refresh_token`.** Refresh tokens are IP-bound and rotate
  on every refresh; reusing a stale value triggers `revokeFamily()` and
  permanently logs the whole family out.
- Keep **one** Chrome instance alive for the whole session (`KEEP=1`) and reuse
  it for every shot. A plain (non-KEEP) run calls `Browser.close` and kills it.
- If Chrome is already running on the same profile, DevTools will not start:
  kill stale `--remote-debugging-port` processes and remove `Singleton*` files.

## Capture workflow

1. **Display size.** Get the logical resolution (points), not the Retina pixels:
   ```sh
   system_profiler SPDisplaysDataType -json | python3 -c "
   import json,sys
   d=json.load(sys.stdin)
   print([x.get('_spdisplays_resolution') for x in d['SPDisplaysDataType']])"
   ```
   e.g. `1710 x 1112 @ 60.00Hz` → use `SHOT_W=1710 SHOT_H=1112`. Screenshots are
   then `3420×2224` at `deviceScaleFactor: 2`.

2. **Launch Chrome** once with that window size and the module route:
   ```sh
   "<temp>/chrome-shots" # profile dir
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --new-window --remote-debugging-port=19222 \
     --user-data-dir="$T" --no-first-run --no-default-browser-check \
     --window-size=1710,1112 --window-position=0,0 \
     "http://localhost:5173/<module-route>?view=grid"
   ```
   Module route = module name after the scope, e.g.
   `@user/mc-schematic-storage` → `/melvinchia3636--mc-schematic-storage`.
   `lifeforge--<name>` modules drop the prefix (`/calendar`).

3. **Shoot** with `shot.mjs` (next to this file). It only attaches to an already
   running Chrome — it never launches one. It finds the tab on
   `localhost:5173`, optionally clicks, presses keys, and captures:
   ```sh
   SHOT_W=1710 SHOT_H=1112 KEEP=1 node shot.mjs '[
     {"file":"hs-grid.png","click":"<collapse sidebar>","waitAfter":3000},
     {"file":"hs-viewer.png","click":"<open feature modal>","waitAfter":6000}
   ]'
   ```
   Each entry supports: `path` (navigate; first entry only), `waitBefore`,
   `click` (JS expression), `waitAfter`, `key` (e.g. Escape), `scrollBottom`,
   `fullPage`, `file`. Environment: `SHOT_W`, `SHOT_H`, `SHOT_DSF` (default
   2), `CDP_PORT` (default 19222), `KEEP=1` to leave Chrome open.

4. **Collapse the sidebar before capturing.** The module grid must span the full
   width. Click the header toggle (`tabler:menu`):
   ```js
   (() => {
     const b = [...document.querySelectorAll('button')].find(b => {
       const r = b.getBoundingClientRect()
       return r.width > 10 && r.height > 10 && r.y < 60 && r.x < 340
     })
     b && b.click()
     return b ? 1 : 0
   })()
   ```
   **Require `width > 10 && height > 10`** — hidden zero-size buttons otherwise
   match first and the sidebar never collapses.

5. **View mode** is persisted in localStorage, so always navigate explicitly:
   `?view=grid` / `?view=list` (`syncWithQuery` defaults to true).

6. **Targeting a specific entry/modal.** Match the card heading, then walk up and
   click the button whose text matches:
   ```js
   (() => {
     const c = [...document.querySelectorAll('h3')].find(x => x.textContent.trim() === 'Tree Farm')
     let btn = null, el = c
     for (let i = 0; i < 12 && !btn; i++) {
       el = el.parentElement
       if (el) btn = [...el.querySelectorAll('button')].find(b => b.textContent.includes('View'))
     }
     btn && btn.click()
     return 1
   })()
   ```
   Use `Input.dispatchKeyEvent` (Escape) to close a modal between shots.

7. **Measure the sidebar/rail instead of guessing.** In the live page:
   ```js
   [...document.querySelectorAll('body *')]
     .map(e => e.getBoundingClientRect())
     .find(r => r.height > innerHeight - 40 && r.width > 50 && r.width < 160)  // collapsed rail
   ```
   The expanded sidebar width differs per viewport (384 CSS at 1920, 342 CSS at
   1710) — never hardcode it.

8. **Crop** the rail/sidebar with ImageMagick at `2 × cssWidth`:
   ```sh
   magick hs-grid.png -crop +160+0 +repage screenshots/grid-view.png
   ```
   For the collapsed icon rail, `+160+0` (≈68 CSS px rail + gap) is right at
   1710 CSS width. Verify visually — a partial row of icons or a clipped first
   card means the offset is wrong.

9. **Close the browser** when done: `pkill -f "remote-debugging-port=19222"`.

## Pitfalls checklist

- [ ] API server is actually up (3636), not just the web dev server.
- [ ] No cookie injection with a stale token.
- [ ] One persistent Chrome instance (`KEEP=1`), never `Browser.close` mid-run.
- [ ] Collapse click filtered by element size.
- [ ] `?view=grid` used explicitly for grid shots.
- [ ] Modal shots target the requested schematic/item, not the first card.
- [ ] Waits are short (3–8 s); do not poll with long sleeps.
- [ ] Screenshot dimensions equal display logical size × 2.
- [ ] Crop offset measured from the DOM, then verified by eye.
- [ ] Chrome processes cleaned up at the end.
