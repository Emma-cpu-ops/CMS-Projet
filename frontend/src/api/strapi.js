import axios from 'axios'

const rawUrl = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').trim()
export const strapiServerUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')
export const strapiApiUrl = strapiServerUrl ? `${strapiServerUrl}/api` : ''

const token = (
  import.meta.env.VITE_STRAPI_TOKEN ||
  import.meta.env.VITE_STRAPI_API_TOKEN ||
  ''
).trim()

export const hasRemoteApi = Boolean(strapiServerUrl)

const client = axios.create({
  baseURL: strapiApiUrl,
  timeout: 8000,
})

export async function checkApiConnection() {
  if (!hasRemoteApi) return false

  try {
    await client.get('/global', { timeout: 5000 })
    return true
  } catch {
    try {
      await client.get('/articles', { timeout: 5000 })
      return true
    } catch {
      return false
    }
  }
}

client.interceptors.request.use((config) => {
  const jwt = localStorage.getItem('echoppe_jwt')
  // Prioritize the Strapi API token with full permissions so user JWT without permissions doesn't get 403
  const auth = token || jwt
  if (auth) {
    config.headers.Authorization = `Bearer ${auth}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 403 occurs due to Strapi Authenticated role permissions, retry with API token or without auth
    if (error?.response?.status === 403 && !error.config?._retry) {
      error.config._retry = true
      if (token && error.config.headers.Authorization !== `Bearer ${token}`) {
        error.config.headers.Authorization = `Bearer ${token}`
        return client(error.config)
      }
      delete error.config.headers.Authorization
      return client(error.config)
    }
    return Promise.reject(error)
  },
)


function unwrapList(payload) {
  return Array.isArray(payload?.data) ? payload.data : []
}

function unwrapOne(payload) {
  return payload?.data ?? null
}

export async function fetchGlobal() {
  const { data } = await client.get('/global', { params: { populate: '*' } })
  return unwrapOne(data)
}

export async function fetchCategories() {
  const { data } = await client.get('/categories', { params: { populate: '*' } })
  return unwrapList(data)
}

export async function fetchArticles() {
  const { data } = await client.get('/articles', { params: { populate: '*' } })
  return unwrapList(data)
}

export async function fetchArticleBySlug(slug) {
  const articles = await fetchArticles()
  return articles.find((item) => item.slug === slug) ?? null
}

export async function loginWithStrapi(identifier, password) {
  const { data } = await client.post('/auth/local', { identifier, password })
  return data
}

export async function registerWithStrapi(username, email, password) {
  const { data } = await client.post('/auth/local/register', {
    username,
    email,
    password,
  })
  return data
}

export async function fetchMyCart() {
  if (!hasRemoteApi) return null
  try {
    const { data } = await client.get('/cards', { params: { populate: '*' } })
    return unwrapList(data)
  } catch {
    try {
      const { data } = await client.get('/paniers', { params: { populate: '*' } })
      return unwrapList(data)
    } catch {
      return []
    }
  }
}

export async function createCartLine(body) {
  if (!hasRemoteApi) return null
  try {
    const { data } = await client.post('/cards', { data: body })
    return unwrapOne(data)
  } catch {
    try {
      const { data } = await client.post('/paniers', { data: body })
      return unwrapOne(data)
    } catch {
      return null
    }
  }
}

export async function deleteCartLine(documentId) {
  if (!hasRemoteApi || !documentId) return null
  try {
    await client.delete(`/cards/${documentId}`)
  } catch {
    try {
      await client.delete(`/paniers/${documentId}`)
    } catch {
      // ignore
    }
  }
}
