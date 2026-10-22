import { useEffect, useRef, useSyncExternalStore } from 'react'
import { Header } from './components/Header/Header'
import { Home } from './pages/Home/Home'
import { Catalog } from './pages/Catalog/Catalog'
import { Treinador } from './pages/Treinador/Treinador'
import { PokemonDetails } from './pages/PokemonDetails/PokemonDetails'
import type { Page } from './types/navigation'
import './App.css'

function getPage(): Page {
  if (window.location.hash.startsWith('#pokemon/')) return 'pokemon'
  switch (window.location.hash) {
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
  const locationHash = useSyncExternalStore(subscribeToNavigation, getLocationHash)
  const page = getPage()
  const mainRef = useRef<HTMLElement>(null)
  const previousLocation = useRef(locationHash)

  useEffect(() => {
    document.title = `${titles[page]} | Pokédex`
    if (previousLocation.current !== locationHash) {
      mainRef.current?.focus({ preventScroll: true })
      window.scrollTo(0, 0)
      previousLocation.current = locationHash
    }
  }, [page, locationHash])

  return (
    <>
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
        {page === 'inicio' && <Home />}
        {page === 'catalogo' && <Catalog onViewDetails={(id) => { window.location.hash = `pokemon/${id}` }} />}
        {page === 'pokemon' && <PokemonDetails key={locationHash} pokemonId={Number(locationHash.slice('#pokemon/'.length))} />}
        {page === 'treinadores' && <Treinador />}
      </main>
    </>
  )
}

export default App
