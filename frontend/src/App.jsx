import { useCallback, useEffect, useMemo, useState } from 'react'
import { createStudent, deleteStudent, getStudents, hasSession, login, register, clearTokens } from './api'
import './App.css'

const blankStudent = { rollNumber: '', fullName: '', department: '', email: '', phone: '', dob: '', gender: '', address: '', semester: 1, cgpa: '' }

function App() {
  const [authenticated, setAuthenticated] = useState(hasSession())
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [students, setStudents] = useState([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(blankStudent)

  const loadStudents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getStudents({ keyword: query, page, size: 10, sortBy: 'fullName', sortDir: 'asc' })
      setStudents(result.content || [])
      setTotalPages(result.totalPages || 0)
    } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }, [page, query])

  useEffect(() => {
    if (!authenticated) return undefined
    const loadTimer = setTimeout(loadStudents, 0)
    return () => clearTimeout(loadTimer)
  }, [authenticated, loadStudents])

  async function submitLogin(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try { await login(credentials); setAuthenticated(true) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }

  async function submitStudent(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try { await createStudent({ ...form, semester: Number(form.semester), cgpa: form.cgpa ? Number(form.cgpa) : null }); setShowModal(false); setForm(blankStudent); await loadStudents() } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }

  async function removeStudent(id) {
    if (!window.confirm('Delete this student record?')) return
    try { await deleteStudent(id); await loadStudents() } catch (requestError) { setError(requestError.message) }
  }

  const activeCount = useMemo(() => students.length, [students])
  if (!authenticated) return <Login credentials={credentials} setCredentials={setCredentials} submitLogin={submitLogin} loading={loading} error={error} onAuthSuccess={() => setAuthenticated(true)} />

  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">N</span><span>Northstar</span></div><p className="eyebrow">Workspace</p><nav><button className="nav-item active"><span>▦</span> Students</button><button className="nav-item" onClick={() => setError('Courses management is coming next.') }><span>▤</span> Courses</button><button className="nav-item" onClick={() => setError('Attendance management is coming next.') }><span>◷</span> Attendance</button><button className="nav-item" onClick={() => setError('Reports are coming next.') }><span>▥</span> Reports</button></nav><div className="sidebar-bottom"><button className="nav-item" onClick={() => setError('Settings are coming next.')}><span>⚙</span> Settings</button><div className="profile"><div className="avatar">AD</div><div><strong>Administrator</strong><small>Authenticated</small></div><button className="profile-menu" onClick={() => { clearTokens(); setAuthenticated(false) }}>↪</button></div></div></aside>
    <main className="main-content"><header className="topbar"><div className="crumb">Workspace <span>/</span> <strong>Students</strong></div><div className="top-actions"><span className="connection-status"><i /> API connected</span></div></header><section className="page-heading"><div><p className="eyebrow">Student management</p><h1>Student directory <span>✦</span></h1><p className="subheading">Create, search, and maintain student records.</p></div><button className="primary-button" onClick={() => { setForm(blankStudent); setShowModal(true) }}><span>+</span> Add student</button></section>
      <section className="metrics"><article className="metric-card accent-card"><div className="metric-top"><span>Records on page</span><span className="metric-icon">♙</span></div><strong>{activeCount}</strong><p>Loaded from the API</p></article><article className="metric-card"><div className="metric-top"><span>Current page</span><span className="metric-icon green">#</span></div><strong>{page + 1}</strong><p>of {totalPages || 1} pages</p></article><article className="metric-card"><div className="metric-top"><span>Connection</span><span className="metric-icon blue">✓</span></div><strong>Live</strong><p>Spring Boot backend</p></article><article className="metric-card"><div className="metric-top"><span>Security</span><span className="metric-icon yellow">◆</span></div><strong>JWT</strong><p>Auto-refresh enabled</p></article></section>
      <section className="table-panel"><div className="panel-heading"><div><h2>Student directory</h2><p>Results are loaded from PostgreSQL through the secured API.</p></div><button className="more-button" onClick={loadStudents}>↻</button></div><div className="toolbar"><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => { setPage(0); setQuery(event.target.value) }} placeholder="Search name, email, or roll number..." /></label><button className="filter-button" onClick={loadStudents}>Refresh</button></div>{error && <div className="error-banner">{error}</div>}<div className="table-wrap"><table><thead><tr><th>Student</th><th>Roll number</th><th>Department</th><th>Semester</th><th>CGPA</th><th /></tr></thead><tbody>{students.map((student) => <tr key={student.id}><td><div className="student-cell"><div className="student-avatar">{student.fullName?.split(' ').map((part) => part[0]).join('')}</div><div><strong>{student.fullName}</strong><small>{student.email}</small></div></div></td><td>{student.rollNumber}</td><td>{student.department}</td><td>{student.semester}</td><td>{student.cgpa ?? '-'}</td><td><button className="row-menu" onClick={() => removeStudent(student.id)}>Delete</button></td></tr>)}</tbody></table>{loading && <p className="empty-state">Loading records...</p>}{!loading && students.length === 0 && <p className="empty-state">No student records found.</p>}</div><div className="table-footer"><span>Page {page + 1} of {totalPages || 1}</span><div><button disabled={page === 0 || loading} onClick={() => setPage(page - 1)}>←</button><button className="page-number">{page + 1}</button><button disabled={totalPages === 0 || page >= totalPages - 1 || loading} onClick={() => setPage(page + 1)}>→</button></div></div></section></main>
    {showModal && <div className="modal-backdrop"><form className="modal" onSubmit={submitStudent}><button type="button" className="modal-close" onClick={() => setShowModal(false)}>×</button><p className="eyebrow">New record</p><h2>Add student</h2><p className="modal-copy">This creates a record in the secured backend.</p>{[['fullName', 'Full name'], ['rollNumber', 'Roll number'], ['department', 'Department'], ['email', 'Email address'], ['phone', 'Phone']].map(([key, label]) => <label key={key}>{label}<input required value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></label>)}<div className="form-grid"><label>Semester<input required type="number" min="1" value={form.semester} onChange={(event) => setForm({ ...form, semester: event.target.value })} /></label><label>CGPA<input type="number" min="0" max="10" step="0.01" value={form.cgpa} onChange={(event) => setForm({ ...form, cgpa: event.target.value })} /></label></div><button className="primary-button modal-submit" disabled={loading}>{loading ? 'Saving...' : 'Create student'} <span>→</span></button></form></div>}
  </div>
}

