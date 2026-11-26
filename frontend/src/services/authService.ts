export type AccountProfile = {
  readonly username: string
  readonly pokemonId: number
}

type Registration = {
  name: string
  username: string
  password: string
  pokemonId: number
}

type CsrfToken = {
  headerName: string
  token: string
}

async function postAuth(action: 'register' | 'login' | 'logout', body?: string | URLSearchParams) {
  const csrfResponse = await fetch('/api/auth/csrf')
  if (!csrfResponse.ok) throw new Error('Não foi possível conectar à Pokédex. Tente novamente.')

  const csrf: CsrfToken = await csrfResponse.json()
  const headers = new Headers({ [csrf.headerName]: csrf.token })
  if (typeof body === 'string') headers.set('Content-Type', 'application/json')
  return fetch(`/api/auth/${action}`, { method: 'POST', headers, body })
}

export async function getSession(signal?: AbortSignal): Promise<AccountProfile | null> {
  const response = await fetch('/api/auth/me', { signal })
  if (response.status === 401) return null
  if (!response.ok) throw new Error('Não foi possível consultar sua sessão.')
  return response.json()
}

export async function registerAccount(registration: Registration): Promise<void> {
  const response = await postAuth('register', JSON.stringify(registration))
  if (response.ok) return
  if (response.status === 400 || response.status === 409) {
    const problem = await response.json()
    if (typeof problem.detail === 'string') throw new Error(problem.detail)
  }
  throw new Error('Não foi possível criar a conta. Tente novamente.')
}

export async function signIn(username: string, password: string): Promise<AccountProfile> {
  const response = await postAuth('login', new URLSearchParams({ username, password }))
  if (response.status === 401) throw new Error('Usuário ou senha inválidos.')
  if (!response.ok) throw new Error('Não foi possível entrar. Tente novamente.')

  const account = await getSession()
  if (!account) throw new Error('Não foi possível iniciar sua sessão.')
  return account
}

export async function signOut(): Promise<void> {
  const response = await postAuth('logout')
  if (!response.ok) throw new Error('Não foi possível sair. Tente novamente.')
}
