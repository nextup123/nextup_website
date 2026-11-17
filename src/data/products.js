
/* ---------------------------------------------------------------------------
   PRODUCTS — the single source of truth for every product on the site.

   To add a new product: copy one object below, change the `slug` (used in the
   URL: /products/<slug>), fill in the fields, and drop its photo into
   /public/images/products/ and any video into /public/videos/. That's it: the product
   card, the detail page, the compare table, the product finder and the footer
   links all pick it up automatically.

   Any spec `value` set to null shows as "To be confirmed" on the site,
   so you can publish before every number is final.

   The URL slugs (cobot, robot, robot1) are kept from the first version so old links still work.
--------------------------------------------------------------------------- */

// "Working diameter": the booklet's table says "Working Radius", but its figures are diameters (about twice
// the reach), so they are shown unchanged under the corrected label.
// Figures from the Nextup Robotics booklet (booklet_final.pdf, Nov 2026): Table 1.1 (industrial
// robots), Table 2.1 (NexC5 cobot) and Tables 1.2 / 2.2 (range of motion, the same on every model).

// Range of motion and top speed per axis. The booklet lists the same values for every model.
export const MOTION = [
  { axis: 'Axis 1', part: 'Base', range: '± 360°', speed: '180°/s' },
  { axis: 'Axis 2', part: 'Shoulder', range: '± 115°', speed: '180°/s' },
  { axis: 'Axis 3', part: 'Elbow', range: '± 160°', speed: '180°/s' },
  { axis: 'Axis 4', part: 'Wrist 1', range: '± 170°', speed: '200°/s' },
  { axis: 'Axis 5', part: 'Wrist 2', range: '± 180°', speed: '200°/s' },
  { axis: 'Axis 6', part: 'Wrist 3', range: '± 360°', speed: '200°/s' },
]

// Shared by every model: the same controller, software and integration approach
const CONTROL = (ip) => [
  { label: 'Programming', value: 'Graphical drag-and-drop, with auto-generation' },
  { label: 'Inputs and outputs', value: '30 digital in / 18 digital out' },
  { label: 'Communication', value: 'EtherCAT' },
  { label: 'Ingress protection', value: ip },
  { label: 'Operating temperature', value: '0 to 80', unit: '°C' },
]

const INDUSTRIAL_HIGHLIGHTS = [
  { title: 'Continuous duty', text: 'Built for production where repeatability, cycle time and uptime are critical, and stable over long production runs.' },
  { title: 'Delivered as a cell', text: 'Integrated with your machines, tooling, fixtures, conveyors, sensors and safety systems, not shipped as a bare arm.' },
  { title: 'Made for real parts', text: 'Programs account for part variation and changing inputs, with sensor and vision feedback where the process needs it.' },
  { title: 'One platform', text: 'Every model runs the same software and follows the same integration and service approach, supported from Ghaziabad.' },
]

