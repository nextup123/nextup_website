import { motion } from 'framer-motion'
import { PLATFORM, SECTORS } from '../data/content'
import Media from './Media'
import { Reveal, ease } from './motion'
import { SectionHead } from './ui'

/* Booklet content: "Automation built around your process", the control software, the complete
   automation system and the industries served. Copy and photos live in content.js (PLATFORM, SECTORS). */
export default function Platform({ n = '05' }) {
  const { software: sw, system: sy } = PLATFORM
  return (
    <section className="sec platform">
      <div className="wrap">
        <SectionHead n={n} label="Built around your process" title={['A system,', <span className="muted">not a robot in a box.</span>]}
          sub="Every robot or cobot is deployed as part of a complete automation system that considers the process, machine interfaces, tooling, safety and operator workflow from the start. Automation fits your factory instead of forcing changes to proven lines." />

        <div className="feat">
          <Reveal className="feat-m">
            <motion.div className="feat-img" initial={{ scale: 1.08 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.4, ease }}>
              <Media src={sw.image} label={sw.caption} fit="contain" />
            </motion.div>
            <span className="feat-cap mono">{sw.caption}</span>
          </Reveal>
          <div className="feat-t">
            <Reveal><span className="mono muted">Control and programming</span></Reveal>
            <Reveal><h3 className="feat-h">{sw.title}</h3></Reveal>
            <Reveal><p className="lede">{sw.text}</p></Reveal>
            <dl className="feat-pts">
              {sw.points.map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.06}><dt>{t}</dt><dd>{d}</dd></Reveal>
              ))}
            </dl>
          </div>
        </div>

        <div className="feat rev">
          <Reveal className="feat-m">
            <motion.div className="feat-img" initial={{ scale: 1.08 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.4, ease }}>
              <Media src={sy.image} poster={sy.poster} label={sy.caption} />
            </motion.div>
            <span className="feat-cap mono">{sy.caption}</span>
          </Reveal>
          <div className="feat-t">
            <Reveal><span className="mono muted">Complete automation system</span></Reveal>
            <Reveal><h3 className="feat-h">{sy.title}</h3></Reveal>
            <Reveal><p className="lede">{sy.text}</p></Reveal>
            <Reveal className="feat-list">
              <p className="mono muted">Always included</p>
              <div className="chips">{sy.core.map((c) => <span key={c} className="on">{c}</span>)}</div>
            </Reveal>
            <Reveal className="feat-list">
              <p className="mono muted">Added as your process needs</p>
              <div className="chips">{sy.options.map((c) => <span key={c}>{c}</span>)}</div>
            </Reveal>
          </div>
        </div>

        <div className="sectors-head"><span className="mono muted">Industries we serve</span></div>
        <ol className="sectors">
          {SECTORS.map((name, i) => (
            <Reveal as="li" key={name} delay={i * 0.06} className="sector">
              <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
              <h4>{name}</h4>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
