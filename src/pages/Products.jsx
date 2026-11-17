import { Link } from 'react-router-dom'
import { PRODUCTS, COMPARE_ROWS, compareValue, RANGE } from '../data/products'
import Finder from '../components/Finder'
import { Page, Reveal } from '../components/motion'
import { PageHead, ProductCard, SectionHead, Arrow } from '../components/ui'

export default function Products() {
  return (
    <Page>
      <PageHead label="Products" title={['Robots for', <span className="muted">every line.</span>]}
        sub="Collaborative and industrial arms, designed, built and supported by one team in Ghaziabad." />
      <section className="sec tight">
        <div className="wrap pgrid">
          {PRODUCTS.map((p, i) => <Reveal key={p.slug} delay={i * 0.08}><ProductCard p={p} index={i} /></Reveal>)}
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <SectionHead n="01" label="Compare" title={['Side by side.']} />
          <Reveal className="compare-wrap">
            <table className="compare">
              <thead>
                <tr><th /> {PRODUCTS.map((p) => <th key={p.slug}><Link to={`/products/${p.slug}`}>{p.name} <Arrow size={13} /></Link><small className="mono">{p.family}</small></th>)}</tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r) => (
                  <tr key={r}><th className="mono">{r}</th>{PRODUCTS.map((p) => { const v = compareValue(p, r); return <td key={p.slug}>{v || <span className="tbc">To be confirmed</span>}</td> })}</tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <SectionHead n="02" label="Industrial range" title={['Four payloads.', <span className="muted">One platform.</span>]}
            sub="Our industrial robots come in 5, 10, 15 and 20 kg payload variants. Ask us which one fits your process." />
          <Reveal className="compare-wrap">
            <table className="compare range-t">
              <thead><tr><th />{RANGE.models.map((m) => { const p = PRODUCTS.find((x) => x.name === m); return <th key={m} className={p ? 'hl' : ''}>{p ? <Link to={`/products/${p.slug}`}>{m} <Arrow size={13} /></Link> : m}</th> })}</tr></thead>
              <tbody>{RANGE.rows.map(([label, ...v]) => <tr key={label}><th className="mono">{label}</th>{v.map((x, i) => <td key={i}>{x}</td>)}</tr>)}</tbody>
            </table>
          </Reveal>
          <div className="range-common">{RANGE.common.map(([k, v]) => <div key={k}><span className="mono muted">{k}</span><b>{v}</b></div>)}</div>
          <p className="range-note mono">{RANGE.note}</p>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <SectionHead n="03" label="Product finder" title={['Not sure which?', <span className="muted">Start with the task.</span>]} />
          <Reveal><Finder /></Reveal>
        </div>
      </section>
    </Page>
  )
}
