import type { ReactNode } from 'react'
import './Header.css'

export type HeaderProps = {
  brand?: string
  homeHref?: string
  children?: ReactNode
}

export function Header({ brand = 'Pokédex', homeHref = '#inicio', children }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__content">
        <a className="header__brand" href={homeHref} aria-label={`${brand} — início`}>
          <span className="header__mark" aria-hidden="true" />
          {brand}
        </a>
        {children && <nav className="header__navigation" aria-label="Principal">{children}</nav>}
      </div>
    </header>
  )
}