export const PRODUCTS = [
  {
    slug: 'cobot',
    name: 'NexC5',
    family: 'Collaborative robot',
    tagline: 'Works beside your people, not behind a fence.',
    summary:
      'NexC5 is a 6-axis collaborative robot with a 5 kg payload and 1 m of reach. It shares the workspace with your operators after a risk assessment, learns new paths by hand guiding, and suits jobs that change often: pick and place, inspection, light machine tending and operator-assisted work.',
    // Three short facts shown on the card and at the top of the detail page
    keyFacts: [
      { label: 'Payload', value: '5 kg' },
      { label: 'Reach', value: '1 m' },
      { label: 'Repeatability', value: '± 0.05 mm' },
    ],
    highlights: [
      { title: 'Safe beside people', text: 'Collaborative operation in close proximity to operators, after an appropriate risk assessment.' },
      { title: 'Teach it by hand', text: 'Guide the arm to set positions and paths. After training, operators change routines without waiting for an engineer.' },
      { title: 'Programs without code', text: 'Graphical drag-and-drop programming with auto-generation, the same software as our industrial robots.' },
      { title: 'Quick changeovers', text: 'Compact and flexible, for small batches and frequent changes. Standard in white, also available in blue.' },
    ],
    bestFor: 'Changing tasks and work beside people',
    collaborative: 'Yes, after a risk assessment',
    applications: ['pick-and-place', 'inspection', 'machine-tending'],
    specs: [
      { group: 'Performance', items: [
        { label: 'Payload', value: '5', unit: 'kg' },
        { label: 'Reach', value: '1000', unit: 'mm' },
        { label: 'Working diameter', value: '1700', unit: 'mm' },
        { label: 'Repeatability', value: '± 0.05', unit: 'mm' },
        { label: 'Top joint speed', value: '200', unit: '°/s' },
      ]},
      { group: 'Build', items: [
        { label: 'Axes', value: '6' },
        { label: 'Weight', value: '70', unit: 'kg' },
        { label: 'Rated power', value: '1.2', unit: 'kW' },
        { label: 'Max. power consumption', value: '1.5', unit: 'kW' },
        { label: 'Colours', value: 'White (standard) or blue' },
      ]},
      { group: 'Control and environment', items: [
        { label: 'Collaborative operation', value: 'Yes, after a risk assessment' },
        { label: 'Teaching', value: 'Hand guiding and graphical software' },
        ...CONTROL('IP65'),
      ]},
    ],
    motion: MOTION,
    media: {
      // Main product photo. Shown on a near-black "stage", so photos on a dark
      // background (or a transparent PNG/AVIF cut-out) look best.
      cover: '/images/renders/cobot-hero.webp', // rendered from the STL model (tools/render.html)
      // Interactive 3D model (packed from the NexC5 STL files). Set to null to hide the 3D viewer.
      model: '/models/cobot.bin',
      // Clip of the product working (muted MP4). Set to null to hide the "In action" section.
      video: '/videos/cobot-dual-spm-integration.mp4',
      poster: '/videos/cobot-dual-spm-integration.jpg',
      // Gallery: images or MP4 videos. Add or remove entries freely; an empty list hides the section.
      gallery: [
        // renders from the NexC5 STL files and URDF (2026-11-17), tools/render.html (&color=1d5fd6 for blue)
        { src: '/images/renders/cobot-hero.webp', caption: 'NexC5 in white, three-quarter view' },
        { src: '/images/renders/cobot-hero-blue.webp', caption: 'NexC5 in blue' },
        { src: '/images/renders/cobot-side.webp', caption: 'NexC5, reaching' },
        { src: '/images/renders/cobot-inspect.webp', caption: 'NexC5, inspection pose' },
        { src: '/images/renders/cobot-side-blue.webp', caption: 'NexC5 in blue, reaching' },
        { src: '/images/renders/cobot-detail.webp', caption: 'NexC5 wrist and tool flange' },
        { src: '/images/booklet/nexc5-white.webp', caption: 'NexC5, studio render from the booklet' },
        { src: '/videos/cobot-dual-spm-integration.mp4', caption: 'NexC5 feeding a dual-SPM line' },
      ],
    },
    brochure: null, // e.g. '/docs/nextup-booklet.pdf'
  },
  {
    // The booklet's table lists NexR5, NexR8, NexR15 and NexR20, and its footnote lists a 10 kg variant.
    // NexR10 uses the NexR8 column (the closest model) with the 10 kg payload. Confirm before launch.
    slug: 'robot',
    name: 'NexR10',
    family: 'Industrial robot',
    tagline: 'Fast, repeatable and built for continuous duty.',
    summary:
      'NexR10 is a 6-axis industrial robot with a 10 kg payload, 1.5 m of reach and ± 0.05 mm repeatability. It is built for fixed, repetitive and load-bearing work where cycle time and uptime matter, and it is delivered as a complete cell around your process.',
    keyFacts: [
      { label: 'Payload', value: '10 kg' },
      { label: 'Reach', value: '1.5 m' },
      { label: 'Repeatability', value: '± 0.05 mm' },
    ],
    highlights: INDUSTRIAL_HIGHLIGHTS,
    bestFor: 'Machine tending and high-volume handling',
    collaborative: 'No, runs behind guarding',
    applications: ['machine-tending', 'pick-and-place', 'welding', 'powder-coating', 'inspection', 'deflashing-and-polishing'],
    specs: [
      { group: 'Performance', items: [
        { label: 'Payload', value: '10', unit: 'kg' },
        { label: 'Reach', value: '1500', unit: 'mm' },
        { label: 'Working diameter', value: '2800', unit: 'mm' },
        { label: 'Repeatability', value: '± 0.05', unit: 'mm' },
        { label: 'Top joint speed', value: '200', unit: '°/s' },
      ]},
      { group: 'Build', items: [
        { label: 'Axes', value: '6' },
        { label: 'Weight', value: 'About 140', unit: 'kg' },
        { label: 'Rated power', value: '1.5', unit: 'kW' },
        { label: 'Mounting', value: 'Floor' },
      ]},
      { group: 'Control and environment', items: [
        { label: 'Collaborative operation', value: 'No, runs behind guarding' },
        ...CONTROL('IP64'),
      ]},
    ],
    motion: MOTION,
    media: {
      cover: '/images/renders/robot-hero.webp', // rendered from the STL model (tools/render.html)
      model: '/models/robot.bin',
      video: '/videos/glass-automation.mp4',
      poster: '/videos/glass-automation.jpg',
      gallery: [
        { src: '/images/renders/robot-hero.webp', caption: 'NexR10, three-quarter view' },
        { src: '/images/renders/robot-side.webp', caption: 'NexR10, reaching' },
        { src: '/images/renders/robot-detail.webp', caption: 'NexR10 wrist and tool flange' },
        { src: '/images/products/robot.avif', caption: 'NexR10, studio photo' },
        { src: '/videos/glass-automation.mp4', caption: 'CNC glass handling' },
        { src: '/videos/cnc-cap-handling.mp4', caption: 'High-speed CNC cap handling' },
      ],
    },
    brochure: null,
  },
  {
    // Robot1 = NexR20 since 2026-11-17 (booklet Table 1.1, NexR20 column). Slug kept so old links work.
    slug: 'robot1',
    name: 'NexR20',
    family: 'Industrial robot',
    tagline: 'Our longest reach and heaviest lift.',
    summary:
      'NexR20 is the heavyweight of the range: a 6-axis industrial robot with a 20 kg payload, 1.8 m of reach and a 3400 mm working diameter. It carries heavy grippers, welding torches and multi-part tooling across large machines and wide fixtures, in cells that run behind guarding.',
    keyFacts: [
      { label: 'Payload', value: '20 kg' },
      { label: 'Reach', value: '1.8 m' },
      { label: 'Repeatability', value: '± 0.1 mm' },
    ],
    highlights: INDUSTRIAL_HIGHLIGHTS,
    bestFor: 'Heavy parts, long reach and welding',
    collaborative: 'No, runs behind guarding',
    applications: ['welding', 'machine-tending', 'pick-and-place', 'powder-coating', 'deflashing-and-polishing', 'inspection'],
    specs: [
      { group: 'Performance', items: [
        { label: 'Payload', value: '20', unit: 'kg' },
        { label: 'Reach', value: '1800', unit: 'mm' },
        { label: 'Working diameter', value: '3400', unit: 'mm' },
        { label: 'Repeatability', value: '± 0.1', unit: 'mm' },
        { label: 'Top joint speed', value: '200', unit: '°/s' },
      ]},
      { group: 'Build', items: [
        { label: 'Axes', value: '6' },
        { label: 'Weight', value: 'About 250', unit: 'kg' },
        { label: 'Rated power', value: '3', unit: 'kW' },
        { label: 'Mounting', value: 'Floor' },
      ]},
      { group: 'Control and environment', items: [
        { label: 'Collaborative operation', value: 'No, runs behind guarding' },
        ...CONTROL('IP64'),
      ]},
    ],
    motion: MOTION,
    media: {
      cover: '/images/renders/robot1-hero.webp', // rendered from the STL model (tools/render.html)
      model: '/models/robot1.bin',
      video: null, // add '/videos/nexr20.mp4' when you have a clip
      gallery: [
        { src: '/images/renders/robot1-hero.webp', caption: 'NexR20, three-quarter view' },
        { src: '/images/renders/robot1-side.webp', caption: 'NexR20, reaching' },
        { src: '/images/renders/robot1-detail.webp', caption: 'NexR20 forearm and wrist' },
        { src: '/images/booklet/app-welding.webp', caption: 'Welding with a robot arm' },
      ],
    },
    brochure: null,
  },
]

