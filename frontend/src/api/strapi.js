import axios from 'axios'
import { fallbackArticles, fallbackCategories, fallbackGlobal } from '../data/fallback'

const baseURL = import.meta.env.VITE_STRAPI_URL?.replace(/\/$/, '')
const token = import.meta.env.VITE_STRAPI_TOKEN

export const hasRemoteApi = Boolean(baseURL)

const client = axios.create({
  baseURL: baseURL ? `${baseURL}/api` : undefined,
  timeout: 8000,
})

export async function checkApiConnection() {
  if (!baseURL) return false

  try {
    await client.get('/global', { timeout: 5000 })
    return true
  } catch {
    return false
  }
}

client.interceptors.request.use((config) => {
  const jwt = localStorage.getItem('echoppe_jwt')
  const auth = jwt || token
  if (auth) {
    config.headers.Authorization = `Bearer ${auth}`
  }
  return config
})

function unwrapList(payload) {
  return Array.isArray(payload?.data) ? payload.data : []
}

function unwrapOne(payload) {
  return payload?.data ?? null
}

export async function fetchGlobal() {
  if (!hasRemoteApi) return fallbackGlobal
  try {
    const { data } = await client.get('/global')
    return unwrapOne(data) ?? fallbackGlobal
  } catch {
    return fallbackGlobal
  }
}

export async function fetchCategories() {
  if (!hasRemoteApi) return fallbackCategories
  try {
    const { data } = await client.get('/categories')
    const list = unwrapList(data)
    return list.length ? list : fallbackCategories
  } catch {
    return fallbackCategories
  }
}

export async function fetchArticles() {
  if (!hasRemoteApi) return fallbackArticles
  try {
    const { data } = await client.get('/articles', { params: { populate: '*' } })
    const list = unwrapList(data)
    return list.length ? list : fallbackArticles
  } catch {
    return fallbackArticles
  }
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
  const { data } = await client.get('/paniers', { params: { populate: '*' } })
  return unwrapList(data)
}

export async function createCartLine(body) {
  if (!hasRemoteApi) return null
  const { data } = await client.post('/paniers', { data: body })
  return unwrapOne(data)
}

export async function deleteCartLine(documentId) {
  if (!hasRemoteApi) return null
  await client.delete(`/paniers/${documentId}`)
}
