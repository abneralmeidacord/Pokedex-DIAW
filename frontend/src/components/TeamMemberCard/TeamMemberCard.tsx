import type { Pokemon } from '../../types/pokemon'
import { motion } from 'motion/react'
import { useMotionPreferences } from '../../motion/preferences'
import { getMotionTransition, MOTION } from '../../motion/settings'
import { getPokemonHref } from '../../utils/routes'
import pokeballIcon from '../../assets/figma/pokeball-brand.svg'
import './TeamMemberCard.css'

export type TeamMemberCardProps = {
  pokemon: Pick<Pokemon, 'id' | 'name'>
}

export function TeamMemberCard({ pokemon }: TeamMemberCardProps) {
  const reducedMotion = useMotionPreferences()
  return (
    <motion.a
      className="team-member"
      href={getPokemonHref(pokemon.id)}
      aria-label={`Ver ficha de ${pokemon.name}`}
      whileHover={reducedMotion ? undefined : { y: -MOTION.distance.card }}
      whileTap={reducedMotion ? undefined : { scale: MOTION.pressedScale }}
      transition={getMotionTransition(reducedMotion, MOTION.duration.fast)}
    >
      <span className="team-member__id">#{String(pokemon.id).padStart(3, '0')}</span>
      <span className="team-member__name">{pokemon.name}</span>
      <img className="team-member__icon" src={pokeballIcon} alt="" width={32} height={32} />
      <span className="team-member__role">Integrante da equipe</span>
    </motion.a>
  )
}
