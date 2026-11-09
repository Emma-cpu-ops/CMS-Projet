import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchArticles, fetchCategories } from '../api/strapi'
import ProductCard from '../components/ProductCard'
import { categorySlugOf } from '../utils/format'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const selected = params.get('cat') || ''
  const [categories, setCategories] = useState([])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [articlesError, setArticlesError] = useState(false)
  const [categoriesError, setCategoriesError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setArticlesError(false)
      setCategoriesError(false)

      const [categoriesResult, articlesResult] = await Promise.allSettled([
        fetchCategories(),
        fetchArticles(),
      ])

      if (ignore) return

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

      setLoading(false)
    }

    load()

    return () => {
      ignore = true
    }
  }, [reloadKey])

  const visible = useMemo(() => {
    if (!selected) return articles
    return articles.filter((article) => categorySlugOf(article) === selected)
  }, [articles, selected])

  return (
    <main className="section">
      <div className="section-head">
        <h1>Catalogue</h1>
        <p>{visible.length} article{visible.length > 1 ? 's' : ''}</p>
      </div>
      {categoriesError ? (
        <p className="notice" role="status">Impossible de charger les catégories.</p>
      ) : null}
      <div className="chips">
        <button
          type="button"
          className={`chip ${selected === '' ? 'active' : ''}`}
          onClick={() => setParams({})}
        >
          Tous
        </button>
        {categories.map((category) => (
          <button
            type="button"
            key={category.slug}
            className={`chip ${selected === category.slug ? 'active' : ''}`}
            onClick={() => setParams({ cat: category.slug })}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="grid">
        {loading ? <p role="status">Chargement des produits…</p> : null}
        {!loading && articlesError ? (
          <div className="empty-state" role="alert">
            <p>Impossible de charger les produits. Vérifiez la connexion à l’API puis réessayez.</p>
            <button type="button" className="btn ghost" onClick={() => setReloadKey((key) => key + 1)}>
              Réessayer
            </button>
          </div>
        ) : null}
        {!loading && !articlesError && visible.length === 0 ? (
          <p className="empty-state" role="status">
            {articles.length === 0
              ? 'Aucun produit disponible pour le moment.'
              : 'Aucun produit dans cette catégorie.'}
          </p>
        ) : null}
        {!loading && !articlesError
          ? visible.map((article) => (
              <ProductCard key={article.documentId || article.id} article={article} />
            ))
          : null}
      </div>
    </main>
  )
}
