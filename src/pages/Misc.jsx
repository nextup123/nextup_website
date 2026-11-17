import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS, STEPS, RECOGNITION, NEXT, INDUSTRIES, APPS, SITE, FAQ, STATS } from '../data/content'
import { PRODUCTS, getProduct } from '../data/products'
import Media from '../components/Media'
import PaybackCalc from '../components/Payback'
import { Page, Reveal, Counter, ScrollWords, ease } from '../components/motion'
import { PageHead, SectionHead, Label, Arrow, Btn } from '../components/ui'

export function Projects() {
  return (
    <Page>
      <PageHead label="Deployed projects" title={['Real robots.', <span className="muted">Real factories.</span>]}
        sub="A few of the cells we have designed, built and installed. Each one started with a single manual task." />
      <div className="projects">
        {PROJECTS.map((p, i) => {
          const prod = getProduct(p.product)
          return (
            <section key={p.title} className={`project wrap${i % 2 ? ' flip' : ''}`}>
              {/* The clips are 720 px wide, so the frame never grows past that (no upscaling blur on big screens) */}
              <Reveal className="project-m"><Media src={p.video} poster={p.poster} label={`${p.title} video`} /></Reveal>
              <div className="project-b">
                <div>
                  <Label n={String(i + 1).padStart(2, '0')}>{p.tag}</Label>
                  <h2>{p.title}</h2>
                </div>
                <div className="project-two">
                  <div><h4 className="mono muted">The challenge</h4><p>{p.challenge}</p></div>
                  <div><h4 className="mono muted">What we built</h4><p>{p.built}</p></div>
                </div>
                <div className="kpis">{p.stats.map((s) => (<div key={s.label}><b className={s.value ? '' : 'tbc'}>{s.value || 'Add figure'}</b><span className="mono">{s.label}</span></div>))}</div>
                {prod && <Link className="textlink" to={`/products/${prod.slug}`}>Built with the {prod.name} <Arrow size={14} /></Link>}
              </div>
            </section>
          )
        })}
      </div>
    </Page>
  )
}

export function Payback() {
  return (
    <Page>
      <PageHead label="Payback estimate" title={['How fast does', <span className="muted">a robot pay back?</span>]} sub="Move the sliders to match your line. The estimate updates as you go." />
      <section className="sec tight"><div className="wrap"><Reveal><PaybackCalc /></Reveal></div></section>
    </Page>
  )
}

export function About() {
  return (
    <Page>
      <PageHead label="Company" title={['One team.', <span className="muted">Every robot.</span>]} sub="We design, build and support every robot we ship, from Ghaziabad." />
      <section className="sec tight">
        <div className="wrap">
          <ScrollWords className="statement" text="We automate the manual points of your line, and we build the robot, the software and the support behind it. No hand-offs between vendors, one number to call." />
          <dl className="stats">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="stat"><dd><Counter to={s.value} suffix={s.suffix} /></dd><dt className="mono">{s.label}</dt></Reveal>
            ))}
          </dl>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <SectionHead n="01" label="How we work" title={['Five steps.', <span className="muted">One team.</span>]} />
          <div className="steps">
            <div className="steps-line"><i style={{ transform: 'scaleX(1)' }} /></div>
            {STEPS.map((s, i) => (<Reveal key={s.title} delay={i * 0.08} className="step"><span className="step-n mono">0{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></Reveal>))}
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <SectionHead n="02" label="Recognised by" title={['Backed by India’s', <span className="muted">startup ecosystem.</span>]} />
          <div className="logos">
            {RECOGNITION.map((r, i) => (<Reveal key={r.name} delay={(i % 5) * 0.05} className="logo-tile"><img src={r.logo} alt={r.name} loading="lazy" /><span className="mono">{r.name}</span></Reveal>))}
          </div>
        </div>
      </section>
    </Page>
  )
}

