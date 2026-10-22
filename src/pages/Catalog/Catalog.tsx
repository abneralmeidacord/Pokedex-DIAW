import { Header } from '../../components/Header/Header'
import './Catalog.css'

export function Catalog() {
  return (
    <div className="catalog">
      <Header />
      <main id="inicio" className="catalog__main">
        <section className="catalog__hero" aria-labelledby="catalog-title">
          <div className="catalog__copy">
            <div className="catalog__eyebrow-container">
              <p className="catalog__eyebrow">Descubra novos Pokémons</p>
            </div>
            <h1 id="catalog-title" className="catalog__title">
              Explore a Pokédex.
            </h1>
          </div>

        </section>
      </main>
    </div>
  )
}
