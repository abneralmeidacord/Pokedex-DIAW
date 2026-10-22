import type { Pokemon } from '../../types/pokemon'
import { getPokemonHref } from '../../utils/routes'
import pokeballIcon from '../../assets/figma/pokeball-brand.svg'
import './TeamMemberCard.css'

export type TeamMemberCardProps = {
  pokemon: Pick<Pokemon, 'id' | 'name'>
}

export function TeamMemberCard({ pokemon }: TeamMemberCardProps) {
  return (
    <a
      className="team-member"
      href={getPokemonHref(pokemon.id)}
      aria-label={`Ver ficha de ${pokemon.name}`}
    >
      <span className="team-member__id">#{String(pokemon.id).padStart(3, '0')}</span>
      <span className="team-member__name">{pokemon.name}</span>
      <img className="team-member__icon" src={pokeballIcon} alt="" width={32} height={32} />
      <span className="team-member__role">Integrante da equipe</span>
    </a>
  )
}