export function Contact() {
  const [params] = useSearchParams()
  const pre = getProduct(params.get('product'))
  const task = APPS.find((a) => a.slug === params.get('task'))
  const [sent, setSent] = useState(false)
  const [faq, setFaq] = useState(0)
  const submit = (e) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.target))
    const body = `Name: ${f.name}\nPhone: ${f.phone}\nCompany: ${f.company}\nIndustry: ${f.industry}\nInterested in: ${f.product}\n\n${f.what}`
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Automation enquiry from ' + f.name)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  return (
    <Page>
      <PageHead label="Contact" title={['Tell us what', <span className="muted">to automate.</span>]} sub="We usually reply the same working day." />
      <section className="sec tight">
        <div className="wrap contact">
          <div className="contact-l">
            <div className="quick">
              <a href={`https://wa.me/${SITE.phone}`} target="_blank" rel="noreferrer"><span className="mono muted">Fastest</span><b>WhatsApp</b><small>{SITE.phoneLabel}</small><Arrow /></a>
              <a href={`tel:+${SITE.phone}`}><span className="mono muted">Call</span><b>{SITE.phoneLabel}</b><small>Monday to Saturday</small><Arrow /></a>
              <a href={`mailto:${SITE.email}`}><span className="mono muted">Email</span><b>Write to us</b><small>{SITE.email}</small><Arrow /></a>
            </div>
            <Label>What happens next</Label>
            <ol className="next">{NEXT.map((t, i) => (<li key={t}><span className="mono">0{i + 1}</span>{t}</li>))}</ol>
            <div className="offices">
              {SITE.offices.map((o) => (<p key={o.label}><span className="mono muted">{o.label} office</span><br />{o.lines.join(' ')}</p>))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" className="form done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease }}>
                <div className="tick">✓</div>
                <h3>Thanks, we’ve got it.</h3>
                <p>Your email app should have opened with your message. If not, write to {SITE.email} or message us on WhatsApp.</p>
              </motion.div>
            ) : (
              <motion.form key="f" className="form" onSubmit={submit} exit={{ opacity: 0 }}>
                <div className="two">
                  <label><span className="mono">Name</span><input name="name" required autoComplete="name" /></label>
                  <label><span className="mono">Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
                </div>
                <label><span className="mono">Company</span><input name="company" autoComplete="organization" /></label>
                <div className="two">
                  <label><span className="mono">Industry</span><select name="industry">{INDUSTRIES.map((x) => <option key={x}>{x}</option>)}</select></label>
                  <label><span className="mono">Interested in</span>
                    <select name="product" defaultValue={pre ? pre.name : 'Not sure yet'}>
                      {PRODUCTS.map((p) => <option key={p.slug}>{p.name}</option>)}
                      <option>Custom automation</option><option>Not sure yet</option>
                    </select>
                  </label>
                </div>
                <label><span className="mono">What do you want to automate?</span><textarea name="what" rows="5" required defaultValue={task ? `I'd like to automate ${task.name.toLowerCase()}.` : ''} /></label>
                <button className="btn" type="submit"><span>Send enquiry</span><i><Arrow size={14} /></i></button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
      <section className="sec">
        <div className="wrap faq-wrap">
          <SectionHead n="01" label="Questions" title={['Good to know.']} />
          <div className="faq">
            {FAQ.map((f, i) => (
              <div key={f.q} className={'faq-i' + (faq === i ? ' open' : '')}>
                <button onClick={() => setFaq(faq === i ? -1 : i)} aria-expanded={faq === i}><span>{f.q}</span><i aria-hidden="true" /></button>
                <AnimatePresence initial={false}>
                  {faq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }}>
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}

export function NotFound() {
  return (
    <Page>
      <PageHead label="404" title={['Off the map.']} sub="The link may be old. Try one of these instead.">
        <div className="row"><Btn to="/">Home</Btn><Btn to="/products" kind="ghost">Products</Btn></div>
      </PageHead>
    </Page>
  )
}
