import { Button } from '../../components/Button/Button'
import './Home.css'

export type HomeProps = {
  catalogHref?: string
}

export function Home({ catalogHref = '#catalogo' }: HomeProps) {
  return (
    <div className="home">
      <section className="home__hero" aria-labelledby="home-title">
        <div className="home__copy">
          <div className="home__eyebrow-container">
            <p className="home__eyebrow">Gotta catch them all</p>
          </div>
          <h1 id="home-title" className="home__title">Pokédex</h1>
          <h2 className="home__subtitle">
            Sua próxima aventura<br />começa aqui.
          </h2>
          <p className="home__description">
            Conheça os Pokémon, descubra seus atributos e encontre os parceiros dos seus treinadores favoritos.
          </p>
          <Button className="home__action" href={catalogHref} endIcon="→">
            Abrir Pokédex
          </Button>
        </div>

        <div className="home__visual">
          <a className="home__device" href={catalogHref} aria-label="Abrir Pokédex">
            <img
              className="home__device-image"
              src={`${import.meta.env.BASE_URL}assets/imgs/pokedex-closed.png`}
              alt=""
              width="1638"
              height="2058"
            />
          </a>
        </div>
      </section>
    </div>
  )
}
