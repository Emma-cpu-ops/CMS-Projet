import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

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
      <h1>Panier</h1>
      {notice ? <p className="notice">{notice}</p> : null}
      {items.length === 0 ? (
        <p>
          Votre panier est vide. <Link to="/catalogue">Voir le catalogue</Link>
        </p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((line) => (
              <li key={line.slug} className="cart-line">
                <div>
                  <strong>{line.title}</strong>
                  <p>{formatPrice(line.Price)}</p>
                </div>
                <div className="qty">
                  <button type="button" onClick={() => setQty(line.slug, line.qty - 1)}>
                    −
                  </button>
                  <span>{line.qty}</span>
                  <button type="button" onClick={() => setQty(line.slug, line.qty + 1)}>
                    +
                  </button>
                </div>
                <button type="button" className="linkish" onClick={() => removeItem(line.slug, line.documentId)}>
                  Retirer
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
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
        </>
      )}
    </main>
  )
}
