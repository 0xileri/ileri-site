import { useEffect, useRef, useState } from 'react'
import { CountUp, useReveal } from './motion.jsx'
import {
  X_URL, DM_URL, TG_URL, AVATAR, AVATAR_SM, BANNER, BANNER_SM, stats, services, packages, oneOff, steps,
  featured, builds, wins, receipts, roles, contacts, profile, whoToFollow, article, videos, projects,
} from './data.js'
import * as I from './icons.jsx'
import Background from './Background.jsx'
import XEmbed from './XEmbed.jsx'
import { postIdFrom, mediaThumb, getPost } from './posts-lib.js'
import { useTheme, THEME_LABELS, prefersReducedMotion, saveData } from './hooks.js'

const ext = { target: '_blank', rel: 'noopener noreferrer' }

// Real post date from the post ID (snowflake), so dates are never made up.
const dateFromUrl = (url) => {
  const m = url && url.match(/status\/(\d+)/)
  if (!m) return null
  const ms = Number(BigInt(m[1]) >> 22n) + 1288834974657
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const NAV = [
  { id: 'top', label: 'Home', Icon: I.Home },
  { id: 'services', label: 'Services', Icon: I.Bolt },
  { id: 'packages', label: 'Packages', Icon: I.Tag },
  { id: 'proof', label: 'Proof', Icon: I.Trophy },
  { id: 'how', label: 'How it works', Icon: I.Steps },
  { id: 'contact', label: 'Contact', Icon: I.Mail },
]
// Sections that live behind "Show more" on the Posts tab.
const HIDDEN = ['services', 'how', 'shipped', 'more-videos']
const TABS = [
  { id: 'posts', label: 'Posts' },
  { id: 'packages', label: 'Packages' },
  { id: 'proof', label: 'Proof' },
  { id: 'media', label: 'Media' },
]

// Render @handles in real post text as links.
function Linkify({ text }) {
  return text.split('\n\n').map((para, i) => (
    <p key={i}>
      {para.split(/(@\w+)/g).map((part, j) => (part.startsWith('@')
        ? <a key={j} className="mention" href={`https://x.com/${part.slice(1)}`} {...ext}>{part}</a>
        : part))}
    </p>
  ))
}

function Avatar({ size = 40, src = AVATAR_SM, letter }) {
  if (letter) return <span className="avatar avatar-letter" style={{ width: size, height: size, fontSize: size * 0.42 }}>{letter}</span>
  return <img className="avatar" src={src} alt="" width={size} height={size} style={{ width: size, height: size }} loading="lazy" decoding="async" />
}

/* Hover cards (desktop only, CSS gated on hover-capable pointers) */
function projectInfo(name) {
  const p = projects.find((x) => x.name === name || name.startsWith(x.name))
  const results = wins.filter((w) => w.name === name || w.name.startsWith(name) || (p && w.name.startsWith(p.name)))
  const role = roles.find((r) => r.name === name)
  return { name: p ? p.name : name, handle: p && p.handle, logo: p && p.logo, results, role }
}

function Hover({ name, children }) {
  const info = projectInfo(name)
  const href = info.handle ? `https://x.com/${info.handle}` : (info.results[0] && info.results[0].href)
  return (
    <span className="hov">
      {children}
      <span className="hc" role="tooltip">
        <span className="hc-top">
          {info.logo ? <img className="avatar" src={info.logo} alt="" width="48" height="48" loading="lazy" /> : <Avatar size={48} letter={info.name[0]} />}
          {href && <a className="btn btn-light btn-sm" href={href} {...ext}>{info.handle ? 'View on X' : 'View post'}</a>}
        </span>
        <strong>{info.name}</strong>
        {info.handle && <span className="dim">@{info.handle}</span>}
        <span className="hc-lines">
          {info.role && <span>Current role: {info.role.role}</span>}
          {info.results.map((r) => <span key={r.name + r.result}>{r.result} <span className="dim">· {dateFromUrl(r.href)}</span></span>)}
          {!info.role && !info.results.length && <span className="dim">Worked with ileri</span>}
        </span>
      </span>
    </span>
  )
}

function ProfileHover({ children }) {
  return (
    <span className="hov">
      {children}
      <span className="hc" role="tooltip">
        <span className="hc-top">
          <img className="avatar" src={AVATAR_SM} alt="" width="56" height="56" loading="lazy" />
          <a className="btn btn-accent btn-sm" href={DM_URL} {...ext}>DM me</a>
        </span>
        <strong>{profile.name}</strong>
        <span className="dim">{profile.handle}</span>
        <span className="hc-bio">{profile.bio}</span>
        <span className="hc-follow"><span><strong>{profile.following}</strong> <span className="dim">Following</span></span><span><strong>{profile.followers}</strong> <span className="dim">Followers</span></span></span>
      </span>
    </span>
  )
}

function Actions({ counts }) {
  const [liked, setLiked] = useState(false)
  const [reposted, setReposted] = useState(false)
  const [copied, setCopied] = useState(false)
  const share = () => {
    navigator.clipboard?.writeText('https://ileri.lol').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    }).catch(() => {})
  }
  const c = counts || {}
  const lbl = (n, word, rest) => (n ? `${n} ${word}. ${rest}` : rest)
  return (
    <div className="actions">
      <a className="act act-reply" href={DM_URL} {...ext} aria-label={lbl(c.replies, 'replies', 'Reply with a DM')}><I.Reply size={18} />{counts && <span aria-hidden="true">{c.replies}</span>}</a>
      <button className={`act act-repost${reposted ? ' on' : ''}`} onClick={() => setReposted(!reposted)} aria-pressed={reposted} aria-label={lbl(c.reposts, 'reposts', 'Repost')}>
        <I.Repost size={18} />{counts && <span aria-hidden="true">{c.reposts}</span>}{reposted && <span className="act-note">nice</span>}
      </button>
      <button className={`act act-like${liked ? ' on' : ''}`} onClick={() => setLiked(!liked)} aria-pressed={liked} aria-label={lbl(c.likes, 'likes', 'Like')}>
        <span className="heart"><I.Heart size={18} filled={liked} /></span>{counts && <span aria-hidden="true">{c.likes}</span>}{liked && <span className="act-note">ty ❤️</span>}
      </button>
      {counts
        ? <span className="act act-views" role="img" aria-label={`${c.views} views`}><I.Views size={18} /><span aria-hidden="true">{c.views}</span></span>
        : <span className="act act-views" aria-hidden="true"><I.Views size={18} /></span>}
      <button className="act act-share" onClick={share} aria-label="Copy site link">
        <I.Share size={18} />{copied && <span className="act-note">copied</span>}
      </button>
    </div>
  )
}

