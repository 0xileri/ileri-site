import * as I from './icons.jsx'
import { getPost, formatDuration } from './posts-lib.js'

const ext = { target: '_blank', rel: 'noopener noreferrer' }

export function Linkify({ text }) {
  if (!text) return null
  const lines = text.split('\n')
  const tok = /(@[A-Za-z0-9_]+)|(https?:\/\/[^\s]+)|(#\w+)/g
  return (
    <p>
      {lines.map((line, i) => {
        const parts = []
        let last = 0
        let m
        const re = new RegExp(tok)
        while ((m = re.exec(line))) {
          if (m.index > last) parts.push(line.slice(last, m.index))
          const [full, mention, url, tag] = m
          if (mention) {
            parts.push(<a key={`${i}-${m.index}`} className="mention" href={`https://x.com/${mention.slice(1)}`} {...ext} onClick={(e) => e.stopPropagation()}>{mention}</a>)
          } else if (url) {
            const href = url.replace(/[.,!?)]+$/, '')
            const trail = url.slice(href.length)
            parts.push(<a key={`${i}-${m.index}`} className="mention" href={href} {...ext} onClick={(e) => e.stopPropagation()}>{href.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>)
            if (trail) parts.push(trail)
          } else if (tag) {
            parts.push(<a key={`${i}-${m.index}`} className="mention" href={`https://x.com/hashtag/${tag.slice(1)}`} {...ext} onClick={(e) => e.stopPropagation()}>{tag}</a>)
          }
          last = m.index + full.length
        }
        if (last < line.length) parts.push(line.slice(last))
        return <span key={i}>{i > 0 && <br />}{parts}</span>
      })}
    </p>
  )
}

function VerifiedMark() {
  return (
    <svg className="verified" width="16" height="16" viewBox="0 0 22 22" aria-label="Verified">
      <circle cx="11" cy="11" r="11" fill="currentColor" />
      <path d="m6.3 11.2 2.8 2.8 6.6-6.6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Head({ author, created }) {
  if (!author) return null
  return (
    <header className="x-embed-head">
      {author.avatar
        ? <img className="avatar" src={author.avatar} alt="" width="40" height="40" loading="lazy" decoding="async" />
        : <span className="avatar avatar-letter" style={{ width: 40, height: 40 }}>{(author.name || '?')[0]}</span>}
      <div className="x-embed-who">
        <span className="x-embed-name">
          <strong>{author.name}</strong>
          {author.verified && <VerifiedMark />}
        </span>
        <span className="dim">@{author.handle}{created ? ` · ${created}` : ''}</span>
      </div>
    </header>
  )
}

function Media({ media }) {
  if (!media?.length) return null
  const one = media.length === 1
  return (
    <div className={`x-embed-media${one ? ' one' : ''} count-${Math.min(media.length, 4)}`}>
      {media.slice(0, 4).map((m, i) => {
        const src = m.src || m.poster
        if (!src) return null
        const video = m.type === 'video' || m.type === 'gif'
        return (
          <span key={src + i} className="x-embed-shot">
            <img src={src} alt="" width={m.w} height={m.h} loading="lazy" decoding="async" />
            {video && (
              <>
                <span className="play" aria-hidden="true"><I.Play size={18} /></span>
                {m.duration ? <span className="vid-chip">{formatDuration(m.duration)}</span> : null}
              </>
            )}
          </span>
        )
      })}
    </div>
  )
}

function Article({ article }) {
  if (!article) return null
  return (
    <div className="x-article">
      {article.cover && <img src={article.cover} alt="" width={article.w} height={article.h} loading="lazy" decoding="async" />}
      <div className="x-article-body">
        <span className="article-tag"><I.Steps size={14} /> Article</span>
        {article.title && <h2>{article.title}</h2>}
        {article.preview && <p className="dim">{article.preview}</p>}
      </div>
    </div>
  )
}

function Quote({ quote }) {
  if (!quote) return null
  return (
    <div className="x-quote">
      <Head author={quote.author} created={quote.created} />
      {quote.text && <div className="x-embed-text compact"><Linkify text={quote.text} /></div>}
      <Article article={quote.article} />
      <Media media={quote.media} />
    </div>
  )
}

function Counts({ counts }) {
  if (!counts) return null
  return (
    <div className="x-embed-counts" aria-label={`${counts.replies} replies, ${counts.reposts} reposts, ${counts.likes} likes, ${counts.views} views`}>
      <span><I.Reply size={16} />{counts.replies}</span>
      <span><I.Repost size={16} />{counts.reposts}</span>
      <span><I.Heart size={16} />{counts.likes}</span>
      <span><I.Views size={16} />{counts.views}</span>
    </div>
  )
}

export default function XEmbed({ id, badge, href }) {
  const p = getPost(id)
  const url = (p && p.url) || href || (id ? `https://x.com/i/status/${id}` : '#')

  if (!p || !p.ok) {
    return (
      <article className="x-embed x-embed-missing">
        {badge && <span className="x-embed-badge">{badge}</span>}
        <a className="x-embed-hit" href={url} {...ext} aria-label="View this post on X" />
        <p>This post is unavailable on X right now.</p>
        <span className="inline-link">View on X <I.Ext /></span>
      </article>
    )
  }

  const label = `${p.author?.name || ''} on X${badge ? `, ${badge}` : ''}. View the original post`
  const long = (p.text || '').length > 280

  return (
    <article className="x-embed">
      {badge && <span className="x-embed-badge">{badge}</span>}
      <a className="x-embed-hit" href={p.url} {...ext} aria-label={label} />
      <Head author={p.author} created={p.created} />
      {p.text && <div className={`x-embed-text${long ? ' clamp' : ''}`}><Linkify text={p.text} />{long && <span className="show-post">Show more</span>}</div>}
      <Article article={p.article} />
      <Media media={p.media} />
      <Quote quote={p.quote} />
      <Counts counts={p.counts} />
    </article>
  )
}
