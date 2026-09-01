import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  clearTokens,
  createAnnouncement,
  createAttendance,
  createCourse,
  createExamination,
  createFaculty,
  createMarks,
  createStudent,
  createTimetable,
  createUser,
  deleteAnnouncement,
  deleteAttendance,
  deleteCourse,
  deleteExamination,
  deleteFaculty,
  deleteMarks,
  deleteNotification,
  deleteStudent,
  deleteTimetable,
  deleteUser,
  getAcademicHistory,
  getAllCourses,
  getAnnouncements,
  getAttendance,
  getCourses,
  getExaminations,
  getFaculty,
  getMarks,
  getNotifications,
  getReportsSummary,
  getRole,
  getStudents,
  getTimetable,
  getUsername,
  getUsers,
  hasSession,
  login,
  markAllNotificationsRead,
  markNotificationRead,
  register,
  updateAttendance,
  updateCourse,
  updateFaculty,
  updateMarks,
  updateStudent,
  USE_API
} from './api'
import './App.css'

const blankStudent = { rollNumber: '', fullName: '', department: '', email: '', phone: '', dob: '', gender: '', address: '', semester: 1, cgpa: '' }
const blankCourse = { courseCode: '', courseName: '', department: '', credits: 3, instructor: '', description: '' }
const blankAttendance = { studentId: '', courseId: '', date: new Date().toISOString().split('T')[0], status: 'PRESENT', remarks: '' }
const blankFaculty = { facultyId: '', name: '', email: '', phone: '', department: '', designation: '', coursesAssigned: '' }
const blankMarks = { studentId: '', courseName: '', internal: 20, assignment: 15, midterm: 25, final: 25 }
const blankTimetable = { day: 'Monday', time: '09:00 AM - 10:30 AM', courseCode: '', courseName: '', faculty: '', room: '', department: 'Computer Science', semester: 4 }
const blankExam = { courseCode: '', courseName: '', type: 'End Semester', date: '', time: '10:00 AM - 01:00 PM', room: 'Hall A', semester: 4, department: 'Computer Science' }
const blankAnnouncement = { title: '', description: '', category: 'Academic', targetAudience: 'All', priority: 'Normal' }
const blankUser = { username: '', name: '', role: 'STUDENT', email: '' }