function Post({ children, id, pinned, label, time, thread, threadEnd, compact, counts }) {
  return (
    <article className={`post reveal${thread ? ' in-thread' : ''}${threadEnd ? ' thread-end' : ''}${compact ? ' compact' : ''}`} id={id}>
      {pinned && <p className="post-ctx"><I.Pin /> Pinned</p>}
      {label && !pinned && <p className="post-ctx">{label}</p>}
      <div className="post-row">
        <div className="post-gutter">
          <Avatar />
          {thread && !threadEnd && <span className="thread-line" />}
        </div>
        <div className="post-main">
          <header className="post-head">
            <ProfileHover><strong>{profile.name}</strong></ProfileHover>
            <span className="dim">{profile.handle}</span>
            {time && <><span className="dim">·</span><span className="dim">{time}</span></>}
          </header>
          <div className="post-body">{children}</div>
          <Actions counts={counts} />
        </div>
      </div>
    </article>
  )
}

function Pinned({ go }) {
  return (
    <Post id="offer" pinned>
      <p>I help early AI and crypto projects grow on X.</p>
      <p>Posts on my page, KOL pushes through creators I manage, a community set up the right way, and AI videos for your launch.</p>
      <p>I build too, with hackathon wins and shipped projects of my own, so I get what you're working on. DMs open.</p>
      <div className="card stat-card">
        {stats.map((s) => <div key={s.label}><CountUp value={s.value} /><span>{s.label}</span></div>)}
      </div>
      <div className="btn-row">
        <a className="btn btn-accent" href={DM_URL} {...ext}>DM me</a>
        <a className="btn btn-outline" href={TG_URL} {...ext}><I.Send size={16} /> Telegram</a>
        <button className="btn btn-outline" onClick={() => go('packages', 'packages')}>See packages</button>
      </div>
    </Post>
  )
}

