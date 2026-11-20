# Nextup Robotics website (React + Vite + Framer Motion + three.js)

## Run it

    npm install
    npm run dev        # open http://localhost:5173
    npm run build      # production build in /dist
    npm run preview    # preview the production build

The contact form sends enquiries to the release hub when built with `VITE_CONTACT_API=https://<hub>` (see `.env.example`); they appear in the hub's enquiries dashboard at `https://<hub>/admin`. Without it, the form opens the visitor's email app.

Deploys as a static site on Netlify or Vercel (`public/_redirects` and `vercel.json` make direct links like /products/cobot work).

## Where things live

| What | File |
| --- | --- |
| **Products** (stacked panels, cards, detail pages, compare table, finder, footer) | `src/data/products.js` |
| Applications, projects, steps, FAQ, contact details, offices, hero clips | `src/data/content.js` |
| Colours, type and spacing for light and dark | top of `src/styles.css` (`[data-theme='light']`, `[data-theme='dark']`) |
| Light/dark switching | `src/theme.jsx` (+ the small script in `index.html` that prevents a flash) |
| Interactive 3D robots | `src/components/CobotViewer.jsx`, `src/three/` |
| Pages | `src/pages/` |

## The 3D robots

All three robots (NexC5, NexR10, NexR20; folder and URL names `cobot`, `robot`, `robot1`) have an interactive 3D viewer, built from their STL files
(in `tools/cobot-stl/`, `tools/robot-stl/`, `tools/robot1-stl/`). Each robot's 7 links are packed into one
compact file in `public/models/` (about 350 to 400 KB each). three.js and a model only download when the
viewer is about to scroll into view. The home page has a switcher between the robots.

- Joint positions, colours and poses for each robot are in `src/three/kinematics.js` (`RIGS`). All three use the joint
  origins from their URDFs (`tools/*-stl/*.urdf.xacro`). URDF joints that turn about -Z have `axis: -1`;
  `mesh`, `meshRotZ`, `baseMesh` and `baseRotZ` place a mesh inside its link frame when the STL was exported
  in another frame.
- A product shows a viewer when `media.model` is set in `products.js`. The file name picks the rig
  (`/models/robot1.bin` uses `RIGS.robot1`).
- To repack after the CAD changes: `python3 tools/pack-stl.py tools/robot-stl public/models/robot.bin` (needs numpy).

## Product renders

The product images in `public/images/renders/` (hero, side and detail view per robot, black background)
are rendered from the same 3D models. To re-render, run `npm run dev` and open
`/tools/render.html?rig=robot&view=hero&pose=Ready&w=2400&h=1800` (views: hero, side, detail, top;
poses from `kinematics.js`; add `&j1=120` to turn the base, `&color=1d5fd6` for the blue NexC5). Save the canvas, then convert to WebP.
Full-resolution PNGs were delivered separately.

## Adding a new product

1. Copy one product object in `src/data/products.js` and paste it at the end of `PRODUCTS`.
2. Change `slug` (the URL `/products/<slug>`), `name`, `family`, text, `keyFacts`, `highlights`, `specs` and `applications`.
3. Drop its photo into `public/images/products/` and any video into `public/videos/`, and point its `media` block at them.

It then appears in the home page product stack, the Products page, the compare table, the finder, the footer and
the application pages it is linked to. Any spec set to `null` shows as "To be confirmed".

## Product data source

Specs, the range of motion, the software and complete-system sections, the deployment steps, the applications
and the industries come from the Nextup booklet (Nov 2026). Booklet photos are in `public/images/booklet/`.

> **NexR10** is not in the booklet's spec table (it lists NexR5, NexR8, NexR15 and NexR20; the footnote lists a
> 10 kg variant). NexR10 uses the NexR8 figures with a 10 kg payload. Confirm before launch.

The NexC5 STL files were updated on 2026-11-17 (link1 and link4 are modelled turned 180°; the rig in
`kinematics.js` accounts for it).

## Loading screen

First-time visitors see a branded loader (markup and styles in `index.html`, logic in `src/boot.js`) until the
first page's fonts, images, videos and 3D model have downloaded, so nothing pops in. It gives up after
12 seconds (`MAX_WAIT`) on slow connections. The hero animations start when it fades out.

## Design

- **Palette**: monochrome (porcelain `#F4F5F7` / ink `#0A0D12` in light, graphite `#07090C` / `#F1F3F6` in dark) with one
  signal colour, the logo's blue (`#1660D0` light, `#3B93F0` dark). Product photos and videos sit on true-black
  stages in both themes, because that is how the robots are shot.
- **Type**: Inter Tight for big editorial headlines, Inter for text, JetBrains Mono for technical labels and readouts.
- **Logo**: the mark is redrawn as an SVG (`Mark` in `src/components/ui.jsx`, `public/brand/mark.svg`) so it is crisp
  and works on light backgrounds. The original raster is still in `public/brand/logo.avif`.
- **Motion**: masked headline reveals, scroll-lit statement text, counters, sticky stacked product panels, a cursor
  preview on the applications list, a horizontal project track driven by vertical scroll, a filling process line,
  and a logo marquee. Everything respects the visitor's "reduce motion" setting.
- **Theme**: the toggle in the top bar remembers the choice; first-time visitors get their system setting, and the
  3D scene re-lights itself when the theme changes.
