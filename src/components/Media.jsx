import { useEffect, useRef, useState } from 'react'

/* Shows the real image/video if the file exists in /public.
   Until then it shows a clearly labelled placeholder with the exact file path
   to drop the file into, so nobody has to dig through the code. */
/* Photos and clips show in black and white and turn to colour on hover. On touch screens (no hover)
   they turn to colour while they are mostly in view. Pass color to opt out. */
const NO_HOVER = typeof window !== 'undefined' && window.matchMedia?.('(hover: none)').matches
function useLit(ref, on) {
  const [lit, setLit] = useState(false)
  useEffect(() => {
    if (!on || !ref.current || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setLit(e.intersectionRatio > 0.6), { threshold: [0, 0.6, 1] })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [on, ref])
  return lit
}

export default function Media({ src, label, kind, className = '', fit = 'cover', controls = false, poster, color = false }) {
  const [ok, setOk] = useState(Boolean(src))
  const el = useRef(null)
  const lit = useLit(el, ok && !color && NO_HOVER)
  const cls = (color ? className : `${className} media-bw${lit ? ' lit' : ''}`).trim()
  const isVideo = kind ? kind === 'video' : /\.(mp4|webm|mov)$/i.test(src || '')
  if (!ok)
    return (
      <div className={'ph ' + className} role="img" aria-label={`Placeholder for ${label}`}>
        <span className="ph-icon" aria-hidden="true">{isVideo ? <PlayIcon /> : <PhotoIcon />}</span>
        <span className="ph-label">{isVideo ? 'Video' : 'Photo'}: {label}</span>
        {src && <code>public{src}</code>}
      </div>
    )
  return isVideo ? (
    <video ref={el} className={cls} src={src} poster={poster} autoPlay={!controls} muted={!controls} loop={!controls} controls={controls} playsInline onError={() => setOk(false)} style={{ objectFit: fit }} />
  ) : (
    <img ref={el} className={cls} src={src} alt={label} loading="lazy" onError={() => setOk(false)} style={{ objectFit: fit }} />
  )
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10" /><path d="M10 8.5v7l6-3.5z" fill="currentColor" /></svg>
)
const PhotoIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="M21 16l-5-5-8 8" /></svg>
)
