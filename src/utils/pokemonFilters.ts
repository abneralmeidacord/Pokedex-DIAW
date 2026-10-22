import type { Pokemon, PokemonType } from '../types/pokemon'

export type CatalogOrder = 'asc' | 'desc'

export type CatalogFilters = {
    readonly query: string
    readonly typeId: number | null
    readonly order: CatalogOrder
}

export const EMPTY_CATALOG_FILTERS: CatalogFilters = { query: '', typeId: null, order: 'asc' }

export function hasActiveFilters(filters: CatalogFilters): boolean {
    return filters.query.trim() !== '' || filters.typeId !== null || filters.order !== 'asc'
}

export function filterPokemon(
    pokemon: readonly Pokemon[],
    filters: CatalogFilters,
): readonly Pokemon[] {
    const term = filters.query.trim().toLowerCase()
    const idMatch = /^#?(\d+)$/.exec(term)
    const searchedId = idMatch ? Number(idMatch[1]) : null

    const matches = pokemon.filter((record) => {
        const matchesType =
            filters.typeId === null || record.types.some((type) => type.id === filters.typeId)
        const matchesQuery =
            term === '' ||
            (searchedId !== null
                ? record.id === searchedId
                : record.name.toLowerCase().includes(term))
        return matchesType && matchesQuery
    })

    return matches.sort((a, b) => (filters.order === 'asc' ? a.id - b.id : b.id - a.id))
}

export function getUsedTypes(
    types: readonly PokemonType[],
    pokemon: readonly Pokemon[],
): readonly PokemonType[] {
    const used = new Set(pokemon.flatMap((record) => record.types.map((type) => type.id)))
    return types.filter((type) => used.has(type.id))
}