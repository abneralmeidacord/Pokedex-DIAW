import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { motion, MotionConfig } from 'motion/react'
import { useReducedMotion } from './hooks/useReducedMotion'
import { MotionPreferencesContext } from './motion/preferences'
import { getMotionTransition, MOTION } from './motion/settings'
import { Header } from './components/Header/Header'
import { Button } from './components/Button/Button'
import { AuthPage } from './pages/Auth/AuthPage'
import { Home } from './pages/Home/Home'
import { Catalog } from './pages/Catalog/Catalog'
import { PokemonDetails } from './pages/PokemonDetails/PokemonDetails'
import { TrainersPage } from './pages/Trainers/TrainersPage'
import { TrainerTeamPage } from './pages/TrainerTeam/TrainerTeamPage'
import { getTrainerIdFromHash } from './utils/routes'
import { getPokemonImageSource } from './utils/pokemonPresentation'
import { getSession, signOut } from './services/authService'
import type { AccountProfile } from './services/authService'
import { loadPokedex } from './services/pokedexService'
import type { Page } from './types/navigation'
import type { PokedexData } from './types/pokemon'
import { EMPTY_CATALOG_FILTERS } from './utils/pokemonFilters'
import type { CatalogFilters } from './utils/pokemonFilters'
import './App.css'

function getPage(): Page {
  if (window.location.hash.startsWith('#pokemon/')) return 'pokemon'
  if (getTrainerIdFromHash(window.location.hash) !== null) return 'treinadores'
  switch (window.location.hash.split('?')[0]) {
    case '#catalogo': return 'catalogo'
    case '#treinadores': return 'treinadores'
    case '#login': return 'login'
    case '#cadastro': return 'cadastro'
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
  login: 'Entrar',
  cadastro: 'Criar conta',
}

type Theme = 'light' | 'dark'

function getSavedTheme(): Theme {
  const savedTheme = localStorage.getItem('pokedex-theme')
  return savedTheme === 'dark' ? 'dark' : 'light'
}

function App() {
  const reducedMotion = useReducedMotion()
  const locationHash = useSyncExternalStore(subscribeToNavigation, getLocationHash)
  const page = getPage()
  const trainerId = getTrainerIdFromHash(locationHash)
  const routeParams = new URLSearchParams(locationHash.split('?')[1] ?? '')
  const pokemonParam = routeParams.get('pokemon')
  const isAuthPage = page === 'login' || page === 'cadastro'
  const [theme, setTheme] = useState<Theme>(getSavedTheme)
  const relatedPokemonId = pokemonParam === null
    ? undefined
    : Number(pokemonParam)
  const mainRef = useRef<HTMLElement>(null)
  const previousLocation = useRef(locationHash)
  const [catalogFilters, setCatalogFilters] = useState<CatalogFilters>(EMPTY_CATALOG_FILTERS)
  const [pokedex, setPokedex] = useState<PokedexData | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [account, setAccount] = useState<AccountProfile | null>()
  const [signingOut, setSigningOut] = useState(false)
  const [signOutFailed, setSignOutFailed] = useState(false)
  const avatar = pokedex?.pokemon.find((record) => record.id === account?.pokemonId)
  const avatarSource = account ? getPokemonImageSource(avatar ?? { id: account.pokemonId }) : undefined

  useEffect(() => {
    const request = new AbortController()
    getSession(request.signal)
      .then((profile) => {
        if (!request.signal.aborted) setAccount((current) => current === undefined ? profile : current)
      })
      .catch(() => {
        if (!request.signal.aborted) setAccount((current) => current ?? null)
      })
    return () => request.abort()
  }, [])

  useEffect(() => {
    if (account && isAuthPage) window.location.replace('#catalogo')
  }, [account, isAuthPage])

  useEffect(() => {
    const request = new AbortController()
    loadPokedex(request.signal).then((data) => {
      if (!request.signal.aborted) setPokedex(data)
    }).catch(() => {
      if (!request.signal.aborted) setLoadFailed(true)
    })
    return () => request.abort()
  }, [loadAttempt])

  useEffect(() => {
    document.title = `${titles[page]} | Pokédex`
    if (previousLocation.current !== locationHash) {
      mainRef.current?.focus({ preventScroll: true })
      window.scrollTo(0, 0)
      previousLocation.current = locationHash
    }
  }, [page, locationHash])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('pokedex-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((current) => current === 'light' ? 'dark' : 'light')
  }
  async function endSession() {
    setSignOutFailed(false)
    setSigningOut(true)
    try {
      await signOut()
      setAccount(null)
    } catch {
      setSignOutFailed(true)
    } finally {
      setSigningOut(false)
    }
  }

  function beginSession(profile: AccountProfile) {
    setAccount(profile)
    window.location.hash = 'catalogo'
  }

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
        <Header
          currentPage={page === 'pokemon' ? 'catalogo' : page}
          account={account}
          avatarSource={avatarSource}
          signingOut={signingOut}
          onSignOut={endSession}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main ref={mainRef} id="conteudo" className="app__main" tabIndex={-1}>
          {signOutFailed && <p className="app__data-status" role="alert">Não foi possível sair. Tente novamente.</p>}
          <motion.div
            key={locationHash}
            className="app__screen"
            initial={reducedMotion ? false : { opacity: 0.85, y: MOTION.distance.page }}
            animate={{ opacity: 1, y: 0 }}
            transition={getMotionTransition(reducedMotion)}
          >
            {page === 'inicio' && <Home />}
            {isAuthPage && account === undefined && (
              <p className="app__data-status" role="status">Verificando sua sessão…</p>
            )}
            {page === 'login' && account === null && (
              <AuthPage mode="login" justRegistered={routeParams.get('cadastro') === 'ok'} onSignedIn={beginSession} />
            )}
            {page === 'cadastro' && account === null && pokedex && (
              <AuthPage mode="cadastro" pokemon={pokedex.pokemon} onSignedIn={beginSession} />
            )}
            {page !== 'inicio' && page !== 'login' && pokedex === null && (!isAuthPage || account === null) && (
              <div className="app__data-status">
                {loadFailed ? (
                  <>
                    <p role="alert">Não foi possível carregar os dados da Pokédex.</p>
                    <Button variant="secondary" onClick={() => {
                      setLoadFailed(false)
                      setLoadAttempt((attempt) => attempt + 1)
                    }}>
                      Tentar novamente
                    </Button>
                  </>
                ) : <p role="status">Carregando a Pokédex…</p>}
              </div>
            )}
            {page === 'catalogo' && pokedex && (
              <Catalog
                pokedex={pokedex}
                filters={catalogFilters}
                onFiltersChange={setCatalogFilters}
                onViewDetails={(id) => { window.location.hash = `pokemon/${id}` }}
              />
            )}
            {page === 'pokemon' && pokedex && (
              <PokemonDetails pokedex={pokedex} pokemonId={Number(locationHash.slice('#pokemon/'.length))} />
            )}
            {page === 'treinadores' && pokedex && (
              trainerId === null ? (
                <TrainersPage
                  pokedex={pokedex}
                  pokemonId={relatedPokemonId}
                />
              ) : (
                <TrainerTeamPage pokedex={pokedex} trainerId={trainerId} />
              )
            )}
          </motion.div>
        </main>
      </MotionConfig>
    </MotionPreferencesContext.Provider>
  )
}

export default App