/* Autoplay video: muted, looped, plays only while on screen. Reduced motion or data saver shows the poster. */
function AutoVideo({ v }) {
  const ref = useRef(null)
  const [still] = useState(() => prefersReducedMotion() || saveData())
  const [src, setSrc] = useState(null)
  useEffect(() => {
    const el = ref.current
    if (!el || still || !('IntersectionObserver' in window)) return
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSrc(v.src); near.disconnect() } }, { rootMargin: '300px' })
    const vis = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !document.hidden) el.play?.().catch(() => {})
      else el.pause?.()
    }, { threshold: 0.4 })
    const onHide = () => { if (document.hidden) el.pause() }
    near.observe(el); vis.observe(el)
    document.addEventListener('visibilitychange', onHide)
    return () => { near.disconnect(); vis.disconnect(); document.removeEventListener('visibilitychange', onHide) }
  }, [still, v.src])
  return (
    <a className="media video-media" href={v.href} {...ext} aria-label={`${v.label} by ileri. Watch the full video on X`} style={{ aspectRatio: `${v.w} / ${v.h}` }}>
      {still
        ? <img src={v.poster} alt="" width={v.w} height={v.h} loading="lazy" decoding="async" />
        : <video ref={ref} src={src || undefined} poster={v.poster} muted loop playsInline preload="none" width={v.w} height={v.h} aria-hidden="true" />}
      <span className="vid-chip"><I.Muted /> 0:12 clip</span>
      <span className="vid-cta"><I.Play size={14} /> Watch full video on X</span>
    </a>
  )
}

function VideoPost({ v, pinnedLabel }) {
  return (
    <Post id={`video-${v.id}`} label={pinnedLabel || 'AI video'} time={dateFromUrl(v.href)} counts={v.counts}>
      <Linkify text={v.text} />
      <AutoVideo v={v} />
    </Post>
  )
}

function ArticlePost() {
  const p = getPost(postIdFrom(article.href))
  return (
    <Post id="ai-video" label="Article" time={(p && p.created) || dateFromUrl(article.href)}>
      <p>wrote down exactly how I make my AI videos, start to finish. if you're new to it, start here 👇</p>
      <XEmbed id={postIdFrom(article.href)} href={article.href} />
    </Post>
  )
}

function ServicesThread() {
  return (
    <section id="services" aria-label="Services">
      <Post thread label="Thread">
        <p>What I do for your project. Four things, pick one or stack them into one campaign 🧵</p>
      </Post>
      {services.map((s, i) => (
        <Post key={s.n} thread threadEnd={i === services.length - 1}>
          <p className="post-title">{i + 1}/ {s.title}</p>
          <p>{s.body}</p>
          <ul className="chips">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          {s.link && <a className="inline-link" href={s.link.href} {...ext}>{s.link.label} <I.Ext /></a>}
        </Post>
      ))}
    </section>
  )
}

