import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { useFavoriteIds } from '../hooks/useFavoriteIds'
import './Profile.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const API_BASE = 'http://localhost/backend/api'

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Profile() {
  // Kept in React state (not just read once from localStorage) so a
  // successful save re-renders the page immediately with the new details.
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')))
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' })
  const [editError, setEditError] = useState('')
  const [saving, setSaving] = useState(false)

  const { favoriteIds } = useFavoriteIds(user?.id)
  const favoritesCount = favoriteIds.length

  const startEditing = () => {
    setEditForm({
      name: user.full_name,
      email: user.email,
      phone: user.phone,
    })
    setEditError('')
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditError('')
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target
    setEditForm((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setEditError('')

    if (!editForm.name.trim()) {
      setEditError('Name is required.')
      return
    }

    if (!emailPattern.test(editForm.email.trim().toLowerCase())) {
      setEditError('Enter a valid email address.')
      return
    }

    if (!editForm.phone.trim()) {
      setEditError('Phone number is required.')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`${API_BASE}/profile.php`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          full_name: editForm.name.trim(),
          email: editForm.email.trim().toLowerCase(),
          phone: editForm.phone.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setEditError(data.error || 'Something went wrong. Please try again.')
        return
      }

      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      setIsEditing(false)
    } catch {
      setEditError('Could not reach the server. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Navbar activePage="profile" />
      <section className="profile-page page-panel">
        {!user ? (
          <>
            <p className="eyebrow">Account</p>
            <h1>Sign in to view your profile</h1>
            <p>Your account details will appear here once you sign in to RedStream.</p>
            <Link className="primary-button" to="/">
              Sign In
            </Link>
          </>
        ) : (
          <>
            <div className="profile-top-row">
              <p className="eyebrow">Your account</p>
              <div className="profile-top-actions">
                {user.role === 'admin' ? (
                  <Link className="profile-admin-button" to="/admin">
                    Admin Dashboard
                  </Link>
                ) : null}
                {!isEditing ? (
                  <button className="profile-edit-button" type="button" onClick={startEditing}>
                    Edit Profile
                  </button>
                ) : null}
              </div>
            </div>

            <div className="profile-header">
              <div className="profile-avatar" aria-hidden="true">
                {getInitials(isEditing ? editForm.name : user.full_name)}
              </div>
              <div className="profile-identity">
                {isEditing ? (
                  <h1>Edit your details</h1>
                ) : (
                  <>
                    <h1>{user.full_name}</h1>
                    <span className="profile-plan-badge">
                      {user.subscription_active ? 'Subscription Active' : 'Subscription Expired'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <form className="profile-edit-form" onSubmit={handleSave}>
                <label>
                  Name
                  <input name="name" type="text" value={editForm.name} onChange={handleEditChange} />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={editForm.email} onChange={handleEditChange} />
                </label>
                <label>
                  Phone
                  <input name="phone" type="tel" value={editForm.phone} onChange={handleEditChange} />
                </label>
                {editError ? <p className="profile-edit-error">{editError}</p> : null}
                <div className="profile-edit-actions">
                  <button className="primary-button" type="submit" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-content-grid">
                <div className="profile-details">
                  <div className="profile-detail-row">
                    <span className="profile-detail-label">Email</span>
                    <span className="profile-detail-value">{user.email}</span>
                  </div>
                  <div className="profile-detail-row">
                    <span className="profile-detail-label">phone</span>
                    <span className="profile-detail-value">{user.phone}</span>
                  </div>
                </div>

                <Link to="/favorites" className="profile-favorites-card">
                  <span className="profile-favorites-count">{favoritesCount}</span>
                  <div className="profile-favorites-copy">
                    <h2>Favorite Movies</h2>
                    <p>
                      {favoritesCount === 1
                        ? '1 saved movie — tap to view your list'
                        : `${favoritesCount} saved movies — tap to view your list`}
                    </p>
                  </div>
                  <span className="profile-favorites-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>

                <article className="profile-payment-status">
                  <span className="profile-payment-icon" aria-hidden="true">
                    {user.subscription_active ? '✓' : '!'}
                  </span>
                  <div>
                    <h2>{user.subscription_active ? 'Payment up to date' : 'Subscription expired'}</h2>
                    <p>
                      {user.subscription_active
                        ? `Your subscription is active, with ${user.days_remaining} day${
                            user.days_remaining === 1 ? '' : 's'
                          } remaining in this billing cycle.`
                        : 'Your subscription has expired. Renew to keep watching.'}
                    </p>
                  </div>
                </article>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}

export default Profile
