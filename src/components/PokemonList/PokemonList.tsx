import { PokemonCard } from '../PokemonCard/PokemonCard'
import type { Pokemon } from '../../types/pokemon'
import './PokemonList.css'

export type PokemonListProps = {
  pokemon: readonly Pokemon[]
  onQuickView?: (pokemon: Pokemon) => void
}

export function PokemonList({ pokemon, onQuickView }: PokemonListProps) {
  return (
    <ul className="pokemon-list" aria-label="Catálogo de Pokémon">
      {pokemon.map((pokemon) => (
        <li className="pokemon-list__item" key={pokemon.id}>
          <PokemonCard pokemon={pokemon} onQuickView={onQuickView} />
        </li>
      ))}
    </ul>
  )
}