function Poll() {
  const [pick, setPick] = useState(null)
  const chosen = packages.find((p) => p.name === pick)
  return (
    <div className="poll">
      {packages.map((p) => (
        <button key={p.name} className={`poll-opt${pick === p.name ? ' picked' : ''}${pick && pick !== p.name ? ' faded' : ''}`} onClick={() => setPick(p.name)} aria-pressed={pick === p.name}>
          <span className="poll-fill" style={{ width: pick === p.name ? '100%' : '0%' }} />
          <span className="poll-label">{p.name}</span>
          {pick === p.name && <I.Check />}
        </button>
      ))}
      <p className="dim poll-foot" aria-live="polite">
        {chosen
          ? <>Good pick. <a href={DM_URL} {...ext}>DM me about {chosen.name}</a> and we'll get going.</>
          : 'Tap one. No one sees your vote, it just helps you decide.'}
      </p>
    </div>
  )
}

function PackagesBlock() {
  return (
    <section id="packages" aria-label="Packages">
      <Post label="Packages">
        <p>Monthly packages. DM me for pricing. Which one fits your project?</p>
        <Poll />
      </Post>
      {packages.map((p) => (
        <Post key={p.name}>
          <div className={`card plan${p.featured ? ' plan-featured' : ''}`}>
            <div className="plan-top">
              <span className="plan-name">{p.name}</span>
              <span className="plan-price">Monthly · DM for pricing</span>
            </div>
            <ul className="checks">{p.items.map((it) => <li key={it}><I.Check /> {it}</li>)}</ul>
            <a className={`btn ${p.featured ? 'btn-accent' : 'btn-outline'} btn-block`} href={DM_URL} {...ext}>Ask about {p.name}</a>
          </div>
        </Post>
      ))}
      <Post>
        <p>Just need a single post or a video? That works too.</p>
        <div className="card table">
          {oneOff.map((o) => <div key={o.item}><span>{o.item}</span><strong>DM for a quote</strong></div>)}
        </div>
        <p className="note">Very early team? I'm open to part cash, part tokens.</p>
      </Post>
    </section>
  )
}

function HowThread() {
  return (
    <section id="how" aria-label="How it works">
      <Post thread label="Thread">
        <p>How working with me goes. Pitch, plan, launch 👇</p>
      </Post>
      {steps.map((s, i) => (
        <Post key={s.n} thread threadEnd={i === steps.length - 1}>
          <p className="post-title">{i + 1}/ {s.title}</p>
          <p>{s.body}</p>
        </Post>
      ))}
    </section>
  )
}

function LogoRow() {
  return (
    <div className="logos" aria-label="Projects I've worked with">
      {projects.map((p) => (
        <Hover key={p.name} name={p.name}>
          <span className={`logo${p.logo ? '' : ' logo-word'}`} tabIndex={0}>
            {p.logo && <img src={p.logo} alt="" width="28" height="28" loading="lazy" />}
            <span>{p.name}</span>
          </span>
        </Hover>
      ))}
    </div>
  )
}

function ProofBlock({ full }) {
  const [more, setMore] = useState(false)
  const extraReceipts = receipts.filter((r) => !featured.some((f) => f.name === r.name))
  const rest = wins.filter((w) => !receipts.some((r) => r.name === w.name) && !featured.some((f) => f.name === w.name || w.name.startsWith(f.name)))
  return (
    <section id="proof" aria-label="Proof">
      <Post label="Receipts">
        <p>The receipts. Wins from open campaigns and hackathons, judged against everyone else who entered. Each one links to the public post.</p>
        <p className="post-title logos-title">Projects I've worked with</p>
        <LogoRow />
      </Post>
      {featured.map((f) => (
        <Post key={f.name} time={dateFromUrl(f.href)}>
          <p><Hover name={f.name}><strong>{f.name}</strong></Hover>: {f.body}</p>
          <XEmbed id={postIdFrom(f.href)} href={f.href} badge={f.badge} />
        </Post>
      ))}
      {full && more && extraReceipts.map((r) => (
        <Post key={r.name} time={dateFromUrl(r.href)}>
          <p><Hover name={r.name}><strong>{r.name}</strong></Hover>: {r.label}</p>
          <XEmbed id={postIdFrom(r.href)} href={r.href} badge={r.label} />
        </Post>
      ))}
      {full && more && rest.map((w) => (
        <Post key={w.name} compact time={dateFromUrl(w.href)}>
          <p><Hover name={w.name}><strong>{w.name}</strong></Hover>: {w.result} <span className="badge badge-dim">{w.type}</span></p>
          <a className="inline-link" href={w.href} {...ext}>View the original post <I.Ext /></a>
        </Post>
      ))}
      {full && (
        <button className="show-more" onClick={() => setMore(!more)} aria-expanded={more}>
          {more ? 'Show fewer posts' : `Show ${extraReceipts.length + rest.length} more wins`}
        </button>
      )}
    </section>
  )
}

