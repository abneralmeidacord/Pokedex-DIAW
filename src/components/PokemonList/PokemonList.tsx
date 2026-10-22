import { PokemonCard } from '../PokemonCard/PokemonCard'
import type { Pokemon } from '../../types/pokemon'
import './PokemonList.css'

export type PokemonListProps = {
  pokemon: readonly Pokemon[]
}

export function PokemonList({ pokemon }: PokemonListProps) {
  return (
    <ul className="pokemon-list" aria-label="Catálogo de Pokémon">
      {pokemon.map((pokemon) => (
        <li className="pokemon-list__item" key={pokemon.id}>
          <PokemonCard pokemon={pokemon} />
        </li>
      ))}
    </ul>
  )
}
