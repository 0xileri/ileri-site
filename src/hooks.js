import { useEffect, useState } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const saveData = () => {
  const c = typeof navigator !== 'undefined' && navigator.connection
  return !!(c && (c.saveData || /(^|-)2g$|^3g$/.test(c.effectiveType || '')))
}

const THEMES = ['dark', 'dim', 'light']
export const THEME_LABELS = { dark: 'Lights out', dim: 'Dim', light: 'Light' }

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { const t = localStorage.getItem('theme'); return THEMES.includes(t) ? t : 'dark' } catch { return 'dark' }
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = theme === 'light' ? '#ffffff' : theme === 'dim' ? '#15202b' : '#000000'
    try { localStorage.setItem('theme', theme) } catch { /* private mode */ }
  }, [theme])
  const cycle = () => setTheme(THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length])
  return { theme, setTheme, cycle, themes: THEMES }
}
