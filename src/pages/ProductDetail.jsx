import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS, getProduct } from '../data/products'
import { getApp } from '../data/content'
import Media from '../components/Media'
import CobotViewer from '../components/CobotViewer'
import { Page, Reveal, Lines, ease } from '../components/motion'
import { Arrow, Btn, Label, SectionHead, TBC } from '../components/ui'

function Lightbox({ items, index, onClose, onMove }) {
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onMove(1); if (e.key === 'ArrowLeft') onMove(-1) }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose, onMove])
  const it = items[index]
  return (
    <motion.div className="lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.figure key={index} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease }} onClick={(e) => e.stopPropagation()}>
        <div className="lb-m"><Media src={it.src} label={it.caption} fit="contain" controls={/\.mp4$/.test(it.src)} /></div>
        <figcaption className="mono">{it.caption} <span>{index + 1} / {items.length}</span></figcaption>
      </motion.figure>
      <button className="lb-btn prev" onClick={(e) => { e.stopPropagation(); onMove(-1) }} aria-label="Previous">‹</button>
      <button className="lb-btn next" onClick={(e) => { e.stopPropagation(); onMove(1) }} aria-label="Next">›</button>
      <button className="lb-close" onClick={onClose} aria-label="Close">×</button>
    </motion.div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const p = getProduct(slug)
  const [lb, setLb] = useState(null)
  if (!p) return <Navigate to="/products" replace />
  const i = PRODUCTS.indexOf(p)
  const next = PRODUCTS[(i + 1) % PRODUCTS.length]
  const gallery = p.media.gallery || []
  let n = 0
  const num = () => String(++n).padStart(2, '0')

  return (
    <Page>
      <section className="pd-hero">
        <div className="wrap pd-hero-t">
          <Link to="/products" className="crumb mono">← All products</Link>
          <Reveal><Label>{String(i + 1).padStart(2, '0')} · {p.family}</Label></Reveal>
          <Lines lines={[p.name]} className="pd-name" />
          <div className="pd-hero-row">
            <Reveal delay={0.25}><p className="lede">{p.tagline}</p></Reveal>
            <Reveal delay={0.35} className="row">
              <Btn to={`/contact?product=${p.slug}`}>Request a demo</Btn>
              {p.brochure && <Btn href={p.brochure} kind="ghost" download>Brochure</Btn>}
            </Reveal>
          </div>
        </div>
        <motion.div className="pd-stage stage" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2, ease }}>
          <Media src={p.media.cover} label={p.name} fit="contain" />
        </motion.div>
        <div className="wrap spec-strip">
          {p.keyFacts.map((f) => <div key={f.label}><span className="mono muted">{f.label}</span><b>{f.value || <TBC />}</b></div>)}
          {p.bestFor && <div><span className="mono muted">Best for</span><b>{p.bestFor}</b></div>}
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <Reveal><Label n={num()}>Overview</Label></Reveal>
          <Reveal><p className="statement">{p.summary}</p></Reveal>
          <div className="highlights">
            {p.highlights.map((h, k) => (
              <Reveal key={h.title} delay={k * 0.06} className="hl">
                <span className="mono muted">{String(k + 1).padStart(2, '0')}</span>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {p.media.model && (
        <section className="sec interactive">
          <div className="wrap"><SectionHead n={num()} label="Interactive model" title={['Take the controls.']} sub="Drag to orbit. Drive each joint with the sliders or pick a pose." /></div>
          <Reveal className="wrap-bleed"><CobotViewer key={p.slug} src={p.media.model} name={p.name} /></Reveal>
        </section>
      )}

      {p.media.video && (
        <section className="pd-video">
          <div className="wrap"><Label n={num()}>In action</Label></div>
          <Reveal className="pd-video-m"><Media src={p.media.video} poster={p.media.poster} label={`${p.name} in action`} /></Reveal>
        </section>
      )}

      <section className="sec">
        <div className="wrap">
          <SectionHead n={num()} label="Specifications" title={['The numbers.']} sub="From the Nextup product booklet. Ask us for the full data sheet for your application." />
          <div className="specs">
            {p.specs.map((g) => (
              <Reveal key={g.group} className="spec-g">
                <h3 className="mono">{g.group}</h3>
                <dl>{g.items.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value ? `${s.value}${s.unit ? ' ' + s.unit : ''}` : <TBC />}</dd></div>)}</dl>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {p.motion && (
        <section className="sec">
          <div className="wrap">
            <SectionHead n={num()} label="Range of motion" title={['Six axes.', <span className="muted">Every one measured.</span>]} sub="Range and top speed for each joint. The sliders in the 3D model above use the same limits." />
            <Reveal className="compare-wrap">
              <table className="compare motion-t">
                <thead><tr><th>Axis</th><th>Joint</th><th>Range</th><th>Top speed</th></tr></thead>
                <tbody>
                  {p.motion.map((m) => {
                    const deg = parseFloat(m.range.replace(/[^0-9.]/g, ''))
                    return (
                      <tr key={m.axis}>
                        <td className="mono">{m.axis}</td>
                        <td>{m.part}</td>
                        <td>{m.range}<span className="motion-bar" aria-hidden="true"><i style={{ width: `${(deg / 360) * 100}%`, marginLeft: `-${(deg / 720) * 100}%` }} /></span></td>
                        <td>{m.speed}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>
      )}

      <section className="sec">
        <div className="wrap">
          <SectionHead n={num()} label="Applications" title={['Where it works.']} />
          <div className="chips big">
            {p.applications.map((s) => { const a = getApp(s); return a && <Link key={s} to={`/applications/${s}`}>{a.name} <Arrow size={14} /></Link> })}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <Label n={num()}>Gallery</Label>
            <div className="gallery">
              {gallery.map((g, k) => (
                <Reveal key={g.src + k} delay={k * 0.06}>
                  <button className="g-item stage" onClick={() => setLb(k)} aria-label={`Open ${g.caption}`}>
                    <Media src={g.src} label={g.caption} fit={/\.mp4$/.test(g.src) ? 'cover' : 'contain'} />
                    <span className="mono">{g.caption}</span>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Link to={`/products/${next.slug}`} className="next-p wrap">
        <span className="mono muted">Next product</span>
        <span className="next-n">{next.name} <Arrow size={40} /></span>
      </Link>

      <AnimatePresence>
        {lb !== null && <Lightbox items={gallery} index={lb} onClose={() => setLb(null)} onMove={(d) => setLb((lb + d + gallery.length) % gallery.length)} />}
      </AnimatePresence>
    </Page>
  )
}
