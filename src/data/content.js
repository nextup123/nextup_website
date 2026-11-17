
// All site copy that is not product-specific lives here. Edit freely.

export const SITE = {
  // Full-screen hero background. Clips play one after another, then loop.
  heroVideos: [
    { src: '/videos/glass-automation.mp4', poster: '/videos/glass-automation.jpg', label: 'CNC glass handling' },
    { src: '/videos/cnc-cap-handling.mp4', poster: '/videos/cnc-cap-handling.jpg', label: 'High-speed cap handling' },
    { src: '/videos/cobot-dual-spm-integration.mp4', poster: '/videos/cobot-dual-spm-integration.jpg', label: 'NexC5 + dual SPM line' },
  ],
  name: 'Nextup Robotics',
  phone: '918076369462',
  phoneLabel: '+91 80763 69462',
  email: 'nextuprobotics@gmail.com',
  city: 'Ghaziabad, India',
  offices: [
    { label: 'Registered', lines: ['5/189, Chiranjeev Vihar,', 'Ghaziabad, UP 201001'] },
    { label: 'Branch', lines: ['B2, Industrial Area, Udyog Kunj,', 'Ghaziabad, UP 201015'] },
  ],
  social: [
    ['YouTube', 'https://www.youtube.com/@nextuprobotics'],
    ['LinkedIn', 'https://www.linkedin.com/company/nextup-robotics/'],
    ['Facebook', 'https://www.facebook.com/nextuprobotics/'],
    ['Instagram', 'https://www.instagram.com/nextuprobotics/'],
    ['X', 'https://x.com/NextupRobotics'],
  ],
}

export const STATS = [
  { value: 24, suffix: ' hrs', label: 'On-site support' },
  { value: 6, suffix: '', label: 'Applications' },
  { value: 10, suffix: '', label: 'Recognitions' },
  { value: 100, suffix: '%', label: 'Made in India' },
]

// `image` can be a photo or an MP4. Photos fill their frame unless `fit: 'contain'` is set
// (used for the robot renders on a black background).
export const APPS = [
  { slug: 'pick-and-place', name: 'Pick and place', image: '/images/booklet/app-pick-and-place.webp', blurb: 'Move parts between stations, trays and conveyors at a steady rhythm.', replaces: 'Repetitive lifting and sorting at the end of a line.', gains: ['The same cycle time in every shift', 'Fewer dropped, scratched or misplaced parts', 'Operators move to setup and checking work'], fits: ['Packaging', 'Assembly', 'Electronics'] },
  { slug: 'powder-coating', name: 'Powder coating and spraying', image: '/images/booklet/app-spray-coating.webp', blurb: 'Spray powder, paint and other coatings evenly while people stay out of the booth.', replaces: 'Manual spraying in dusty booths.', gains: ['Even coating, part after part', 'Less wasted powder', 'People kept away from fine dust'], fits: ['Coating and finishing units', 'Metal fabrication', 'Auto parts'] },
  { slug: 'machine-tending', name: 'CNC machine tending', image: '/images/booklet/app-machine-tending.webp', blurb: 'Load and unload CNC, VMC and HMC machines so the spindle keeps cutting.', replaces: 'Standing at the machine, waiting for the cycle to end.', gains: ['Machines keep running through breaks and shift changes', 'Gentle, repeatable part handling', 'One person can watch several machines'], fits: ['CNC machining units', 'Glass processing', 'Forging'] },
  { slug: 'inspection', name: 'Vision inspection', image: '/images/booklet/app-inspection.webp', blurb: 'Check every part with a camera, and correct the robot’s motion from what it sees.', replaces: 'Visual checks at the end of a shift.', gains: ['The same standard on part one and part ten thousand', 'Defects caught before they travel downstream', 'Vision-based motion correction for parts that vary'], fits: ['Automotive', 'Consumer goods', 'Precision parts'] },
  { slug: 'welding', name: 'Welding and spot welding', image: '/images/booklet/app-welding.webp', blurb: 'Lay consistent seams and spot welds while the welder stays out of the fumes.', replaces: 'Hand welding of repeat jobs.', gains: ['Consistent seam quality', 'Less exposure to heat, arc and fumes', 'Faster repeat jobs once the program is set'], fits: ['Metal fabrication', 'Automotive and auto components', 'Structures'] },
  { slug: 'deflashing-and-polishing', name: 'Deflashing and polishing', image: '/images/renders/robot1-side.webp', blurb: 'Trim, grind and polish to the same finish every time.', replaces: 'Hand grinding and buffing.', gains: ['A uniform finish across a batch', 'Less dust and noise for people', 'Less rework and scrap'], fits: ['Metal casting', 'Moulded parts', 'Metal products'], fit: 'contain' },
]
export const getApp = (slug) => APPS.find((a) => a.slug === slug)

export const FOUR = [
  { title: 'Repetitive', text: 'The same motion, thousands of times a shift.' },
  { title: 'Hazardous', text: 'Heat, fumes, dust and heavy loads.' },
  { title: 'Precise', text: 'Tolerances a tired hand cannot hold.' },
  { title: 'Relentless', text: 'Work that should not stop at shift change.' },
]

