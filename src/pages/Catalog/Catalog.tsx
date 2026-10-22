import { PokemonList } from '../../components/PokemonList/PokemonList'
import { getPokemon } from '../../services/pokedexService'
import './Catalog.css'

const pokemon = getPokemon()

export function Catalog() {
  return (
    <section className="catalog" aria-labelledby="catalog-title">
      <div className="catalog__heading">
        <p className="catalog__eyebrow">Descubra. Conheça. Explore.</p>
        <h1 id="catalog-title" className="catalog__title">Explore a Pokédex</h1>
      </div>
      <section className="catalog__collection" aria-labelledby="catalog-collection-title">
        <div className="catalog__collection-heading">
          <h2 className="catalog__collection-title" id="catalog-collection-title">Explore o catálogo</h2>
          <p className="catalog__hint">Selecione um Pokémon para ver seus atributos.</p>
        </div>
        <PokemonList pokemon={pokemon} />
      </section>
    </section>
  )
}
