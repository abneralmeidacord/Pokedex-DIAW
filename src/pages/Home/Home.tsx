import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button/Button'
import { PokedexCover } from '../../components/PokedexCover/PokedexCover'
import type { PokedexCoverState } from '../../components/PokedexCover/PokedexCover'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './Home.css'

export type HomeProps = {
  catalogHref?: string
}

export function Home({ catalogHref = '#catalogo' }: HomeProps) {
  const [deviceState, setDeviceState] = useState<PokedexCoverState>('closed')
  const phase = useRef<PokedexCoverState | 'complete'>('closed')
  const mounted = useRef(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const navigateToCatalog = useCallback(() => {
    if (!mounted.current || phase.current === 'complete') return
    phase.current = 'complete'
    window.location.assign(catalogHref)
  }, [catalogHref])

  useEffect(() => {
    if (prefersReducedMotion && (phase.current === 'opening' || phase.current === 'open')) {
      navigateToCatalog()
    }
  }, [prefersReducedMotion, navigateToCatalog])

  function openPokedex() {
    if (!mounted.current || phase.current !== 'closed') return
    if (prefersReducedMotion) {
      navigateToCatalog()
      return
    }
    phase.current = 'opening'
    setDeviceState('opening')
  }

  function finishOpening() {
    if (!mounted.current || phase.current !== 'opening') return
    phase.current = 'open'
    setDeviceState('open')
  }

  function enterCatalog() {
    if (!mounted.current || phase.current !== 'open') return
    navigateToCatalog()
  }

  return (
    <div className="home">
      <section className="home__hero" aria-labelledby="home-title">
        <div className="home__copy">
          <div className="home__eyebrow-container">
            <p className="home__eyebrow">Gotta catch them all</p>
          </div>
          <h1 id="home-title" className="home__title">Pokédex</h1>
          <h2 className="home__subtitle">
            Sua próxima aventura<br />começa aqui.
          </h2>
          <p className="home__description">
            Conheça os Pokémon, descubra seus atributos e encontre os parceiros dos seus treinadores favoritos.
          </p>
          <Button className="home__action" onClick={openPokedex} disabled={deviceState !== 'closed'} endIcon={'\u2192'}>
            {deviceState === 'closed' ? 'Abrir Pokédex' : 'Abrindo Pokédex...'}
          </Button>
          <button className="home__skip" type="button" onClick={navigateToCatalog}>
            {deviceState === 'closed' ? 'Entrar sem animação' : 'Pular animação'}
          </button>
        </div>

        <div className="home__visual">
          <PokedexCover state={deviceState} onOpen={openPokedex} onOpeningComplete={finishOpening} onReady={enterCatalog} />
        </div>
      </section>
    </div>
  )
}
