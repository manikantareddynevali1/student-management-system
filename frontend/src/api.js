const API_BASE = import.meta.env.VITE_API_URL || ''

let accessToken = sessionStorage.getItem('accessToken')
let refreshToken = sessionStorage.getItem('refreshToken')

function saveTokens(tokens) {
  accessToken = tokens.accessToken
  refreshToken = tokens.refreshToken
  sessionStorage.setItem('accessToken', accessToken)
  sessionStorage.setItem('refreshToken', refreshToken)
}

export function clearTokens() {
  accessToken = null
  refreshToken = null
  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('refreshToken')
}

async function request(path, options = {}, retry = true) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (response.status === 401 && retry && refreshToken) {
    const refreshed = await fetch(`${API_BASE}/api/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) })
    if (refreshed.ok) {
      saveTokens(await refreshed.json())
      return request(path, options, false)
    }
    clearTokens()
  }
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try { message = (await response.json()).message || message } catch { /* Empty responses are valid for DELETE and password endpoints. */ }
    throw new Error(message)
  }
  return response.status === 204 ? null : response.json()
}

export async function login(credentials) {
  const tokens = await request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }, false)
  saveTokens(tokens)
  return tokens
}

export async function register(details) {
  const tokens = await request('/api/auth/register', { method: 'POST', body: JSON.stringify(details) }, false)
  saveTokens(tokens)
  return tokens
}

export function hasSession() { return Boolean(accessToken) }
export function getStudents(params) { return request(`/api/students?${new URLSearchParams(params)}`) }
export function createStudent(student) { return request('/api/students', { method: 'POST', body: JSON.stringify(student) }) }
export function updateStudent(id, student) { return request(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(student) }) }
export function deleteStudent(id) { return request(`/api/students/${id}`, { method: 'DELETE' }) }