function ShippedBlock() {
  return (
    <section id="shipped" aria-label="Shipped projects">
      <Post label="Builds">
        <p>Projects I built and shipped myself. Click through to check them.</p>
      </Post>
      {builds.map((b) => (
        <Post key={b.name} time={dateFromUrl(b.href)}>
          <p>{b.tag}</p>
          <a className="card quote" href={b.href} {...ext}>
            <div className="quote-head">
              <Avatar size={20} letter={b.name[0]} />
              <strong>{b.name}</strong>
            </div>
            <p>{b.body}</p>
            <span className="inline-link">{b.cta} <I.Ext /></span>
          </a>
        </Post>
      ))}
      <Post>
        <p>Current roles:</p>
        <ul className="roles">{roles.map((r) => <li key={r.name}><Hover name={r.name}><strong>{r.name}</strong></Hover><span className="dim">{r.role}</span></li>)}</ul>
      </Post>
    </section>
  )
}

/* X style compose box. No backend: it opens a prefilled X DM, or copies the text and opens Telegram. */
const IDEAS = ['Launch campaign', 'KOL push', 'AI launch video', 'Community setup']
function Compose() {
  const [text, setText] = useState('')
  const [note, setNote] = useState('')
  const max = 500
  const msg = () => (text.trim() ? `Hey ileri, found you on ileri.lol.\n\n${text.trim()}` : 'Hey ileri, found you on ileri.lol. I want to talk about my project.')
  const add = (idea) => setText((t) => (t.includes(idea) ? t : `${t}${t && !t.endsWith(' ') ? ' ' : ''}Interested in: ${idea}.`))
  const toTelegram = () => {
    navigator.clipboard?.writeText(msg()).then(() => setNote('Message copied. Paste it in Telegram.')).catch(() => {})
    window.open(TG_URL, '_blank', 'noopener')
  }
  const left = max - text.length
  return (
    <div className="compose" id="compose">
      <Avatar size={40} />
      <div className="compose-main">
        <label htmlFor="compose-text" className="sr-only">What's your project?</label>
        <textarea id="compose-text" rows={3} maxLength={max} placeholder="What's your project?" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="compose-ideas">{IDEAS.map((i) => <button key={i} type="button" onClick={() => add(i)}>+ {i}</button>)}</div>
        <div className="compose-bar">
          <span className={`compose-count${left < 40 ? ' warn' : ''}`} aria-live="polite">{left < 100 ? left : ''}</span>
          <button type="button" className="btn btn-outline btn-sm" onClick={toTelegram}><I.Send size={14} /> Telegram</button>
          <a className="btn btn-accent btn-sm" href={`${DM_URL}&text=${encodeURIComponent(msg())}`} {...ext}>Post to DM</a>
        </div>
        {note && <p className="dim compose-note" role="status">{note}</p>}
      </div>
    </div>
  )
}

