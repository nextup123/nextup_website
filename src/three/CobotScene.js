import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { buildArm, RIGS } from './kinematics'

/* Interactive robot scene, plain three.js (no React) so it can be lazy-loaded as one chunk.
   Each model file is a robot's 7 STL links packed by tools/pack-stl.py into one compact
   binary (16-bit quantised, indexed). The rig (joints, colours, poses) is in kinematics.js. */

export const JOINT_INFO = [ // ranges from the Nextup booklet (Tables 1.2 and 2.2), the same on every model
  { name: 'Base', min: -360, max: 360 },
  { name: 'Shoulder', min: -115, max: 115 },
  { name: 'Elbow', min: -160, max: 160 },
  { name: 'Wrist 1', min: -170, max: 170 },
  { name: 'Wrist 2', min: -180, max: 180 },
  { name: 'Wrist 3', min: -360, max: 360 },
]
export const posesFor = (rig) => (RIGS[rig] || RIGS.cobot).poses
const D2R = Math.PI / 180

const THEMES = {
  dark: { floor: 0x0b0e13, grid: 0x2a3340, grid2: 0x161c25, shadow: 0.55, white: 0xe9ebee, dark: 0x16191e, accent: 0x3b93f0, env: 0.55 },
  light: { floor: 0xe9ecf0, grid: 0xb4bcc8, grid2: 0xd3d8df, shadow: 0.22, white: 0xf7f7f5, dark: 0x1d2025, accent: 0x1660d0, env: 0.8 },
}

export async function loadPacked(url) {
  const buf = await (await fetch(url)).arrayBuffer()
  const dv = new DataView(buf)
  if (dv.getUint32(0, true) !== 0x3143584e) throw new Error('Not a packed cobot model')
  const n = dv.getUint32(4, true)
  let off = 8 + n * 32
  const out = []
  for (let i = 0; i < n; i++) {
    const h = 8 + i * 32
    const nv = dv.getUint32(h, true), ni = dv.getUint32(h + 4, true)
    const mn = [0, 1, 2].map((k) => dv.getFloat32(h + 8 + k * 4, true))
    const sc = [0, 1, 2].map((k) => dv.getFloat32(h + 20 + k * 4, true))
    const q = new Uint16Array(buf, off, nv * 3)
    off += Math.ceil((nv * 6) / 4) * 4
    const idx = new Uint16Array(buf, off, ni)
    off += Math.ceil((ni * 2) / 4) * 4
    const pos = new Float32Array(nv * 3)
    for (let v = 0; v < nv * 3; v++) pos[v] = mn[v % 3] + q[v] * sc[v % 3]
    let g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setIndex(new THREE.BufferAttribute(new Uint16Array(idx), 1))
    g = toCreasedNormals(g, 32 * D2R) // keep CAD edges crisp, curved surfaces smooth
    out.push(g)
  }
  return out
}

