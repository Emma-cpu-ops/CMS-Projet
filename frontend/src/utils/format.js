export function formatPrice(value) {
  const amount = Number(value ?? 0)
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function mediaUrl(file) {
  const url = file?.url || file?.data?.attributes?.url || file?.data?.url
  if (!url) return null
  if (url.startsWith('http')) return url
  const base = import.meta.env.VITE_STRAPI_URL?.replace(/\/$/, '')
  return base ? `${base}${url}` : url
}

export function articleImage(article) {
  const cover = article?.cover
  if (!cover) return null
  const file = Array.isArray(cover) ? cover[0] : cover?.data || cover
  const first = Array.isArray(file) ? file[0] : file
  return mediaUrl(first)
}

export function categorySlugOf(article) {
  return (
    article.categorySlug ||
    article.category?.slug ||
    article.category?.data?.slug ||
    article.categorie?.slug ||
    ''
  )
}
