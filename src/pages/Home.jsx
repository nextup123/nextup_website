import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { PRODUCTS } from '../data/products'
import { APPS, PROJECTS, STATS, STEPS, RECOGNITION, SITE } from '../data/content'
import Media from '../components/Media'
import CobotViewer from '../components/CobotViewer'
import Platform from '../components/Platform'
import { useBootReady } from '../boot'
import { Page, Reveal, Counter, Lines, ScrollWords, ease } from '../components/motion'
import { SectionHead, Label, Arrow, Btn } from '../components/ui'

/* ── 1. Full-screen video hero. Clips in SITE.heroVideos play in turn. ───────────── */
function Hero() {
  const clips = SITE.heroVideos
  const ready = useBootReady()
  const [n, setN] = useState(0)
  const [prog, setProg] = useState(0)
  const ref = useRef(null)
  const sec = useRef(null)
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (ready && n === 0 && !v.dataset.started) { v.dataset.started = '1'; v.currentTime = 0 }
    v.play?.().catch(() => {})
  }, [n, ready])
  const c = clips[n]
  return (
    <section className="hero" ref={sec}>
      <motion.div className="hero-bg" style={{ y }}>
        <AnimatePresence mode="sync">
          <motion.video key={c.src} ref={ref} src={c.src} poster={c.poster} autoPlay muted playsInline loop={clips.length === 1}
            onTimeUpdate={(e) => setProg(e.target.currentTime / (e.target.duration || 1))}
            onEnded={() => setN((n + 1) % clips.length)}
            initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.4, ease }} />
        </AnimatePresence>
      </motion.div>
      <div className="hero-shade" />
      <motion.div className="hero-in wrap" style={{ opacity: fade }}>
        <motion.p className="label mono" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ delay: 0.2, duration: 1 }}>
          <span className="n">NX</span><span>Collaborative and industrial robotics · {SITE.city}</span>
        </motion.p>
        <Lines lines={['Precision,', <>in <em>motion.</em></>]} className="mega" delay={0.25} />
        <div className="hero-foot">
          <motion.p className="lede" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.9, duration: 0.9, ease }}>
            Robots that take on the repetitive, hazardous and precise work on your line. Engineered in India and supported on your floor within 24 hours.
          </motion.p>
          <motion.div className="row" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 1.05, duration: 0.9, ease }}>
            <Btn to="/contact">Book a demo</Btn>
            <Btn href="#cobot-3d" kind="ghost light">Explore the robots in 3D</Btn>
          </motion.div>
        </div>
      </motion.div>
      <div className="hero-hud wrap mono">
        <div className="clips">
          {clips.map((k, i) => (
            <button key={k.src} className={i === n ? 'on' : ''} onClick={() => setN(i)} aria-label={`Play clip: ${k.label}`}>
              <span className="t">0{i + 1} {k.label}</span>
              <span className="bar"><i style={{ transform: `scaleX(${i === n ? prog : i < n ? 1 : 0})` }} /></span>
            </button>
          ))}
        </div>
        <a href="#intro" className="scroll-cue">Scroll <span className="cue-line" /></a>
      </div>
    </section>
  )
}

