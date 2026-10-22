import { useState } from 'react'
import './TrainerPortrait.css'

export type TrainerPortraitProps = {
  name: string
  src?: string | null
  size?: 'md' | 'lg'
}

export function TrainerPortrait({ name, src, size = 'md' }: TrainerPortraitProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const hasImage = Boolean(src) && failedSrc !== src
  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <span className={`trainer-portrait trainer-portrait--${size}`}>
      {hasImage && src ? (
        <img
          className="trainer-portrait__image"
          src={src}
          alt={`Retrato de ${name}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span className="trainer-portrait__fallback" aria-hidden="true">{initial}</span>
      )}
    </span>
  )
}