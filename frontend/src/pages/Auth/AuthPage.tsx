import { useState } from 'react'
import type { FormEvent } from 'react'
import { AccountAvatar } from '../../components/AccountAvatar/AccountAvatar'
import { Button } from '../../components/Button/Button'
import { registerAccount, signIn } from '../../services/authService'
import type { AccountProfile } from '../../services/authService'
import type { Pokemon } from '../../types/pokemon'
import { EMPTY_CATALOG_FILTERS, filterPokemon } from '../../utils/pokemonFilters'
import { getPokemonImageSource } from '../../utils/pokemonPresentation'
import './AuthPage.css'

type AuthPageProps = {
  mode: 'login' | 'cadastro'
  pokemon?: readonly Pokemon[]
  justRegistered?: boolean
  onSignedIn: (account: AccountProfile) => void
}

function PasswordField({ name, label, isNew }: { name: string; label: string; isNew: boolean }) {
  const [visible, setVisible] = useState(false)
  const hintId = isNew && name === 'password' ? 'password-hint' : undefined
  const fieldName = name === 'passwordConfirmation' ? 'confirmação da senha' : 'senha'

  return (
    <div className="auth__field">
      <label htmlFor={name}>{label}</label>
      <div className="auth__password">
        <input
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={isNew ? 'new-password' : 'current-password'}
          aria-describedby={hintId}
          maxLength={128}
          required
        />
        <button
          className="auth__visibility"
          type="button"
          aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${fieldName}`}
          aria-controls={name}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      {hintId && <small id={hintId}>Use pelo menos 8 caracteres.</small>}
    </div>
  )
}

function AvatarPicker({ pokemon }: { pokemon: readonly Pokemon[] }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const selected = pokemon.find((record) => String(record.id) === selectedId)
  const matches = filterPokemon(pokemon, { ...EMPTY_CATALOG_FILTERS, query })
  const choices = selected && !matches.includes(selected) ? [selected, ...matches] : matches

  return (
    <fieldset className="auth__avatars">
      <legend>Foto de perfil</legend>
      <div className="auth__avatar-preview">
        <AccountAvatar
          src={selected && getPokemonImageSource(selected)}
          alt={selected ? `Prévia do avatar de ${selected.name}` : ''}
          size="preview"
        />
        <p aria-live="polite">
          {selected ? <strong>{selected.name}</strong> : 'Escolha um Pokémon do catálogo para seu perfil.'}
        </p>
      </div>
      <div className="auth__field">
        <label htmlFor="avatar-search">Pesquisar Pokémon por nome ou ID</label>
        <input
          id="avatar-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault() }}
        />
      </div>
      <div className="auth__field">
        <label htmlFor="pokemonId">Pokémon do perfil</label>
        <select id="pokemonId" name="pokemonId" size={5} value={selectedId} onChange={(event) => setSelectedId(event.currentTarget.value)} required>
          <option value="" disabled>Selecione um Pokémon</option>
          {choices.map((record) => (
            <option key={record.id} value={record.id}>#{String(record.id).padStart(3, '0')} {record.name}</option>
          ))}
        </select>
        {matches.length === 0 && <p role="status">Nenhum Pokémon encontrado.</p>}
      </div>
    </fieldset>
  )
}

export function AuthPage({ mode, pokemon = [], justRegistered, onSignedIn }: AuthPageProps) {
  const isRegistration = mode === 'cadastro'
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setError('')

    const fields = new FormData(event.currentTarget)
    const username = String(fields.get('username') ?? '').trim()
    const password = String(fields.get('password') ?? '')
    if (!username || !password) {
      setError('Preencha o usuário e a senha.')
      return
    }
    const name = String(fields.get('name') ?? '').trim()
    const pokemonId = Number(fields.get('pokemonId'))

    if (isRegistration) {
      if (name.length < 2 || name.length > 60) {
        setError('Informe um nome de 2 a 60 caracteres.')
        return
      }
      if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
        setError('Use de 3 a 24 letras, números ou sublinhados no usuário.')
        return
      }
      if (password.length < 8 || password.length > 128 || !password.trim()) {
        setError('Informe uma senha de 8 a 128 caracteres.')
        return
      }
      if (password !== fields.get('passwordConfirmation')) {
        setError('As senhas precisam ser iguais.')
        return
      }
      if (!pokemon.some((record) => record.id === pokemonId)) {
        setError('Escolha um Pokémon do catálogo para o perfil.')
        return
      }
    }

    setPending(true)
    try {
      if (isRegistration) {
        await registerAccount({ name, username, password, pokemonId })
        window.location.hash = 'login?cadastro=ok'
      } else {
        onSignedIn(await signIn(username, password))
      }
    } catch (failure) {
      setError(failure instanceof Error && !(failure instanceof TypeError)
        ? failure.message
        : 'Não foi possível conectar à Pokédex. Tente novamente.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="auth" aria-labelledby="auth-title">
      <h1 id="auth-title">{isRegistration ? 'Criar conta' : 'Entrar na Pokédex'}</h1>
      {justRegistered && <p className="auth__success" role="status">Conta criada. Entre com seu usuário e senha.</p>}
      <form className="auth__form" onSubmit={submit} noValidate>
        {isRegistration && (
          <div className="auth__field">
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" autoComplete="name" maxLength={60} required />
          </div>
        )}
        <div className="auth__field">
          <label htmlFor="username">Usuário</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            aria-describedby={isRegistration ? 'username-hint' : undefined}
            maxLength={24}
            required
          />
          {isRegistration && <small id="username-hint">Use de 3 a 24 letras, números ou sublinhados.</small>}
        </div>
        <PasswordField name="password" label="Senha" isNew={isRegistration} />
        {isRegistration && (
          <>
            <PasswordField name="passwordConfirmation" label="Confirmar senha" isNew />
            <AvatarPicker pokemon={pokemon} />
          </>
        )}
        {error && <p className="auth__error" role="alert">{error}</p>}
        <Button type="submit" disabled={pending}>
          {isRegistration ? pending ? 'Criando conta…' : 'Criar conta' : pending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
      <p className="auth__switch">
        {isRegistration ? <>Já tem conta? <a href="#login">Entrar</a></> : <>Ainda não tem conta? <a href="#cadastro">Criar conta</a></>}
      </p>
    </section>
  )
}
