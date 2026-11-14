import { useEffect, useState } from 'react'
import {
  X_URL, AVATAR, AI_VIDEO_URL, stats, ecosystems, services, packages, oneOff, steps,
  featured, builds, wins, receipts, roles, contacts, profile, whoToFollow, article,
} from './data.js'
import * as I from './icons.jsx'

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
const MOBILE_NAV = NAV.filter((n) => n.id !== 'how')
const TABS = [
  { id: 'posts', label: 'Posts' },
  { id: 'packages', label: 'Packages' },
  { id: 'proof', label: 'Proof' },
  { id: 'media', label: 'Media' },
]

function Avatar({ size = 40, src = AVATAR, letter }) {
  if (letter) return <span className="avatar avatar-letter" style={{ width: size, height: size, fontSize: size * 0.42 }}>{letter}</span>
  return <img className="avatar" src={src} alt="" width={size} height={size} style={{ width: size, height: size }} />
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
  return (
    <div className="actions">
      <a className="act act-reply" href={X_URL} {...ext} aria-label="Reply with a DM"><I.Reply size={18} />{counts && <span>{counts.replies}</span>}</a>
      <button className={`act act-repost${reposted ? ' on' : ''}`} onClick={() => setReposted(!reposted)} aria-pressed={reposted} aria-label="Repost">
        <I.Repost size={18} />{counts && <span>{counts.reposts}</span>}{reposted && <span className="act-note">nice</span>}
      </button>
      <button className={`act act-like${liked ? ' on' : ''}`} onClick={() => setLiked(!liked)} aria-pressed={liked} aria-label="Like">
        <span className="heart"><I.Heart size={18} filled={liked} /></span>{counts && <span>{counts.likes}</span>}{liked && <span className="act-note">ty ❤️</span>}
      </button>
      <span className="act act-views" aria-hidden={!counts}><I.Views size={18} />{counts && <span>{counts.views}</span>}</span>
      <button className="act act-share" onClick={share} aria-label="Copy site link">
        <I.Share size={18} />{copied && <span className="act-note">copied</span>}
      </button>
    </div>
  )
}

function Post({ children, id, pinned, label, time, thread, threadEnd, compact, counts }) {
  return (
    <article className={`post${thread ? ' in-thread' : ''}${threadEnd ? ' thread-end' : ''}${compact ? ' compact' : ''}`} id={id}>
      {pinned && <p className="post-ctx"><I.Pin /> Pinned</p>}
      {label && !pinned && <p className="post-ctx">{label}</p>}
      <div className="post-row">
        <div className="post-gutter">
          <Avatar />
          {thread && !threadEnd && <span className="thread-line" />}
        </div>
        <div className="post-main">
          <header className="post-head">
            <strong>{profile.name}</strong>
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
        {stats.map((s) => <div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>)}
      </div>
      <div className="btn-row">
        <a className="btn btn-accent" href={X_URL} {...ext}>DM me</a>
        <button className="btn btn-outline" onClick={() => go('packages', 'packages')}>See packages</button>
      </div>
    </Post>
  )
}

function ArticleCard() {
  return (
    <a className="card article" href={article.href} {...ext}>
      <img src={article.cover} alt="Cover image for the article" loading="lazy" />
      <div className="article-body">
        <span className="article-tag"><I.Steps size={14} /> Article</span>
        <h3>{article.title}</h3>
        <p className="dim">{article.preview}</p>
        <span className="inline-link">Read the article <I.Ext /></span>
      </div>
    </a>
  )
}

function ArticlePost({ pinned = true }) {
  return (
    <Post id="ai-video" pinned={pinned} label={pinned ? undefined : 'Article'} time={dateFromUrl(article.href)} counts={article.counts}>
      <p>wrote down exactly how I make my AI videos, start to finish. if you're new to it, start here 👇</p>
      <ArticleCard />
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
        <button key={p.name} className={`poll-opt${pick === p.name ? ' picked' : ''}${pick && pick !== p.name ? ' faded' : ''}`} onClick={() => setPick(p.name)}>
          <span className="poll-fill" style={{ width: pick === p.name ? '100%' : '0%' }} />
          <span className="poll-label">{p.name} · {p.price}/month</span>
          {pick === p.name && <I.Check />}
        </button>
      ))}
      <p className="dim poll-foot">
        {chosen
          ? <>Good pick. <a href={X_URL} {...ext}>DM me about {chosen.name}</a> and we'll get going.</>
          : 'Tap one. No one sees your vote, it just helps you decide.'}
      </p>
    </div>
  )
}

