import { useEffect, useRef, useState } from 'react'
import { BG_VIDEO } from './data.js'
import { prefersReducedMotion } from './hooks.js'

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

// Play the seaport loop on any desktop and normal mobile unless the visitor
// asked for reduced motion or has data-saver on. Do not gate on effectiveType,
// deviceMemory, or a late idle callback — those hid the video on desktop Chrome.
export function pickVideo() {
  if (typeof window === 'undefined') return null
  if (!BG_VIDEO.enabled) return null
  if (prefersReducedMotion()) return null
  try {
    if (navigator.connection && navigator.connection.saveData) return null
  } catch { /* ignore */ }
  const small = window.matchMedia('(max-width: 700px)').matches
  if (small) return { mp4: BG_VIDEO.mobile || BG_VIDEO.mp4 }
  return { webm: BG_VIDEO.webm, mp4: BG_VIDEO.mp4 }
}

function BgVideo({ onShow, onPlaying }) {
  const ref = useRef(null)
  const pickedRef = useRef(null)
  if (pickedRef.current === null) pickedRef.current = pickVideo()
  const picked = pickedRef.current
  const [src, setSrc] = useState(null)
  const shown = useRef(false)
  const played = useRef(false)

  const markShow = () => {
    if (shown.current) return
    shown.current = true
    onShow()
  }
  const markPlay = () => {
    if (played.current) return
    played.current = true
    onPlaying()
  }

  useEffect(() => {
    if (!picked) return
    markShow()
    const id = requestAnimationFrame(() => setSrc(picked))
    return () => cancelAnimationFrame(id)
  }, [picked])

  useEffect(() => {
    const v = ref.current
    if (!v || !src) return
    const tryPlay = () => {
      const p = v.play()
      if (p && typeof p.then === 'function') p.then(markPlay).catch(() => {})
    }
    const onCanPlay = () => tryPlay()
    const onPlayingEv = () => markPlay()
    v.addEventListener('canplay', onCanPlay)
    v.addEventListener('playing', onPlayingEv)
    tryPlay()
    const onVis = () => { if (document.hidden) v.pause(); else tryPlay() }
    document.addEventListener('visibilitychange', onVis)
    const evs = ['pointerdown', 'keydown', 'touchstart', 'click']
    evs.forEach((e) => window.addEventListener(e, tryPlay, { passive: true }))
    return () => {
      v.removeEventListener('canplay', onCanPlay)
      v.removeEventListener('playing', onPlayingEv)
      document.removeEventListener('visibilitychange', onVis)
      evs.forEach((e) => window.removeEventListener(e, tryPlay))
    }
  }, [src])

  if (!picked) return null
  return (
    <>
      <img className="bg-video bg-poster" src={BG_VIDEO.poster} alt="" aria-hidden="true" />
      {src && (
        <video
          ref={ref}
          className="bg-video"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          poster={BG_VIDEO.poster}
          aria-hidden="true"
          tabIndex={-1}
        >
          {src.webm && <source src={src.webm} type="video/webm" />}
          {src.mp4 && <source src={src.mp4} type="video/mp4" />}
        </video>
      )}
    </>
  )
}

export default function Background() {
  const ref = useRef(null)
  const stopRef = useRef(() => {})
  const [hasVideo, setHasVideo] = useState(() => !!pickVideo())
  const [playing, setPlaying] = useState(false)

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
    <div className={`bg${hasVideo ? ' bg-has-video' : ''}${playing ? ' bg-video-playing' : ''}`} aria-hidden="true">
      <canvas ref={ref} className="bg-canvas" />
      <BgVideo
        onShow={() => setHasVideo(true)}
        onPlaying={() => { setPlaying(true); setTimeout(() => stopRef.current(), 1200) }}
      />
      <div className="bg-shade" />
      <div className="bg-vignette" />
      <div className="bg-grain" />
    </div>
  )
}
