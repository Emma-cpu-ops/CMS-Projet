import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { articleImage, formatPrice } from '../utils/format'

export default function Cart() {
  const { items, removeItem, setQty, clear, total, notice } = useCart()
  const [ordered, setOrdered] = useState(false)

  if (ordered) {
    return (
      <main className="section narrow">
        <h1>Commande enregistrée</h1>
        <p className="lede">
          Paiement simulé : aucune donnée de carte n’a transité. Votre panier a été vidé.
        </p>
        <Link to="/catalogue" className="btn">
          Continuer les achats
        </Link>
      </main>
    )
  }

  return (
    <main className="section">
      <div className="section-head">
        <h1>Panier</h1>
        {items.length > 0 ? (
          <button type="button" className="linkish" onClick={clear}>
            Vider le panier
          </button>
        ) : null}
      </div>
      {notice ? <p className="notice">{notice}</p> : null}
      {items.length === 0 ? (
        <div className="cart-empty">
          <p className="lede">Votre panier est actuellement vide.</p>
          <Link to="/catalogue" className="btn">
            Découvrir le catalogue
          </Link>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((line) => {
              const img = articleImage(line)
              return (
                <li key={line.slug} className="cart-line">
                  <div className="cart-item-info">
                    {img ? (
                      <Link to={`/produit/${line.slug}`} className="cart-item-thumb">
                        <img src={img} alt={line.title} />
                      </Link>
                    ) : (
                      <div className={`cart-item-thumb placeholder tone-${line.slug.split('-')[0] || 't'}`} />
                    )}
                    <div>
                      <h3 className="cart-item-title">
                        <Link to={`/produit/${line.slug}`}>{line.title}</Link>
                      </h3>
                      <p className="cart-item-price">{formatPrice(line.Price)}</p>
                    </div>
                  </div>
                  <div className="qty">
                    <button
                      type="button"
                      onClick={() => setQty(line.slug, line.qty - 1)}
                      aria-label="Diminuer"
                    >
                      −
                    </button>
                    <span>{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(line.slug, line.qty + 1)}
                      aria-label="Augmenter"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-line-subtotal">
                    <strong>{formatPrice(line.Price * line.qty)}</strong>
                  </div>
                  <button
                    type="button"
                    className="linkish cart-remove-btn"
                    onClick={() => removeItem(line.slug, line.documentId, line.remoteId)}
                    title="Supprimer cet article"
                  >
                    Supprimer
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total TTC</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div className="cart-actions">
              <Link to="/catalogue" className="btn ghost">
                Continuer les achats
              </Link>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  clear()
                  setOrdered(true)
                }}
              >
                Commander (paiement simulé)
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
