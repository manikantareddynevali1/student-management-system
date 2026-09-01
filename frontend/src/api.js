import {
  initialMockFaculty,
  initialMockMarks,
  initialMockTimetable,
  initialMockExaminations,
  initialMockAnnouncements,
  initialMockNotifications,
  initialMockUsers,
  initialMockAcademicHistory
} from './mockData'

export const USE_API = import.meta.env.VITE_USE_API === 'true'
const API_BASE = import.meta.env.VITE_API_URL || ''

let accessToken = sessionStorage.getItem('accessToken')
let refreshToken = sessionStorage.getItem('refreshToken')

// In-Memory Mock Store for UI Development Mode (VITE_USE_API=false)
let mockStudents = [
  { id: '1', rollNumber: 'CS2026', fullName: 'Alex Rivera', department: 'Computer Science', email: 'alex@university.edu', phone: '555-0199', dob: '2002-05-15', gender: 'MALE', address: '123 Campus Way', semester: 4, cgpa: 3.90, courseCode: 'CS101', courseName: 'Data Structures & Algorithms', attendancePct: 94.2 },
  { id: '2', rollNumber: 'CS2027', fullName: 'Sophia Chen', department: 'Computer Science', email: 'sophia@university.edu', phone: '555-0198', dob: '2003-08-22', gender: 'FEMALE', address: '456 University Ave', semester: 4, cgpa: 3.82, courseCode: 'CS101', courseName: 'Data Structures & Algorithms', attendancePct: 91.0 },
  { id: '3', rollNumber: 'EC2025', fullName: 'Marcus Vance', department: 'Electronics & Comm', email: 'marcus@university.edu', phone: '555-0197', dob: '2001-11-10', gender: 'MALE', address: '789 Science Park', semester: 6, cgpa: 3.65, courseCode: 'EC301', courseName: 'Digital Signal Processing', attendancePct: 71.5 },
  { id: '4', rollNumber: 'DS2026', fullName: 'Emily Watson', department: 'Data Science', email: 'emily@university.edu', phone: '555-0196', dob: '2002-03-30', gender: 'FEMALE', address: '101 Tech Hub', semester: 4, cgpa: 3.95, courseCode: 'DS401', courseName: 'Machine Learning & AI', attendancePct: 98.0 },
  { id: '5', rollNumber: 'CS2028', fullName: 'Liam O\'Connor', department: 'Computer Science', email: 'liam@university.edu', phone: '555-0195', dob: '2004-01-12', gender: 'MALE', address: '202 College St', semester: 4, cgpa: 3.50, courseCode: 'CS202', courseName: 'Database Management Systems', attendancePct: 85.4 }
]

let mockCourses = [
  { id: '101', courseCode: 'CS101', courseName: 'Data Structures & Algorithms', department: 'Computer Science', semester: 4, section: 'Sec A', credits: 4, instructor: 'Dr. Alan Turing', description: 'Fundamental data structures and complexity analysis.', enrolledStudentsCount: 28 },
  { id: '102', courseCode: 'CS202', courseName: 'Database Management Systems', department: 'Computer Science', semester: 4, section: 'Sec B', credits: 4, instructor: 'Prof. Edgar Codd', description: 'Relational model, SQL, normalization and transaction processing.', enrolledStudentsCount: 32 },
  { id: '103', courseCode: 'EC301', courseName: 'Digital Signal Processing', department: 'Electronics & Comm', semester: 6, section: 'Sec A', credits: 3, instructor: 'Dr. Claude Shannon', description: 'Continuous and discrete time signals and Fourier analysis.', enrolledStudentsCount: 24 },
  { id: '104', courseCode: 'DS401', courseName: 'Machine Learning & AI', department: 'Data Science', semester: 4, section: 'Sec A', credits: 4, instructor: 'Dr. Andrew Ng', description: 'Supervised, unsupervised learning and neural networks.', enrolledStudentsCount: 30 }
]

