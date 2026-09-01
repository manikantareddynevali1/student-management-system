const API_BASE = import.meta.env.VITE_API_URL || ''

let accessToken = sessionStorage.getItem('accessToken')
let refreshToken = sessionStorage.getItem('refreshToken')

function saveTokens(tokens) {
  accessToken = tokens.accessToken
  refreshToken = tokens.refreshToken
  sessionStorage.setItem('accessToken', accessToken)
  sessionStorage.setItem('refreshToken', refreshToken)
  sessionStorage.setItem('role', tokens.role || '')
  sessionStorage.setItem('username', tokens.username || '')
}

export function clearTokens() {
  accessToken = null
  refreshToken = null
  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('refreshToken')
  sessionStorage.removeItem('role')
  sessionStorage.removeItem('username')
}

async function request(path, options = {}, retry = true) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch (networkError) {
    throw new Error(`Cannot connect to Spring Boot backend (${API_BASE}). Please make sure the backend server is running.`)
  }
  if (response.status === 401 && retry && refreshToken) {
    let refreshed
    try {
      refreshed = await fetch(`${API_BASE}/api/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) })
    } catch {
      clearTokens()
      throw new Error('Session expired. Please log in again.')
    }
    if (refreshed.ok) {
      saveTokens(await refreshed.json())
      return request(path, options, false)
    }
    clearTokens()
  }
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try { message = (await response.json()).message || message } catch { /* Empty responses */ }
    throw new Error(message)
  }
  return response.status === 204 ? null : response.json()
}

// Authentication
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
export function getRole() { return sessionStorage.getItem('role') || '' }
export function getUsername() { return sessionStorage.getItem('username') || '' }

// Students API
export async function getStudents(params = {}) {
  return request(`/api/students?${new URLSearchParams(params)}`)
}

export async function getStudentById(id) {
  return request(`/api/students/${id}`)
}

export async function createStudent(student) {
  return request('/api/students', { method: 'POST', body: JSON.stringify(student) })
}

export async function updateStudent(id, student) {
  return request(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(student) })
}

export async function deleteStudent(id) {
  return request(`/api/students/${id}`, { method: 'DELETE' })
}

// Courses API
export async function getCourses(params = {}) {
  return request(`/api/courses?${new URLSearchParams(params)}`)
}

export async function getAllCourses() {
  return request('/api/courses/all')
}

export async function createCourse(course) {
  return request('/api/courses', { method: 'POST', body: JSON.stringify(course) })
}

export async function updateCourse(id, course) {
  return request(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(course) })
}

export async function deleteCourse(id) {
  return request(`/api/courses/${id}`, { method: 'DELETE' })
}

// Attendance API
export async function getAttendance() {
  return request('/api/attendance')
}

export async function createAttendance(attendance) {
  return request('/api/attendance', { method: 'POST', body: JSON.stringify(attendance) })
}

export async function updateAttendance(id, attendance) {
  return request(`/api/attendance/${id}`, { method: 'PUT', body: JSON.stringify(attendance) })
}

export async function deleteAttendance(id) {
  return request(`/api/attendance/${id}`, { method: 'DELETE' })
}

// Reports API
export async function getReportsSummary() {
  return request('/api/reports/summary')
}

// Faculty Module (Supabase API)
export async function getFaculty() {
  return request('/api/faculty')
}
export async function createFaculty(faculty) {
  return request('/api/faculty', { method: 'POST', body: JSON.stringify(faculty) })
}
export async function updateFaculty(id, faculty) {
  return request(`/api/faculty/${id}`, { method: 'PUT', body: JSON.stringify(faculty) })
}
export async function deleteFaculty(id) {
  return request(`/api/faculty/${id}`, { method: 'DELETE' })
}

// Marks Module (Supabase API)
export async function getMarks() {
  return request('/api/marks')
}
export async function createMarks(marks) {
  return request('/api/marks', { method: 'POST', body: JSON.stringify(marks) })
}
export async function updateMarks(id, marks) {
  return request(`/api/marks/${id}`, { method: 'PUT', body: JSON.stringify(marks) })
}
export async function deleteMarks(id) {
  return request(`/api/marks/${id}`, { method: 'DELETE' })
}

// Timetable Module (Supabase API)
export async function getTimetable() {
  return request('/api/timetable')
}
export async function createTimetable(slot) {
  return request('/api/timetable', { method: 'POST', body: JSON.stringify(slot) })
}
export async function deleteTimetable(id) {
  return request(`/api/timetable/${id}`, { method: 'DELETE' })
}

// Examinations Module (Supabase API)
export async function getExaminations() {
  return request('/api/examinations')
}
export async function createExamination(exam) {
  return request('/api/examinations', { method: 'POST', body: JSON.stringify(exam) })
}
export async function deleteExamination(id) {
  return request(`/api/examinations/${id}`, { method: 'DELETE' })
}

// Announcements Module (Supabase API)
export async function getAnnouncements() {
  return request('/api/announcements')
}
export async function createAnnouncement(ann) {
  return request('/api/announcements', { method: 'POST', body: JSON.stringify(ann) })
}
export async function deleteAnnouncement(id) {
  return request(`/api/announcements/${id}`, { method: 'DELETE' })
}

// Notifications Module (Supabase API)
export async function getNotifications() {
  return request('/api/notifications')
}
export async function markNotificationRead(id) {
  return request(`/api/notifications/${id}/read`, { method: 'PUT' })
}
export async function markAllNotificationsRead() {
  return request('/api/notifications/read-all', { method: 'PUT' })
}
export async function deleteNotification(id) {
  return request(`/api/notifications/${id}`, { method: 'DELETE' })
}

// User Management (Supabase API)
export async function getUsers() {
  return request('/api/users')
}
export async function createUser(user) {
  return request('/api/users', { method: 'POST', body: JSON.stringify(user) })
}
export async function deleteUser(id) {
  return request(`/api/users/${id}`, { method: 'DELETE' })
}

// Academic History (Supabase API)
export async function getAcademicHistory() {
  return request('/api/academic-history')
}