function ContactBlock() {
  return (
    <section id="contact" aria-label="Contact">
      <Post label="Contact">
        <p>Got something early? Tell me what you're building and what you need. I'll tell you straight if I can help.</p>
      </Post>
      <Compose />
      <div className="contacts-wrap">
        <div className="card contacts">
          {contacts.map((c) => (
            <a key={c.label} href={c.href} {...(c.href.startsWith('http') ? ext : {})} className={c.primary ? 'primary' : ''}>
              <span className="dim">{c.label}</span><strong>{c.value}</strong>
            </a>
          ))}
        </div>
      </div>
      <p className="end">You're all caught up ✨</p>
    </section>
  )
}

function MediaGrid() {
  return (
    <section id="media" className="media-grid" aria-label="Media">
      {videos.map((v) => (
        <a key={v.id} href={v.href} {...ext} className="tile tile-video">
          <img src={v.thumb} alt={`${v.label} by ileri, video still`} width="320" height={Math.round(320 * v.h / v.w)} loading="lazy" decoding="async" />
          <span className="play" aria-hidden="true"><I.Play size={22} /></span>
          <span>{v.label}</span>
        </a>
      ))}
      {receipts.map((r) => {
        const id = postIdFrom(r.href)
        const thumb = mediaThumb(getPost(id))
        return (
          <a key={r.name} href={r.href} {...ext} className={`tile${thumb?.video ? ' tile-video' : ''}${thumb ? '' : ' tile-text'}`}>
            {thumb
              ? <img src={thumb.src} width={thumb.w} height={thumb.h} alt={`${r.name} ${r.label}`} loading="lazy" decoding="async" />
              : <span className="tile-fallback">{r.name}</span>}
            {thumb?.video && <span className="play" aria-hidden="true"><I.Play size={22} /></span>}
            <span>{r.name} · {r.label}</span>
          </a>
        )
      })}
    </section>
  )
}

function ProfileHeader({ tab, setTab }) {
  const refs = useRef([])
  const onKey = (e, i) => {
    let n = null
    if (e.key === 'ArrowRight') n = (i + 1) % TABS.length
    if (e.key === 'ArrowLeft') n = (i - 1 + TABS.length) % TABS.length
    if (e.key === 'Home') n = 0
    if (e.key === 'End') n = TABS.length - 1
    if (n === null) return
    e.preventDefault()
    setTab(TABS[n].id)
    refs.current[n]?.focus()
  }
  return (
    <div className="profile" id="top">
      <div className="banner">
        <img src={BANNER} srcSet={`${BANNER_SM} 640w, ${BANNER} 1200w`} sizes="(max-width: 700px) 100vw, 600px" alt="ileri's X banner" width="1200" height="400" fetchpriority="high" />
      </div>
      <div className="profile-inner">
        <div className="profile-row">
          <img className="profile-avatar" src={AVATAR} alt="ileri's profile picture" width="134" height="134" />
          <div className="profile-btns">
            <a className="btn btn-icon btn-outline" href={TG_URL} {...ext} aria-label="Message on Telegram" title="Telegram"><I.Send size={18} /></a>
            <a className="btn btn-outline" href={X_URL} {...ext}>Follow</a>
            <a className="btn btn-accent" href={DM_URL} {...ext}>DM me</a>
          </div>
        </div>
        <h1>{profile.name}</h1>
        <p className="dim">{profile.handle}</p>
        <p className="bio">{profile.bio}</p>
        <p className="meta dim">
          <span><I.Link /> <a href="https://ileri.lol">{profile.site}</a></span>
          <span><I.Calendar /> DMs open</span>
        </p>
        <p className="follow-row">
          <a href={X_URL} {...ext}><strong>{profile.following}</strong> <span className="dim">Following</span></a>
          <a href={X_URL} {...ext}><strong>{profile.followers}</strong> <span className="dim">Followers</span></a>
        </p>
      </div>
      <div className="tabs" role="tablist" aria-label="Profile sections">
        {TABS.map((t, i) => (
          <button key={t.id} ref={(el) => { refs.current[i] = el }} id={`tab-${t.id}`} role="tab" aria-selected={tab === t.id} aria-controls="feed-panel" tabIndex={tab === t.id ? 0 : -1} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)} onKeyDown={(e) => onKey(e, i)}>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Ticker() {
  const items = wins
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (prefersReducedMotion() || paused) return
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 3200)
    return () => clearInterval(t)
  }, [paused, items.length])
  const shown = [0, 1, 2].map((k) => items[(i + k) % items.length])
  return (
    <div className="ticker" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      {shown.map((w, k) => (
        <a className="trend" key={`${w.name}-${i}-${k}`} href={w.href} {...ext} style={{ animationDelay: `${k * 60}ms` }}>
          <span className="dim">{k === 0 ? 'Trending in Wins' : `${w.type} · Trending`}</span>
          <strong>{w.name}</strong>
          <span className="dim">{w.result} · {dateFromUrl(w.href)}</span>
        </a>
      ))}
    </div>
  )
}

