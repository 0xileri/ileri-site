#!/usr/bin/env node
// Fetch linked X posts at build/dev time and save a static JSON + local WebP
// media so the site never calls fxtwitter or pbs.twimg.com in the browser.
// Run: node scripts/fetch-posts.mjs
// Railway's `npm run build` does not run this (no network dependency on deploy).

import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outJson = join(root, 'src', 'posts.json')
const mediaDir = join(root, 'public', 'posts')
const rawDir = '/tmp/fxraw'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// Every X post currently linked from a screenshot (receipts, featured, article).
export const POST_IDS = [
  '2049553153738117425', // LaunchMyNFT article
  '2035001439517335798', // Bungee video
  '2037235146655478071', // PerleLabs article
  '2053754076479770751', // Melee Market photo
  '2033976307210481759', // Yetch video
  '2032896106808414325', // Euclid article
  '2025497795415662709', // Altura article
  '2058611697187782908', // AI video article
]

const fmt = (n) => {
  n = Number(n) || 0
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    return `${v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')}M`
  }
  if (n >= 1000) {
    const v = n / 1000
    return `${v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')}K`
  }
  return String(n)
}

const formatDate = (createdAt, ts) => {
  const d = createdAt ? new Date(createdAt) : (ts ? new Date(ts * 1000) : null)
  if (!d || Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Africa/Lagos' })
}

const run = (cmd, args) => new Promise((resolve, reject) => {
  const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
  let err = ''
  p.stderr.on('data', (d) => { err += d })
  p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} failed (${code}): ${err.slice(-400)}`))))
})

const getJson = async (url) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' }, redirect: 'follow' })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} for ${url}: ${text.slice(0, 180)}`)
  if (text.trimStart().startsWith('<')) throw new Error(`HTML challenge for ${url}`)
  return JSON.parse(text)
}

const fetchTweet = async (id) => {
  const urls = [
    `https://api.fxtwitter.com/status/${id}`,
    `https://api.fxtwitter.com/0xileri/status/${id}`,
    `https://api.fxtwitter.com/i/status/${id}`,
  ]
  let last
  for (const url of urls) {
    try {
      const data = await getJson(url)
      const tweet = data.tweet || data
      if (tweet && (tweet.id || tweet.author)) return tweet
      last = new Error(`unexpected payload from ${url}`)
    } catch (e) {
      last = e
    }
  }
  throw last || new Error(`all endpoints failed for ${id}`)
}

const download = async (url, dest) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*,video/*,*/*' }, redirect: 'follow' })
  if (!res.ok) throw new Error(`download ${res.status} ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
  return dest
}

const toWebp = async (src, dest, { width, square } = {}) => {
  const vf = square
    ? `scale=${width}:${width}:force_original_aspect_ratio=increase:flags=lanczos,crop=${width}:${width}`
    : (width ? `scale='min(${width},iw)':-1:flags=lanczos` : 'scale=iw:ih')
  await run('ffmpeg', ['-y', '-i', src, '-vf', vf, '-quality', '80', dest])
}

const identify = async (file) => {
  // Use ffprobe for width/height of the written webp
  return new Promise((resolve) => {
    const p = spawn('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file])
    let out = ''
    p.stdout.on('data', (d) => { out += d })
    p.on('close', () => {
      const [w, h] = out.trim().split(',').map(Number)
      resolve({ w: w || 0, h: h || 0 })
    })
  })
}

const pickVideoUrl = (m) => m.url || m.video_url || null
const pickThumb = (m) => m.thumbnail_url || m.preview_url || m.poster || null

const normalizeMedia = (media) => {
  const all = (media && (media.all || media.photos || media.videos)) || []
  return all.map((m) => ({
    type: m.type === 'video' || m.type === 'gif' ? (m.type === 'gif' ? 'gif' : 'video') : 'photo',
    url: m.type === 'video' || m.type === 'gif' ? pickVideoUrl(m) : (m.url || m.original_url),
    thumb: pickThumb(m),
    w: m.width,
    h: m.height,
    duration: m.duration || null,
    id: m.id,
  }))
}

const coverFromArticle = (article) => {
  if (!article) return null
  const info = article.cover_media?.media_info || {}
  const url = info.original_img_url || info.url
  if (!url) return null
  return { url, w: info.original_img_width, h: info.original_img_height, title: article.title || '', preview: article.preview_text || '' }
}

const normalizeAuthor = (a) => {
  if (!a) return null
  const verified = !!(a.verification?.verified || a.verified)
  return {
    name: a.name || a.screen_name,
    handle: a.screen_name,
    avatarUrl: a.avatar_url || a.avatar || a.profile_image_url,
    verified,
  }
}

const normalizeQuote = (t) => {
  const q = t.quote || t.quoted || t.quoted_tweet
  if (!q || typeof q !== 'object' || !q.id) return null
  return {
    id: String(q.id),
    url: q.url || (q.author?.screen_name && q.id ? `https://x.com/${q.author.screen_name}/status/${q.id}` : null),
    text: q.text || '',
    created: formatDate(q.created_at, q.created_timestamp),
    author: normalizeAuthor(q.author),
    media: normalizeMedia(q.media),
    article: coverFromArticle(q.article),
  }
}

const ensureDir = (p) => mkdir(p, { recursive: true })