function Login({ credentials, setCredentials, submitLogin, loading, error, onAuthSuccess }) {
  const [registerMode, setRegisterMode] = useState(false)
  const [formError, setFormError] = useState('')
  const [details, setDetails] = useState({ username: '', email: '', password: '', role: 'STUDENT' })
  async function submit(event) {
    event.preventDefault()
    if (!registerMode) return submitLogin(event)
    try { setFormError(''); await register(details); onAuthSuccess() } catch (requestError) { setFormError(requestError.message) }
  }
  const update = (key, value) => setDetails({ ...details, [key]: value })
  return <main className="login-shell"><form className="login-card" onSubmit={submit}><div className="brand"><span className="brand-mark">N</span><span>Northstar</span></div><p className="eyebrow">Student management</p><h1>{registerMode ? 'Create account' : 'Welcome back'}</h1><p className="subheading">{registerMode ? 'Create an account to access your student directory.' : 'Sign in to manage your student directory.'}</p>{registerMode ? <><label>Username<input required value={details.username} onChange={(event) => update('username', event.target.value)} /></label><label>Email<input required type="email" value={details.email} onChange={(event) => update('email', event.target.value)} /></label><label>Password<input required type="password" value={details.password} onChange={(event) => update('password', event.target.value)} /></label><label>Role<select value={details.role} onChange={(event) => update('role', event.target.value)}><option value="STUDENT">Student</option><option value="FACULTY">Faculty</option><option value="ADMIN">Administrator</option></select></label></> : <><label>Username<input required value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} /></label><label>Password<input required type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} /></label></>}{(formError || error) && <div className="error-banner">{formError || error}</div>}<button className="primary-button login-submit" disabled={loading}>{loading ? 'Please wait...' : registerMode ? 'Create account' : 'Sign in'} <span>→</span></button><button type="button" className="switch-auth" onClick={() => { setRegisterMode(!registerMode); setFormError('') }}>{registerMode ? 'Already have an account? Sign in' : 'New here? Create an account'}</button></form></main>
}

export default App