function Display({ theme, setTheme, themes }) {
  return (
    <div className="box">
      <h2 id="display-h">Display</h2>
      <div className="display" role="radiogroup" aria-labelledby="display-h">
        {themes.map((t) => (
          <button key={t} role="radio" aria-checked={theme === t} className={`display-opt display-${t}${theme === t ? ' on' : ''}`} onClick={() => setTheme(t)}>
            <span className="display-dot" aria-hidden="true" />{THEME_LABELS[t]}
          </button>
        ))}
      </div>
    </div>
  )
}

function Sidebar({ go, themeCtl }) {
  return (
    <aside className="right" aria-label="Sidebar">
      <div className="right-inner">
        <a className="search" href="#proof" onClick={(e) => { e.preventDefault(); go('proof', 'proof') }}><I.Search /> <span>Search the receipts</span></a>
        <div className="box">
          <h2>What's happening</h2>
          <Ticker />
          {roles.map((r) => (
            <div className="trend" key={r.name}>
              <span className="dim">Current role</span>
              <strong>{r.name}</strong>
              <span className="dim">{r.role}</span>
            </div>
          ))}
          <button className="show-more box-more" onClick={() => go('proof', 'proof')}>Show all wins</button>
        </div>
        <Display {...themeCtl} />
        <div className="box">
          <h2>Who to follow</h2>
          {whoToFollow.map((w) => (
            <a className="wtf" key={w.handle} href={w.href} {...ext}>
              <Avatar size={40} src={w.avatar} letter={w.letter} />
              <span className="wtf-text"><strong>{w.name}</strong><span className="dim">{w.handle}</span></span>
              <span className="btn btn-light btn-sm">{w.cta}</span>
            </a>
          ))}
        </div>
        <p className="legal dim">© 2026 ILERI · ileri's personal site, styled like a timeline. Not affiliated with any social network.</p>
      </div>
    </aside>
  )
}

