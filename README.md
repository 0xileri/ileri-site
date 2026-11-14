# ileri.lol

Personal site for ileri ([@0xileri](https://x.com/0xileri)). I help early AI and crypto projects grow on X with posts on my page, KOL campaigns through creators I manage, community setup and growth, and AI videos.

The site is styled like a social timeline: a dark 3-column layout with a nav rail, a feed of posts from @0xileri and a sidebar, plus a bottom tab bar on mobile. It's ileri's own site and isn't affiliated with any social network.

Built with Vite + React. Fonts (Fraunces, Inter, JetBrains Mono, all SIL OFL 1.1), the favicon, `og.jpg` and the receipt screenshots are carried over from the previous version of the site.

## Run it locally

```bash
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # production build into dist/
npm start        # serves dist/ on $PORT (defaults to 3000)
```

## Edit the content

All copy, prices, wins and links live in `src/data.js`. Layout is in `src/App.jsx`, icons in `src/icons.jsx`, styles in `src/styles.css`. Post dates on wins come from the real post IDs, so they're never made up. Meta and Open Graph tags are in `index.html`.

## Deploy on Railway

1. In Railway, create a new service and pick **Deploy from GitHub repo**, then choose `0xileri/ileri-site`.
2. Railway detects Node with Nixpacks/Railpack. The defaults work:
   - **Build command:** `npm run build`
   - **Start command:** `npm start` (runs `serve -s dist` on Railway's `$PORT`, with SPA fallback)
3. Under **Settings > Networking**, generate a Railway domain to check it, then add the custom domain `ileri.lol` and point DNS at the target Railway gives you.

Node 18 or newer is required (`engines` in `package.json`).

## Previews

`preview-desktop.png` and `preview-mobile.png` are full-page screenshots of the build.
