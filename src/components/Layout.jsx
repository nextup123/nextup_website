import { useEffect, useLayoutEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { PRODUCTS } from '../data/products'
import { APPS, SITE } from '../data/content'
import { useTheme } from '../theme'
import { Logo, Arrow, Btn } from './ui'

const LINKS = [
  ['/products', 'Products'],
  ['/applications', 'Applications'],
  ['/projects', 'Projects'],
  ['/about', 'Company'],
]

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button className="tt" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}>
      <span className="tt-track"><motion.span className="tt-knob" layout transition={{ type: 'spring', stiffness: 500, damping: 34 }} style={{ marginLeft: dark ? 'auto' : 0 }}>
        {dark ? (
          <svg viewBox="0 0 16 16" width="12" height="12"><path d="M13.5 9.6A5.6 5.6 0 0 1 6.4 2.5a5.6 5.6 0 1 0 7.1 7.1Z" fill="currentColor" /></svg>
        ) : (
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3" /><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M3 13l1.1-1.1M11.9 4.1 13 3" /></svg>
        )}
      </motion.span></span>
    </button>
  )
}

export function Nav() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  // Over the home page's video hero the bar is transparent with light text.
  const overHero = pathname === '/' && !scrolled && !open
  return (
    <>
      <header className={'nav' + (overHero ? ' on-hero' : '') + (scrolled ? ' solid' : '') + (open ? ' open' : '')}>
        <div className="nav-in">
          <Link to="/" className="nav-logo" aria-label="Nextup Robotics home"><Logo /></Link>
          <nav className="nav-links" aria-label="Main">
            {LINKS.map(([to, l]) => (
              <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'on' : '')}>{l}</NavLink>
            ))}
          </nav>
          <div className="nav-r">
            <ThemeToggle />
            <Link to="/contact" className="nav-cta">Book a demo</Link>
            <button className="burger" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
              <i /><i />
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}>
            <nav>
              {[...LINKS, ['/contact', 'Contact']].map(([to, l], i) => (
                <motion.div key={to} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  <Link to={to}><span className="mono">0{i + 1}</span>{l}</Link>
                </motion.div>
              ))}
            </nav>
            <div className="menu-foot mono"><a href={`tel:+${SITE.phone}`}>{SITE.phoneLabel}</a><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const ic = (d) => <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d={d} /></svg>
const SOCIAL_ICONS = {
  YouTube: ic('M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-3.2.5-4.8s-.1-3.2-.5-4.8ZM9.7 15V9l5.8 3-5.8 3Z'),
  LinkedIn: ic('M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.7-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.1H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z'),
  Facebook: ic('M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z'),
  Instagram: ic('M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1ZM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9Z'),
  X: ic('M18.2 2.3h3.4l-7.4 8.4 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9L.8 2.3h7l4.8 6.4 5.6-6.4Zm-1.2 17.9h1.9L7 4.2H5l12 16Z'),
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-cta">
          <h2>Let’s automate<br /><span className="muted">your line.</span></h2>
          <div className="foot-cta-r">
            <p className="lede">Tell us the task. We’ll come back with a layout, a robot and a payback estimate.</p>
            <div className="row"><Btn to="/contact">Book a demo</Btn><Btn href={`https://wa.me/${SITE.phone}`} target="_blank" rel="noreferrer" kind="ghost">WhatsApp</Btn></div>
          </div>
        </div>
        <div className="foot-grid">
          <div>
            <p className="mono muted">Products</p>
            {PRODUCTS.map((p) => <Link key={p.slug} to={`/products/${p.slug}`}>{p.name}</Link>)}
          </div>
          <div>
            <p className="mono muted">Applications</p>
            {APPS.map((a) => <Link key={a.slug} to={`/applications/${a.slug}`}>{a.name}</Link>)}
          </div>
          <div>
            <p className="mono muted">Company</p>
            <Link to="/about">About</Link><Link to="/projects">Projects</Link><Link to="/payback">Payback calculator</Link><Link to="/contact">Contact</Link>
          </div>
          <div>
            <p className="mono muted">Reach us</p>
            <a href={`tel:+${SITE.phone}`}>{SITE.phoneLabel}</a>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            {SITE.offices.map((o) => <span key={o.label} className="addr"><b>{o.label}</b> {o.lines.join(' ')}</span>)}
          </div>
        </div>
        <div className="foot-mega" aria-hidden="true">NEXTUP</div>
        <div className="foot-base mono">
          <span>© {year} {SITE.name}</span>
          <span className="social">{SITE.social.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer" aria-label={`Nextup Robotics on ${n}`}>{SOCIAL_ICONS[n]}<span>{n}</span></a>)}</span>
          <span>Engineered in {SITE.city}</span>
        </div>
      </div>
    </footer>
  )
}

/* Every navigation lands at the top of the new page. Runs before paint, jumps instantly
   (the site uses smooth scrolling for in-page anchors, which must not apply here), and
   turns off the browser's own restore, which would otherwise keep the old scroll position. */
export function ScrollTop() {
  const { pathname, hash } = useLocation()
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])
  useLayoutEffect(() => {
    if (hash) return // in-page anchor links (e.g. /#cobot-3d) handle themselves
    // 'instant' overrides the CSS smooth scrolling, which otherwise animates (and can be cut short)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })
  return <motion.div className="progress" style={{ scaleX: x }} />
}

export function WhatsAppFab() {
  return (
    <a className="fab" href={`https://wa.me/${SITE.phone}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
    </a>
  )
}
