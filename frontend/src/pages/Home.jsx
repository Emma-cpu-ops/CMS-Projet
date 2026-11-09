import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkApiConnection, fetchArticles, fetchCategories, fetchGlobal } from '../api/strapi'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [global, setGlobal] = useState(null)
  const [categories, setCategories] = useState([])
  const [articles, setArticles] = useState([])
  const [remoteConnected, setRemoteConnected] = useState(false)
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [articlesError, setArticlesError] = useState(false)
  const [categoriesError, setCategoriesError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    async function load() {
      setArticlesLoading(true)
      setArticlesError(false)
      setCategoriesError(false)

      const [connectionResult, globalResult, categoriesResult, articlesResult] =
        await Promise.allSettled([
          checkApiConnection(),
          fetchGlobal(),
          fetchCategories(),
          fetchArticles(),
        ])

      if (!ignore) {
        if (connectionResult.status === 'fulfilled') {
          setRemoteConnected(connectionResult.value)
        }

        if (globalResult.status === 'fulfilled') {
          setGlobal(globalResult.value)
        } else {
          console.error('Impossible de charger les informations du site.', globalResult.reason)
        }

        if (categoriesResult.status === 'fulfilled') {
          setCategories(categoriesResult.value)
        } else {
          console.error('Impossible de charger les catégories.', categoriesResult.reason)
          setCategoriesError(true)
        }

        if (articlesResult.status === 'fulfilled') {
          setArticles(articlesResult.value)
        } else {
          console.error('Impossible de charger les produits.', articlesResult.reason)
          setArticlesError(true)
        }

        setArticlesLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [reloadKey])

  const highlighted = articles.slice(0, 3)

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">
          {remoteConnected ? 'Connecté à Strapi' : 'Boutique en ligne'}
        </p>
        <h1>{global?.siteName || 'Mon Échoppe Tech & Mode'}</h1>
        <p className="lede">{global?.siteDescription}</p>
        <Link to="/catalogue" className="btn">
          Entrer dans la boutique
        </Link>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Rayons</h2>
        </div>
        <div className="chips">
          {categories.map((category) => (
            <Link key={category.documentId || category.id} className="chip" to={`/catalogue?cat=${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </div>
        {categoriesError ? (
          <p className="notice" role="status">Impossible de charger les catégories.</p>
        ) : null}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>À la une</h2>
          <Link to="/catalogue">Tout voir</Link>
        </div>
        <div className="grid">
          {articlesLoading ? <p role="status">Chargement des produits…</p> : null}
          {!articlesLoading && articlesError ? (
            <div className="empty-state" role="alert">
              <p>Impossible de charger les produits. Vérifiez la connexion à l’API puis réessayez.</p>
              <button type="button" className="btn ghost" onClick={() => setReloadKey((key) => key + 1)}>
                Réessayer
              </button>
            </div>
          ) : null}
          {!articlesLoading && !articlesError && highlighted.length === 0 ? (
            <p className="empty-state" role="status">Aucun produit disponible pour le moment.</p>
          ) : null}
          {!articlesLoading && !articlesError
            ? highlighted.map((article) => (
                <ProductCard key={article.documentId || article.id} article={article} />
              ))
            : null}
        </div>
      </section>
    </main>
  )
}
