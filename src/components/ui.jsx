import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Media from './Media'
import { Reveal, Lines } from './motion'

export const Arrow = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" /></svg>
)
export const show = (v) => (v === null || v === undefined || v === '' ? null : v)
export const TBC = () => <span className="tbc">To be confirmed</span>

/* Brand mark redrawn as a vector from the logo (four linked nodes forming an N),
   so it stays sharp and works on both light and dark backgrounds. */
export function Mark({ size = 34 }) {
  return (
    <svg width={size} height={size / 2} viewBox="0 0 82 41" aria-hidden="true" className="mark">
      <defs>
        <linearGradient id="nx-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1A9BE3" /><stop offset="1" stopColor="#2457B0" />
        </linearGradient>
      </defs>
      <g fill="url(#nx-g)" stroke="url(#nx-g)" strokeWidth="7" strokeLinecap="round">
        <path d="M10 31 30 10 51 31 72 10" fill="none" />
        <circle cx="10" cy="31" r="8" stroke="none" /><circle cx="30" cy="10" r="8" stroke="none" />
        <circle cx="51" cy="31" r="8" stroke="none" /><circle cx="72" cy="10" r="8" stroke="none" />
      </g>
    </svg>
  )
}
export function Logo() {
  return <span className="logo"><Mark /><span className="wordmark">Nextup<b>Robotics</b></span></span>
}

/* Small mono label used above every section: "01 — Products" */
export function Label({ n, children, className = '' }) {
  return <p className={'label mono ' + className}>{n && <span className="n">{n}</span>}<span>{children}</span></p>
}

export function SectionHead({ n, label, title, sub, children }) {
  return (
    <div className="shead">
      <Reveal><Label n={n}>{label}</Label></Reveal>
      <div className="shead-row">
        <Lines as="h2" lines={[].concat(title)} inView />
        {(sub || children) && <Reveal delay={0.15} className="shead-side">{sub && <p className="lede">{sub}</p>}{children}</Reveal>}
      </div>
    </div>
  )
}

export function PageHead({ label, title, sub, children }) {
  return (
    <header className="phead wrap">
      <Reveal><Label>{label}</Label></Reveal>
      <Lines as="h1" lines={[].concat(title)} />
      {(sub || children) && (
        <Reveal delay={0.3} className="phead-sub">{sub && <p className="lede">{sub}</p>}{children}</Reveal>
      )}
    </header>
  )
}

export function Btn({ to, href, children, kind = '', ...rest }) {
  const inner = <><span>{children}</span><i><Arrow size={14} /></i></>
  const cls = 'btn ' + kind
  if (to) return <Link className={cls} to={to} {...rest}>{inner}</Link>
  return <a className={cls} href={href} {...rest}>{inner}</a>
}

export function ProductCard({ p, index }) {
  return (
    <Link to={`/products/${p.slug}`} className="pcard">
      <div className="pcard-m stage"><Media src={p.media.cover} label={p.name} fit="contain" /></div>
      <div className="pcard-b">
        <span className="mono muted">{String(index + 1).padStart(2, '0')} · {p.family}</span>
        <h3>{p.name}</h3>
        <p>{p.tagline}</p>
        <span className="more mono">Explore <Arrow size={13} /></span>
      </div>
    </Link>
  )
}
