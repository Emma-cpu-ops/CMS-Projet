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

  useEffect(() => {
    fetchCategories().then(setCategories)
    fetchArticles().then(setArticles)
  }, [])

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
        {visible.map((article) => (
          <ProductCard key={article.documentId || article.id} article={article} />
        ))}
      </div>
    </main>
  )
}
