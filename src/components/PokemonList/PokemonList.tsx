import { PokemonCard } from '../PokemonCard/PokemonCard'
import { motion } from 'motion/react'
import { useMotionPreferences } from '../../motion/preferences'
import { getMotionTransition } from '../../motion/settings'
import type { Pokemon } from '../../types/pokemon'
import './PokemonList.css'

export type PokemonListProps = {
  pokemon: readonly Pokemon[]
  onQuickView?: (pokemon: Pokemon, trigger: HTMLButtonElement, clickCount: number) => void
}

export function PokemonList({ pokemon, onQuickView }: PokemonListProps) {
  const reducedMotion = useMotionPreferences()
  return (
    <ul className="pokemon-list" aria-label="Catálogo de Pokémon">
      {pokemon.map((pokemon) => (
        <motion.li className="pokemon-list__item" key={pokemon.id} layout={reducedMotion ? false : 'position'} transition={getMotionTransition(reducedMotion)}>
          <PokemonCard pokemon={pokemon} onQuickView={onQuickView} />
        </motion.li>
      ))}
    </ul>
  )
}
