import { useState } from 'react'
import { PokemonList } from '../../components/PokemonList/PokemonList'
import { PokemonQuickView } from '../../components/PokemonQuickView/PokemonQuickView'
import { getPokemon } from '../../services/pokedexService'
import type { Pokemon } from '../../types/pokemon'
import './Catalog.css'

const pokemon = getPokemon()

export function Catalog() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)

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
        <PokemonList pokemon={pokemon} onQuickView={setSelectedPokemon} />
      </section>
      <PokemonQuickView
        isOpen={selectedPokemon !== null}
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </section>
  )
}
