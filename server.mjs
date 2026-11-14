// Tiny static server for the Vite build.
// - 301s www.ileri.lol to ileri.lol
// - long-caches hashed /assets, short-caches everything else, never caches index.html
// - serves real files (robots.txt, sitemap.xml, og.jpg...) as themselves; only unknown
//   routes without a file extension fall back to index.html; missing files 404
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import handler from 'serve-handler'
import compression from 'compression'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')
const port = Number(process.env.PORT) || 3000
const CANONICAL = 'ileri.lol'
const compress = compression()

const config = {
  public: root,
  cleanUrls: false,
  directoryListing: false,
  etag: true,
  rewrites: [{ source: '**', destination: '/index.html' }],
  headers: [
    { source: '**', headers: [
      { key: 'Cache-Control', value: 'public, max-age=3600' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ] },
    { source: 'assets/**', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: 'fonts/**', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }] },
    { source: '{video,bg}/**', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }] },
    { source: 'index.html', headers: [{ key: 'Cache-Control', value: 'no-cache' }] },
  ],
}

const server = http.createServer((req, res) => {
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().toLowerCase()
  if (host.startsWith('www.')) {
    res.writeHead(301, { Location: `https://${CANONICAL}${req.url}`, 'Cache-Control': 'public, max-age=86400' })
    return res.end()
  }
  const pathname = decodeURIComponent((req.url || '/').split('?')[0])
  if (path.extname(pathname)) {
    const file = path.join(root, path.normalize(pathname).replace(/^(\.\.[/\\])+/, ''))
    if (!file.startsWith(root) || !fs.existsSync(file)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      return res.end('Not found')
    }
  }
  compress(req, res, () => handler(req, res, config))
})

server.listen(port, '0.0.0.0', () => console.log(`ileri-site on :${port}`))
