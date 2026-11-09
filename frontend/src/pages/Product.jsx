import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchArticleBySlug } from '../api/strapi'
import { useCart } from '../context/CartContext'
import { articleImage, formatPrice } from '../utils/format'

export default function Product() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [article, setArticle] = useState(undefined)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [qty, setQty] = useState(1)
  const [addedNotice, setAddedNotice] = useState(false)

  useEffect(() => {
    let ignore = false

    async function load() {
      setArticle(undefined)
      setLoadError(false)
      try {
        const result = await fetchArticleBySlug(slug)
        if (!ignore) setArticle(result)
      } catch (error) {
        console.error('Impossible de charger le produit.', error)
        if (!ignore) setLoadError(true)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [slug, reloadKey])

  if (article === undefined) {
    return (
      <main className="section">
        {loadError ? (
          <div className="empty-state" role="alert">
            <p>Impossible de charger ce produit. Vérifiez la connexion à l’API puis réessayez.</p>
            <button type="button" className="btn ghost" onClick={() => setReloadKey((key) => key + 1)}>
              Réessayer
            </button>
          </div>
        ) : (
          <p role="status">Chargement…</p>
        )}
      </main>
    )
  }

  if (!article) {
    return (
      <main className="section">
        <p>Article introuvable.</p>
        <Link to="/catalogue" className="btn ghost">Retour au catalogue</Link>
      </main>
    )
  }

  const image = articleImage(article)
  const title = article?.title?.trim() || 'Produit'
  const productTone = (article?.slug || 'produit').split('-')[0] || 't'

  const handleAdd = async () => {
    await addItem(article, qty)
    setAddedNotice(true)
  }

  return (
    <main className="product">
      <div className={`product-media ${image ? '' : `placeholder tone-${productTone}`}`}>
        {image ? (
          <img
            src={image}
            alt={title}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.classList.add(
                  'placeholder',
                  `tone-${productTone}`,
                )
              }
            }}
          />
        ) : null}
      </div>
      <div>
        <p className="eyebrow">Fiche produit</p>
        <h1>{title}</h1>
        <p className="lede">{article.description || 'Découvrez ce produit sélectionné pour vous.'}</p>
        <p className="price">{formatPrice(article.Price)}</p>

        <div className="product-actions">
          <div className="qty-selector">
            <label htmlFor="product-qty">Quantité :</label>
            <div className="qty">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <input
                id="product-qty"
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
          </div>

          <button type="button" className="btn" onClick={handleAdd}>
            Ajouter au panier
          </button>
        </div>

        {addedNotice ? (
          <div className="product-alert">
            <p>✓ <strong>{title}</strong> ({qty}) a bien été ajouté à votre panier !</p>
            <div className="product-alert-actions">
              <Link to="/panier" className="btn">
                Voir mon panier
              </Link>
              <Link to="/catalogue" className="btn ghost">
                Continuer mes achats
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
