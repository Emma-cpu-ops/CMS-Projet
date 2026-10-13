import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createCartLine, deleteCartLine, hasRemoteApi } from '../api/strapi'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)
const CART_KEY = 'echoppe_cart'

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState(readCart)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = async (article) => {
    setItems((current) => {
      const existing = current.find((line) => line.slug === article.slug)
      if (existing) {
        return current.map((line) =>
          line.slug === article.slug ? { ...line, qty: line.qty + 1 } : line,
        )
      }
      return [
        ...current,
        {
          slug: article.slug,
          documentId: article.documentId,
          title: article.title.trim(),
          Price: article.Price,
          qty: 1,
        },
      ]
    })

    if (hasRemoteApi && user) {
      try {
        await createCartLine({
          titre: article.title.trim(),
          Desc: article.description,
          slug: `${article.slug}-${Date.now()}`,
          article: article.documentId,
        })
      } catch {
        setNotice('Ajouté en local. L’écriture Strapi a échoué (permissions ou nom d’API).')
      }
    }
  }

  const removeItem = async (slug, documentId) => {
    setItems((current) => current.filter((line) => line.slug !== slug))
    if (hasRemoteApi && documentId) {
      try {
        await deleteCartLine(documentId)
      } catch {
        setNotice('Ligne retirée en local. La suppression Strapi a échoué.')
      }
    }
  }

  const setQty = (slug, qty) => {
    if (qty < 1) return
    setItems((current) =>
      current.map((line) => (line.slug === slug ? { ...line, qty } : line)),
    )
  }

  const clear = () => setItems([])

  const total = items.reduce((sum, line) => sum + Number(line.Price) * line.qty, 0)
  const count = items.reduce((sum, line) => sum + line.qty, 0)

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQty, clear, total, count, notice, setNotice }),
    [items, total, count, notice],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans CartProvider')
  return ctx
}
