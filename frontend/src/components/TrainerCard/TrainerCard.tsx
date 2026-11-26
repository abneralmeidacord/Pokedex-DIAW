import { useId } from 'react'
import { motion } from 'motion/react'
import { useMotionPreferences } from '../../motion/preferences'
import { getMotionTransition, MOTION } from '../../motion/settings'
import { TrainerPortrait } from '../TrainerPortrait/TrainerPortrait'
import { formatBadges } from '../../utils/trainerPresentation'
import './TrainerCard.css'

export type TrainerCardProps = {
  name: string
  badges: number
  portraitSrc?: string | null
  teamPreview?: string
  onViewTeam?: () => void
}

export function TrainerCard({
  name,
  badges,
  portraitSrc,
  teamPreview,
  onViewTeam,
}: TrainerCardProps) {
  const nameId = useId()
  const reducedMotion = useMotionPreferences()

  return (
    <motion.article
      className="trainer-card"
      aria-labelledby={nameId}
      whileHover={reducedMotion ? undefined : { y: -MOTION.distance.card }}
      whileTap={reducedMotion ? undefined : { scale: MOTION.pressedScale }}
      transition={getMotionTransition(reducedMotion, MOTION.duration.fast)}
    >
      <header className="trainer-card__header">
        <TrainerPortrait name={name} src={portraitSrc} />
        <div className="trainer-card__identity">
          <h2 className="trainer-card__name" id={nameId}>{name}</h2>
          <p className="trainer-card__badges">{formatBadges(badges)}</p>
        </div>
      </header>

      {teamPreview && <p className="trainer-card__team">{teamPreview}</p>}

      {onViewTeam && (
        <button
          type="button"
          className="trainer-card__link"
          aria-label={`Ver equipe de ${name}`}
          onClick={onViewTeam}
        >
          Ver equipe <span aria-hidden="true">→</span>
        </button>
      )}
    </motion.article>
  )
}