export class CobotScene {
  constructor(container, { url, rig = 'cobot', theme = 'dark', onChange, onHover }) {
    this.container = container
    this.rig = RIGS[rig] || RIGS.cobot
    this.poses = this.rig.poses
    this.demoList = Object.keys(this.poses).slice(0, 3)
    this.onChange = onChange
    this.onHover = onHover
    this.angles = this.poses.Ready.slice()
    this.target = this.poses.Ready.slice()
    this.demo = true
    this.demoIx = 0
    this.demoT = 0
    this.visible = true
    this.hovered = -1

    const r = (this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }))
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    r.outputColorSpace = THREE.SRGBColorSpace
    r.toneMapping = THREE.ACESFilmicToneMapping
    r.toneMappingExposure = 1.0
    r.shadowMap.enabled = true
    r.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(r.domElement)

    const s = (this.scene = new THREE.Scene())
    const pm = new THREE.PMREMGenerator(r)
    s.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
    pm.dispose()

    this.camera = new THREE.PerspectiveCamera(28, 1, 0.05, 50)
    this.camera.position.set(2.3, 1.45, 2.75)

    const key = (this.key = new THREE.DirectionalLight(0xffffff, 2.2))
    key.position.set(1.6, 3.2, 1.4)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.left = key.shadow.camera.bottom = -1.4
    key.shadow.camera.right = key.shadow.camera.top = 1.4
    key.shadow.radius = 6
    key.shadow.bias = -0.0004
    s.add(key)
    const rim = (this.rim = new THREE.DirectionalLight(0x9cc6ff, 1.1))
    rim.position.set(-2.5, 1.8, -2)
    s.add(rim)
    s.add((this.hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 0.35)))

    // Floor: shadow catcher + fine polar grid + accent ring around the base
    this.shadowFloor = new THREE.Mesh(new THREE.CircleGeometry(3, 64), new THREE.ShadowMaterial({ opacity: 0.4 }))
    this.shadowFloor.rotation.x = -Math.PI / 2
    this.shadowFloor.receiveShadow = true
    s.add(this.shadowFloor)
    this.ring = new THREE.Mesh(new THREE.RingGeometry(0.19, 0.192, 128), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9 }))
    this.ring.rotation.x = -Math.PI / 2
    this.ring.position.y = 0.001
    s.add(this.ring)
    this.reach = new THREE.Mesh(new THREE.RingGeometry(1.07, 1.073, 160), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55 }))
    this.reach.rotation.x = -Math.PI / 2
    this.reach.position.y = 0.001
    s.add(this.reach)

    this.mats = {
      white: new THREE.MeshStandardMaterial({ color: this.rig.body.dark, roughness: this.rig.body.roughness, metalness: this.rig.body.metalness, envMapIntensity: 0.8 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x1b1d21, roughness: 0.45, metalness: 0.25, envMapIntensity: 0.7 }),
    }
    this.controls = new OrbitControls(this.camera, r.domElement)
    Object.assign(this.controls, {
      enableDamping: true, dampingFactor: 0.07, enablePan: false, minDistance: 1.5, maxDistance: 4.6,
      maxPolarAngle: 1.52, minPolarAngle: 0.25, autoRotate: true, autoRotateSpeed: 0.55, rotateSpeed: 0.7,
    })
    // no wheel/pinch zoom: the viewer is large, so it must never trap page scrolling
    this.controls.enableZoom = false
    // touch: horizontal drag orbits, vertical swipe still scrolls the page
    r.domElement.style.touchAction = 'pan-y'
    this.controls.target.set(0, 0.48, 0)
    this.controls.addEventListener('start', () => { this.controls.autoRotate = false })

    this.setTheme(theme)
    this.ray = new THREE.Raycaster()
    this.ptr = new THREE.Vector2()
    this._move = (e) => {
      const b = r.domElement.getBoundingClientRect()
      this.ptr.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1)
      this._pick = true
    }
    this._leave = () => this.setHover(-1)
    r.domElement.addEventListener('pointermove', this._move)
    r.domElement.addEventListener('pointerleave', this._leave)

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(container)
    this.io = new IntersectionObserver((es) => { this.visible = es[es.length - 1].isIntersecting })
    this.io.observe(container)
    this.resize()
    this.clock = new THREE.Clock()
    this.ready = loadPacked(url).then((geos) => {
      const mats = this.rig.paint.map((p) => (p === 'dark' ? this.mats.dark : this.mats.white.clone()))
      const { root, joints } = buildArm(this.rig, geos, mats)
      // show every robot at the same on-screen size, whatever its real height
      const h = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3()).y
      root.scale.setScalar(1.3 / h)
      this.arm = root
      this.joints = joints
      this.meshes = []
      root.traverse((o) => o.isMesh && this.meshes.push(o))
      s.add(root)
      this.applyAngles()
    })
    this._loop = () => { this.raf = requestAnimationFrame(this._loop); this.tick() }
    this._loop()
  }

  setTheme(name) {
    const t = THEMES[name] || THEMES.dark
    this.theme = t
    this.shadowFloor.material.opacity = t.shadow
    this.ring.material.color.set(t.accent)
    this.reach.material.color.set(t.grid)
    this.mats.white.color.set(this.rig.body[name === 'light' ? 'light' : 'dark'])
    this.mats.dark.color.set(t.dark)
    this.meshes?.forEach((m, i) => { if (m.material !== this.mats.dark) m.material.color.set(this.rig.body[name === 'light' ? 'light' : 'dark']) })
    this.scene.environmentIntensity = t.env
    if (this.grid) { this.scene.remove(this.grid); this.grid.geometry.dispose(); this.grid.material.dispose() }
    this.grid = new THREE.PolarGridHelper(2.2, 16, 9, 96, t.grid2, t.grid2)
    this.grid.material.transparent = true
    this.grid.material.opacity = 0.9
    this.scene.add(this.grid)
  }

  setHover(i) {
    if (i === this.hovered) return
    this.hovered = i
    this.meshes?.forEach((m, k) => {
      if (m.material.emissive) m.material.emissive.set(k === i ? this.theme.accent : 0x000000)
      if (m.material.emissive) m.material.emissiveIntensity = k === i ? 0.35 : 0
    })
    this.renderer.domElement.style.cursor = i >= 0 ? 'grab' : ''
    this.onHover?.(i)
  }

  setJoint(i, deg) {
    this.demo = false
    this.target[i] = deg
  }
  setPose(name) {
    this.demo = false
    this.target = this.poses[name].slice()
  }
  setDemo(on) {
    this.demo = on
    this.demoT = 0
    if (on) this.controls.autoRotate = true
  }

  applyAngles() {
    this.joints?.forEach((j, i) => { j.rotation.z = (j.userData.sign || 1) * this.angles[i] * D2R })
  }

  resize() {
    const { clientWidth: w, clientHeight: h } = this.container
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    // keep the whole arm in frame on narrow screens
    this.camera.fov = w / h < 0.9 ? 40 : 30
    // on wide layouts the control panel sits on the right, so shift the robot left of centre
    if (w > 960) this.camera.setViewOffset(w, h, Math.min(190, w * 0.12), 0, w, h)
    else this.camera.clearViewOffset()
    this.camera.updateProjectionMatrix()
  }

  tick() {
    if (!this.visible) { this.clock.getDelta(); return }
    const dt = Math.min(this.clock.getDelta(), 0.05)
    if (this.demo) {
      this.demoT += dt
      if (this.demoT > 3.4) { this.demoT = 0; this.demoIx = (this.demoIx + 1) % this.demoList.length; this.target = this.poses[this.demoList[this.demoIx]].slice() }
    }
    let moved = false
    const k = 1 - Math.exp(-dt * (this.demo ? 2.2 : 7))
    for (let i = 0; i < 6; i++) {
      const d = this.target[i] - this.angles[i]
      if (Math.abs(d) > 0.01) { this.angles[i] += d * k; moved = true }
    }
    if (moved) { this.applyAngles(); this.onChange?.(this.angles, this.target) }
    if (this._pick && this.meshes) {
      this._pick = false
      this.ray.setFromCamera(this.ptr, this.camera)
      const hit = this.ray.intersectObjects(this.meshes, false)[0]
      this.setHover(hit ? this.meshes.indexOf(hit.object) : -1)
    }
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.io.disconnect()
    this.renderer.domElement.removeEventListener('pointermove', this._move)
    this.renderer.domElement.removeEventListener('pointerleave', this._leave)
    this.controls.dispose()
    this.scene.traverse((o) => { o.geometry?.dispose(); if (o.material) [].concat(o.material).forEach((m) => m.dispose()) })
    this.scene.environment?.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
