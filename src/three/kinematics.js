import * as THREE from 'three'

/* Kinematic rigs for each Nextup robot, reconstructed from the STL link meshes (metres, Z-up).
   No URDF was supplied, so joint origins were measured from the parts. If you get a URDF,
   copy each joint's <origin> straight into `joints` below.

   joints[i]: where link i+1's frame sits in link i's frame (`origin`) and link i+1's x / y
   axes expressed in link i's frame (z = x × y). The joint rotates about the child's local Z.
   `paint`: 'body' or 'dark' per link (base_link first).
   `poses`: named joint angles in degrees. The first three play as the demo loop. */

export const LINKS = ['base_link', 'link1', 'link2', 'link3', 'link4', 'link5', 'link6']

export const RIGS = {
  cobot: {
    // NexC5: joint origins and axes from nextupCobot.urdf.xacro (supplied 2026-11-17). Every URDF joint turns
    // about -Z, hence axis: -1. The URDF matches the first STL export (centres of mass agree). The
    // 2026-11-17 STLs are the same parts saved in other frames, so three meshes are put back (`mesh`,
    // `meshRotZ`, applied inside the link's own frame): link1 turned 180° and 41.95 mm lower, link4 turned
    // 180°, link5 turned -12.47° and 1 mm higher, base turned 180°. Without this the wrist (link5) shows tilted.
    baseZ: 0,
    baseRotZ: 180,
    joints: [
      { origin: [0, 0, 0.23], x: [1, 0, 0], y: [0, 1, 0], axis: -1, mesh: [0.0023, -0.00001, 0.04195], meshRotZ: 180 },
      { origin: [0, -0.125, 0.145], x: [1, 0, 0], y: [0, 0, 1], axis: -1 }, // rpy 1.5708 0 0
      { origin: [0, 0.45, 0], x: [-1, 0, 0], y: [0, 1, 0], axis: -1 }, // rpy 3.1416 0 3.1416
      { origin: [0, 0.35, 0], x: [0, 1, 0], y: [1, 0, 0], axis: -1, meshRotZ: 180 }, // rpy 3.1416 0 1.5708
      { origin: [0.112, 0, 0.079], x: [0, 1, 0], y: [0, 0, 1], axis: -1, mesh: [0, 0, -0.001], meshRotZ: 12.47 }, // rpy 1.5708 0 1.5708
      { origin: [0, 0.0775, 0.07], x: [-1, 0, 0], y: [0, 0, 1], axis: -1 }, // rpy 1.5708 0 -3.1416
    ],
    body: { light: 0xf7f7f5, dark: 0xe9ebee, roughness: 0.38, metalness: 0.04 }, // white
    paint: ['dark', 'body', 'body', 'body', 'body', 'body', 'dark'],
    poses: { // URDF zero is the arm standing straight up
      Ready: [150, -20, 90, -60, -90, 0],
      Pick: [150, -45, 120, -75, 0, 0],
      Inspect: [-60, -20, 90, -60, 0, 0],
      Upright: [0, 0, 0, 0, 0, 0],
    },
  },
  robot: {
    baseZ: 0,
    // NexR10: joint origins and axes from nextupRobot.urdf.xacro (supplied 2026-11-17). Mesh centres of mass
    // match the URDF, so the STLs are used as exported.
    joints: [
      { origin: [0, 0, 0.493], x: [1, 0, 0], y: [0, 1, 0], axis: -1 },
      { origin: [-0.089, 0, 0.125], x: [0, 1, 0], y: [0, 0, 1], axis: -1 },
      { origin: [0, 0.6, -0.004], x: [-1, 0, 0], y: [0, 1, 0], axis: -1 },
      { origin: [0, 0.45, -0.005], x: [0, -1, 0], y: [-1, 0, 0], axis: -1 },
      { origin: [-0.137, 0, 0.088], x: [0, -1, 0], y: [0, 0, 1], axis: -1 },
      { origin: [0, 0.068, 0.245], x: [-1, 0, 0], y: [0, 0, 1], axis: -1 },
    ],
    body: { light: 0x1d5fd6, dark: 0x2a6ee0, roughness: 0.42, metalness: 0.08 }, // logo blue
    paint: ['dark', 'body', 'body', 'body', 'body', 'body', 'dark'],
    poses: {
      Ready: [60, -10, -100, 90, 90, 0],
      Reach: [60, -10, -100, 0, 0, 0],
      Tuck: [40, -20, -120, 90, 60, 0],
      Upright: [0, 0, 0, 0, 0, 0],
    },
  },
  robot1: {
    baseZ: 0,
    // Robot1 (NexR20): joint origins and axes from nextupRobot1.urdf.xacro (supplied 2026-11-17). The base
    // mesh is drawn 0.6 m up (the URDF's visual origin); the joints are not.
    baseMesh: [0, 0, 0.6],
    joints: [
      { origin: [0, 0, 0.593], x: [1, 0, 0], y: [0, 1, 0] },
      { origin: [0.0772577, 0, 0.18], x: [0, 0.92022, -0.3914], y: [0, -0.3914, -0.92022] },
      { origin: [-0.383049, -0.923728, 0.002], x: [0.92022, -0.3914, 0], y: [-0.3914, -0.92022, 0], axis: -1 },
      { origin: [0, 0.6, 0], x: [0, 1, 0], y: [1, 0, 0], axis: -1 },
      { origin: [0.18, 0, 0.106], x: [0, 1, 0], y: [0, 0, 1], axis: -1 },
      { origin: [-0.0005, 0.0665, 0.245], x: [-0.35005, 0, -0.93673], y: [-0.93673, 0, 0.35005], axis: -1 },
    ],
    body: { light: 0x7b838e, dark: 0x8a929c, roughness: 0.3, metalness: 0.6 }, // titanium
    paint: ['dark', 'dark', 'body', 'body', 'body', 'body', 'dark'],
    poses: {
      Ready: [0, 20, 90, -90, 90, 0],
      Reach: [-40, 40, 60, 0, 0, 0],
      Inspect: [-30, 30, 80, 90, 90, 0],
      Upright: [0, 0, 0, 0, 0, 0],
    },
  },
}

