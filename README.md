# Bajeti Yanga — Organised Structure

Previously a single ~545 KB HTML file. Now split for maintainability while keeping behaviour identical.

## Directory layout

```
bajeti-yanga/
├── index.html              # Clean shell: meta, links, body markup, script tags
├── css/
│   └── styles.css          # All app styles (variables, components, dark mode, etc.)
├── js/
│   ├── firebase-init.js    # Firebase config + persistence setup
│   ├── boot-splash.js      # Early boot splash logic (runs before main app)
│   └── app.js              # Main application logic (~6.4k lines)
├── icons/                  # PWA icons (copy from original deployment)
├── manifest.webmanifest    # PWA manifest (copy from original)
└── README.md
```

## What changed

| Before                        | After                                      |
|-------------------------------|--------------------------------------------|
| One monolithic HTML file      | `index.html` + `css/` + `js/`              |
| Inline `<style>` blocks       | `css/styles.css`                           |
| Firebase init in `<head>`     | `js/firebase-init.js`                      |
| Boot-splash script inline     | `js/boot-splash.js`                        |
| Entire app logic in one script| `js/app.js`                                |

External CDNs (Firebase, Lucide, qrcode, jsQR) and the relative paths for `manifest.webmanifest` / icons are unchanged.

## How to run

Serve the folder over HTTP (required for Firebase, service workers, and modules later):

```bash
# From the bajeti-yanga directory
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` (or the port shown).

Copy your existing `manifest.webmanifest` and `icons/` folder into this directory so the PWA links resolve.

## Suggested next steps for deeper modularisation

`app.js` is still large because the original code uses many shared globals (`lCfg`, `lPx`, `hhId`, `lang`, `tab`, etc.). A good incremental path:

1. **Extract pure helpers** → `js/utils.js`  
   (date formatters, `MK()`, `esc()`, `toast()`, `g()`, `val()`, etc.)

2. **Extract constants / i18n** → `js/i18n.js`  
   (`TX` object and language helpers)

3. **Extract chat + AI** → `js/chat.js`  
   (everything under the `// CHAT -- Bajeti AI` section, Magic Log, AI summary)

4. **Extract auth / setup / PIN** → `js/auth.js`

5. **Extract render functions** → `js/render.js`  
   (`rHome`, `rLog`, `rInsights`, `rSettings`, …)

6. Eventually move to ES modules (`type="module"`) and a simple bundler (esbuild / Vite) if the project grows further.

Keep global state explicit (or introduce a small store object) when you split so circular dependencies stay manageable.

## Notes

- No behaviour was intentionally changed — only structure.
- The worker secret and Firebase config remain client-visible (as before). Rotate secrets and tighten Firestore rules as needed.
- Service worker / offline caching should still register correctly as long as paths stay same-origin.
