import { createContext, useContext, useMemo, useState } from 'react'
import { hasRemoteApi, loginWithStrapi, registerWithStrapi } from '../api/strapi'

const AuthContext = createContext(null)
const USER_KEY = 'echoppe_user'
const JWT_KEY = 'echoppe_jwt'

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)
  const [error, setError] = useState('')

  const persist = (nextUser, jwt) => {
    setUser(nextUser)
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    else localStorage.removeItem(USER_KEY)
    if (jwt) localStorage.setItem(JWT_KEY, jwt)
    else localStorage.removeItem(JWT_KEY)
  }

  const login = async ({ identifier, password }) => {
    setError('')
    if (hasRemoteApi) {
      const data = await loginWithStrapi(identifier, password)
      persist(data.user, data.jwt)
      return data.user
    }
    const local = JSON.parse(localStorage.getItem('echoppe_accounts') || '[]')
    const found = local.find(
      (account) =>
        (account.email === identifier || account.username === identifier) &&
        account.password === password,
    )
    if (!found) {
      throw new Error('Identifiants incorrects. Créez un compte si besoin.')
    }
    const { password: _pw, ...safe } = found
    persist(safe, null)
    return safe
  }

  const register = async ({ username, email, password }) => {
    setError('')
    if (hasRemoteApi) {
      const data = await registerWithStrapi(username, email, password)
      persist(data.user, data.jwt)
      return data.user
    }
    const local = JSON.parse(localStorage.getItem('echoppe_accounts') || '[]')
    if (local.some((account) => account.email === email)) {
      throw new Error('Un compte existe déjà avec cet e-mail.')
    }
    const created = { id: Date.now(), username, email, password }
    localStorage.setItem('echoppe_accounts', JSON.stringify([...local, created]))
    const { password: _pw, ...safe } = created
    persist(safe, null)
    return safe
  }

  const logout = () => persist(null, null)

  const value = useMemo(
    () => ({ user, error, setError, login, register, logout, hasRemoteApi }),
    [user, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
