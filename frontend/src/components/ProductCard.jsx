import { Link } from 'react-router-dom'
import { articleImage, formatPrice } from '../utils/format'

export default function ProductCard({ article }) {
  const image = articleImage(article)
  const title = article?.title?.trim() || 'Produit'
  const slug = article?.slug || ''
  const description = article?.description || 'Découvrez ce produit de la boutique.'

  return (
    <article className="card">
      <Link to={`/produit/${slug}`} className="card-media">
        {image ? (
          <img src={image} alt={title} />
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
          <strong>{formatPrice(article?.Price)}</strong>
          <Link to={`/produit/${slug}`} className="btn ghost">
            Voir
          </Link>
        </div>
      </div>
    </article>
  )
}
