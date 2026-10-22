import type { CSSProperties } from 'react'
import type { PokemonType } from '../../types/pokemon'
import { getPokemonTypeColor, getPokemonTypeLabel } from '../../utils/pokemonPresentation'
import './TypeFilter.css'

export type TypeFilterProps = {
    types: readonly PokemonType[]
    value: number | null
    onChange: (typeId: number | null) => void
}

export function TypeFilter({ types, value, onChange }: TypeFilterProps) {
    return (
        <div className="type-filter" role="group" aria-label="Filtrar por tipo">
            <button
                type="button"
                className="type-filter__option type-filter__option--all"
                aria-pressed={value === null}
                onClick={() => onChange(null)}
            >
                Todos
            </button>
            {types.map((type) => (
                <button
                    key={type.id}
                    type="button"
                    className="type-filter__option"
                    style={{ '--type-color': getPokemonTypeColor(type) } as CSSProperties}
                    aria-pressed={value === type.id}
                    onClick={() => onChange(value === type.id ? null : type.id)}
                >
                    {getPokemonTypeLabel(type)}
                </button>
            ))}
        </div>
    )
}