import type { Trainer } from '../../types/pokemon'
import { getTrainerHref } from '../../utils/routes'
import './RelatedTrainers.css'

export type RelatedTrainersProps = {
  trainers: readonly Pick<Trainer, 'id' | 'name'>[]
}

export function RelatedTrainers({ trainers }: RelatedTrainersProps) {
  return (
    <section className="related-trainers" aria-labelledby="related-trainers-title">
      <h2 className="related-trainers__title" id="related-trainers-title">Treinadores relacionados</h2>
      {trainers.length === 0 ? (
        <p className="related-trainers__empty">Nenhum treinador tem este Pokémon na equipe.</p>
      ) : (
        <ul className="related-trainers__list">
          {trainers.map((trainer) => (
            <li key={trainer.id}>
              <a className="related-trainers__link" href={getTrainerHref(trainer.id)}>{trainer.name}</a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}