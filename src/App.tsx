import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { motion, MotionConfig } from 'motion/react'
import { useReducedMotion } from './hooks/useReducedMotion'
import { MotionPreferencesContext } from './motion/preferences'
import { getMotionTransition, MOTION } from './motion/settings'
import { Header } from './components/Header/Header'
import { Home } from './pages/Home/Home'
import { Catalog } from './pages/Catalog/Catalog'
import { PokemonDetails } from './pages/PokemonDetails/PokemonDetails'
import { TrainersPage } from './pages/Trainers/TrainersPage'
import { TrainerTeamPage } from './pages/TrainerTeam/TrainerTeamPage'
import { getTrainerIdFromHash } from './utils/routes'
import type { Page } from './types/navigation'
import { EMPTY_CATALOG_FILTERS } from './utils/pokemonFilters'
import type { CatalogFilters } from './utils/pokemonFilters'
import './App.css'

function getPage(): Page {
  if (window.location.hash.startsWith('#pokemon/')) return 'pokemon'
  if (getTrainerIdFromHash(window.location.hash) !== null) return 'treinadores'
  switch (window.location.hash.split('?')[0]) {
    case '#catalogo': return 'catalogo'
    case '#treinadores': return 'treinadores'
    default: return 'inicio'
  }
}

function getLocationHash() {
  return window.location.hash
}

function subscribeToNavigation(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const titles: Record<Page, string> = {
  inicio: 'Início',
  catalogo: 'Catálogo',
  treinadores: 'Treinadores',
  pokemon: 'Ficha do Pokémon',
}

function App() {
  const reducedMotion = useReducedMotion()
  const locationHash = useSyncExternalStore(subscribeToNavigation, getLocationHash)
  const page = getPage()
  const trainerId = getTrainerIdFromHash(locationHash)
  const pokemonParam = new URLSearchParams(
    locationHash.split('?')[1] ?? ''
  ).get('pokemon')

  const relatedPokemonId = pokemonParam === null
    ? undefined
    : Number(pokemonParam)
  const mainRef = useRef<HTMLElement>(null)
  const previousLocation = useRef(locationHash)
  const [catalogFilters, setCatalogFilters] = useState<CatalogFilters>(EMPTY_CATALOG_FILTERS)


  useEffect(() => {
    document.title = `${titles[page]} | Pokédex`
    if (previousLocation.current !== locationHash) {
      mainRef.current?.focus({ preventScroll: true })
      window.scrollTo(0, 0)
      previousLocation.current = locationHash
    }
  }, [page, locationHash])

  return (
    <MotionPreferencesContext.Provider value={reducedMotion}>
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'} transition={getMotionTransition(reducedMotion)}>
        <a
          className="app__skip-link"
          href="#conteudo"
          onClick={(event) => {
            event.preventDefault()
            mainRef.current?.focus()
          }}
        >
          Pular para o conteúdo
        </a>
        <Header currentPage={page === 'pokemon' ? 'catalogo' : page} />
        <main ref={mainRef} id="conteudo" className="app__main" tabIndex={-1}>
          <motion.div
            key={locationHash}
            className="app__screen"
            initial={reducedMotion ? false : { opacity: 0.85, y: MOTION.distance.page }}
            animate={{ opacity: 1, y: 0 }}
            transition={getMotionTransition(reducedMotion)}
          >
            {page === 'inicio' && <Home />}
            {page === 'catalogo' && (
              <Catalog
                filters={catalogFilters}
                onFiltersChange={setCatalogFilters}
                onViewDetails={(id) => { window.location.hash = `pokemon/${id}` }}
              />
            )}
            {page === 'pokemon' && <PokemonDetails key={locationHash} pokemonId={Number(locationHash.slice('#pokemon/'.length))} />}
            {page === 'treinadores' && (
              trainerId === null ? (
                <TrainersPage
                  key={locationHash}
                  pokemonId={relatedPokemonId}
                />
              ) : (
                <TrainerTeamPage trainerId={trainerId} />
              )
            )}
          </motion.div>
        </main>
      </MotionConfig>
    </MotionPreferencesContext.Provider>
  )
}

export default App
