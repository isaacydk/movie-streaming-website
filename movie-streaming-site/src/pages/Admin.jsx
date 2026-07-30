import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HOME_MOVIES_CACHE_KEY } from '../hooks/useHomeMovies'
import './Admin.css'

const API_BASE = 'http://192.168.1.8/backend/api/admin'

// Home.jsx / LandingPage.jsx cache movies.php's response in localStorage for
// a few minutes (see useHomeMovies.js) so they're not hitting the DB on
// every visit. Any admin change (create/edit/delete/sync) makes that cache
// stale immediately, so we clear it here - the next Home/Landing load then
// fetches fresh data instead of showing a deleted/edited movie.
function invalidateHomeMoviesCache() {
  try {
    localStorage.removeItem(HOME_MOVIES_CACHE_KEY)
  } catch {
    // localStorage unavailable (e.g. private mode edge case) - non-fatal
  }
}

const EMPTY_MOVIE = {
  id: '',
  title: '',
  genre: '',
  rating: '',
  poster: '',
  synopsis: '',
  director: '',
  cast: '',
  releaseYear: '',
  runtime: '',
  maturity: '',
  audio: '',
  subtitles: '',
  fileUrl: '',
  fileFormat: '',
  resolution: '',
  isActive: true,
  categories: [],
}

// Keep in sync with the movie_categories ENUM in db-data3.sql.
const MOVIE_CATEGORIES = ['Popular', 'Top Rated', 'Trending']

const MOVIE_JSON_TEMPLATE = [
  {
    id: '',
    title: 'Movie Title',
    genre: 'Genre (e.g. Action, Drama, Comedy)',
    rating: 7.5,
    poster: 'https://example.com/path/to/poster.jpg',
    synopsis: 'A short summary of the movie goes here.',
    director: 'Director Full Name',
    cast: 'Actor One, Actor Two, Actor Three',
    releaseYear: 2024,
    runtime: '1h 45m',
    maturity: '13+',
    audio: 'English',
    subtitles: 'English, Amharic',
    fileUrl: 'https://example.com/path/to/video.mp4',
    fileFormat: 'mp4',
    resolution: '1080p',
    isActive: true,
    categories: ['Popular'],
  },
]

function useAdminUser() {
  return useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  }, [])
}

async function callApi(path, adminId, options = {}) {
  const requestUrl = API_BASE + '/' + path
  const extraHeaders = options.headers || {}

  const response = await fetch(requestUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Id': adminId,
      ...extraHeaders,
    },
  })

  const raw = await response.text()
  let data = {}

  if (raw) {
    try {
      data = JSON.parse(raw)
    } catch {
      // The server sent something that isn't valid JSON (a PHP warning/
      // fatal error printed into the body, an empty response, an HTML
      // 404 page, etc). Surface that clearly instead of pretending
      // nothing came back - that's what was making the lists look
      // empty with no explanation.
      const errorMessage =
        'Server returned an unreadable response (HTTP ' + response.status + ') from ' + path + '. ' +
        'Open the Network tab or the PHP error log to see the real error. Raw response: ' + raw.slice(0, 200)
      throw new Error(errorMessage)
    }
  }

  if (!response.ok || data.error) {
    throw new Error(data.error || 'Request failed (HTTP ' + response.status + ') from ' + path)
  }

  return data
}

