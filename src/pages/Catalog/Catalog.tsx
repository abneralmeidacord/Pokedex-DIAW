import { useRef, useState } from 'react'
import { Button } from '../../components/Button/Button'
import { PokemonList } from '../../components/PokemonList/PokemonList'
import { PokemonQuickView } from '../../components/PokemonQuickView/PokemonQuickView'
import { SearchBar } from '../../components/SearchBar/SearchBar'
import { TypeFilter } from '../../components/TypeFilter/TypeFilter'
import { getPokemon, getPokemonTypes } from '../../services/pokedexService'
import {
  EMPTY_CATALOG_FILTERS,
  filterPokemon,
  getUsedTypes,
  hasActiveFilters,
} from '../../utils/pokemonFilters'
import type { CatalogFilters } from '../../utils/pokemonFilters'
import './Catalog.css'

const pokemon = getPokemon()
const types = getUsedTypes(getPokemonTypes(), pokemon)

export type CatalogProps = {
  filters: CatalogFilters
  onFiltersChange: (filters: CatalogFilters) => void
  onViewDetails?: (id: number) => void
}

export function Catalog({ filters, onFiltersChange, onViewDetails }: CatalogProps) {
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null)
  const pendingDetailsId = useRef<number | null>(null)
  const quickViewTrigger = useRef<HTMLElement | null>(null)
  const hasOpenedQuickView = useRef(false)
  const selectedPokemon = pokemon.find((record) => record.id === selectedPokemonId) ?? null
  const visiblePokemon = filterPokemon(pokemon, filters)
  const filtersActive = hasActiveFilters(filters)

  function clearFilters() {
    onFiltersChange(EMPTY_CATALOG_FILTERS)
  }

  function handleViewDetails(id: number) {
    if (!onViewDetails || selectedPokemon?.id !== id || pendingDetailsId.current !== null) return
    pendingDetailsId.current = id
    setSelectedPokemonId(null)
  }

  function handleQuickViewExit() {
    const id = pendingDetailsId.current
    pendingDetailsId.current = null
    if (id !== null) onViewDetails?.(id)
  }

  return (
    <section className="catalog" aria-labelledby="catalog-title">
      <div className="catalog__heading">
        <p className="catalog__eyebrow">Descubra. Conheça. Explore.</p>
        <h1 id="catalog-title" className="catalog__title">Explore a Pokédex</h1>
      </div>

      <div className="catalog__filters">
        <div className="catalog__search-row">
          <div className="catalog__search">
            <SearchBar
              label="Pesquisar Pokémon por nome ou ID"
              value={filters.query}
              onChange={(query) => onFiltersChange({ ...filters, query })}
            />
          </div>
          {filtersActive && (
            <Button variant="secondary" className="catalog__pill" onClick={clearFilters}>
              Limpar
            </Button>
          )}
          <Button
            variant="secondary"
            className="catalog__pill"
            endIcon={filters.order === 'asc' ? '↓' : '↑'}
            aria-label={`Ordenar por ID, ${filters.order === 'asc' ? 'crescente' : 'decrescente'}. Alternar ordem`}
            onClick={() => onFiltersChange({ ...filters, order: filters.order === 'asc' ? 'desc' : 'asc' })}
          >
            ID {filters.order === 'asc' ? 'crescente' : 'decrescente'}
          </Button>
        </div>
        <TypeFilter
          types={types}
          value={filters.typeId}
          onChange={(typeId) => onFiltersChange({ ...filters, typeId })}
        />
      </div>

      <section className="catalog__collection" aria-labelledby="catalog-collection-title">
        <div className="catalog__collection-heading">
          <h2 className="catalog__collection-title" id="catalog-collection-title">Explore o catálogo</h2>
          <p className="catalog__hint">Selecione um Pokémon para uma consulta rápida.</p>
        </div>
        <p className="catalog__count" role="status">
          {visiblePokemon.length} Pokémon {visiblePokemon.length === 1 ? 'encontrado' : 'encontrados'}
        </p>
        {visiblePokemon.length === 0 ? (
          <div className="catalog__empty">
            <h3 className="catalog__empty-title">Nenhum Pokémon encontrado</h3>
            <p className="catalog__empty-text">Tente outro nome, outro ID ou outro tipo.</p>
            <Button variant="secondary" onClick={clearFilters}>Limpar filtros</Button>
          </div>
        ) : (
          <PokemonList pokemon={visiblePokemon} onQuickView={(record, trigger, clickCount) => {
            if (pendingDetailsId.current !== null || (!hasOpenedQuickView.current && clickCount > 1)) return
            hasOpenedQuickView.current = true
            quickViewTrigger.current = trigger
            setSelectedPokemonId(record.id)
          }} />
        )}
      </section>

      <PokemonQuickView
        isOpen={selectedPokemon !== null}
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemonId(null)}
        onViewDetails={onViewDetails ? handleViewDetails : undefined}
        onExitComplete={handleQuickViewExit}
        returnFocusRef={quickViewTrigger}
      />
    </section>
  )
}
