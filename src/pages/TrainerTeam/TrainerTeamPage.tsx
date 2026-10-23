import { TeamMemberCard } from '../../components/TeamMemberCard/TeamMemberCard'
import { TrainerPortrait } from '../../components/TrainerPortrait/TrainerPortrait'
import { getTrainerById, getTrainerTeam } from '../../services/pokedexService'
import { TRAINERS_HREF } from '../../utils/routes'
import {
  formatEarnedBadges,
  formatTeamSize,
  getTrainerPortraitSource,
} from '../../utils/trainerPresentation'
import './TrainerTeamPage.css'

export type TrainerTeamPageProps = {
  trainerId: number
}

export function TrainerTeamPage({ trainerId }: TrainerTeamPageProps) {
  const trainer = getTrainerById(trainerId)

  if (trainer === undefined) {
    return (
      <section className="trainer-team" aria-labelledby="trainer-team-title">
        <a className="trainer-team__back" href={TRAINERS_HREF}>← Todos os treinadores</a>
        <h1 id="trainer-team-title" className="trainer-team__not-found">Treinador não encontrado.</h1>
      </section>
    )
  }

  const team = getTrainerTeam(trainer)

  return (
    <section className="trainer-team" aria-labelledby="trainer-team-title">
      <a className="trainer-team__back" href={TRAINERS_HREF}>← Todos os treinadores</a>

      <div className="trainer-team__hero">
        <TrainerPortrait name={trainer.name} src={getTrainerPortraitSource(trainer.id)} size="lg" />
        <div>
          <h1 id="trainer-team-title" className="trainer-team__name">{trainer.name}</h1>
          <p className="trainer-team__badges">{formatEarnedBadges(trainer.badges)}</p>
          <p className="trainer-team__size">{formatTeamSize(team.length)}</p>
        </div>
      </div>

      <h2 className="trainer-team__subtitle">Parceiros de jornada</h2>
      <ul className="trainer-team__list" aria-label={`Equipe de ${trainer.name}`}>
        {team.map((pokemon, index) => (
          <li className="trainer-team__item" key={`${pokemon.id}-${index}`}>
            <TeamMemberCard pokemon={pokemon} />
          </li>
        ))}
      </ul>
    </section>
  )
}
