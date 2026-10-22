import { useEffect, useRef, useSyncExternalStore } from 'react'
import { Header } from './components/Header/Header'
import { Home } from './pages/Home/Home'
import { Catalog } from './pages/Catalog/Catalog'
import { Treinador } from './pages/Treinador/Treinador'
import type { Page } from './types/navigation'
import './App.css'

function getPage(): Page {
  switch (window.location.hash) {
    case '#catalogo': return 'catalogo'
    case '#treinadores': return 'treinadores'
    default: return 'inicio'
  }
}

function subscribeToNavigation(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const titles: Record<Page, string> = {
  inicio: 'Início',
  catalogo: 'Catálogo',
  treinadores: 'Treinadores',
}

function App() {
  const page = useSyncExternalStore(subscribeToNavigation, getPage)
  const mainRef = useRef<HTMLElement>(null)
  const previousPage = useRef(page)

  useEffect(() => {
    document.title = `${titles[page]} | Pokédex`
    if (previousPage.current !== page) {
      mainRef.current?.focus({ preventScroll: true })
      window.scrollTo(0, 0)
      previousPage.current = page
    }
  }, [page])

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
      <Header currentPage={page} />
      <main ref={mainRef} id="conteudo" className="app__main" tabIndex={-1}>
        {page === 'inicio' && <Home />}
        {page === 'catalogo' && <Catalog />}
        {page === 'treinadores' && <Treinador />}
      </main>
    </>
  )
}

export default App
