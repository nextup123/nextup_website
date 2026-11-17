import { createContext, useContext, useEffect, useState } from 'react'

/* Light / dark theme. The visitor's choice is saved; until they choose, the site follows
   their operating system setting (and keeps following it if it changes). */
const Ctx = createContext({ theme: 'dark', toggle: () => {} })
const systemTheme = () => (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
const saved = () => { try { return localStorage.getItem('theme') } catch { return null } }

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || saved() || systemTheme())
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#07090c' : '#f4f5f7')
  }, [theme])
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: light)')
    const on = () => { if (!saved()) setTheme(systemTheme()) }
    mq?.addEventListener?.('change', on)
    return () => mq?.removeEventListener?.('change', on)
  }, [])
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    root.classList.add('theme-anim')
    setTimeout(() => root.classList.remove('theme-anim'), 500)
    try { localStorage.setItem('theme', next) } catch {}
    setTheme(next)
  }
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}
export const useTheme = () => useContext(Ctx)
