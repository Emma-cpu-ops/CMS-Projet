import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { articleImage, formatPrice } from '../utils/format'

export default function ProductCard({ article }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const image = articleImage(article)
  const title = article?.title?.trim() || 'Produit'
  const slug = article?.slug || ''
  const description = article?.description || 'Découvrez ce produit de la boutique.'

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await addItem(article)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article className="card">
      <Link to={`/produit/${slug}`} className="card-media">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.classList.add(
                  'placeholder',
                  `tone-${slug.split('-')[0] || 't'}`,
                )
              }
            }}
          />
        ) : (
          <div className={`placeholder tone-${slug.split('-')[0] || 't'}`} />
        )}
      </Link>
      <div className="card-body">
        <h3>
          <Link to={`/produit/${slug}`}>{title}</Link>
        </h3>
        <p>{description}</p>
        <div className="card-meta">
          <strong className="card-price">{formatPrice(article?.Price)}</strong>
          <div className="card-actions">
            <Link to={`/produit/${slug}`} className="btn ghost" title="Voir le produit">
              Détails
            </Link>
            <button
              type="button"
              className={`btn ${added ? 'btn-success' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? '✓ Ajouté' : 'Ajouter au panier'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
