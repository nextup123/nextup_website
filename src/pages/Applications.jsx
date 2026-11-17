import { Link, Navigate, useParams } from 'react-router-dom'
import { APPS, getApp } from '../data/content'
import { PRODUCTS } from '../data/products'
import Media from '../components/Media'
import { Page, Reveal } from '../components/motion'
import { Arrow, Btn, Label, PageHead, ProductCard } from '../components/ui'

const fitFor = (a) => a.fit || 'cover'

export function Applications() {
  return (
    <Page>
      <PageHead label="Applications" title={['Where robots', <span className="muted">work.</span>]}
        sub="Different grippers, different applications, same robot. Six places on your line where a robot earns its keep. Pick one to see what it replaces, what you gain and which product fits." />
      <section className="sec tight">
        <div className="wrap agrid">
          {APPS.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 0.08}>
              <Link to={`/applications/${a.slug}`} className="acard">
                <div className="acard-m stage"><Media src={a.image} label={a.name} fit={fitFor(a)} /></div>
                <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
                <h3>{a.name}</h3>
                <p>{a.blurb}</p>
                <span className="more mono">See details <Arrow size={13} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </Page>
  )
}

export function AppDetail() {
  const { slug } = useParams()
  const a = getApp(slug)
  if (!a) return <Navigate to="/applications" replace />
  const i = APPS.indexOf(a)
  const n = APPS[(i + 1) % APPS.length]
  const fits = PRODUCTS.filter((p) => p.applications.includes(a.slug))
  return (
    <Page>
      <PageHead label={`Application ${String(i + 1).padStart(2, '0')}`} title={[a.name]} sub={a.blurb}>
        <Link to="/applications" className="crumb mono">← All applications</Link>
      </PageHead>
      <Reveal className="ad-media stage">
        {/* photos smaller than the banner sit whole on a blurred copy of themselves instead of being cropped */}
        {!a.fit && !/\.mp4$/.test(a.image) && <Media src={a.image} label="" className="ad-bg" />}
        <Media src={a.image} label={a.name} fit={a.fit || (/\.mp4$/.test(a.image) ? 'cover' : 'contain')} className="ad-fg" />
      </Reveal>
      <section className="sec">
        <div className="wrap ad-grid">
          <Reveal className="ad-b"><Label n="01">What it replaces</Label><p className="ad-big">{a.replaces}</p></Reveal>
          <Reveal className="ad-b" delay={0.08}><Label n="02">What you gain</Label>
            <ul className="gains">{a.gains.map((g) => <li key={g}>{g}</li>)}</ul>
          </Reveal>
          <Reveal className="ad-b" delay={0.16}><Label n="03">Works well in</Label>
            <div className="chips">{a.fits.map((f) => <span key={f}>{f}</span>)}</div>
          </Reveal>
        </div>
        <div className="wrap row" style={{ marginTop: 48 }}>
          <Btn to={`/contact?task=${a.slug}`}>Automate this task</Btn>
          <Btn to={`/applications/${n.slug}`} kind="ghost">Next: {n.name}</Btn>
        </div>
      </section>
      {fits.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <Label n="04">Products for {a.name.toLowerCase()}</Label>
            <div className="pgrid">{fits.map((p, k) => <ProductCard key={p.slug} p={p} index={PRODUCTS.indexOf(p)} />)}</div>
          </div>
        </section>
      )}
    </Page>
  )
}