function PackagesBlock() {
  return (
    <section id="packages" aria-label="Packages">
      <Post label="Packages">
        <p>Monthly packages, prices in USD. Which one fits your project?</p>
        <Poll />
      </Post>
      {packages.map((p) => (
        <Post key={p.name}>
          <div className={`card plan${p.featured ? ' plan-featured' : ''}`}>
            <div className="plan-top">
              <span className="plan-name">{p.name}</span>
              <span className="plan-price"><strong>{p.price}</strong>/month</span>
            </div>
            <ul className="checks">{p.items.map((it) => <li key={it}><I.Check /> {it}</li>)}</ul>
            <a className={`btn ${p.featured ? 'btn-accent' : 'btn-outline'} btn-block`} href={X_URL} {...ext}>Ask about {p.name}</a>
          </div>
        </Post>
      ))}
      <Post>
        <p>Just need a single post or a video? That works too.</p>
        <div className="card table">
          {oneOff.map((o) => <div key={o.item}><span>{o.item}</span><strong>{o.price}</strong></div>)}
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

function ProofBlock() {
  const [more, setMore] = useState(false)
  const rest = wins.filter((w) => !featured.some((f) => w.name === f.name))
  return (
    <section id="proof" aria-label="Proof">
      <Post label="Receipts">
        <p>The receipts. Wins from open campaigns and hackathons, judged against everyone else who entered. Each one links to the public post.</p>
      </Post>
      {featured.map((f) => (
        <Post key={f.name} time={dateFromUrl(f.href)}>
          <p>{f.body} <span className="badge">{f.badge}</span></p>
          <a className="media" href={f.href} {...ext}>
            <img src={f.img} alt={`${f.name} ${f.badge} announcement`} loading="lazy" />
          </a>
          <a className="inline-link" href={f.href} {...ext}>View the original post <I.Ext /></a>
        </Post>
      ))}
      {more && rest.map((w) => (
        <Post key={w.name} compact time={dateFromUrl(w.href)}>
          <p><strong>{w.name}</strong>: {w.result} <span className="badge badge-dim">{w.type}</span></p>
          <a className="inline-link" href={w.href} {...ext}>View the original post <I.Ext /></a>
        </Post>
      ))}
      <button className="show-more" onClick={() => setMore(!more)} aria-expanded={more}>
        {more ? 'Show fewer posts' : `Show ${rest.length} more wins`}
      </button>
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
        <ul className="roles">{roles.map((r) => <li key={r.name}><strong>{r.name}</strong><span className="dim">{r.role}</span></li>)}</ul>
      </Post>
    </section>
  )
}

function ContactBlock() {
  return (
    <section id="contact" aria-label="Contact">
      <Post label="Contact">
        <p>Got something early? Send me a DM.</p>
        <p>Tell me what you're building and what you need. I'll tell you straight if I can help.</p>
        <div className="card contacts">
          {contacts.map((c) => (
            <a key={c.label} href={c.href} {...(c.href.startsWith('http') ? ext : {})} className={c.primary ? 'primary' : ''}>
              <span className="dim">{c.label}</span><strong>{c.value}</strong>
            </a>
          ))}
        </div>
      </Post>
      <p className="end">You're all caught up ✨</p>
    </section>
  )
}

function MediaGrid() {
  return (
    <section id="media" className="media-grid" aria-label="Media">
      {receipts.map((r) => (
        <a key={r.name} href={r.href} {...ext} className="tile">
          <img src={r.img} alt={`${r.name} ${r.label} screenshot`} loading="lazy" />
          <span>{r.name} · {r.label}</span>
        </a>
      ))}
      <a href={AI_VIDEO_URL} {...ext} className="tile tile-video">
        <span className="play">▶</span>
        <span>AI video · recent work</span>
      </a>
    </section>
  )
}

function ProfileHeader({ tab, setTab }) {
  return (
    <div className="profile" id="top">
      <div className="banner" aria-hidden="true">
        <span className="banner-word">ILERI.</span>
      </div>
      <div className="profile-inner">
        <div className="profile-row">
          <img className="profile-avatar" src={AVATAR} alt="ileri's profile picture" width="134" height="134" />
          <a className="btn btn-light" href={X_URL} {...ext}>Follow</a>
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
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="right">
      <a className="search" href="#proof"><I.Search /> <span>Search the receipts</span></a>
      <div className="box">
        <h2>What's happening</h2>
        {roles.map((r) => (
          <div className="trend" key={r.name}>
            <span className="dim">Current role</span>
            <strong>{r.name}</strong>
            <span className="dim">{r.role}</span>
          </div>
        ))}
        <div className="trend">
          <span className="dim">Ecosystems worked with or won in</span>
          <div className="eco">{ecosystems.map((e) => <span key={e}>{e}</span>)}</div>
        </div>
      </div>
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
    </aside>
  )
}

export default function App() {
  const [tab, setTab] = useState('posts')
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('top')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id, nextTab = 'posts') => {
    setTab(nextTab)
    setActive(id)
    requestAnimationFrame(() => {
      const el = document.getElementById(id === 'top' ? 'top' : id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
  const changeTab = (t) => {
    setTab(t)
    const el = document.querySelector('.tabs')
    if (el && window.scrollY > el.offsetTop) window.scrollTo({ top: el.offsetTop - 53 })
  }

  return (
    <div className="shell">
      <a href="#main" className="skip">Skip to content</a>

      <nav className="rail" aria-label="Main">
        <a href="#top" className="rail-logo" onClick={(e) => { e.preventDefault(); go('top') }}>ILERI<span>.</span></a>
        {NAV.map(({ id, label, Icon }) => (
          <a key={id} href={`#${id}`} className={`rail-item${active === id ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); go(id) }}>
            <Icon size={26} /><span>{label}</span>
          </a>
        ))}
        <a className="btn btn-accent rail-post" href={X_URL} {...ext}><span>DM me</span><I.Quill size={24} /></a>
        <a className="rail-me" href={X_URL} {...ext}>
          <Avatar size={40} />
          <span><strong>{profile.name}</strong><span className="dim">{profile.handle}</span></span>
        </a>
      </nav>

      <main className="center" id="main">
        <header className={`top-bar${scrolled ? ' scrolled' : ''}`}>
          <a href="#top" className="mobile-avatar" onClick={(e) => { e.preventDefault(); go('top') }}><Avatar size={32} /></a>
          <div>
            <strong>{profile.name}</strong>
            <span className="dim">Growth for early AI and crypto projects</span>
          </div>
        </header>

        <ProfileHeader tab={tab} setTab={changeTab} />

        <div className="feed">
          {tab === 'posts' && <>
            <Pinned go={go} />
            <ArticlePost />
            <ServicesThread />
            <PackagesBlock />
            <HowThread />
            <ProofBlock />
            <ShippedBlock />
            <ContactBlock />
          </>}
          {tab === 'packages' && <><PackagesBlock /><ContactBlock /></>}
          {tab === 'proof' && <><ProofBlock /><ShippedBlock /></>}
          {tab === 'media' && <><ArticlePost pinned={false} /><MediaGrid /></>}
        </div>
      </main>

      <Sidebar />

      <a className="fab" href={X_URL} {...ext} aria-label="DM me"><I.Quill size={24} /></a>
      <nav className="bottom-bar" aria-label="Mobile">
        {MOBILE_NAV.map(({ id, label, Icon }) => (
          <a key={id} href={`#${id}`} aria-label={label} className={active === id ? 'active' : ''} onClick={(e) => { e.preventDefault(); go(id) }}>
            <Icon size={24} />
          </a>
        ))}
      </nav>
    </div>
  )
}
