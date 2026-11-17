import { useSyncExternalStore } from 'react'
import { PRODUCTS } from './data/products'

/* First-visit loading screen.
   The overlay itself is plain HTML/CSS in index.html, so it shows the instant the page opens.
   Once React has rendered the first page, this waits for everything on that page to be fetched:
   fonts, every image (including lazy ones further down), every video (until it can play through)
   and, where the page has one, the 3D model and the three.js code. Then it fades out and the
   intro animations start. A hard time limit means a slow connection never gets stuck on it. */

const MAX_WAIT = 12000 // ms: never hold visitors longer than this
const MIN_SHOW = 700 // ms: avoid a flicker on fast connections

let ready = false
const subs = new Set()
const setReady = () => { ready = true; subs.forEach((f) => f()) }
export const useBootReady = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => ready)

const once = (el, events) => new Promise((res) => { const h = () => { events.forEach((e) => el.removeEventListener(e, h)); res() }; events.forEach((e) => el.addEventListener(e, h)) })

function imageTask(src) {
  return new Promise((res) => {
    const im = new Image()
    im.onload = () => (im.decode ? im.decode().catch(() => {}).then(res) : res())
    im.onerror = res
    im.src = src
  })
}
function videoTask(v) {
  if (v.readyState >= 4) return Promise.resolve()
  v.preload = 'auto'
  return once(v, ['canplaythrough', 'error', 'stalled'])
}
function modelsFor(path) {
  const m = path.match(/^\/products\/([^/]+)/)
  if (m) return PRODUCTS.filter((p) => p.slug === m[1] && p.media.model).map((p) => p.media.model)
  if (path === '/') return PRODUCTS.filter((p) => p.media.model).slice(0, 1).map((p) => p.media.model)
  return []
}

export function runBoot() {
  const el = document.getElementById('boot')
  if (!el || ready) { setReady(); return }
  const start = performance.now()
  const bar = el.querySelector('.boot-bar i')
  const pct = el.querySelector('.boot-pct')
  document.documentElement.classList.add('booting')

  const tasks = []
  if (document.fonts?.ready) tasks.push(document.fonts.ready)
  const imgs = new Set([...document.querySelectorAll('#root img')].map((i) => i.currentSrc || i.src).filter(Boolean))
  imgs.forEach((s) => tasks.push(imageTask(s)))
  document.querySelectorAll('#root video').forEach((v) => tasks.push(videoTask(v)))
  const models = modelsFor(window.location.pathname)
  if (models.length) {
    tasks.push(import('./three/CobotScene').catch(() => {}))
    models.forEach((u) => tasks.push(fetch(u).then((r) => r.arrayBuffer()).catch(() => {})))
  }

  let done = 0
  const total = tasks.length || 1
  const tick = () => {
    const p = Math.round((done / total) * 100)
    if (bar) bar.style.transform = `scaleX(${p / 100})`
    if (pct) pct.textContent = String(p).padStart(3, '0')
  }
  tasks.forEach((t) => Promise.resolve(t).finally(() => { done++; tick() }))
  tick()

  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    if (bar) bar.style.transform = 'scaleX(1)'
    if (pct) pct.textContent = '100'
    setTimeout(() => {
      el.classList.add('boot-out')
      document.documentElement.classList.remove('booting')
      setReady()
      setTimeout(() => el.remove(), 900)
    }, Math.max(0, MIN_SHOW - (performance.now() - start)) + 250)
  }
  Promise.allSettled(tasks).then(finish)
  setTimeout(finish, MAX_WAIT)
}