/* ── 2. Statement with words that light up on scroll, plus stats ─────────────────── */
function Intro() {
  return (
    <section className="sec intro" id="intro">
      <div className="wrap">
        <Reveal><Label n="01">Why Nextup</Label></Reveal>
        <ScrollWords className="statement" text="We build robots for the work people shouldn’t have to do: the repetitive, the hazardous, the precise and the relentless. Then we stay on your floor until it runs." />
        <dl className="stats">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="stat">
              <dd><Counter to={s.value} suffix={s.suffix} /></dd>
              <dt className="mono">{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ── 3. Interactive 3D robots (every product with a `media.model`) ─────────────────── */
function Interactive() {
  const models = PRODUCTS.filter((p) => p.media.model)
  const [sel, setSel] = useState(0)
  if (!models.length) return null
  const p = models[sel]
  return (
    <section className="sec interactive" id="cobot-3d">
      <div className="wrap">
        <SectionHead n="02" label="Interactive models" title={['Meet the robots.', <span className="muted">Move them yourself.</span>]}
          sub="Built from our engineering files. Pick a robot, drag to orbit, hover a link to identify it, and drive each of its six joints." />
        {models.length > 1 && (
          <div className="model-tabs" role="tablist" aria-label="Choose a robot">
            {models.map((m, i) => (
              <button key={m.slug} role="tab" aria-selected={i === sel} className={i === sel ? 'on' : ''} onClick={() => setSel(i)}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>{m.name}
                {i === sel && <motion.i layoutId="model-tab" className="model-tab-bar" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
              </button>
            ))}
          </div>
        )}
      </div>
      <Reveal className="wrap-bleed"><CobotViewer key={p.slug} src={p.media.model} name={p.name} /></Reveal>
      <div className="wrap spec-strip">
        <div><span className="mono muted">Model</span><b>{p.name}</b></div>
        {p.keyFacts.map((f) => (
          <div key={f.label}><span className="mono muted">{f.label}</span><b>{f.value || 'To be confirmed'}</b></div>
        ))}
        <Link to={`/products/${p.slug}`} className="strip-link">Full {p.name} specs <Arrow /></Link>
      </div>
    </section>
  )
}

/* ── 4. Products as stacked full-width panels ─────────────────────────────────────── */
function Products() {
  return (
    <section className="sec products-home" id="products">
      <div className="wrap">
        <SectionHead n="03" label="Products" title={['One platform.', <span className="muted">Every kind of work.</span>]}
          sub="From the NexC5 cobot that works beside your people to the NexR industrial arms that run behind guarding. Same software, same integration, same team." />
      </div>
      <div className="stack wrap">
        {PRODUCTS.map((p, i) => (
          <article key={p.slug} className="stack-card" style={{ top: `calc(var(--nav-h) + 16px + ${i * 14}px)` }}>
            <div className="sc-t">
              <span className="mono muted">{String(i + 1).padStart(2, '0')} / {String(PRODUCTS.length).padStart(2, '0')} · {p.family}</span>
              <h3 className="sc-name">{p.name}</h3>
              <p className="sc-tag">{p.tagline}</p>
              <dl className="sc-facts">
                {p.keyFacts.map((f) => <div key={f.label}><dt className="mono">{f.label}</dt><dd>{f.value || <span className="tbc">To be confirmed</span>}</dd></div>)}
              </dl>
              <div className="row"><Btn to={`/products/${p.slug}`}>Explore {p.name}</Btn></div>
            </div>
            <div className="sc-m stage">
              <motion.div className="sc-img" initial={{ scale: 1.08, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.4, ease }}>
                <Media src={p.media.cover} label={p.name} fit="contain" />
              </motion.div>
              <span className="sc-ghost" aria-hidden="true">{p.name}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ── 5. Applications: editorial list with a media preview that follows the cursor ── */
function Applications() {
  const [hover, setHover] = useState(null)
  const box = useRef(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 28 }), y = useSpring(my, { stiffness: 260, damping: 28 })
  const move = (e) => { const b = box.current.getBoundingClientRect(); mx.set(e.clientX - b.left); my.set(e.clientY - b.top) }
  return (
    <section className="sec apps-home">
      <div className="wrap">
        <SectionHead n="04" label="Applications" title={['Where robots', <span className="muted">earn their keep.</span>]} />
        <div className="alist" ref={box} onMouseMove={move} onMouseLeave={() => setHover(null)}>
          {APPS.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.04}>
              <Link to={`/applications/${a.slug}`} className={'arow' + (hover && hover !== a.slug ? ' dim' : '')} onMouseEnter={() => setHover(a.slug)}>
                <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
                <span className="arow-n">{a.name}</span>
                <span className="arow-b">{a.blurb}</span>
                <span className="arow-a"><Arrow size={22} /></span>
              </Link>
            </Reveal>
          ))}
          <motion.div className="apeek stage" style={{ x, y }} animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.85 }} transition={{ duration: 0.3, ease }} aria-hidden="true">
            {APPS.map((a) => (
              <div key={a.slug} className="apeek-i" style={{ opacity: hover === a.slug ? 1 : 0 }}>
                <Media src={a.image} label={a.name} fit={a.fit || 'cover'} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── 6. Projects: vertical scroll drives a horizontal track ───────────────────────── */
function Projects() {
  const sec = useRef(null), track = useRef(null)
  const [dist, setDist] = useState(0)
  useLayoutEffect(() => {
    const m = () => setDist(window.innerWidth > 900 ? Math.max(0, track.current.scrollWidth - window.innerWidth) : 0)
    m()
    window.addEventListener('resize', m)
    return () => window.removeEventListener('resize', m)
  }, [])
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  return (
    <section className="hscroll" ref={sec} style={{ height: dist ? `calc(100vh + ${dist}px)` : 'auto' }}>
      <div className="hs-sticky">
        <div className="wrap hs-head">
          <Label n="06">Deployed projects</Label>
          <Link to="/projects" className="textlink">All projects <Arrow size={14} /></Link>
        </div>
        <motion.div className="hs-track" ref={track} style={{ x }}>
          <div className="hs-intro">
            <h2>Real robots.<br /><span className="muted">Real factories.</span></h2>
            <p className="lede">Each one started with a single manual task.</p>
          </div>
          {PROJECTS.map((p, i) => (
            <article key={p.title} className="hs-card">
              <div className="hs-m"><Media src={p.video} poster={p.poster} label={p.title} /></div>
              <div className="hs-b">
                <span className="mono muted">{String(i + 1).padStart(2, '0')} · {p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.built}</p>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── 7. Process ───────────────────────────────────────────────────────────────────── */
function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  return (
    <section className="sec process">
      <div className="wrap">
        <SectionHead n="07" label="How we work" title={['Five steps.', <span className="muted">One team.</span>]} />
        <div className="steps" ref={ref}>
          <div className="steps-line"><motion.i style={{ scaleX: scrollYProgress }} /></div>
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="step">
              <span className="step-n mono">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 8. Recognition marquee ───────────────────────────────────────────────────────── */
function Recognition() {
  const row = [...RECOGNITION, ...RECOGNITION]
  return (
    <section className="sec recog">
      <div className="wrap"><Label n="08">Recognised and backed by</Label></div>
      <div className="marquee" aria-label="Recognitions">
        <div className="marquee-in">
          {row.map((r, i) => <div className="mq-logo" key={i} aria-hidden={i >= RECOGNITION.length}><img src={r.logo} alt={r.name} loading="lazy" /></div>)}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <Page>
      <Hero />
      <Intro />
      <Interactive />
      <Products />
      <Applications />
      <Platform n="05" />
      <Projects />
      <Process />
      <Recognition />
    </Page>
  )
}