const saveAvatar = async (author) => {
  if (!author?.handle || !author.avatarUrl) return null
  const dest = join(mediaDir, 'avatars', `${author.handle}.webp`)
  const publicPath = `/posts/avatars/${author.handle}.webp`
  if (existsSync(dest)) return publicPath
  const raw = join(rawDir, `avatar-${author.handle}`)
  const url = author.avatarUrl.replace(/_normal\.(jpg|png|webp)/, '_200x200.$1')
  await download(url, raw)
  await toWebp(raw, dest, { width: 96, square: true })
  return publicPath
}

const saveImage = async (url, destName, width = 1200) => {
  if (!url) return null
  const dest = join(mediaDir, destName)
  const publicPath = `/posts/${destName}`
  const raw = join(rawDir, destName.replace(/\.webp$/, '') + '.src')
  await download(url, raw)
  await toWebp(raw, dest, { width })
  const { w, h } = await identify(dest)
  return { src: publicPath, w, h }
}

const buildPost = async (id, tweet) => {
  const author = normalizeAuthor(tweet.author)
  const avatar = await saveAvatar(author)
  const mediaIn = normalizeMedia(tweet.media)
  const media = []
  for (let i = 0; i < mediaIn.length; i++) {
    const m = mediaIn[i]
    if (m.type === 'photo') {
      const img = await saveImage(m.url, `${id}-${i}.webp`, 1200)
      if (img) media.push({ type: 'photo', src: img.src, w: img.w, h: img.h })
    } else {
      const thumbUrl = m.thumb || m.url
      const poster = await saveImage(thumbUrl, `${id}-poster.webp`, 1200)
      media.push({
        type: m.type,
        poster: poster?.src || null,
        w: poster?.w || m.w || 0,
        h: poster?.h || m.h || 0,
        duration: m.duration || null,
        // No full mp4: these clips are 1–2 minutes. Poster + link only.
      })
    }
  }

  let article = null
  const cover = coverFromArticle(tweet.article)
  if (cover) {
    const img = await saveImage(cover.url, `${id}-cover.webp`, 1280)
    let preview = (cover.preview || '').replace(/\s+/g, ' ').trim()
    if (preview.length > 240) preview = preview.slice(0, 237).replace(/\s+\S*$/, '') + '...'
    article = {
      title: cover.title,
      preview,
      cover: img?.src || null,
      w: img?.w || cover.w,
      h: img?.h || cover.h,
    }
  }

  let quote = normalizeQuote(tweet)
  if (quote) {
    if (quote.author) {
      const qAvatar = await saveAvatar(quote.author)
      quote.author = { name: quote.author.name, handle: quote.author.handle, avatar: qAvatar, verified: quote.author.verified }
    }
    const qMedia = []
    for (let i = 0; i < (quote.media || []).length; i++) {
      const m = quote.media[i]
      if (m.type === 'photo' && m.url) {
        const img = await saveImage(m.url, `${id}-q${i}.webp`, 800)
        if (img) qMedia.push({ type: 'photo', src: img.src, w: img.w, h: img.h })
      } else if (m.thumb) {
        const poster = await saveImage(m.thumb, `${id}-q-poster.webp`, 800)
        qMedia.push({ type: m.type, poster: poster?.src, w: poster?.w || m.w, h: poster?.h || m.h })
      }
    }
    quote.media = qMedia
    if (quote.article?.url) {
      const img = await saveImage(quote.article.url, `${id}-q-cover.webp`, 800)
      quote.article = { title: quote.article.title, preview: quote.article.preview, cover: img?.src, w: img?.w, h: img?.h }
    }
  }

  return {
    id: String(tweet.id || id),
    url: tweet.url || `https://x.com/${author?.handle || '0xileri'}/status/${id}`,
    text: tweet.text || '',
    created: formatDate(tweet.created_at, tweet.created_timestamp),
    author: { name: author?.name, handle: author?.handle, avatar, verified: !!author?.verified },
    counts: {
      replies: fmt(tweet.replies),
      reposts: fmt(tweet.retweets ?? tweet.reposts),
      likes: fmt(tweet.likes),
      views: fmt(tweet.views),
    },
    countsRaw: {
      replies: Number(tweet.replies) || 0,
      reposts: Number(tweet.retweets ?? tweet.reposts) || 0,
      likes: Number(tweet.likes) || 0,
      views: Number(tweet.views) || 0,
    },
    media,
    article: article && article.cover ? article : null,
    quote,
    ok: true,
  }
}

const main = async () => {
  await ensureDir(join(mediaDir, 'avatars'))
  await ensureDir(rawDir)
  const out = {}
  for (const id of POST_IDS) {
    process.stdout.write(`fetch ${id}... `)
    try {
      const tweet = await fetchTweet(id)
      out[id] = await buildPost(id, tweet)
      const kind = out[id].article ? 'article' : (out[id].media[0]?.type || 'text')
      console.log(`ok (${kind}, ${out[id].counts.likes} likes)`)
    } catch (e) {
      console.log(`FAILED: ${e.message}`)
      out[id] = { id, url: `https://x.com/0xileri/status/${id}`, ok: false, error: String(e.message || e) }
    }
  }
  await writeFile(outJson, JSON.stringify(out, null, 2) + '\n')
  console.log(`wrote ${outJson}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