// Builds the arm. Returns { root, joints } where joints[i] is the Object3D to rotate
// (about its local Z) for joint i+1. `materials` is one material per link.
export function buildArm(rig, geometries, materials) {
  const root = new THREE.Group()
  root.rotation.x = -Math.PI / 2 // robot Z-up -> three.js Y-up
  const holder = new THREE.Group()
  holder.position.z = rig.baseZ || 0
  root.add(holder)
  const base = new THREE.Mesh(geometries[0], materials[0])
  if (rig.baseRotZ) base.rotation.z = rig.baseRotZ * Math.PI / 180
  if (rig.baseMesh) base.position.set(...rig.baseMesh)
  holder.add(base)
  let parent = holder
  const joints = []
  rig.joints.forEach((j, i) => {
    const frame = new THREE.Group()
    const x = new THREE.Vector3(...j.x).normalize(), y = new THREE.Vector3(...j.y).normalize()
    const z = new THREE.Vector3().crossVectors(x, y)
    frame.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z))
    frame.position.set(...j.origin)
    const pivot = new THREE.Group()
    frame.add(pivot)
    pivot.userData.sign = j.axis || 1 // -1 when the URDF axis is -Z
    const mesh = new THREE.Mesh(geometries[i + 1], materials[i + 1])
    if (j.mesh) mesh.position.set(...j.mesh)
    if (j.meshRotZ) mesh.rotation.z = j.meshRotZ * Math.PI / 180
    pivot.add(mesh)
    parent.add(frame)
    parent = pivot
    joints.push(pivot)
  })
  root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } })
  return { root, joints }
}
