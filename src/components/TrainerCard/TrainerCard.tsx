import { useId, useState } from 'react'
import './TrainerCard.css'

export type TrainerCardProps = {
  name: string
  badges: number
  portraitSrc?: string | null
  teamPreview?: string
  onViewTeam?: () => void
}

function formatBadges(count: number): string {
  return `${count} ${count === 1 ? 'insígnia' : 'insígnias'}`
}

export function TrainerCard({
  name,
  badges,
  portraitSrc,
  teamPreview,
  onViewTeam,
}: TrainerCardProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const nameId = useId()
  const hasPortrait = Boolean(portraitSrc) && failedSrc !== portraitSrc
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <article className="trainer-card" aria-labelledby={nameId}>
      <header className="trainer-card__header">
        <div className="trainer-card__portrait">
          {hasPortrait && portraitSrc ? (
            <img
              className="trainer-card__image"
              src={portraitSrc}
              alt={`Retrato de ${name}`}
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
              onError={() => setFailedSrc(portraitSrc)}
            />
          ) : (
            <span className="trainer-card__fallback" aria-hidden="true">
              {initial}
            </span>
          )}
        </div>
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
    </article>
  )
}