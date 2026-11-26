import type { ReactNode } from 'react'
import type { AccountProfile } from '../../services/authService'
import type { Page } from '../../types/navigation'
import { AccountAvatar } from '../AccountAvatar/AccountAvatar'
import { Button } from '../Button/Button'
import './Header.css'

export type HeaderProps = {
  brand?: string
  homeHref?: string
  currentPage?: Page
  account?: AccountProfile | null
  avatarSource?: string
  signingOut?: boolean
  onSignOut?: () => void
  children?: ReactNode
}

export function Header({
  brand = 'Pokédex',
  homeHref = '#inicio',
  currentPage = 'inicio',
  account,
  avatarSource,
  signingOut,
  onSignOut,
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
          {account ? (
            <div className="header__account">
              <AccountAvatar src={avatarSource} />
              <span className="header__username" title={account.username}>{account.username}</span>
              <Button variant="secondary" className="header__auth-button" onClick={onSignOut} disabled={signingOut}>
                {signingOut ? 'Saindo…' : 'Sair'}
              </Button>
            </div>
          ) : account === null && (
            <Button
              href="#login"
              variant="secondary"
              className="header__auth-button"
              aria-current={currentPage === 'login' ? 'page' : undefined}
            >
              Entrar
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
