import type { AccountProfile } from '../../services/authService'
import type { PokedexData } from '../../types/pokemon'
import { getPokemonImageSource } from '../../utils/pokemonPresentation'
import { Button } from '../../components/Button/Button'
import './ProfilePage.css'

type ProfilePageProps = { pokedex: PokedexData; account: AccountProfile }

export function ProfilePage({ pokedex, account }: ProfilePageProps) {
  const favorites = account.favoritePokemonIds
    .map((id) => pokedex.pokemon.find((pokemon) => pokemon.id === id))
    .filter((pokemon) => pokemon !== undefined)

  return (
    <section className="profile-page" aria-labelledby="profile-title">
      <p className="profile-page__eyebrow">Seu espaço na Pokédex</p>
      <h1 id="profile-title">Perfil de {account.username}</h1>
      <section aria-labelledby="profile-favorites-title">
        <h2 id="profile-favorites-title">Pokémon favoritos</h2>
        {favorites.length === 0 ? (
          <div className="profile-page__empty">
            <p>Você ainda não salvou nenhum Pokémon nos favoritos.</p>
            <Button href="#catalogo" variant="secondary">Explorar a Pokédex</Button>
          </div>
        ) : (
          <ul className="profile-page__list">
            {favorites.map((pokemon) => (
              <li key={pokemon.id}>
                <a className="profile-page__card" href={`#pokemon/${pokemon.id}`}>
                  <img src={getPokemonImageSource(pokemon)} alt="" loading="lazy" />
                  <span>#{String(pokemon.id).padStart(3, '0')} {pokemon.name}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}
