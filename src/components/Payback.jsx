import { useState } from 'react'
import { Btn } from './ui'
import { motion, AnimatePresence } from 'framer-motion'

const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
const FIELDS = [
  { k: 'cost', l: 'System cost (₹)', min: 300000, max: 5000000, step: 50000, fmt: inr },
  { k: 'ops', l: 'Operators freed per shift', min: 1, max: 6, step: 1 },
  { k: 'wage', l: 'Monthly wage per operator (₹)', min: 10000, max: 60000, step: 1000, fmt: inr },
  { k: 'shifts', l: 'Shifts per day', min: 1, max: 3, step: 1 },
]

export default function PaybackCalc() {
  const [v, setV] = useState({ cost: 1200000, ops: 2, wage: 22000, shifts: 2 })
  const saving = v.ops * v.shifts * v.wage * 12
  const net = saving - v.cost * 0.05
  const months = net > 0 ? v.cost / (net / 12) : null
  const label = months ? months.toFixed(1) : '–'
  const pct = months ? Math.min(100, (months / 36) * 100) : 100
  return (
    <div className="calc">
      <div className="fields">
        {FIELDS.map((f) => (
          <label key={f.k}>
            <span className="calc-l"><span className="mono">{f.l}</span><b>{f.fmt ? f.fmt(v[f.k]) : v[f.k]}</b></span>
            <input type="range" min={f.min} max={f.max} step={f.step} value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: +e.target.value })}
              style={{ '--p': ((v[f.k] - f.min) / (f.max - f.min)) * 100 + '%' }} />
          </label>
        ))}
      </div>
      <div className="out">
        <p className="mono muted">Estimated payback</p>
        <div className="out-n">
          <AnimatePresence mode="popLayout">
            <motion.b key={label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.25 }}>{label}</motion.b>
          </AnimatePresence>
          <span>{months ? 'months' : 'not within range'}</span>
        </div>
        <div className="bar"><motion.i animate={{ width: pct + '%' }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></div>
        <p className="out-note">Yearly labour saving <b>{inr(saving)}</b>. Assumes 5% of system cost per year for upkeep. This is a rough guide, so ask us for a quote based on your line.</p>
        <Btn to="/contact?topic=payback">Get an exact number</Btn>
      </div>
    </div>
  )
}
