import { useState } from 'react'
import pokeball from '../../assets/figma/pokeball-brand.svg'
import './AccountAvatar.css'

type AccountAvatarProps = {
  src?: string
  alt?: string
  size?: 'small' | 'preview'
}

export function AccountAvatar({ src, alt = '', size = 'small' }: AccountAvatarProps) {
  const [failedSource, setFailedSource] = useState<string>()
  const source = src && src !== failedSource ? src : pokeball

  return (
    <img
      className={`account-avatar account-avatar--${size}`}
      src={source}
      alt={alt}
      onError={() => { if (src === source) setFailedSource(src) }}
    />
  )
}
