import { useState } from 'react'
import { PokemonList } from '../../components/PokemonList/PokemonList'
import { PokemonQuickView } from '../../components/PokemonQuickView/PokemonQuickView'
import { getPokemon } from '../../services/pokedexService'
import './Catalog.css'

const pokemon = getPokemon()

export type CatalogProps = {
  onViewDetails?: (id: number) => void
}

export function Catalog({ onViewDetails }: CatalogProps) {
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null)
  const selectedPokemon = pokemon.find((record) => record.id === selectedPokemonId) ?? null

  function handleViewDetails(id: number) {
    if (!onViewDetails || selectedPokemon?.id !== id) return
    setSelectedPokemonId(null)
    onViewDetails(id)
  }

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
        <PokemonList pokemon={pokemon} onQuickView={(record) => setSelectedPokemonId(record.id)} />
      </section>
      <PokemonQuickView
        isOpen={selectedPokemon !== null}
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemonId(null)}
        onViewDetails={onViewDetails ? handleViewDetails : undefined}
      />
    </section>
  )
}