function App() {
  const [authenticated, setAuthenticated] = useState(hasSession())
  const [role, setRole] = useState(getRole())
  const [username, setUsername] = useState(getUsername())
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [activeTab, setActiveTab] = useState('dashboard')

  // Shared UI States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Domain States
  const [students, setStudents] = useState([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [studentForm, setStudentForm] = useState(blankStudent)
  const [editingStudentId, setEditingStudentId] = useState(null)
  const [viewStudentProfile, setViewStudentProfile] = useState(null)

  const [courses, setCourses] = useState([])
  const [courseQuery, setCourseQuery] = useState('')
  const [courseDeptFilter, setCourseDeptFilter] = useState('')
  const [coursePage, setCoursePage] = useState(0)
  const [courseTotalPages, setCourseTotalPages] = useState(0)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [courseForm, setCourseForm] = useState(blankCourse)
  const [editingCourseId, setEditingCourseId] = useState(null)
  const [viewCourseDetails, setViewCourseDetails] = useState(null)

  const [attendanceList, setAttendanceList] = useState([])
  const [allStudentsList, setAllStudentsList] = useState([])
  const [allCoursesList, setAllCoursesList] = useState([])
  const [attStatusFilter, setAttStatusFilter] = useState('')
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [attendanceForm, setAttendanceForm] = useState(blankAttendance)

  const [facultyList, setFacultyList] = useState([])
  const [facultyQuery, setFacultyQuery] = useState('')
  const [facultyDeptFilter, setFacultyDeptFilter] = useState('')
  const [showFacultyModal, setShowFacultyModal] = useState(false)
  const [facultyForm, setFacultyForm] = useState(blankFaculty)

  const [marksList, setMarksList] = useState([])
  const [marksQuery, setMarksQuery] = useState('')
  const [marksGradeFilter, setMarksGradeFilter] = useState('')
  const [showMarksModal, setShowMarksModal] = useState(false)
  const [marksForm, setMarksForm] = useState(blankMarks)

  const [reportsData, setReportsData] = useState(null)
  const [timetableList, setTimetableList] = useState([])
  const [timetableDayFilter, setTimetableDayFilter] = useState('Monday')
  const [showTimetableModal, setShowTimetableModal] = useState(false)
  const [timetableForm, setTimetableForm] = useState(blankTimetable)

  const [examinations, setExaminations] = useState([])
  const [showExamModal, setShowExamModal] = useState(false)
  const [examForm, setExamForm] = useState(blankExam)

  const [announcements, setAnnouncements] = useState([])
  const [showAnnModal, setShowAnnModal] = useState(false)
  const [annForm, setAnnForm] = useState(blankAnnouncement)

  const [notifications, setNotifications] = useState([])
  const [usersList, setUsersList] = useState([])
  const [showUserModal, setShowUserModal] = useState(false)
  const [userForm, setUserForm] = useState(blankUser)

  const [academicHistory, setAcademicHistory] = useState([])
  const [myStudentsFilterCourse, setMyStudentsFilterCourse] = useState('')

  const canWrite = role === 'ADMIN' || role === 'FACULTY'
  const canDelete = role === 'ADMIN'

  // Logged-in Faculty Name derivation
  const facultyName = useMemo(() => {
    if (role !== 'FACULTY') return ''
    const un = (username || '').toLowerCase()
    if (un.includes('codd')) return 'Prof. Edgar Codd'
    if (un.includes('shannon')) return 'Dr. Claude Shannon'
    if (un.includes('andrew')) return 'Dr. Andrew Ng'
    if (un.includes('hopper')) return 'Dr. Grace Hopper'
    return 'Dr. Alan Turing'
  }, [role, username])

  // Faculty Assigned Courses Filter
  const facultyCourses = useMemo(() => {
    if (role !== 'FACULTY') return courses
    return courses.filter(c => c.instructor === facultyName)
  }, [role, courses, facultyName])

  // Faculty Filtered Courses by Search Box
  const facultyCoursesFiltered = useMemo(() => {
    return facultyCourses.filter(c => {
      const kw = courseQuery.toLowerCase().trim()
      if (!kw) return true
      return c.courseCode.toLowerCase().includes(kw) || c.courseName.toLowerCase().includes(kw) || c.department.toLowerCase().includes(kw)
    })
  }, [facultyCourses, courseQuery])

  // Faculty Assigned Students
  const facultyStudents = useMemo(() => {
    if (role !== 'FACULTY') return students
    const assignedCourseCodes = facultyCourses.map(c => c.courseCode)
    return students.filter(s => assignedCourseCodes.includes(s.courseCode || 'CS101'))
  }, [role, students, facultyCourses])

  // Faculty Timetable Slots
  const facultyTimetable = useMemo(() => {
    if (role !== 'FACULTY') return timetableList
    return timetableList.filter(t => t.faculty === facultyName)
  }, [role, timetableList, facultyName])

  // Data Fetchers
  const loadStudents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getStudents({ keyword: query, page, size: 10, sortBy: 'fullName', sortDir: 'asc' })
      setStudents(result.content || [])
      setTotalPages(result.totalPages || 0)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }, [page, query])

  const loadCourses = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getCourses({ keyword: courseQuery, page: coursePage, size: 10, sortBy: 'courseName', sortDir: 'asc' })
      setCourses(result.content || [])
      setCourseTotalPages(result.totalPages || 0)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }, [coursePage, courseQuery])

  const loadAttendance = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const records = await getAttendance()
      setAttendanceList(records || [])
      const studentsRes = await getStudents({ size: 100 })
      setAllStudentsList(studentsRes.content || [])
      const coursesRes = await getAllCourses()
      setAllCoursesList(coursesRes || [])
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }, [])

  const loadFaculty = useCallback(async () => {
    try { setFacultyList(await getFaculty()) } catch (err) { setError(err.message) }
  }, [])

  const loadMarks = useCallback(async () => {
    try { setMarksList(await getMarks()) } catch (err) { setError(err.message) }
  }, [])

  const loadReports = useCallback(async () => {
    try { setReportsData(await getReportsSummary()) } catch (err) { setError(err.message) }
  }, [])

  const loadTimetable = useCallback(async () => {
    try { setTimetableList(await getTimetable()) } catch (err) { setError(err.message) }
  }, [])

  const loadExaminations = useCallback(async () => {
    try { setExaminations(await getExaminations()) } catch (err) { setError(err.message) }
  }, [])

  const loadAnnouncements = useCallback(async () => {
    try { setAnnouncements(await getAnnouncements()) } catch (err) { setError(err.message) }
  }, [])

  const loadNotifications = useCallback(async () => {
    try { setNotifications(await getNotifications()) } catch { /* Silent */ }
  }, [])

  const loadUsers = useCallback(async () => {
    try { setUsersList(await getUsers()) } catch (err) { setError(err.message) }
  }, [])

  const loadAcademicHistory = useCallback(async () => {
    try { setAcademicHistory(await getAcademicHistory()) } catch (err) { setError(err.message) }
  }, [])

  useEffect(() => {
    if (!authenticated) return undefined
    loadNotifications()
    loadAnnouncements()
    if (activeTab === 'dashboard' || activeTab === 'reports') loadReports()
    if (activeTab === 'students' || activeTab === 'dashboard' || activeTab === 'my-students') loadStudents()
    if (activeTab === 'courses' || activeTab === 'my-courses' || activeTab === 'dashboard') loadCourses()
    if (activeTab === 'attendance' || activeTab === 'dashboard') loadAttendance()
    if (activeTab === 'faculty' || activeTab === 'dashboard') loadFaculty()
    if (activeTab === 'marks') loadMarks()
    if (activeTab === 'timetable') loadTimetable()
    if (activeTab === 'examinations') loadExaminations()
    if (activeTab === 'users') loadUsers()
    if (activeTab === 'academic-history') loadAcademicHistory()
  }, [authenticated, activeTab, loadStudents, loadCourses, loadAttendance, loadFaculty, loadMarks, loadReports, loadTimetable, loadExaminations, loadAnnouncements, loadNotifications, loadUsers, loadAcademicHistory])

  // Auth Handler
  async function submitLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const tokens = await login(credentials)
      setRole(tokens.role)
      setUsername(tokens.username)
      setAuthenticated(true)
      setActiveTab('dashboard')
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  // Submit Actions
  async function submitStudent(e) {
    e.preventDefault(); setLoading(true)
    try {
      const payload = { ...studentForm, semester: Number(studentForm.semester), cgpa: studentForm.cgpa ? Number(studentForm.cgpa) : null }
      if (editingStudentId) await updateStudent(editingStudentId, payload)
      else await createStudent(payload)
      setShowStudentModal(false); setStudentForm(blankStudent); setEditingStudentId(null); await loadStudents()
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  async function submitCourse(e) {
    e.preventDefault(); setLoading(true)
    try {
      const payload = { ...courseForm, credits: Number(courseForm.credits) }
      if (editingCourseId) await updateCourse(editingCourseId, payload)
      else await createCourse(payload)
      setShowCourseModal(false); setCourseForm(blankCourse); setEditingCourseId(null); await loadCourses()
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  async function submitAttendance(e) {
    e.preventDefault()
    try {
      await createAttendance(attendanceForm)
      setShowAttendanceModal(false); setAttendanceForm(blankAttendance); await loadAttendance()
    } catch (err) { setError(err.message) }
  }

  async function submitMarks(e) {
    e.preventDefault()
    try {
      const studentObj = allStudentsList.find(s => s.id === marksForm.studentId)
      await createMarks({
        ...marksForm,
        studentName: studentObj ? studentObj.fullName : 'Student',
        rollNumber: studentObj ? studentObj.rollNumber : '-',
        semester: studentObj ? studentObj.semester : 1
      })
      setShowMarksModal(false); setMarksForm(blankMarks); await loadMarks()
    } catch (err) { setError(err.message) }
  }

  async function submitTimetable(e) {
    e.preventDefault()
    try { await createTimetable(timetableForm); setShowTimetableModal(false); setTimetableForm(blankTimetable); await loadTimetable() } catch (err) { setError(err.message) }
  }

  async function submitExam(e) {
    e.preventDefault()
    try { await createExamination(examForm); setShowExamModal(false); setExamForm(blankExam); await loadExaminations() } catch (err) { setError(err.message) }
  }

  async function submitAnnouncement(e) {
    e.preventDefault()
    try { await createAnnouncement(annForm); setShowAnnModal(false); setAnnForm(blankAnnouncement); await loadAnnouncements() } catch (err) { setError(err.message) }
  }

  async function submitUser(e) {
    e.preventDefault()
    try { await createUser(userForm); setShowUserModal(false); setUserForm(blankUser); await loadUsers() } catch (err) { setError(err.message) }
  }

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])

  const filteredFacultyTimetable = useMemo(() => {
    return facultyTimetable.filter(t => t.day === timetableDayFilter)
  }, [facultyTimetable, timetableDayFilter])

  if (!authenticated) return <Login credentials={credentials} setCredentials={setCredentials} submitLogin={submitLogin} loading={loading} error={error} onAuthSuccess={(tokens) => { setRole(tokens.role); setUsername(tokens.username); setAuthenticated(true); setActiveTab('dashboard') }} />

  return (
    <div className="app-shell">
      {/* ---------------- SIDEBAR NAVIGATION ---------------- */}
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">N</span><span>Northstar</span></div>
        <p className="eyebrow">{role} PORTAL</p>
        <nav>
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span>◈</span> Dashboard
          </button>

          {/* ADMIN NAVIGATION */}
          {role === 'ADMIN' && (
            <>
              <button className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}><span>▦</span> Students</button>
              <button className={`nav-item ${activeTab === 'faculty' ? 'active' : ''}`} onClick={() => setActiveTab('faculty')}><span>⬢</span> Faculty</button>
              <button className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}><span>▤</span> Courses</button>
              <button className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}><span>◷</span> Attendance</button>
              <button className={`nav-item ${activeTab === 'marks' ? 'active' : ''}`} onClick={() => setActiveTab('marks')}><span>★</span> Marks & Grades</button>
              <button className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}><span>◫</span> Timetable</button>
              <button className={`nav-item ${activeTab === 'examinations' ? 'active' : ''}`} onClick={() => setActiveTab('examinations')}><span>📜</span> Examinations</button>
              <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}><span>▥</span> Reports & Analytics</button>
              <button className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}><span>📢</span> Announcements</button>
              <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}><span>👤</span> User Management</button>
            </>
          )}

          {/* FACULTY NAVIGATION (Strict 9 items, Examinations REMOVED) */}
          {role === 'FACULTY' && (
            <>
              <button className={`nav-item ${activeTab === 'my-courses' ? 'active' : ''}`} onClick={() => setActiveTab('my-courses')}><span>▤</span> My Courses</button>
              <button className={`nav-item ${activeTab === 'my-students' ? 'active' : ''}`} onClick={() => setActiveTab('my-students')}><span>▦</span> My Students</button>
              <button className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}><span>◷</span> Attendance</button>
              <button className={`nav-item ${activeTab === 'marks' ? 'active' : ''}`} onClick={() => setActiveTab('marks')}><span>★</span> Marks & Grades</button>
              <button className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}><span>◫</span> Timetable</button>
              <button className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}><span>📢</span> Announcements</button>
            </>
          )}

          {/* STUDENT NAVIGATION */}
          {role === 'STUDENT' && (
            <>
              <button className={`nav-item ${activeTab === 'my-profile' ? 'active' : ''}`} onClick={() => setActiveTab('my-profile')}><span>👤</span> My Profile</button>
              <button className={`nav-item ${activeTab === 'my-courses' ? 'active' : ''}`} onClick={() => setActiveTab('my-courses')}><span>▤</span> Registered Courses</button>
              <button className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}><span>◷</span> Attendance Logs</button>
              <button className={`nav-item ${activeTab === 'marks' ? 'active' : ''}`} onClick={() => setActiveTab('marks')}><span>★</span> My Marks & GPA</button>
              <button className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}><span>◫</span> Class Schedule</button>
              <button className={`nav-item ${activeTab === 'examinations' ? 'active' : ''}`} onClick={() => setActiveTab('examinations')}><span>📜</span> Exam Schedule</button>
              <button className={`nav-item ${activeTab === 'academic-history' ? 'active' : ''}`} onClick={() => setActiveTab('academic-history')}><span>📊</span> Academic History</button>
              <button className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}><span>📢</span> Notices</button>
            </>
          )}

          <button className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <span>🔔</span> Notifications {unreadCount > 0 && <b className="badge-count">{unreadCount}</b>}
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <span>⚙</span> Settings
          </button>
          <div className="profile">
            <div className="avatar">{(role || 'U').slice(0, 2)}</div>
            <div>
              <strong>{username || role}</strong>
              <small>{role}</small>
            </div>
            <button className="profile-menu" title="Sign out" onClick={() => { clearTokens(); setRole(''); setUsername(''); setAuthenticated(false) }}>↪</button>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="main-content">
        <header className="topbar">
          <div className="crumb">University Portal <span>/</span> <strong>{role} Workspace</strong></div>
          <div className="top-actions">
            <span className="connection-status">
              <i style={{ background: USE_API ? '#62aa78' : '#e08a40' }} /> {USE_API ? 'API Connected (PostgreSQL)' : 'Dev UI Mode (Mock Data)'}
            </span>
          </div>
        </header>

        {/* ---------------- DASHBOARD PORTALS ---------------- */}
        {activeTab === 'dashboard' && (
          <>
            <section className="page-heading">
              <div>
                <p className="eyebrow">{role} PORTAL DASHBOARD</p>
                <h1>Welcome back, {facultyName || username || role} <span>✦</span></h1>
                <p className="subheading">Overview of your teaching activities and academic metrics.</p>
              </div>
            </section>

            {/* ADMIN DASHBOARD */}
            {role === 'ADMIN' && (
              <section className="metrics" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <article className="metric-card accent-card">
                  <div className="metric-top"><span>Total Enrolled</span><span className="metric-icon">♙</span></div>
                  <strong>{students.length}</strong>
                  <p>Active Students</p>
                </article>
                <article className="metric-card">
                  <div className="metric-top"><span>Total Faculty</span><span className="metric-icon yellow">⬢</span></div>
                  <strong>{facultyList.length}</strong>
                  <p>Professors & Staff</p>
                </article>
                <article className="metric-card">
                  <div className="metric-top"><span>Catalog Courses</span><span className="metric-icon green">▤</span></div>
                  <strong>{courses.length}</strong>
                  <p>Active Subjects</p>
                </article>
                <article className="metric-card">
                  <div className="metric-top"><span>Avg CGPA</span><span className="metric-icon blue">★</span></div>
                  <strong>3.82</strong>
                  <p>Institution Average</p>
                </article>
              </section>
            )}

            {/* FACULTY DASHBOARD (Reflects ONLY faculty data) */}
            {role === 'FACULTY' && (
              <>
                <section className="metrics" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  <article className="metric-card accent-card">
                    <div className="metric-top"><span>My Courses</span><span className="metric-icon green">▤</span></div>
                    <strong>{facultyCourses.length}</strong>
                    <p>Assigned Subjects</p>
                  </article>
                  <article className="metric-card">
                    <div className="metric-top"><span>Total Students</span><span className="metric-icon">♙</span></div>
                    <strong>{facultyStudents.length}</strong>
                    <p>Across My Courses</p>
                  </article>
                  <article className="metric-card">
                    <div className="metric-top"><span>Today's Classes</span><span className="metric-icon blue">◫</span></div>
                    <strong>{facultyTimetable.filter(t => t.day === 'Monday').length}</strong>
                    <p>Scheduled Lectures</p>
                  </article>
                  <article className="metric-card">
                    <div className="metric-top"><span>Average Attendance</span><span className="metric-icon yellow">◷</span></div>
                    <strong>92.6%</strong>
                    <p>My Course Average</p>
                  </article>
                </section>

                <div className="form-grid" style={{ marginTop: '24px', gridTemplateColumns: '1fr 1fr' }}>
                  <div className="table-panel" style={{ marginTop: 0, padding: '20px' }}>
                    <h3 style={{ margin: '0 0 14px', fontFamily: 'Georgia, serif', color: '#304044' }}>Pending Tasks & Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ padding: '12px', background: '#fff9e6', borderRadius: '6px', border: '1px solid #f2e3b6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div><strong style={{ fontSize: '12px', color: '#6e5618' }}>Pending Attendance Logs</strong><p style={{ margin: 0, fontSize: '11px', color: '#91752b' }}>1 class log pending submission</p></div>
                        <button className="primary-button" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setActiveTab('attendance')}>Mark Now</button>
                      </div>
                      <div style={{ padding: '12px', background: '#f0f7ff', borderRadius: '6px', border: '1px solid #cce3ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div><strong style={{ fontSize: '12px', color: '#1f538c' }}>Pending Marks Entry</strong><p style={{ margin: 0, fontSize: '11px', color: '#3b74b3' }}>Internal marks pending for CS101</p></div>
                        <button className="primary-button" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setActiveTab('marks')}>Enter Marks</button>
                      </div>
                    </div>
                  </div>

                  <div className="table-panel" style={{ marginTop: 0, padding: '20px' }}>
                    <h3 style={{ margin: '0 0 14px', fontFamily: 'Georgia, serif', color: '#304044' }}>My Teaching Activity</h3>
                    <p style={{ fontSize: '12px', color: '#687674' }}>Assigned Instructor: <strong>{facultyName}</strong></p>
                    <p style={{ fontSize: '12px', color: '#687674', marginTop: '4px' }}>Department: <strong>Computer Science</strong></p>
                    <button className="primary-button" style={{ marginTop: '14px' }} onClick={() => setActiveTab('my-courses')}>View My Assigned Courses <span>→</span></button>
                  </div>
                </div>
              </>
            )}

            {/* STUDENT DASHBOARD */}
            {role === 'STUDENT' && (
              <section className="metrics" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <article className="metric-card accent-card">
                  <div className="metric-top"><span>Current CGPA</span><span className="metric-icon yellow">★</span></div>
                  <strong>3.90</strong>
                  <p>Distinction Standing</p>
                </article>
                <article className="metric-card">
                  <div className="metric-top"><span>Attendance Rate</span><span className="metric-icon green">◷</span></div>
                  <strong>94.2%</strong>
                  <p>Good Standing</p>
                </article>
                <article className="metric-card">
                  <div className="metric-top"><span>Credits Earned</span><span className="metric-icon blue">#</span></div>
                  <strong>92</strong>
                  <p>Out of 160 Credits</p>
                </article>
                <article className="metric-card">
                  <div className="metric-top"><span>Current Semester</span><span className="metric-icon">▤</span></div>
                  <strong>Semester 4</strong>
                  <p>Computer Science</p>
                </article>
              </section>
            )}
          </>
        )}

        {/* ---------------- MY COURSES (FACULTY PORTAL VIEW) ---------------- */}
        {activeTab === 'my-courses' && role === 'FACULTY' && (
          <section className="table-panel">
            <div className="panel-heading">
              <div>
                <h2>My Assigned Courses</h2>
                <p>Showing courses assigned to {facultyName}</p>
              </div>
            </div>
            <div className="toolbar">
              <label className="search-box">
                <span>⌕</span>
                <input value={courseQuery} onChange={(e) => setCourseQuery(e.target.value)} placeholder="Search my courses..." />
              </label>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>Section</th>
                    <th>Credits</th>
                    <th>Students</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyCoursesFiltered.map((course) => (
                    <tr key={course.id}>
                      <td><strong>{course.courseCode}</strong></td>
                      <td>{course.courseName}</td>
                      <td>{course.department}</td>
                      <td>Semester {course.semester || 4}</td>
                      <td><span className="status active">{course.section || 'Sec A'}</span></td>
                      <td>{course.credits} Credits</td>
                      <td><strong>{course.enrolledStudentsCount || 28} Students</strong></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="row-menu" onClick={() => { setMyStudentsFilterCourse(course.courseCode); setActiveTab('my-students') }}>View Students</button>
                          <button className="row-menu" onClick={() => setActiveTab('attendance')}>Attendance</button>
                          <button className="row-menu" onClick={() => setActiveTab('marks')}>Marks</button>
                          <button className="row-menu" onClick={() => setViewCourseDetails(course)}>Details</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {facultyCoursesFiltered.length === 0 && <p className="empty-state">No courses assigned to {facultyName}.</p>}
            </div>
          </section>
        )}

        {/* ---------------- MY STUDENTS (FACULTY PORTAL VIEW) ---------------- */}
        {activeTab === 'my-students' && role === 'FACULTY' && (
          <section className="table-panel">
            <div className="panel-heading">
              <div>
                <h2>My Course Students</h2>
                <p>Students enrolled in courses taught by {facultyName}</p>
              </div>
            </div>
            <div className="toolbar">
              <label className="search-box">
                <span>⌕</span>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search student name or roll number..." />
              </label>
              <select className="filter-button" value={myStudentsFilterCourse} onChange={(e) => setMyStudentsFilterCourse(e.target.value)}>
                <option value="">All My Courses</option>
                {facultyCourses.map(c => <option key={c.id} value={c.courseCode}>{c.courseCode} - {c.courseName}</option>)}
              </select>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>Course</th>
                    <th>Attendance %</th>
                    <th>CGPA</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyStudents.map((s) => (
                    <tr key={s.id}>
                      <td><strong>{s.rollNumber}</strong></td>
                      <td>
                        <div className="student-cell">
                          <div className="student-avatar">{s.fullName?.split(' ').map(p => p[0]).join('')}</div>
                          <div><strong>{s.fullName}</strong><small>{s.email}</small></div>
                        </div>
                      </td>
                      <td>{s.department}</td>
                      <td>Semester {s.semester}</td>
                      <td><span className="status active">{s.courseCode || 'CS101'}</span></td>
                      <td><strong style={{ color: (s.attendancePct || 90) < 75 ? '#a14f43' : '#176b57' }}>{s.attendancePct || 92.0}%</strong></td>
                      <td><strong>{s.cgpa || '-'}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {facultyStudents.length === 0 && <p className="empty-state">No students found for this course filter.</p>}
            </div>
          </section>
        )}

        {/* ---------------- STUDENTS (ADMIN VIEW) ---------------- */}
        {activeTab === 'students' && role === 'ADMIN' && (
          <section className="table-panel">
            <div className="panel-heading">
              <div><h2>Student Directory</h2></div>
              <button className="primary-button" onClick={() => { setStudentForm(blankStudent); setEditingStudentId(null); setShowStudentModal(true) }}><span>+</span> Add Student</button>
            </div>
            <div className="toolbar">
              <label className="search-box">
                <span>⌕</span>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, roll number, or email..." />
              </label>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Department</th>
                    <th>Semester</th>
                    <th>CGPA</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} style={{ cursor: 'pointer' }} onClick={() => setViewStudentProfile(student)}>
                      <td>
                        <div className="student-cell">
                          <div className="student-avatar">{student.fullName?.split(' ').map(p => p[0]).join('')}</div>
                          <div><strong>{student.fullName}</strong><small>{student.email}</small></div>
                        </div>
                      </td>
                      <td>{student.rollNumber}</td>
                      <td>{student.department}</td>
                      <td>{student.semester}</td>
                      <td><strong>{student.cgpa ?? '-'}</strong></td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button className="row-menu" onClick={() => { setStudentForm({ ...blankStudent, ...student }); setEditingStudentId(student.id); setShowStudentModal(true) }}>Edit</button>
                        <button className="row-menu" onClick={() => deleteStudent(student.id).then(loadStudents)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ---------------- COURSES (ADMIN VIEW) ---------------- */}
        {activeTab === 'courses' && role === 'ADMIN' && (
          <section className="table-panel">
            <div className="panel-heading">
              <div><h2>Academic Course Catalog</h2></div>
              <button className="primary-button" onClick={() => { setCourseForm(blankCourse); setEditingCourseId(null); setShowCourseModal(true) }}><span>+</span> Add Course</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Course Name</th>
                    <th>Department</th>
                    <th>Credits</th>
                    <th>Instructor</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td><strong>{course.courseCode}</strong></td>
                      <td>{course.courseName}</td>
                      <td>{course.department}</td>
                      <td>{course.credits}</td>
                      <td>{course.instructor}</td>
                      <td>
                        <button className="row-menu" onClick={() => { setCourseForm({ ...blankCourse, ...course }); setEditingCourseId(course.id); setShowCourseModal(true) }}>Edit</button>
                        <button className="row-menu" onClick={() => deleteCourse(course.id).then(loadCourses)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ---------------- FACULTY (ADMIN VIEW) ---------------- */}
        {activeTab === 'faculty' && role === 'ADMIN' && (
          <section className="table-panel">
            <div className="panel-heading">
              <div><h2>Faculty Members</h2></div>
              <button className="primary-button" onClick={() => { setFacultyForm(blankFaculty); setShowFacultyModal(true) }}><span>+</span> Add Faculty</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Faculty ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {facultyList.map(f => (
                    <tr key={f.id}>
                      <td><strong>{f.facultyId}</strong></td>
                      <td>{f.name}</td>
                      <td>{f.email}</td>
                      <td>{f.department}</td>
                      <td>{f.designation}</td>
                      <td>
                        <button className="row-menu" onClick={() => deleteFaculty(f.id).then(loadFaculty)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ---------------- ATTENDANCE ---------------- */}
        {activeTab === 'attendance' && (
          <section className="table-panel">
            <div className="panel-heading">
              <div><h2>Attendance Logs</h2></div>
              {canWrite && <button className="primary-button" onClick={() => setShowAttendanceModal(true)}><span>+</span> Record Attendance</button>}
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {attendanceList.map(a => (
                    <tr key={a.id}>
                      <td><strong>{a.studentName}</strong></td>
                      <td>{a.studentRollNumber}</td>
                      <td>{a.courseName}</td>
                      <td>{a.date}</td>
                      <td><span className={`status ${a.status === 'PRESENT' ? 'active' : 'inactive'}`}><i /> {a.status}</span></td>
                      <td>
                        {canDelete && <button className="row-menu" onClick={() => deleteAttendance(a.id).then(loadAttendance)}>Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ---------------- MARKS & GRADES ---------------- */}
        {activeTab === 'marks' && (
          <section className="table-panel">
            <div className="panel-heading">
              <div><h2>Academic Grade Sheet</h2></div>
              {canWrite && <button className="primary-button" onClick={() => setShowMarksModal(true)}><span>+</span> Enter Marks</button>}
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Course</th>
                    <th>Internal (25)</th>
                    <th>Midterm (30)</th>
                    <th>Final (25)</th>
                    <th>Total</th>
                    <th>Grade</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {marksList.map(m => (
                    <tr key={m.id}>
                      <td><strong>{m.studentName}</strong></td>
                      <td>{m.rollNumber}</td>
                      <td>{m.courseName}</td>
                      <td>{m.internal}</td>
                      <td>{m.midterm}</td>
                      <td>{m.final}</td>
                      <td><strong>{m.total}</strong></td>
                      <td><span className="status active">★ {m.grade}</span></td>
                      <td>
                        {canDelete && <button className="row-menu" onClick={() => deleteMarks(m.id).then(loadMarks)}>Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ---------------- TIMETABLE ---------------- */}
        {activeTab === 'timetable' && (
          <section className="table-panel">
            <div className="panel-heading">
              <div>
                <h2>{role === 'FACULTY' ? `My Teaching Timetable (${facultyName})` : 'Class Schedule'}</h2>
              </div>
              {role === 'ADMIN' && <button className="primary-button" onClick={() => setShowTimetableModal(true)}><span>+</span> Add Slot</button>}
            </div>

            <div className="toolbar" style={{ borderBottom: 'none', paddingLeft: 0 }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <button key={day} className={`filter-button ${timetableDayFilter === day ? 'selected' : ''}`} onClick={() => setTimetableDayFilter(day)} style={{ padding: '8px 14px', fontSize: '12px' }}>
                  {day} {day === 'Monday' && ' (Today)'}
                </button>
              ))}
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Semester</th>
                    <th>Section</th>
                    <th>Room</th>
                    {role === 'ADMIN' && <th />}
                  </tr>
                </thead>
                <tbody>
                  {(role === 'FACULTY' ? filteredFacultyTimetable : timetableList.filter(t => t.day === timetableDayFilter)).map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.time}</strong></td>
                      <td>{t.courseCode}</td>
                      <td>{t.courseName}</td>
                      <td>Semester {t.semester || 4}</td>
                      <td><span className="status active">{t.section || 'Sec A'}</span></td>
                      <td>{t.room}</td>
                      {role === 'ADMIN' && (
                        <td><button className="row-menu" onClick={() => deleteTimetable(t.id).then(loadTimetable)}>Remove</button></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {(role === 'FACULTY' ? filteredFacultyTimetable : timetableList.filter(t => t.day === timetableDayFilter)).length === 0 && (
                <p className="empty-state">No scheduled lectures for {timetableDayFilter}.</p>
              )}
            </div>
          </section>
        )}

        {/* ---------------- EXAMINATIONS (ADMIN & STUDENT ONLY) ---------------- */}
        {activeTab === 'examinations' && role !== 'FACULTY' && (
          <section className="table-panel">
            <div className="panel-heading">
              <div><h2>Examination Schedule</h2></div>
              {canWrite && <button className="primary-button" onClick={() => setShowExamModal(true)}><span>+</span> Add Exam</button>}
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Exam Type</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Room</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {examinations.map(ex => (
                    <tr key={ex.id}>
                      <td><strong>{ex.courseCode} - {ex.courseName}</strong></td>
                      <td>{ex.type}</td>
                      <td>{ex.date}</td>
                      <td>{ex.time}</td>
                      <td><span className="status active">{ex.room}</span></td>
                      <td>
                        {canDelete && <button className="row-menu" onClick={() => deleteExamination(ex.id).then(loadExaminations)}>Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ---------------- ANNOUNCEMENTS ---------------- */}
        {activeTab === 'announcements' && (
          <section className="table-panel" style={{ padding: '20px' }}>
            <div className="panel-heading" style={{ padding: 0, marginBottom: '20px' }}>
              <div><h2>Notices & Announcements</h2></div>
              {canWrite && <button className="primary-button" onClick={() => setShowAnnModal(true)}><span>+</span> Post Notice</button>}
            </div>
            {announcements.map(an => (
              <div key={an.id} style={{ padding: '16px', border: '1px solid var(--line)', borderRadius: '8px', marginBottom: '12px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#304044', fontSize: '14px' }}>{an.title}</strong>
                  <span className="status pending">{an.priority}</span>
                </div>
                <p style={{ margin: '8px 0', color: '#687674', fontSize: '12px' }}>{an.description}</p>
                <small style={{ color: '#9aa5a3', fontSize: '10px' }}>Target: {an.targetAudience} • Posted: {an.date}</small>
              </div>
            ))}
          </section>
        )}

        {/* ---------------- ACADEMIC HISTORY (STUDENT VIEW) ---------------- */}
        {activeTab === 'academic-history' && role === 'STUDENT' && (
          <section className="table-panel">
            <div className="panel-heading"><div><h2>Semester-wise Performance History</h2></div></div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>Academic Year</th>
                    <th>SGPA</th>
                    <th>Cumulative CGPA</th>
                    <th>Credits Earned</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {academicHistory.map((h, i) => (
                    <tr key={i}>
                      <td><strong>{h.semester}</strong></td>
                      <td>{h.year}</td>
                      <td>{h.sgpa}</td>
                      <td><strong>{h.cgpa}</strong></td>
                      <td>{h.creditsEarned}</td>
                      <td><span className="status active">{h.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ---------------- USER MANAGEMENT (ADMIN VIEW) ---------------- */}
        {activeTab === 'users' && role === 'ADMIN' && (
          <section className="table-panel">
            <div className="panel-heading">
              <div><h2>Portal Users & Access Roles</h2></div>
              <button className="primary-button" onClick={() => setShowUserModal(true)}><span>+</span> Create User</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id}>
                      <td><strong>{u.username}</strong></td>
                      <td>{u.name}</td>
                      <td><span className="status active">{u.role}</span></td>
                      <td>{u.email}</td>
                      <td>{u.status}</td>
                      <td><button className="row-menu" onClick={() => deleteUser(u.id).then(loadUsers)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ---------------- SETTINGS ---------------- */}
        {activeTab === 'settings' && (
          <section className="table-panel" style={{ padding: '24px' }}>
            <h2>Account Preferences</h2>
            <p>Role: <strong>{role}</strong></p>
            <p>Username: <strong>{username}</strong></p>
            <button className="primary-button" style={{ background: '#a14f43', marginTop: '20px' }} onClick={() => { clearTokens(); setRole(''); setUsername(''); setAuthenticated(false) }}>Sign out</button>
          </section>
        )}
      </main>

      {/* ---------------- MODALS ---------------- */}
      {showStudentModal && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={submitStudent}>
            <button type="button" className="modal-close" onClick={() => setShowStudentModal(false)}>×</button>
            <h2>{editingStudentId ? 'Edit Student' : 'Add Student'}</h2>
            {[ ['fullName', 'Full Name'], ['rollNumber', 'Roll Number'], ['department', 'Department'], ['email', 'Email Address'], ['phone', 'Phone'] ].map(([key, label]) => (
              <label key={key}>{label}<input required value={studentForm[key]} onChange={(e) => setStudentForm({ ...studentForm, [key]: e.target.value })} /></label>
            ))}
            <button className="primary-button modal-submit">Save Student <span>→</span></button>
          </form>
        </div>
      )}

      {showCourseModal && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={submitCourse}>
            <button type="button" className="modal-close" onClick={() => setShowCourseModal(false)}>×</button>
            <h2>{editingCourseId ? 'Edit Course' : 'Add Course'}</h2>
            <label>Course Code<input required value={courseForm.courseCode} onChange={(e) => setCourseForm({ ...courseForm, courseCode: e.target.value })} /></label>
            <label>Course Name<input required value={courseForm.courseName} onChange={(e) => setCourseForm({ ...courseForm, courseName: e.target.value })} /></label>
            <label>Department<input value={courseForm.department} onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })} /></label>
            <button className="primary-button modal-submit">Save Course <span>→</span></button>
          </form>
        </div>
      )}

      {showAnnModal && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={submitAnnouncement}>
            <button type="button" className="modal-close" onClick={() => setShowAnnModal(false)}>×</button>
            <h2>New Announcement</h2>
            <label>Title<input required value={annForm.title} onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} /></label>
            <label>Description<input required value={annForm.description} onChange={(e) => setAnnForm({ ...annForm, description: e.target.value })} /></label>
            <button className="primary-button modal-submit">Post Announcement <span>→</span></button>
          </form>
        </div>
      )}
    </div>
  )
}

function Login({ credentials, setCredentials, submitLogin, loading, error, onAuthSuccess }) {
  const [registerMode, setRegisterMode] = useState(false)
  const [details, setDetails] = useState({ username: '', email: '', password: '', role: 'STUDENT' })

  async function submit(e) {
    e.preventDefault()
    if (!registerMode) return submitLogin(e)
    try { const tokens = await register(details); onAuthSuccess(tokens) } catch (err) { alert(err.message) }
  }

  return (
    <main className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <div className="brand"><span className="brand-mark">N</span><span>Northstar Portal</span></div>
        <h1>{registerMode ? 'Create Account' : 'Sign In'}</h1>
        {registerMode ? (
          <>
            <label>Username<input required value={details.username} onChange={(e) => setDetails({ ...details, username: e.target.value })} /></label>
            <label>Email<input required type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} /></label>
            <label>Password<input required type="password" value={details.password} onChange={(e) => setDetails({ ...details, password: e.target.value })} /></label>
            <label>Role
              <select value={details.role} onChange={(e) => setDetails({ ...details, role: e.target.value })}>
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </label>
          </>
        ) : (
          <>
            <label>Username (e.g. admin / turing / alex)<input required value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} /></label>
            <label>Password<input required type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} /></label>
          </>
        )}
        {error && <div className="error-banner">{error}</div>}
        <button className="primary-button login-submit">{registerMode ? 'Create Account' : 'Sign In'} <span>→</span></button>
        <button type="button" className="switch-auth" onClick={() => setRegisterMode(!registerMode)}>{registerMode ? 'Sign In Instead' : 'Create New Account'}</button>
      </form>
    </main>
  )
}

export default App