export default function App() {
  const [tab, setTab] = useState('posts')
  const [scrolled, setScrolled] = useState(false)
  const [fab, setFab] = useState(false)
  const [active, setActive] = useState('top')
  const [expanded, setExpanded] = useState(false)
  const themeCtl = useTheme()
  const [toTop, setToTop] = useState(false)
  useReveal('.feed', '.reveal')

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setToTop(y > 1400)
      // X style: hide the floating button while scrolling down, bring it back on scroll up
      if (Math.abs(y - last) > 8) {
        const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 700
        setFab(y < last && y > 600 && !nearEnd)
        last = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id, nextTab = 'posts') => {
    if (nextTab === 'posts' && HIDDEN.includes(id)) setExpanded(true)
    setTab(nextTab)
    setActive(id)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    }))
  }
  const changeTab = (t) => {
    setTab(t)
    const el = document.querySelector('.tabs')
    if (el && window.scrollY > el.offsetTop) window.scrollTo({ top: el.offsetTop - 53 })
  }
  const [lead, ...moreVideos] = videos

  return (
    <div className="shell">
      <Background />
      <a href="#main" className="skip">Skip to content</a>

      <nav className="rail" aria-label="Main">
        <a href="#top" className="rail-logo" onClick={(e) => { e.preventDefault(); go('top') }}>ILERI<span>.</span></a>
        {NAV.map(({ id, label, Icon }) => (
          <a key={id} href={`#${id}`} className={`rail-item${active === id ? ' active' : ''}`} aria-current={active === id ? 'true' : undefined} onClick={(e) => { e.preventDefault(); go(id) }}>
            <Icon size={26} /><span>{label}</span>
          </a>
        ))}
        <button className="rail-item rail-theme" onClick={themeCtl.cycle} aria-label={`Theme: ${THEME_LABELS[themeCtl.theme]}. Switch theme`}>
          <I.Theme size={26} /><span>{THEME_LABELS[themeCtl.theme]}</span>
        </button>
        <a className="btn btn-accent rail-post" href={DM_URL} {...ext} aria-label="DM me on X"><span>DM me</span><I.Quill size={24} /></a>
        <a className="rail-me" href={X_URL} {...ext} aria-label="ileri on X">
          <Avatar size={40} />
          <span><strong>{profile.name}</strong><span className="dim">{profile.handle}</span></span>
        </a>
      </nav>

      <main className="center" id="main">
        <header className={`top-bar${scrolled ? ' scrolled' : ''}`}>
          <a href="#top" className="mobile-avatar" aria-label="Back to top" onClick={(e) => { e.preventDefault(); go('top') }}><Avatar size={32} /></a>
          <div>
            <strong>{profile.name}</strong>
            <span className="dim">Growth for early AI and crypto projects</span>
          </div>
          <button className="top-theme" onClick={themeCtl.cycle} aria-label={`Theme: ${THEME_LABELS[themeCtl.theme]}. Switch theme`}><I.Theme size={20} /></button>
        </header>

        <ProfileHeader tab={tab} setTab={changeTab} />

        <div className="feed" id="feed-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={-1}>
          {tab === 'posts' && <>
            <Pinned go={go} />
            <VideoPost v={lead} />
            <ProofBlock />
            <PackagesBlock />
            {expanded ? <>
              <ServicesThread />
              <section id="more-videos" aria-label="More AI videos">{moreVideos.map((v) => <VideoPost key={v.id} v={v} />)}</section>
              <ArticlePost />
              <HowThread />
              <ShippedBlock />
            </> : (
              <button className="show-more show-more-big" onClick={() => setExpanded(true)} aria-expanded={false}>
                Show more posts <span className="dim">services, more AI videos, the AI video article, how it works, builds</span>
              </button>
            )}
            <ContactBlock />
          </>}
          {tab === 'packages' && <><PackagesBlock /><ServicesThread /><HowThread /><ContactBlock /></>}
          {tab === 'proof' && <><ProofBlock full /><ShippedBlock /><ContactBlock /></>}
          {tab === 'media' && <>{videos.map((v) => <VideoPost key={v.id} v={v} />)}<ArticlePost /><MediaGrid /></>}
        </div>
      </main>

      <Sidebar go={go} themeCtl={themeCtl} />

      <button className={`to-top${toTop ? ' on' : ''}`} onClick={() => go('top')} aria-label="Back to top" tabIndex={toTop ? 0 : -1}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 4l7 7-1.4 1.4L13 7.8V20h-2V7.8l-4.6 4.6L5 11z"/></svg>
      </button>
      <a className={`fab${fab ? '' : ' fab-hide'}`} href={DM_URL} {...ext} aria-label="DM me on X"><I.Quill size={24} /></a>
      <nav className="bottom-bar" aria-label="Mobile">
        {NAV.map(({ id, label, Icon }) => (
          <a key={id} href={`#${id}`} aria-label={label} aria-current={active === id ? 'true' : undefined} className={active === id ? 'active' : ''} onClick={(e) => { e.preventDefault(); go(id) }}>
            <Icon size={24} />
          </a>
        ))}
      </nav>
    </div>
  )
}
