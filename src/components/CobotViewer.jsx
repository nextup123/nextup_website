import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../theme'

const NAMES = ['Base', 'Base', 'Shoulder', 'Elbow', 'Wrist 1', 'Wrist 2', 'Wrist 3']

/* Interactive 3D robot (NexC5, NexR10, NexR20). three.js and the model only download when the viewer
   comes near the screen, so the rest of the page stays fast. */
export default function CobotViewer({ src, name = 'robot', controls = true, className = '' }) {
  // the rig is picked from the model file name: /models/robot1.bin -> 'robot1'
  const rig = (src.split('/').pop() || '').replace(/\.bin$/, '')
  const box = useRef(null)
  const scene = useRef(null)
  const { theme } = useTheme()
  const [mod, setMod] = useState(null)
  const [state, setState] = useState('idle') // idle | loading | ready | error
  const [angles, setAngles] = useState(null)
  const [demo, setDemo] = useState(true)
  const [hover, setHover] = useState(-1)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    const el = box.current
    // check every entry: a fast scroll can deliver an "out" and an "in" entry in one batch
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      io.disconnect()
      setState('loading')
      import('../three/CobotScene').then(setMod).catch(() => setState('error'))
    }, { rootMargin: '400px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!mod) return
    let s
    try {
      s = new mod.CobotScene(box.current, {
        url: src, rig, theme: document.documentElement.dataset.theme,
        onChange: (a) => setAngles(a.slice()), onHover: setHover,
      })
    } catch { setState('error'); return }
    scene.current = s
    s.ready.then(() => { setState('ready'); setAngles(s.angles.slice()) }).catch(() => setState('error'))
    s.renderer.domElement.addEventListener('pointerdown', () => setTouched(true), { once: true })
    return () => { s.dispose(); scene.current = null }
  }, [mod, src, rig])

  useEffect(() => { scene.current?.setTheme(theme) }, [theme])

  const info = mod?.JOINT_INFO
  const poses = mod ? Object.keys(mod.posesFor(rig)) : []
  const setJ = (i, v) => { scene.current?.setJoint(i, v); setDemo(false) }

  return (
    <div className={'viewer ' + className}>
      <div className="viewer-canvas" ref={box} aria-label={`Interactive 3D model of the Nextup ${name}. Drag to rotate.`} role="img" />
      <AnimatePresence>
        {state !== 'ready' && (
          <motion.div className="viewer-load" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            {state === 'error' ? <span>3D view needs WebGL. Try another browser.</span> : <><i className="spin" /><span>Loading 3D model</span></>}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="viewer-hud mono" aria-hidden="true">
        <span><i className="dot live" /> {demo ? 'Demo sequence' : 'Manual control'}</span>
        <span className="hud-part">{hover >= 0 ? `Link: ${NAMES[hover]}` : touched ? '' : 'Drag to orbit · hover a link'}</span>
      </div>
      {controls && info && (
        <div className="viewer-panel">
          <div className="vp-head">
            <span className="mono">Joint control</span>
            <button className={'vp-demo' + (demo ? ' on' : '')} onClick={() => { const d = !demo; setDemo(d); scene.current?.setDemo(d) }}>
              {demo ? 'Pause demo' : 'Play demo'}
            </button>
          </div>
          <div className="vp-joints">
            {info.map((j, i) => (
              <label key={j.name} className={hover === i + 1 ? 'hot' : ''}>
                <span className="mono"><b>J{i + 1}</b> {j.name}</span>
                <output className="mono">{angles ? `${angles[i] >= 0 ? '+' : '−'}${Math.abs(angles[i]).toFixed(1).padStart(5, '0')}°` : '—'}</output>
                <input type="range" min={j.min} max={j.max} step="1" value={angles ? Math.round(angles[i]) : 0}
                  style={{ '--p': angles ? ((angles[i] - j.min) / (j.max - j.min)) * 100 + '%' : '50%' }}
                  onChange={(e) => setJ(i, +e.target.value)} aria-label={`Joint ${i + 1}, ${j.name}`} />
              </label>
            ))}
          </div>
          <div className="vp-poses">
            {poses.map((p) => <button key={p} onClick={() => { scene.current?.setPose(p); setDemo(false) }}>{p}</button>)}
          </div>
        </div>
      )}
    </div>
  )
}
