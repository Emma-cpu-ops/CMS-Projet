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

  const addItem = async (article, quantity = 1) => {
    if (!article) return
    const addCount = Number(quantity) > 0 ? Number(quantity) : 1
    const slug = article.slug
    const title = (article.title || 'Produit').trim()
    const price = Number(article.Price ?? 0)

    setItems((current) => {
      const existing = current.find((line) => line.slug === slug)
      if (existing) {
        return current.map((line) =>
          line.slug === slug ? { ...line, qty: line.qty + addCount } : line,
        )
      }
      return [
        ...current,
        {
          slug,
          documentId: article.documentId,
          title,
          Price: price,
          cover: article.cover,
          qty: addCount,
        },
      ]
    })

    if (hasRemoteApi && user) {
      try {
        const created = await createCartLine({
          titre: title,
          Desc: article.description || '',
          slug: `${slug}-${Date.now()}`,
          article: article.documentId || null,
        })
        if (created?.documentId) {
          setItems((current) =>
            current.map((line) =>
              line.slug === slug && !line.remoteId
                ? { ...line, remoteId: created.documentId }
                : line,
            ),
          )
        }
      } catch (err) {
        console.warn('Sync cart line to Strapi:', err)
      }
    }
  }

  const removeItem = async (slug, documentId, remoteId) => {
    setItems((current) => current.filter((line) => line.slug !== slug))
    const idToDelete = remoteId || documentId
    if (hasRemoteApi && idToDelete) {
      try {
        await deleteCartLine(idToDelete)
      } catch (err) {
        console.warn('Suppression Strapi:', err)
      }
    }
  }

  const setQty = (slug, qty) => {
    if (qty < 1) {
      removeItem(slug)
      return
    }
    setItems((current) =>
      current.map((line) => (line.slug === slug ? { ...line, qty } : line)),
    )
  }

  const clear = () => setItems([])

  const total = items.reduce((sum, line) => sum + Number(line.Price || 0) * line.qty, 0)
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
