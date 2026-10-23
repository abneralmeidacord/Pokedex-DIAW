import type { Transition } from 'motion/react'

export const MOTION = {
  duration: { fast: 0.12, standard: 0.18, panel: 0.2, wave: 5, float: 3.8 },
  distance: { card: 3, page: 6, panel: 24, float: 10 },
  pressedScale: 0.99,
  ease: [0.22, 1, 0.36, 1],
} as const

export function getMotionTransition(reduced: boolean, duration: number = MOTION.duration.standard): Transition {
  return { duration: reduced ? 0 : duration, ease: MOTION.ease }
}
