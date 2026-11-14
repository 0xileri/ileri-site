import {
  X_URL, AVATAR, stats, ecosystems, services, packages, oneOff, steps,
  featured, builds, wins, receipts, roles, contacts,
} from './data.js'

const ext = { target: '_blank', rel: 'noopener noreferrer' }

function Arrow() {
  return (
    <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SectionHead({ n, kicker, title, sub }) {
  return (
    <header className="section-head">
      <p className="eyebrow"><span>{n}</span> {kicker}</p>
      <h2>{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </header>
  )
}

function Nav() {
  return (
    <nav className="nav" aria-label="Main">
      <div className="nav-inner">
        <a href="#top" className="logo">ILERI<span>.</span></a>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#packages">Packages</a>
          <a href="#proof">Proof</a>
          <a href="#how">How it works</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="btn btn-solid btn-sm" href={X_URL} {...ext}>DM on X</a>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <p className="pill">DMs open · Growth · KOLs · Community · AI video</p>
          <h1>
            Building something early?<br />
            <em>Let's get it seen.</em>
          </h1>
          <p className="lead">
            I help early AI and crypto projects grow on X. Posts on my page, KOL pushes through creators I manage,
            a community set up the right way, and AI videos for your launch.
          </p>
          <p className="lead small">
            I build too, with hackathon wins and shipped projects of my own, so I get what you're working on.
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href={X_URL} {...ext}>DM me on X <Arrow /></a>
            <a className="btn btn-line" href="#packages">See packages</a>
          </div>
        </div>
        <aside className="card id-card">
          <div className="id-top">
            <img src={AVATAR} alt="ileri's profile picture" width="72" height="72" />
            <div>
              <p className="id-name">ileri</p>
              <a className="id-handle" href={X_URL} {...ext}>@0xileri</a>
            </div>
          </div>
          <ul className="stats">
            {stats.map((s) => (
              <li key={s.label}><strong>{s.value}</strong><span>{s.label}</span></li>
            ))}
          </ul>
        </aside>
      </div>
      <div className="marquee" aria-label="Ecosystems I've worked with or won in">
        <div className="marquee-track">
          {[...ecosystems, ...ecosystems].map((e, i) => <span key={i} aria-hidden={i >= ecosystems.length}>{e}</span>)}
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <SectionHead n="01" kicker="Services" title="What I do for your project" sub="Four things. Pick one, or stack them into one campaign." />
        <div className="grid-4">
          {services.map((s) => (
            <article className="card service" key={s.n}>
              <p className="num">{s.n}</p>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <ul className="tags">{s.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              {s.link && <a className="text-link" href={s.link.href} {...ext}>{s.link.label} <Arrow /></a>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Packages() {
  return (
    <section className="section deep" id="packages">
      <div className="wrap">
        <SectionHead n="02" kicker="Packages" title="Monthly packages" sub="Prices in USD, billed monthly. Want something smaller? One-off work is below." />
        <div className="grid-3">
          {packages.map((p) => (
            <article className={`card plan${p.featured ? ' plan-featured' : ''}`} key={p.name}>
              <h3>{p.name}</h3>
              <p className="price"><strong>{p.price}</strong><span>/month</span></p>
              <ul className="checks">{p.items.map((i) => <li key={i}>{i}</li>)}</ul>
              <a className={`btn ${p.featured ? 'btn-solid' : 'btn-line-light'}`} href={X_URL} {...ext}>Ask about {p.name}</a>
            </article>
          ))}
        </div>
        <div className="oneoff">
          <div>
            <h3>One-off</h3>
            <p>Just need a single post or a video? That works too.</p>
          </div>
          <ul>
            {oneOff.map((o) => (
              <li key={o.item}><span>{o.item}</span><strong>{o.price}</strong></li>
            ))}
          </ul>
        </div>
        <p className="token-note">Very early team? I'm open to part cash, part tokens.</p>
      </div>
    </section>
  )
}

function Proof() {
  return (
    <section className="section" id="proof">
      <div className="wrap">
        <SectionHead n="03" kicker="Proof" title="The receipts" sub="Wins from open campaigns and hackathons, judged against everyone else who entered. Each one links to the public post." />

        <div className="grid-3">
          {featured.map((f) => (
            <a className="card win" key={f.name} href={f.href} {...ext}>
              <img src={f.img} alt={`${f.name} ${f.badge} announcement`} loading="lazy" />
              <div className="win-body">
                <p className="kicker">{f.kicker}</p>
                <h3>{f.name} <span className="badge">{f.badge}</span></h3>
                <p>{f.body}</p>
              </div>
            </a>
          ))}
        </div>

        <h3 className="sub-title">Stuff I've shipped</h3>
        <p className="section-sub">Projects I built and shipped myself. Click through to check them.</p>
        <div className="grid-4">
          {builds.map((b) => (
            <article className="card build" key={b.name}>
              <p className="kicker">{b.tag}</p>
              <h3>{b.name}</h3>
              <p>{b.body}</p>
              <a className="text-link" href={b.href} {...ext}>{b.cta} <Arrow /></a>
            </article>
          ))}
        </div>

        <h3 className="sub-title">Full list</h3>
        <ol className="index">
          {wins.map((w, i) => (
            <li key={w.name}>
              <a href={w.href} {...ext}>
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="idx-name">{w.name}</span>
                <span className="idx-type">{w.type}</span>
                <span className="idx-result">{w.result}</span>
                <Arrow />
              </a>
            </li>
          ))}
        </ol>

        <div className="roles">
          <p>Current roles:</p>
          {roles.map((r) => <span key={r.name}><strong>{r.name}</strong> {r.role}</span>)}
        </div>

        <div className="gallery">
          {receipts.map((r) => (
            <a key={r.name} href={r.href} {...ext} className="shot">
              <img src={r.img} alt={`${r.name} ${r.label} screenshot`} loading="lazy" />
              <span><strong>{r.name}</strong> {r.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function How() {
  return (
    <section className="section soft" id="how">
      <div className="wrap">
        <SectionHead n="04" kicker="How it works" title="Pitch, plan, launch" />
        <div className="grid-3 steps">
          {steps.map((s) => (
            <article className="card step" key={s.n}>
              <p className="num">Step {s.n}</p>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="section deep contact" id="contact">
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow"><span>05</span> Contact</p>
          <h2>Got something early?<br /><em>Send me a DM.</em></h2>
          <p className="section-sub">Tell me what you're building and what you need. I'll tell you straight if I can help.</p>
          <a className="btn btn-solid" href={X_URL} {...ext}>DM me on X <Arrow /></a>
        </div>
        <ul className="contacts">
          {contacts.map((c) => (
            <li key={c.label}>
              <a href={c.href} {...(c.href.startsWith('http') ? ext : {})} className={c.primary ? 'primary' : ''}>
                <span>{c.label}</span><strong>{c.value}</strong>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Services />
        <Packages />
        <Proof />
        <How />
        <Contact />
      </main>
      <footer className="footer">
        <div className="wrap footer-inner">
          <a href="#top" className="logo">ILERI<span>.</span></a>
          <p>© 2026 ILERI · Growth, KOL campaigns and AI video for early AI and crypto projects</p>
          <a href="#top">Back to top</a>
        </div>
      </footer>
    </>
  )
}
