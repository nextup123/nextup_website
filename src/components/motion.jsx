import { useEffect, useRef, useState } from 'react'
import { useBootReady } from '../boot'
import { motion, useInView, animate, useReducedMotion, useScroll, useTransform } from 'framer-motion'

export const ease = [0.2, 0.7, 0.2, 1]

/* Fades + slides children in when they scroll into view. */
export function Reveal({ children, delay = 0, y = 32, as = 'div', className, style, ...rest }) {
  const M = motion[as]
  return (
    <M
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.7, delay, ease }}
      {...rest}
    >
      {children}
    </M>
  )
}

/* Parent that staggers its <StaggerItem> children. */
export function Stagger({ children, className, style, gap = 0.08, as = 'div' }) {
  const M = motion[as]
  return (
    <M
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </M>
  )
}
export const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}
export function StaggerItem({ children, as = 'div', ...rest }) {
  const M = motion[as]
  return <M variants={itemVariants} {...rest}>{children}</M>
}

/* Number that counts up when it scrolls into view. */
export function Counter({ to, suffix = '', duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, { duration, ease, onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, to, duration, reduce])
  return <span ref={ref}>{v}{suffix}</span>
}

/* Wraps each page for a soft enter/exit transition. */
export function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
    >
      {children}
    </motion.div>
  )
}

/* Big headline whose lines rise out of a mask, one after another. */
export function Lines({ lines, as = 'h1', className = '', delay = 0, inView = false }) {
  const M = motion[as]
  const ready = useBootReady() // wait for the loading screen before the intro plays
  const anim = inView
    ? { initial: 'h', whileInView: ready ? 's' : undefined, viewport: { once: true, margin: '0px 0px -10% 0px' } }
    : { initial: 'h', animate: ready ? 's' : 'h' }
  return (
    <M className={'lines ' + className} {...anim} variants={{ h: {}, s: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}>
      {lines.map((l, i) => (
        <span className="line-mask" key={i}>
          <motion.span className="line" variants={{ h: { y: '108%' }, s: { y: '0%', transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] } } }}>{l}</motion.span>
        </span>
      ))}
    </M>
  )
}

/* Paragraph whose words light up as it scrolls through the screen. */
export function ScrollWords({ text, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={'scroll-words ' + className}>
      {words.map((w, i) => <Word key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
    </p>
  )
}
function Word({ children, p, range }) {
  const o = useTransform(p, range, [0.16, 1])
  return <motion.span style={{ opacity: o }}>{children} </motion.span>
}
