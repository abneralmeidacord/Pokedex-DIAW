import { Button } from '../../components/Button/Button'
import { Header } from '../../components/Header/Header'
import './Catalog.css'

export type catalogProps = {
  onOpenPokedex?: () => void
}

export function Catalog({ onOpenPokedex }: catalogProps) {
  return (
    <div className="catalog">
      <Header />
      <main id="inicio" className="catalog__main">
        <section className="catalog__hero" aria-labelledby="catalog-title">
          <div className="catalog__copy">
            <p className="catalog__eyebrow">Sua jornada começa aqui</p>
            <h1 id="catalog-title" className="catalog__title">
              Um mundo de <span>Pokémon</span> para descobrir.
            </h1>
          </div>

        </section>
      </main>
    </div>
  )
}
