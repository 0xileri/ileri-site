import { useEffect, useRef, useState } from 'react'
import { BG_VIDEO } from './data.js'
import { prefersReducedMotion, saveData } from './hooks.js'

// Color scenes. Every few seconds the blobs crossfade to the next scene.
const SCENES = [
  ['#0a3cff', '#7b2cff', '#00d4ff', '#ff2d95', '#ffb020'],
  ['#ff2d95', '#ff7a00', '#7b2cff', '#00e5c0', '#1a2cff'],
  ['#00d4ff', '#00ffa3', '#2b5cff', '#f5b734', '#c026ff'],
  ['#ffb020', '#ff3d5a', '#ff2d95', '#3a1cff', '#00b3ff'],
]
const HOLD = 3200 // ms a scene holds before switching
const FADE = 1400 // ms crossfade

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const RGB = SCENES.map((s) => s.map(hex))
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Pick the background video source, or null to keep the canvas motion background.
// Desktop on a good connection gets the full encode; phones get the small one.
function pickVideo() {
  if (!BG_VIDEO.enabled || prefersReducedMotion() || saveData()) return null
  const small = window.matchMedia('(max-width: 700px)').matches
  if (small) return BG_VIDEO.mobile ? { mp4: BG_VIDEO.mobile } : null
  return { webm: BG_VIDEO.webm, mp4: BG_VIDEO.mp4 }
}

function BgVideo({ onPlaying }) {
  const ref = useRef(null)
  const [src, setSrc] = useState(null)
  const [on, setOn] = useState(false)
  // Wait until after first paint so the 1MB loop does not fight the banner for LCP.
  useEffect(() => {
    const picked = pickVideo()
    if (!picked) return
    let idle, t
    const start = () => setSrc(picked)
    const afterLoad = () => {
      if (typeof requestIdleCallback === 'function') idle = requestIdleCallback(start, { timeout: 1800 })
      else t = setTimeout(start, 800)
    }
    if (document.readyState === 'complete') afterLoad()
    else window.addEventListener('load', afterLoad, { once: true })
    return () => {
      window.removeEventListener('load', afterLoad)
      if (idle && typeof cancelIdleCallback === 'function') cancelIdleCallback(idle)
      clearTimeout(t)
    }
  }, [])
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const onVis = () => { if (document.hidden) v.pause(); else v.play().catch(() => {}) }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [src])
  if (!src) return null
  return (
    <video
      ref={ref}
      className={`bg-video${on ? ' on' : ''}`}
      muted autoPlay loop playsInline preload="metadata" poster={BG_VIDEO.poster}
      onPlaying={() => { setOn(true); onPlaying() }}
      aria-hidden="true" tabIndex={-1}
    >
      {src.webm && <source src={src.webm} type="video/webm" />}
      {src.mp4 && <source src={src.mp4} type="video/mp4" />}
    </video>
  )
}

export default function Background() {
  const ref = useRef(null)
  const stopRef = useRef(() => {})
  const [videoOn, setVideoOn] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 700px)').matches
    const blobs = small ? 4 : 5
    const scale = small ? 0.12 : 0.18 // draw small, CSS scales it up: soft glow for free
    const frameGap = small ? 1000 / 30 : 0
    let w = 0, h = 0, raf = 0, last = 0, running = true
    const start = performance.now()

    const seeds = Array.from({ length: blobs }, (_, i) => ({
      ax: 0.3 + Math.random() * 0.35, ay: 0.25 + Math.random() * 0.35,
      sx: 0.00007 + Math.random() * 0.00009, sy: 0.00006 + Math.random() * 0.0001,
      px: Math.random() * 6.28, py: Math.random() * 6.28,
      r: 0.45 + (i % 3) * 0.12,
    }))

    const resize = () => {
      w = Math.max(32, Math.round(window.innerWidth * scale))
      h = Math.max(32, Math.round(window.innerHeight * scale))
      canvas.width = w
      canvas.height = h
    }

    const draw = (now) => {
      const t = Math.max(0, now - start)
      const cycle = HOLD + FADE
      const idx = Math.floor(t / cycle) % RGB.length
      const into = t % cycle
      const mix = into < HOLD ? 0 : ease((into - HOLD) / FADE)
      const a = RGB[idx], b = RGB[(idx + 1) % RGB.length]
      // brightness pulse at each switch, the HDR flash
      const flash = mix > 0 && mix < 1 ? Math.sin(mix * Math.PI) * 0.18 : 0

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      const m = Math.max(w, h)
      for (let i = 0; i < blobs; i++) {
        const s = seeds[i]
        const x = w * (0.5 + Math.sin(t * s.sx + s.px) * s.ax)
        const y = h * (0.5 + Math.cos(t * s.sy + s.py) * s.ay)
        const r = m * s.r * (1 + Math.sin(t * 0.0004 + i) * 0.08)
        const c = a[i].map((v, k) => Math.round(v + (b[i][k] - v) * mix))
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${0.62 + flash})`)
        g.addColorStop(0.45, `rgba(${c[0]},${c[1]},${c[2]},${0.22 + flash / 2})`)
        g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      if (frameGap && now - last < frameGap) return
      last = now
      draw(now)
    }

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf) }
      else if (!running && !reduce) { running = true; raf = requestAnimationFrame(loop) }
    }

    stopRef.current = () => { running = false; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis) }
    resize()
    if (reduce) draw(start)
    else raf = requestAnimationFrame(loop)
    const onResize = () => { resize(); if (reduce) draw(performance.now()) }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div className={`bg${videoOn ? ' bg-has-video' : ''}`} aria-hidden="true">
      <canvas ref={ref} className="bg-canvas" />
      <BgVideo onPlaying={() => { if (!videoOn) { setVideoOn(true); setTimeout(() => stopRef.current(), 1200) } }} />
      <div className="bg-shade" />
      <div className="bg-vignette" />
      <div className="bg-grain" />
    </div>
  )
}