export default function Admin() {
  const user = useAdminUser()
  const [activeTab, setActiveTab] = useState('movies')

  if (!user) {
    return (
      <AdminGate
        title="Sign in required"
        message="You need to sign in with an admin account to view this page."
      />
    )
  }

  if (user.role !== 'admin') {
    return (
      <AdminGate
        title="Admins only"
        message="Your account doesn't have access to the admin dashboard."
      />
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <Link to="/home" className="admin-logo">
          <span className="logo-icon">M</span>
          <span>RedStream Admin</span>
        </Link>

        <nav className="admin-menu">
          <button
            className={activeTab === 'movies' ? 'active' : ''}
            onClick={() => setActiveTab('movies')}
          >
            Movies
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </nav>

        <Link to="/home" className="logout-link">
          ← Back to site
        </Link>
      </header>

      <main className="admin-main">
        {activeTab === 'movies' && <MoviesPanel adminId={user.id} />}
        {activeTab === 'users' && <UsersPanel adminId={user.id} />}
        {activeTab === 'reports' && <ReportsPanel adminId={user.id} />}
      </main>
    </div>
  )
}

function AdminGate({ title, message }) {
  return (
    <div className="login-screen">
      <div className="login-box">
        <p className="small-title">Access denied</p>
        <h1>{title}</h1>
        <p>{message}</p>
        <Link className="watch-button" to="/home">
          Go to Home
        </Link>
      </div>
    </div>
  )
}

/* ============================== MOVIES ============================== */

function MoviesPanel({ adminId }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_MOVIE)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')
  const [importBusy, setImportBusy] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [syncBusy, setSyncBusy] = useState(false)
  const [syncResult, setSyncResult] = useState(null)

  const loadMovies = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await callApi('movies.php', adminId)
      setMovies(data.movies || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMovies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openEditForm = (movie) => {
    const content = movie.content || {}
    const ratingValue = movie.rating === null || movie.rating === undefined ? '' : movie.rating
    const isActiveValue = content.isActive === null || content.isActive === undefined ? true : content.isActive

    setEditingId(movie.id)
    setForm({
      id: movie.id,
      title: movie.title || '',
      genre: movie.genre || '',
      rating: ratingValue,
      poster: movie.poster || '',
      synopsis: movie.synopsis || '',
      director: movie.director || '',
      cast: movie.cast || '',
      releaseYear: movie.releaseYear || '',
      runtime: movie.runtime || '',
      maturity: movie.maturity || '',
      audio: movie.audio || '',
      subtitles: movie.subtitles || '',
      fileUrl: content.fileUrl || '',
      fileFormat: content.fileFormat || '',
      resolution: content.resolution || '',
      isActive: isActiveValue,
      categories: movie.categories || [],
    })
    setFormError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleCategory = (category) => {
    setForm((current) => {
      const has = current.categories.includes(category)
      return {
        ...current,
        categories: has
          ? current.categories.filter((c) => c !== category)
          : [...current.categories, category],
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setFormError('Title is required.')
      return
    }

    setSaving(true)
    setFormError('')

    try {
      if (editingId) {
        await callApi('movies.php', adminId, {
          method: 'PUT',
          body: JSON.stringify({ ...form, id: editingId }),
        })
      } else {
        await callApi('movies.php', adminId, {
          method: 'POST',
          body: JSON.stringify(form),
        })
      }
      await loadMovies()
      invalidateHomeMoviesCache()
      closeForm()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (movie) => {
    const confirmMessage = 'Delete "' + movie.title + '"? This can\'t be undone.'
    if (!confirm(confirmMessage)) {
      return
    }
    try {
      await callApi('movies.php?id=' + encodeURIComponent(movie.id), adminId, { method: 'DELETE' })
      setMovies((current) => current.filter((m) => m.id !== movie.id))
      invalidateHomeMoviesCache()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSyncNow = async () => {
    setSyncBusy(true)
    setSyncResult(null)
    try {
      const data = await callApi('sync-tmdb.php', adminId, { method: 'POST' })

      const movieWord = data.moviesUpserted === 1 ? 'movie' : 'movies'
      const linkWord = data.categoryLinksAdded === 1 ? 'link' : 'links'
      let syncText =
        'Synced ' + data.moviesUpserted + ' ' + movieWord +
        ' (' + data.categoryLinksAdded + ' new category ' + linkWord + ').'

      if (data.errors && data.errors.length > 0) {
        syncText = syncText + ' ' + data.errors.length + ' warning(s) - check backend/logs/sync.log.'
      }

      setSyncResult({ ok: true, text: syncText })
      await loadMovies()
      invalidateHomeMoviesCache()
    } catch (err) {
      setSyncResult({ ok: false, text: err.message })
    } finally {
      setSyncBusy(false)
    }
  }

  const openImport = () => {
    setImportText(JSON.stringify(MOVIE_JSON_TEMPLATE, null, 2))
    setImportResult(null)
    setShowImport(true)
  }

  const closeImport = () => {
    setShowImport(false)
    setImportResult(null)
  }

  const handleImportSubmit = async (event) => {
    event.preventDefault()

    let parsed
    try {
      parsed = JSON.parse(importText)
    } catch (err) {
      setImportResult({ successCount: 0, errors: ['Invalid JSON: ' + err.message] })
      return
    }

    const list = Array.isArray(parsed) ? parsed : [parsed]
    if (list.length === 0) {
      setImportResult({ successCount: 0, errors: ['The JSON has no movies to import.'] })
      return
    }

    setImportBusy(true)
    let successCount = 0
    const errors = []

    for (const movie of list) {
      const movieTitle = movie && movie.title
      const movieId = movie && movie.id
      const label = movieTitle || movieId || 'Untitled entry'
      try {
        if (!movieTitle || !String(movieTitle).trim()) {
          throw new Error('missing "title"')
        }
        await callApi('movies.php', adminId, {
          method: 'POST',
          body: JSON.stringify(movie),
        })
        successCount++
      } catch (err) {
        errors.push(label + ': ' + err.message)
      }
    }

    setImportResult({ successCount, errors })
    setImportBusy(false)
    if (successCount > 0) {
      await loadMovies()
      invalidateHomeMoviesCache()
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h1>Movies</h1>
          <p>
            Edit or remove existing titles, add new ones by importing JSON, or pull fresh
            titles in from TMDB. A scheduled task also runs this sync periodically in the
            background (see backend/scripts/sync_tmdb.php).
          </p>
        </div>
        <div className="row-buttons">
          <button className="favorites-button" onClick={handleSyncNow} disabled={syncBusy}>
            {syncBusy ? 'Syncing…' : 'Sync TMDB Now'}
          </button>
          <button className="watch-button" onClick={openImport}>
            + Add Movies (Import JSON)
          </button>
        </div>
      </div>

      {syncResult ? (
        <p className={syncResult.ok ? 'loading-text' : 'error-text'}>{syncResult.text}</p>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}

      {loading ? (
        <p className="loading-text">Loading movies…</p>
      ) : movies.length === 0 ? (
        <div className="empty-message">No movies yet. Add your first title.</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Rating</th>
                <th>Source</th>
                <th>Categories</th>
                <th>Video</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => {
                const sourceLabel = movie.source === 'tmdb' ? 'TMDB' : 'Admin'
                const sourceBadgeClass = movie.source === 'tmdb' ? 'status-badge status-gray' : 'status-badge status-green'
                const hasCategories = movie.categories && movie.categories.length > 0
                const hasVideoFile = movie.content && movie.content.fileUrl

                return (
                  <tr key={movie.id}>
                    <td>
                      <div className="poster-thumbnail">
                        {movie.poster ? <img src={movie.poster} alt="" /> : <span>—</span>}
                      </div>
                    </td>
                    <td>
                      <div className="title-cell">{movie.title}</div>
                      <div className="subtle-text">{movie.id}</div>
                    </td>
                    <td>{movie.genre || '—'}</td>
                    <td>{movie.releaseYear || '—'}</td>
                    <td>{movie.rating ? Number(movie.rating).toFixed(1) : '—'}</td>
                    <td>
                      <span className={sourceBadgeClass}>{sourceLabel}</span>
                    </td>
                    <td>
                      {hasCategories ? (
                        <span className="subtle-text">{movie.categories.join(', ')}</span>
                      ) : (
                        <span className="status-badge status-red">Not on Home</span>
                      )}
                    </td>
                    <td>
                      {hasVideoFile ? (
                        <span className="status-badge status-green">Linked</span>
                      ) : (
                        <span className="status-badge status-gray">None</span>
                      )}
                    </td>
                    <td>
                      <div className="row-buttons">
                        <button className="favorites-button" onClick={() => openEditForm(movie)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDelete(movie)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm ? (
        <div className="modal-background" onClick={closeForm}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <h2>Edit Movie</h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Title *
                  <input name="title" value={form.title} onChange={handleChange} required />
                </label>
                <label>
                  Slug / ID (locked)
                  <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    disabled={!!editingId}
                    placeholder="e.g. lost-city"
                  />
                </label>
                <label>
                  Genre
                  <input name="genre" value={form.genre} onChange={handleChange} />
                </label>
                <label>
                  Rating (0-10)
                  <input
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={form.rating}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Release Year
                  <input
                    name="releaseYear"
                    type="number"
                    value={form.releaseYear}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Runtime
                  <input name="runtime" placeholder="1h 52m" value={form.runtime} onChange={handleChange} />
                </label>
                <label>
                  Maturity
                  <input name="maturity" placeholder="13+" value={form.maturity} onChange={handleChange} />
                </label>
                <label>
                  Poster URL
                  <input name="poster" value={form.poster} onChange={handleChange} />
                </label>
                <label className="span-two">
                  Director(s)
                  <input name="director" value={form.director} onChange={handleChange} />
                </label>
                <label className="span-two">
                  Cast
                  <input name="cast" value={form.cast} onChange={handleChange} />
                </label>
                <label>
                  Audio
                  <input name="audio" value={form.audio} onChange={handleChange} />
                </label>
                <label>
                  Subtitles
                  <input name="subtitles" value={form.subtitles} onChange={handleChange} />
                </label>
                <label className="span-two">
                  Synopsis
                  <textarea name="synopsis" value={form.synopsis} onChange={handleChange} rows={3} />
                </label>
              </div>

              <hr className="divider-line" />
              <p className="section-subheading">
                Home page categories
                <span className="subtle-text"> — a movie only shows up on Home if it's in at least one of these.</span>
              </p>
              <div className="category-group">
                {MOVIE_CATEGORIES.map((category) => (
                  <label key={category} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.categories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    {category}
                  </label>
                ))}
              </div>

              <hr className="divider-line" />
              <p className="section-subheading">Video file (optional)</p>
              <div className="form-grid">
                <label className="span-two">
                  File URL
                  <input name="fileUrl" value={form.fileUrl} onChange={handleChange} placeholder="https://... or /media/..." />
                </label>
                <label>
                  Format
                  <input name="fileFormat" placeholder="mp4" value={form.fileFormat} onChange={handleChange} />
                </label>
                <label>
                  Resolution
                  <input name="resolution" placeholder="1080p" value={form.resolution} onChange={handleChange} />
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                  Active / playable
                </label>
              </div>

              {formError ? <p className="error-text">{formError}</p> : null}

              <div className="form-buttons">
                <button className="favorites-button" type="button" onClick={closeForm}>
                  Cancel
                </button>
                <button className="watch-button" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showImport ? (
        <div className="modal-background" onClick={closeImport}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <h2>Import Movies from JSON</h2>
            <p className="subtle-text">
              Edit the placeholder JSON below with your movie details (or paste your own array of
              movies), then hit Import.
            </p>

            <form className="modal-form" onSubmit={handleImportSubmit}>
              <label>
                Movie JSON
                <textarea
                  className="json-textarea"
                  rows={14}
                  spellCheck={false}
                  placeholder='[
  {
    "title": "Movie Title",
    "genre": "Genre (e.g. Action, Drama, Comedy)",
    "rating": 7.5,
    "poster": "https://example.com/path/to/poster.jpg",
    "synopsis": "A short summary of the movie goes here.",
    "director": "Director Full Name",
    "cast": "Actor One, Actor Two, Actor Three",
    "releaseYear": 2024,
    "runtime": "1h 45m",
    "maturity": "13+",
    "audio": "English",
    "subtitles": "English, Amharic",
    "fileUrl": "https://example.com/path/to/video.mp4",
    "fileFormat": "mp4",
    "resolution": "1080p",
    "isActive": true
  }
]'
                  value={importText}
                  onChange={(event) => setImportText(event.target.value)}
                />
              </label>

              {importResult ? (
                <div className={importResult.errors.length > 0 ? 'import-result has-errors' : 'import-result'}>
                  <p>
                    Imported <strong>{importResult.successCount}</strong> movie
                    {importResult.successCount === 1 ? '' : 's'}
                    {importResult.errors.length > 0 ? ', ' + importResult.errors.length + ' failed:' : '.'}
                  </p>
                  {importResult.errors.length > 0 ? (
                    <ul>
                      {importResult.errors.map((message, index) => (
                        <li key={index}>{message}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              <div className="form-buttons">
                <button className="favorites-button" type="button" onClick={closeImport}>
                  Close
                </button>
                <button className="watch-button" type="submit" disabled={importBusy || !importText.trim()}>
                  {importBusy ? 'Importing…' : 'Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  )
}

/* ============================== USERS ============================== */

function repurchaseBadge(user) {
  if (user.repurchaseState === 'expired') {
    return <span className="status-badge status-red">Expired · renew now</span>
  }
  if (user.daysRemaining <= 5) {
    return <span className="status-badge status-yellow">{user.daysRemaining}d left · renew soon</span>
  }
  return <span className="status-badge status-green">{user.daysRemaining} days left</span>
}

function UsersPanel({ adminId }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await callApi('users.php', adminId)
      setUsers(data.users || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renewSubscription = async (user) => {
    setBusyId(user.id)
    try {
      await callApi('users.php', adminId, {
        method: 'PATCH',
        body: JSON.stringify({ id: user.id, action: 'renew' }),
      })
      await loadUsers()
    } catch (err) {
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const toggleRole = async (user) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin'
    const roleWord = nextRole === 'admin' ? 'an admin' : 'a regular user'
    const confirmMessage = 'Make ' + user.fullName + ' ' + roleWord + '?'
    if (!confirm(confirmMessage)) {
      return
    }

    setBusyId(user.id)
    try {
      await callApi('users.php', adminId, {
        method: 'PATCH',
        body: JSON.stringify({ id: user.id, role: nextRole }),
      })
      setUsers((current) =>
        current.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
      )
    } catch (err) {
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h1>Users</h1>
          <p>Everyone with a RedStream account, and when they'll need to renew.</p>
        </div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      {loading ? (
        <p className="loading-text">Loading users…</p>
      ) : users.length === 0 ? (
        <div className="empty-message">No users yet.</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Subscribed since</th>
                <th>Time before repurchase</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleBadgeClass = user.role === 'admin' ? 'status-badge status-green' : 'status-badge status-gray'
                const roleButtonLabel = user.role === 'admin' ? 'Revoke admin' : 'Make admin'
                const subscriptionDate = user.subscriptionStart
                  ? new Date(user.subscriptionStart).toLocaleDateString()
                  : '—'

                return (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td className="subtle-text">{user.email}</td>
                    <td className="subtle-text">{user.phone}</td>
                    <td>
                      <span className={roleBadgeClass}>{user.role}</span>
                    </td>
                    <td className="subtle-text">{subscriptionDate}</td>
                    <td>{repurchaseBadge(user)}</td>
                    <td>
                      <div className="row-buttons">
                        <button
                          className="favorites-button"
                          disabled={busyId === user.id}
                          onClick={() => renewSubscription(user)}
                        >
                          Renew
                        </button>
                        <button
                          className="favorites-button"
                          disabled={busyId === user.id}
                          onClick={() => toggleRole(user)}
                        >
                          {roleButtonLabel}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* ============================== REPORTS ============================== */

function ReportsPanel({ adminId }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const loadReports = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await callApi('reports.php', adminId)
      setReports(data.reports || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selected = reports.find((r) => r.id === selectedId) || null

  const openReport = (report) => {
    setSelectedId(report.id)
  }

  const setReadStatus = async (report, isRead) => {
    try {
      await callApi('reports.php', adminId, {
        method: 'PATCH',
        body: JSON.stringify({ id: report.id, isRead }),
      })
      setReports((current) => current.map((r) => (r.id === report.id ? { ...r, isRead } : r)))
    } catch (err) {
      alert(err.message)
    }
  }

  const deleteReport = async (report) => {
    if (!confirm('Delete this message?')) return
    try {
      await callApi('reports.php?id=' + report.id, adminId, { method: 'DELETE' })
      setReports((current) => current.filter((r) => r.id !== report.id))
      if (selectedId === report.id) setSelectedId(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const unreadCount = reports.filter((r) => !r.isRead).length

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h1>Reports</h1>
          <p>
            Messages submitted through the Contact page.{' '}
            {unreadCount > 0 ? unreadCount + ' unread.' : 'All caught up.'}
          </p>
        </div>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      {loading ? (
        <p className="loading-text">Loading reports…</p>
      ) : reports.length === 0 ? (
        <div className="empty-message">No messages yet.</div>
      ) : (
        <div className="messages-layout">
          <ul className="message-list">
            {reports.map((report) => {
              let itemClass = 'message-item'
              if (selectedId === report.id) {
                itemClass = itemClass + ' active'
              }
              if (!report.isRead) {
                itemClass = itemClass + ' unread'
              }

              return (
                <li key={report.id} className={itemClass} onClick={() => openReport(report)}>
                  <div className="message-row">
                    <span className="message-subject">{report.subject}</span>
                    <span className="message-time">
                      {new Date(report.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="message-preview">{report.message}</p>
                </li>
              )
            })}
          </ul>

          <div className="message-detail">
            {selected ? (
              <>
                <div className="message-detail-header">
                  <div>
                    <h2>{selected.subject}</h2>
                    <p className="subtle-text">
                      {selected.fullName ? selected.fullName + ' · ' : ''}
                      {selected.email || 'No linked account'} ·{' '}
                      {new Date(selected.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="message-detail-buttons">
                    {selected.isRead ? (
                      <button
                        className="favorites-button"
                        onClick={() => setReadStatus(selected, false)}
                      >
                        Mark as unread
                      </button>
                    ) : (
                      <button
                        className="favorites-button"
                        onClick={() => setReadStatus(selected, true)}
                      >
                        Mark as read
                      </button>
                    )}
                    <button className="delete-button" onClick={() => deleteReport(selected)}>
                      Delete
                    </button>
                  </div>
                </div>
                <p className={selected.isRead ? 'message-body' : 'message-body blurred'}>
                  {selected.message}
                </p>
              </>
            ) : (
              <div className="empty-message">Select a message to read it.</div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
