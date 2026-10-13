import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchArticleBySlug } from '../api/strapi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { articleImage, formatPrice } from '../utils/format'

export default function Product() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem } = useCart()
  const [article, setArticle] = useState(undefined)

  useEffect(() => {
    fetchArticleBySlug(slug).then(setArticle)
  }, [slug])

  if (article === undefined) {
    return (
      <main className="section">
        <p>Chargement…</p>
      </main>
    )
  }

  if (!article) {
    return (
      <main className="section">
        <p>Article introuvable.</p>
        <Link to="/catalogue">Retour au catalogue</Link>
      </main>
    )
  }

  const image = articleImage(article)
  const title = article?.title?.trim() || 'Produit'
  const productTone = (article?.slug || 'produit').split('-')[0] || 't'

  const add = async () => {
    if (!user) {
      navigate('/connexion', { state: { from: `/produit/${slug}` } })
      return
    }
    await addItem(article)
    navigate('/panier')
  }

  return (
    <main className="product">
      <div className={`product-media ${image ? '' : `placeholder tone-${productTone}`}`}>
        {image ? <img src={image} alt={title} /> : null}
      </div>
      <div>
        <p className="eyebrow">Fiche produit</p>
        <h1>{title}</h1>
        <p className="lede">{article.description || 'Découvrez ce produit sélectionné pour vous.'}</p>
        <p className="price">{formatPrice(article.Price)}</p>
        <button type="button" className="btn" onClick={add}>
          Ajouter au panier
        </button>
      </div>
    </main>
  )
}