let mockAttendance = [
  { id: 'a1', studentId: '1', studentName: 'Alex Rivera', studentRollNumber: 'CS2026', courseId: '101', courseName: 'Data Structures & Algorithms', courseCode: 'CS101', date: '2026-08-28', status: 'PRESENT', remarks: 'On time' },
  { id: 'a2', studentId: '2', studentName: 'Sophia Chen', studentRollNumber: 'CS2027', courseId: '101', courseName: 'Data Structures & Algorithms', courseCode: 'CS101', date: '2026-08-28', status: 'PRESENT', remarks: 'Active participation' },
  { id: 'a3', studentId: '3', studentName: 'Marcus Vance', studentRollNumber: 'EC2025', courseId: '103', courseName: 'Digital Signal Processing', courseCode: 'EC301', date: '2026-08-28', status: 'ABSENT', remarks: 'Sick leave' },
  { id: 'a4', studentId: '4', studentName: 'Emily Watson', studentRollNumber: 'DS2026', courseId: '104', courseName: 'Machine Learning & AI', courseCode: 'DS401', date: '2026-08-28', status: 'PRESENT', remarks: 'Submitted assignment' },
  { id: 'a5', studentId: '5', studentName: 'Liam O\'Connor', studentRollNumber: 'CS2028', courseId: '102', courseName: 'Database Management Systems', courseCode: 'CS202', date: '2026-08-28', status: 'LATE', remarks: '10 mins delayed' }
]

let mockFacultyStore = [...initialMockFaculty]
let mockMarksStore = [...initialMockMarks]
let mockTimetableStore = [...initialMockTimetable]
let mockExaminationsStore = [...initialMockExaminations]
let mockAnnouncementsStore = [...initialMockAnnouncements]
let mockNotificationsStore = [...initialMockNotifications]
let mockUsersStore = [...initialMockUsers]

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
    try { message = (await response.json()).message || message } catch { /* Empty responses are valid for DELETE and password endpoints. */ }
    throw new Error(message)
  }
  return response.status === 204 ? null : response.json()
}

// Authentication
export async function login(credentials) {
  if (!USE_API) {
    const un = (credentials.username || '').toLowerCase()
    let assignedRole = 'ADMIN'
    if (un.includes('faculty') || un.includes('turing') || un.includes('teacher') || un.includes('codd')) assignedRole = 'FACULTY'
    else if (un.includes('student') || un.includes('alex') || un.includes('sophia')) assignedRole = 'STUDENT'

    const tokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      role: assignedRole,
      username: credentials.username || 'User'
    }
    saveTokens(tokens)
    return tokens
  }
  const tokens = await request('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }, false)
  saveTokens(tokens)
  return tokens
}

export async function register(details) {
  if (!USE_API) {
    const tokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      role: details.role || 'STUDENT',
      username: details.username || 'New User'
    }
    saveTokens(tokens)
    return tokens
  }
  const tokens = await request('/api/auth/register', { method: 'POST', body: JSON.stringify(details) }, false)
  saveTokens(tokens)
  return tokens
}

export function hasSession() { return Boolean(accessToken) || !USE_API }
export function getRole() { return sessionStorage.getItem('role') || (USE_API ? '' : 'ADMIN') }
export function getUsername() { return sessionStorage.getItem('username') || (USE_API ? '' : 'Admin User') }

// Students API / Mock
export async function getStudents(params = {}) {
  if (!USE_API) {
    let list = [...mockStudents]
    const kw = (params.keyword || '').toLowerCase().trim()
    if (kw) {
      list = list.filter(s =>
        s.fullName.toLowerCase().includes(kw) ||
        s.rollNumber.toLowerCase().includes(kw) ||
        s.email.toLowerCase().includes(kw) ||
        s.department.toLowerCase().includes(kw)
      )
    }
    return { content: list, totalPages: 1, totalElements: list.length }
  }
  return request(`/api/students?${new URLSearchParams(params)}`)
}

export async function getStudentById(id) {
  if (!USE_API) {
    const found = mockStudents.find(s => s.id === String(id))
    if (!found) throw new Error('Student not found')
    return found
  }
  return request(`/api/students/${id}`)
}

export async function createStudent(student) {
  if (!USE_API) {
    const created = { id: String(Date.now()), ...student }
    mockStudents = [created, ...mockStudents]
    return created
  }
  return request('/api/students', { method: 'POST', body: JSON.stringify(student) })
}

export async function updateStudent(id, student) {
  if (!USE_API) {
    mockStudents = mockStudents.map(s => s.id === String(id) ? { ...s, ...student } : s)
    return { id, ...student }
  }
  return request(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(student) })
}

export async function deleteStudent(id) {
  if (!USE_API) {
    mockStudents = mockStudents.filter(s => s.id !== String(id))
    return null
  }
  return request(`/api/students/${id}`, { method: 'DELETE' })
}

