import './Catalog.css'

export function Catalog() {
  return (
    <section className="catalog" aria-labelledby="catalog-title">
      <div className="catalog__heading">
        <h1 id="catalog-title" className="catalog__title">Explore a Pokédex.</h1>
        <p className="catalog__description">Conheça os Pokémon e descubra seus atributos.</p>
      </div>
      <div className="catalog__grid" role="region" aria-label="Catálogo de Pokémon" />
    </section>
  )
}
