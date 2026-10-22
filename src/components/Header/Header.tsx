import type { ReactNode } from 'react'
import type { Page } from '../../types/navigation'
import './Header.css'

export type HeaderProps = {
  brand?: string
  homeHref?: string
  currentPage?: Page
  children?: ReactNode
}

export function Header({
  brand = 'Pokédex',
  homeHref = '#inicio',
  currentPage = 'inicio',
  children,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header__content">
        <a
          className="header__brand"
          href={homeHref}
          aria-label={`${brand} - início`}
          aria-current={currentPage === 'inicio' ? 'page' : undefined}
        >
          <span className="header__mark" aria-hidden="true" />
          {brand}
        </a>
        <nav className="header__navigation" aria-label="Principal">
          {children ?? <>
            <a
              href="#catalogo"
              className={`header__link${currentPage === 'inicio' ? ' header__link--pokedex' : ''}`}
              aria-current={currentPage === 'catalogo' ? 'page' : undefined}
            >
              Pokédex
            </a>
            <a
              href="#treinadores"
              className="header__link"
              aria-current={currentPage === 'treinadores' ? 'page' : undefined}
            >
              Treinadores
            </a>
          </>}
        </nav>
      </div>
    </header>
  )
}