// Courses API / Mock
export async function getCourses(params = {}) {
  if (!USE_API) {
    let list = [...mockCourses]
    const kw = (params.keyword || '').toLowerCase().trim()
    if (kw) {
      list = list.filter(c =>
        c.courseCode.toLowerCase().includes(kw) ||
        c.courseName.toLowerCase().includes(kw) ||
        c.department.toLowerCase().includes(kw)
      )
    }
    return { content: list, totalPages: 1, totalElements: list.length }
  }
  return request(`/api/courses?${new URLSearchParams(params)}`)
}

export async function getAllCourses() {
  if (!USE_API) return [...mockCourses]
  return request('/api/courses/all')
}

export async function createCourse(course) {
  if (!USE_API) {
    const created = { id: String(Date.now()), ...course }
    mockCourses = [created, ...mockCourses]
    return created
  }
  return request('/api/courses', { method: 'POST', body: JSON.stringify(course) })
}

export async function updateCourse(id, course) {
  if (!USE_API) {
    mockCourses = mockCourses.map(c => c.id === String(id) ? { ...c, ...course } : c)
    return { id, ...course }
  }
  return request(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(course) })
}

export async function deleteCourse(id) {
  if (!USE_API) {
    mockCourses = mockCourses.filter(c => c.id !== String(id))
    return null
  }
  return request(`/api/courses/${id}`, { method: 'DELETE' })
}

// Attendance API / Mock
export async function getAttendance() {
  if (!USE_API) return [...mockAttendance]
  return request('/api/attendance')
}

export async function createAttendance(attendance) {
  if (!USE_API) {
    const student = mockStudents.find(s => s.id === String(attendance.studentId))
    const course = mockCourses.find(c => c.id === String(attendance.courseId))
    const created = {
      id: String(Date.now()),
      studentId: attendance.studentId,
      studentName: student ? student.fullName : 'Student',
      studentRollNumber: student ? student.rollNumber : '-',
      courseId: attendance.courseId,
      courseName: course ? course.courseName : 'General',
      courseCode: course ? course.courseCode : '',
      date: attendance.date,
      status: attendance.status,
      remarks: attendance.remarks
    }
    mockAttendance = [created, ...mockAttendance]
    return created
  }
  return request('/api/attendance', { method: 'POST', body: JSON.stringify(attendance) })
}

export async function updateAttendance(id, attendance) {
  if (!USE_API) {
    const student = mockStudents.find(s => s.id === String(attendance.studentId))
    const course = mockCourses.find(c => c.id === String(attendance.courseId))
    mockAttendance = mockAttendance.map(a => {
      if (a.id === String(id)) {
        return {
          ...a,
          ...attendance,
          studentName: student ? student.fullName : a.studentName,
          studentRollNumber: student ? student.rollNumber : a.studentRollNumber,
          courseName: course ? course.courseName : a.courseName,
          courseCode: course ? course.courseCode : a.courseCode
        }
      }
      return a
    })
    return { id, ...attendance }
  }
  return request(`/api/attendance/${id}`, { method: 'PUT', body: JSON.stringify(attendance) })
}

export async function deleteAttendance(id) {
  if (!USE_API) {
    mockAttendance = mockAttendance.filter(a => a.id !== String(id))
    return null
  }
  return request(`/api/attendance/${id}`, { method: 'DELETE' })
}

// Reports API / Mock
export async function getReportsSummary() {
  if (!USE_API) {
    const totalStudents = mockStudents.length
    const totalCourses = mockCourses.length
    const totalAttendanceRecords = mockAttendance.length
    const presentCount = mockAttendance.filter(a => a.status === 'PRESENT').length
    const absentCount = mockAttendance.filter(a => a.status === 'ABSENT').length
    const sumCgpa = mockStudents.reduce((acc, s) => acc + (s.cgpa || 0), 0)
    const avgCgpa = totalStudents > 0 ? (sumCgpa / totalStudents).toFixed(2) : '0.00'
    const attendanceRate = totalAttendanceRecords > 0 ? ((presentCount / totalAttendanceRecords) * 100).toFixed(1) : '100.0'

    return {
      totalStudents,
      totalCourses,
      totalFaculty: mockFacultyStore.length,
      totalAttendanceRecords,
      presentCount,
      absentCount,
      averageCgpa: Number(avgCgpa),
      attendanceRate: Number(attendanceRate)
    }
  }
  return request('/api/reports/summary')
}

