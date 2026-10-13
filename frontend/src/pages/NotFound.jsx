import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="section narrow">
      <h1>Page introuvable</h1>
      <p className="lede">La page que vous cherchez n’existe pas ou n’est plus disponible.</p>
      <Link to="/" className="btn">
        Retour à l’accueil
      </Link>
    </main>
  )
}
