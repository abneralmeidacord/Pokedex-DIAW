import './Treinador.css'

export function Treinador() {
  return (
    <section className="trainers" aria-labelledby="trainers-title">
      <h1 id="trainers-title" className="trainers__title">Treinadores</h1>
      <p className="trainers__description">Descubra os treinadores e seus parceiros Pokémon.</p>
      <div className="trainers__grid" role="region" aria-label="Lista de treinadores" />
    </section>
  )
}
