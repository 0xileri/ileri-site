import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './hooks.js'

const EASE_OUT = (t) => 1 - Math.pow(1 - t, 3)

export function parseStat(value) {
  const m = String(value).match(/^(.*?)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!m) return { prefix: '', target: 0, decimals: 0, grouped: false, suffix: value }
  const raw = m[2]
  const dec = raw.includes('.') ? raw.split('.')[1].length : 0
  return {
    prefix: m[1],
    target: parseFloat(raw.replace(/,/g, '')),
    decimals: dec,
    grouped: raw.includes(','),
    suffix: m[3],
  }
}

export function formatStat(parsed, t) {
  const n = parsed.target * t
  let body
  if (parsed.grouped) body = Math.round(n).toLocaleString('en-US')
  else if (parsed.decimals) body = n.toFixed(parsed.decimals)
  else body = String(Math.round(n))
  return `${parsed.prefix}${body}${parsed.suffix}`
}

/** Count up to the given formatted value when the element enters view. 0.95s. */
export function CountUp({ value }) {
  const ref = useRef(null)
  const [text, setText] = useState(value)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setText(value)
      return
    }
    const parsed = parseStat(value)
    setText(formatStat(parsed, 0))
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setText(value)
      return
    }
    let raf = 0
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 950)
        setText(formatStat(parsed, EASE_OUT(t)))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value])

  return <strong ref={ref}>{text}</strong>
}

/**
 * Observe .reveal nodes and add .is-in once, with an 0.08s stagger
 * for items that enter in the same frame. No retrigger.
 */
export function useReveal(rootSelector = '.feed', itemSelector = '.reveal') {
  useEffect(() => {
    const reduce = prefersReducedMotion()
    const root = document.querySelector(rootSelector) || document.body
    const reveal = (el, delay = 0) => {
      if (el.classList.contains('is-in')) return
      if (delay) el.style.setProperty('--reveal-delay', `${delay}s`)
      el.classList.add('is-in')
    }
    const all = () => [...root.querySelectorAll(itemSelector)]
    if (reduce || !('IntersectionObserver' in window)) {
      all().forEach((el) => reveal(el))
      return
    }
    let pending = []
    let flush = 0
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        pending.push(entry.target)
        io.unobserve(entry.target)
      })
      if (!flush && pending.length) {
        flush = requestAnimationFrame(() => {
          pending.forEach((el, i) => reveal(el, i * 0.08))
          pending = []
          flush = 0
        })
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' })
    const watch = () => {
      all().forEach((el) => { if (!el.classList.contains('is-in')) io.observe(el) })
    }
    watch()
    // Anything the visitor scrolled past quickly (never intersected) still shows.
    const catchUp = () => {
      all().forEach((el) => {
        if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < window.innerHeight) { io.unobserve(el); reveal(el) }
      })
    }
    window.addEventListener('scroll', catchUp, { passive: true })
    const mo = new MutationObserver(watch)
    mo.observe(root, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect(); cancelAnimationFrame(flush); window.removeEventListener('scroll', catchUp) }
  }, [rootSelector, itemSelector])
}

/** Vertical progress beam for the receipts list. CSS scroll-driven, IO/scroll fallback. */
export function ReceiptsTrack({ children }) {
  const ref = useRef(null)
  const fillRef = useRef(null)

  useEffect(() => {
    const root = ref.current
    const fill = fillRef.current
    if (!root || !fill) return
    const reduce = prefersReducedMotion()
    const supports = !reduce && typeof CSS !== 'undefined' && CSS.supports
      && (CSS.supports('animation-timeline', 'view()') || CSS.supports('animation-timeline: view()'))
    if (supports) fill.classList.add('sda')
    if (reduce) {
      fill.style.transform = 'scaleY(1)'
      root.querySelectorAll('.receipt-dot').forEach((d) => d.classList.add('on'))
      return
    }
    const update = () => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.75
      const end = vh * 0.45
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (rect.height + start - end || 1)))
      if (!supports) fill.style.transform = `scaleY(${progress})`
      root.querySelectorAll('.receipt-dot').forEach((dot) => {
        const mid = (dot.getBoundingClientRect().top + dot.getBoundingClientRect().height / 2) - rect.top
        const rel = mid / (rect.height || 1)
        dot.classList.toggle('on', progress >= rel - 0.005)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const mo = new MutationObserver(update)
    mo.observe(root, { childList: true, subtree: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      mo.disconnect()
    }
  }, [children])

  return (
    <div className="receipts-list" ref={ref}>
      <span className="receipts-beam" aria-hidden="true">
        <span className="receipts-beam-track" />
        <span className="receipts-beam-fill" ref={fillRef} />
      </span>
      {children}
    </div>
  )
}
