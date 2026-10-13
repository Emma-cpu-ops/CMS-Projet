import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { hasRemoteApi } from '../api/strapi'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [identifier, setIdentifier] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const redirectTo = location.state?.from || '/'

  const submit = async (event) => {
    event.preventDefault()
    setMessage('')
    try {
      if (mode === 'login') {
        await login({ identifier, password })
      } else {
        await register({ username, email, password })
      }
      navigate(redirectTo)
    } catch (error) {
      setMessage(error.response?.data?.error?.message || error.message || 'Échec de connexion')
    }
  }

  return (
    <main className="section narrow">
      <h1>{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h1>
      <p className="lede">
        {hasRemoteApi
          ? 'Connectez-vous pour gérer votre compte et suivre votre commande.'
          : 'Mode démonstration : les comptes sont enregistrés uniquement dans ce navigateur.'}
      </p>
      <form className="form" onSubmit={submit}>
        {mode === 'register' ? (
          <>
            <label>
              Nom d’utilisateur
              <input value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <label>
              E-mail
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
          </>
        ) : (
          <label>
            E-mail ou identifiant
            <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          </label>
        )}
        <label>
          Mot de passe
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </label>
        {message ? <p className="notice">{message}</p> : null}
        <button type="submit" className="btn">
          {mode === 'login' ? 'Se connecter' : 'S’inscrire'}
        </button>
      </form>
      <button
        type="button"
        className="linkish"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login' ? 'Pas encore de compte ? Inscription' : 'Déjà inscrit ? Connexion'}
      </button>
    </main>
  )
}
