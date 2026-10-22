import { useId } from 'react'
import type { PokemonStats as PokemonStatsValues } from '../../types/pokemon'
import './PokemonStats.css'

export type PokemonStatsProps = {
  stats: PokemonStatsValues
  variant?: 'compact' | 'detail'
}

const statDefinitions: readonly { key: keyof PokemonStatsValues; label: string; color: string }[] = [
  { key: 'hp', label: 'HP', color: '#e7474e' },
  { key: 'attack', label: 'Ataque', color: '#ad442d' },
  { key: 'defense', label: 'Defesa', color: '#886615' },
  { key: 'specialAttack', label: 'Ataque especial', color: '#365f99' },
  { key: 'specialDefense', label: 'Defesa especial', color: '#287566' },
  { key: 'speed', label: 'Velocidade', color: '#805399' },
]

export function PokemonStats({ stats, variant = 'compact' }: PokemonStatsProps) {
  const titleId = useId()

  return (
    <section className={`pokemon-stats pokemon-stats--${variant}`} aria-labelledby={titleId}>
      <h3 id={titleId} className="pokemon-stats__title">Atributos base</h3>
      <dl className="pokemon-stats__list">
        {statDefinitions.map(({ key, label, color }) => (
          <div className="pokemon-stats__stat" key={key}>
            <dt>{label}</dt>
            <dd>
              <span className="pokemon-stats__value">{stats[key]}</span>
              <span className="pokemon-stats__track" aria-hidden="true">
                <span style={{ width: `${Math.min(Math.max(stats[key] / 150 * 100, 0), 100)}%`, backgroundColor: `var(--pokemon-stats-color, ${color})` }} />
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