// Faculty Module (Mock)
export async function getFaculty() {
  return [...mockFacultyStore]
}
export async function createFaculty(faculty) {
  const created = { id: 'f' + Date.now(), ...faculty }
  mockFacultyStore = [created, ...mockFacultyStore]
  return created
}
export async function updateFaculty(id, faculty) {
  mockFacultyStore = mockFacultyStore.map(f => f.id === String(id) ? { ...f, ...faculty } : f)
  return { id, ...faculty }
}
export async function deleteFaculty(id) {
  mockFacultyStore = mockFacultyStore.filter(f => f.id !== String(id))
  return null
}

// Marks Module (Mock)
export async function getMarks() {
  return [...mockMarksStore]
}
export async function createMarks(marks) {
  const total = Number(marks.internal || 0) + Number(marks.assignment || 0) + Number(marks.midterm || 0) + Number(marks.final || 0)
  let grade = 'F'
  if (total >= 95) grade = 'A+'
  else if (total >= 90) grade = 'A'
  else if (total >= 80) grade = 'B+'
  else if (total >= 70) grade = 'B'
  else if (total >= 60) grade = 'C'
  else if (total >= 50) grade = 'D'

  const created = { id: 'm' + Date.now(), ...marks, total, grade }
  mockMarksStore = [created, ...mockMarksStore]
  return created
}
export async function updateMarks(id, marks) {
  const total = Number(marks.internal || 0) + Number(marks.assignment || 0) + Number(marks.midterm || 0) + Number(marks.final || 0)
  let grade = 'F'
  if (total >= 95) grade = 'A+'
  else if (total >= 90) grade = 'A'
  else if (total >= 80) grade = 'B+'
  else if (total >= 70) grade = 'B'
  else if (total >= 60) grade = 'C'
  else if (total >= 50) grade = 'D'

  mockMarksStore = mockMarksStore.map(m => m.id === String(id) ? { ...m, ...marks, total, grade } : m)
  return { id, ...marks, total, grade }
}
export async function deleteMarks(id) {
  mockMarksStore = mockMarksStore.filter(m => m.id !== String(id))
  return null
}

// Timetable Module (Mock)
export async function getTimetable() {
  return [...mockTimetableStore]
}
export async function createTimetable(slot) {
  const created = { id: 't' + Date.now(), ...slot }
  mockTimetableStore = [...mockTimetableStore, created]
  return created
}
export async function deleteTimetable(id) {
  mockTimetableStore = mockTimetableStore.filter(t => t.id !== String(id))
  return null
}

// Examinations Module (Mock)
export async function getExaminations() {
  return [...mockExaminationsStore]
}
export async function createExamination(exam) {
  const created = { id: 'ex' + Date.now(), ...exam }
  mockExaminationsStore = [created, ...mockExaminationsStore]
  return created
}
export async function deleteExamination(id) {
  mockExaminationsStore = mockExaminationsStore.filter(e => e.id !== String(id))
  return null
}

// Announcements Module (Mock)
export async function getAnnouncements() {
  return [...mockAnnouncementsStore]
}
export async function createAnnouncement(ann) {
  const created = { id: 'an' + Date.now(), ...ann, date: new Date().toISOString().split('T')[0] }
  mockAnnouncementsStore = [created, ...mockAnnouncementsStore]
  return created
}
export async function deleteAnnouncement(id) {
  mockAnnouncementsStore = mockAnnouncementsStore.filter(a => a.id !== String(id))
  return null
}

// Notifications Module (Mock)
export async function getNotifications() {
  return [...mockNotificationsStore]
}
export async function markNotificationRead(id) {
  mockNotificationsStore = mockNotificationsStore.map(n => n.id === String(id) ? { ...n, read: true } : n)
  return true
}
export async function markAllNotificationsRead() {
  mockNotificationsStore = mockNotificationsStore.map(n => ({ ...n, read: true }))
  return true
}
export async function deleteNotification(id) {
  mockNotificationsStore = mockNotificationsStore.filter(n => n.id !== String(id))
  return null
}

// User Management (Mock)
export async function getUsers() {
  return [...mockUsersStore]
}
export async function createUser(user) {
  const created = { id: 'u' + Date.now(), ...user, status: 'ACTIVE', lastLogin: 'Never' }
  mockUsersStore = [created, ...mockUsersStore]
  return created
}
export async function deleteUser(id) {
  mockUsersStore = mockUsersStore.filter(u => u.id !== String(id))
  return null
}

// Academic History (Mock)
export async function getAcademicHistory() {
  return [...initialMockAcademicHistory]
}
