import data from '../data/pokedex-data.json'
import type { PokedexData, Pokemon, PokemonType, Trainer } from '../types/pokemon'

const pokedex: PokedexData = data

export function getPokemon(): readonly Pokemon[] {
  return structuredClone(pokedex.pokemon)
}

export function getPokemonById(id: number): Pokemon | undefined {
  const pokemon = pokedex.pokemon.find((pokemon) => pokemon.id === id)
  return pokemon === undefined ? undefined : structuredClone(pokemon)
}

export function getPokemonNeighbors(id: number): { previous: Pokemon | undefined; next: Pokemon | undefined } {
  const index = pokedex.pokemon.findIndex((pokemon) => pokemon.id === id)
  if (index === -1) return { previous: undefined, next: undefined }

  return {
    previous: index > 0 ? structuredClone(pokedex.pokemon[index - 1]) : undefined,
    next: index < pokedex.pokemon.length - 1 ? structuredClone(pokedex.pokemon[index + 1]) : undefined,
  }
}

export function getPokemonTypes(): readonly PokemonType[] {
  return structuredClone(pokedex.types)
}

export function getTrainers(): readonly Trainer[] {
  return structuredClone(pokedex.trainers)
}

export function getTrainersByPokemonId(pokemonId: number): readonly Trainer[] {
  if (!pokedex.pokemon.some((pokemon) => pokemon.id === pokemonId)) return []
  return structuredClone(pokedex.trainers.filter((trainer) => trainer.pokemonIds.includes(pokemonId)))
}

export function getTrainerById(id: number): Trainer | undefined {
  const trainer = pokedex.trainers.find((trainer) => trainer.id === id)
  return trainer === undefined ? undefined : structuredClone(trainer)
}
