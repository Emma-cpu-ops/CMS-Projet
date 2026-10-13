import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { checkApiConnection, fetchArticles, fetchCategories, fetchGlobal } from '../api/strapi'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [global, setGlobal] = useState(null)
  const [categories, setCategories] = useState([])
  const [articles, setArticles] = useState([])
  const [remoteConnected, setRemoteConnected] = useState(false)

  useEffect(() => {
    let ignore = false

    async function load() {
      const connected = await checkApiConnection()
      if (!ignore) setRemoteConnected(connected)

      const nextGlobal = await fetchGlobal()
      const nextCategories = await fetchCategories()
      const nextArticles = await fetchArticles()

      if (!ignore) {
        setGlobal(nextGlobal)
        setCategories(nextCategories)
        setArticles(nextArticles)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [])

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
      </section>

      <section className="section">
        <div className="section-head">
          <h2>À la une</h2>
          <Link to="/catalogue">Tout voir</Link>
        </div>
        <div className="grid">
          {highlighted.map((article) => (
            <ProductCard key={article.documentId || article.id} article={article} />
          ))}
        </div>
      </section>
    </main>
  )
}
