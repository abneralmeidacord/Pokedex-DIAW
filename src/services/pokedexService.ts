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

export function getPokemonTypes(): readonly PokemonType[] {
  return structuredClone(pokedex.types)
}

export function getTrainers(): readonly Trainer[] {
  return structuredClone(pokedex.trainers)
}

export function getTrainerById(id: number): Trainer | undefined {
  const trainer = pokedex.trainers.find((trainer) => trainer.id === id)
  return trainer === undefined ? undefined : structuredClone(trainer)
}
