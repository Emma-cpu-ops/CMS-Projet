import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const { count } = useCart()

  return (
    <div className="shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">É</span>
          <span>
            <strong>Échoppe</strong>
            <small>Tech & Mode</small>
          </span>
        </NavLink>
        <nav className="nav">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/catalogue">Catalogue</NavLink>
          <NavLink to="/panier">Panier{count ? ` (${count})` : ''}</NavLink>
          {user ? (
            <button type="button" className="linkish" onClick={logout}>
              {user.username || user.email} · sortir
            </button>
          ) : (
            <NavLink to="/connexion">Connexion</NavLink>
          )}
        </nav>
      </header>
      <Outlet />
      <footer className="footer">
        Livraison rapide · Paiement sécurisé · Boutique en ligne
      </footer>
    </div>
  )
}
