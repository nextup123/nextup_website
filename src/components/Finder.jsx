import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { APPS } from '../data/content'
import { PRODUCTS } from '../data/products'
import Media from './Media'
import { Arrow } from './ui'
import { ease } from './motion'

/* "What do you want to automate?" Pick a task, see the products that fit.
   Matches come from each product's `applications` list in products.js. */
export default function Finder() {
  const [sel, setSel] = useState(APPS[0].slug)
  const app = APPS.find((a) => a.slug === sel)
  const matches = PRODUCTS.filter((p) => p.applications.includes(sel))
  return (
    <div className="finder">
      <div className="finder-opts" role="radiogroup" aria-label="Pick a task">
        {APPS.map((a, i) => (
          <button key={a.slug} role="radio" aria-checked={sel === a.slug} className={sel === a.slug ? 'on' : ''} onClick={() => setSel(a.slug)}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            <span className="t">{a.name}</span>
            {sel === a.slug && <motion.span layoutId="finder-bar" className="finder-bar" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
          </button>
        ))}
      </div>
      <div className="finder-a">
        <AnimatePresence mode="wait">
          <motion.div key={sel} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease }}>
            <p className="finder-blurb">{app.blurb}</p>
            <p className="mono muted">Recommended ({matches.length})</p>
            <div className="finder-list">
              {matches.map((p) => (
                <Link key={p.slug} to={`/products/${p.slug}`} className="finder-item">
                  <div className="fi-m stage"><Media src={p.media.cover} label={p.name} fit="contain" /></div>
                  <div><b>{p.name}</b><small>{p.tagline}</small></div>
                  <Arrow />
                </Link>
              ))}
              {!matches.length && <p className="muted">Talk to us, we build custom cells for this.</p>}
            </div>
            <Link to={`/applications/${app.slug}`} className="textlink">More about {app.name.toLowerCase()} <Arrow size={14} /></Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