export const PROJECTS = [
  { tag: 'Glass handling', video: '/videos/glass-automation.mp4', poster: '/videos/glass-automation.jpg', title: 'CNC glass handling automation', challenge: 'Glass is fragile, and every CNC cycle needed a careful pair of hands.', built: 'A robot that loads and unloads in sync with the CNC, so sheets move without breakage.', stats: [{ label: 'Cycle time', value: null }, { label: 'Breakage', value: null }, { label: 'Payback', value: null }], product: 'robot' },
  { tag: 'High-speed CNC', video: '/videos/cnc-cap-handling.mp4', poster: '/videos/cnc-cap-handling.jpg', title: 'High-speed CNC cap handling', challenge: 'Joint caps needed fast loading, and the machine sat idle between operator visits.', built: 'A robot cell that loads and unloads caps in sync with the CNC, cutting idle time.', stats: [{ label: 'Cycle time', value: null }, { label: 'Idle time', value: null }, { label: 'Payback', value: null }], product: 'robot' },
  { tag: 'NexC5 + dual SPM', video: '/videos/cobot-dual-spm-integration.mp4', poster: '/videos/cobot-dual-spm-integration.jpg', title: 'NexC5 cobot with dual-SPM integration', challenge: 'Raw parts had to be fed into a dual-SPM line by hand, close to moving machinery.', built: 'A collaborative robot that feeds parts with safe, precise transfer into both machines.', stats: [{ label: 'Parts per hour', value: null }, { label: 'Operator effort', value: null }, { label: 'Payback', value: null }], product: 'cobot' },
]

// Follows the booklet's "typical reference deployment process"
export const STEPS = [
  { title: 'Study', text: 'Factory study and process understanding: we walk your floor and map the task, the machines and the cycle.' },
  { title: 'Prepare', text: 'System preparation: robot, control cabinet, tooling, fixtures, vision and safety, designed around your line.' },
  { title: 'Program and test', text: 'We program the cell and test it in-house against your real parts before it ships.' },
  { title: 'Install', text: 'On-site installation and commissioning, with your operators trained on the client interface.' },
  { title: 'Monitor', text: 'We watch the first production runs and support you on site within 24 hours after that.' },
]

export const RECOGNITION = [
  { name: 'Startup India', logo: '/logos/startup-india.avif' },
  { name: 'MeitY, Government of India', logo: '/logos/ministry-n-i-t.avif' },
  { name: 'MeitY Startup Hub', logo: '/logos/meity.avif' },
  { name: 'STPI', logo: '/logos/stpi.avif' },
  { name: 'IIT Mandi', logo: '/logos/iit-mandi.avif' },
  { name: 'Start in UP', logo: '/logos/start-up.avif' },
  { name: 'Innovation Hub Uttar Pradesh', logo: '/logos/innovation-hub.avif' },
  { name: 'AKTU', logo: '/logos/aktu.avif' },
  { name: 'DTU / DFI', logo: '/logos/dtu.avif' },
  { name: 'iHUB DivyaSampark', logo: '/logos/ihub.avif' },
]

export const FAQ = [
  { q: 'Do I need to change my whole line to add a robot?', a: 'No. We start with one manual point on your existing line and design the cell around the machines you already have.' },
  { q: 'Cobot or industrial robot: which one do I need?', a: 'If people need to work close to the robot, or the task changes often, the NexC5 cobot usually fits. For fixed, repetitive or load-bearing work where cycle time and uptime matter, an industrial robot (NexR10 or NexR20) in a guarded cell is usually better. We choose the robot from your process, not from a model list. Use the product finder above or ask us.' },
  { q: 'How long does it take to install?', a: 'It depends on the cell. After the Discover and Design steps you get a timeline with your proposal.' },
  { q: 'What support do I get after installation?', a: 'We train your operators during deployment and support you on site within 24 hours.' },
  { q: 'How fast will it pay for itself?', a: 'Try the payback calculator for a rough number, then ask us for an exact estimate based on your line.' },
]

export const NEXT = [
  'We read your message and reply on WhatsApp or by phone.',
  'We look at your floor, in person or on a video call.',
  'You receive a proposal with a layout and a payback estimate.',
]

export const INDUSTRIES = ['Metal fabrication and casting', 'Automotive and auto components', 'Coating and finishing', 'CNC machining', 'Glass processing', 'General manufacturing', 'Other']

// Industries from the booklet, shown as a list on the home page
export const SECTORS = ['Metal fabrication and casting', 'Automotive and auto components', 'Coating and finishing units', 'CNC machining units', 'General manufacturing']

// "Control and programming" and "Complete automation system" from the booklet
export const PLATFORM = {
  software: {
    image: '/images/renders/cobot-hero-blue.webp', // render on a black stage
    caption: 'The same software runs every NexC5, NexR10 and NexR20',
    title: 'Program by drawing, not by typing.',
    text: 'Every Nextup robot runs the same graphical, node-based programming environment, built for the factory floor on a modular architecture with ROS 2 at the system level. Build, change and test robot logic visually, without text-based code.',
    points: [
      ['Modular logic trees', 'Programs branch on conditions and vision inputs, with error handling built in.'],
      ['Clear separation', 'Motion, I/O, sensor feedback and fallback behaviour are kept apart, so programs stay reliable and easy to maintain.'],
      ['Client control interface', 'Operators run the cell day to day from a simple interface. After training they can change paths themselves.'],
      ['Auto-generation', 'Drag-and-drop programming that generates the routine for you, on the cobot and the industrial robots alike.'],
    ],
  },
  system: {
    image: '/videos/glass-automation.mp4',
    poster: '/videos/glass-automation.jpg',
    caption: 'A complete cell: CNC glass handling',
    title: 'One supplier for the whole cell.',
    text: 'We take single-point responsibility for the complete automation system. The robot is never delivered on its own: it arrives as part of a cell that fits your process, your machines and your operators.',
    core: ['Robot or cobot', 'Industrial control cabinet', 'Control software', 'Base program logic'],
    options: ['Conveyors', 'CNC machine interfaces', 'Hydraulic and pneumatic systems', 'Grippers and fixtures', 'Vision systems', 'Safety scanners and fencing', 'PLC integration', 'Custom cells and operator training'],
  },
}