// The full industrial range from the booklet, shown as a table on the Products page.
// The booklet's table has NexR8 in the second column; its footnote and our naming use a 10 kg variant,
// so that column is shown as NexR10 with the NexR8 figures. Confirm with engineering.
export const RANGE = {
  note: 'All models use the same software platform and follow the same integration and service approach.',
  models: ['NexR5', 'NexR10', 'NexR15', 'NexR20'],
  rows: [
    ['Payload', '5 kg', '10 kg', '15 kg', '20 kg'],
    ['Reach', '1500 mm', '1500 mm', '1250 mm', '1800 mm'],
    ['Working diameter', '2800 mm', '2800 mm', '2300 mm', '3400 mm'],
    ['Repeatability', '± 0.05 mm', '± 0.05 mm', '± 0.05 mm', '± 0.1 mm'],
    ['Weight', '~130 kg', '~140 kg', '~150 kg', '~250 kg'],
    ['Rated power', '1.5 kW', '1.5 kW', '2 kW', '3 kW'],
  ],
  common: [['Axes', '6'], ['Programming', 'Graphical drag-and-drop, auto-generation'], ['Temperature', '0 to 80 °C'], ['Protection', 'IP64'], ['I/O', '30 DI / 18 DO'], ['Communication', 'EtherCAT']],
}

export const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug)

// Rows used by the comparison table. Pulled from each product's keyFacts + bestFor.
export const COMPARE_ROWS = ['Works beside people', 'Payload', 'Reach', 'Working diameter', 'Repeatability', 'Weight', 'Rated power', 'Ingress protection', 'Best for']
// Looks in keyFacts first, then in the spec tables (value + unit)
export const compareValue = (p, row) => {
  if (row === 'Best for') return p.bestFor
  if (row === 'Works beside people') return p.collaborative
  const f = p.keyFacts.find((k) => k.label === row)?.value
  if (f) return f
  const s = p.specs.flatMap((g) => g.items).find((i) => i.label === row)
  return s?.value ? `${s.value}${s.unit ? ' ' + s.unit : ''}` : null
}
