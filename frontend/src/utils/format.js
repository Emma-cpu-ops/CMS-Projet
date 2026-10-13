export function formatPrice(value) {
  const amount = Number(value ?? 0)
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function getStrapiServerUrl() {
  const raw = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').trim()
  return raw.replace(/\/api\/?$/, '').replace(/\/$/, '')
}

export function mediaUrl(file) {
  if (!file) return null
  const url =
    file?.url ||
    file?.formats?.medium?.url ||
    file?.formats?.small?.url ||
    file?.formats?.thumbnail?.url ||
    file?.data?.attributes?.url ||
    file?.data?.url
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = getStrapiServerUrl()
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  return base ? `${base}${cleanUrl}` : cleanUrl
}

export function articleImage(article) {
  if (!article) return null
  const cover =
    article?.cover ||
    article?.image ||
    article?.images ||
    article?.illustration ||
    article?.attributes?.cover ||
    article?.attributes?.image
  if (!cover) return null
  const file = Array.isArray(cover) ? cover[0] : cover?.data || cover
  const first = Array.isArray(file) ? file[0] : file
  return mediaUrl(first)
}

export function categorySlugOf(article) {
  return (
    article?.categorySlug ||
    article?.category?.slug ||
    article?.category?.data?.slug ||
    article?.categorie?.slug ||
    article?.categorie?.data?.slug ||
    ''
  )
}

