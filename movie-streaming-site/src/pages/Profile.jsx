import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { getCurrentUser, plans, updateUser } from '../data/mockUsers'
import { getFavoritesCount } from '../data/favorites'
import './Profile.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  const [user, setUser] = useState(() => getCurrentUser())
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', age: '' })
  const [editError, setEditError] = useState('')

  const plan = user ? plans.find((entry) => entry.id === user.plan) : null
  const favoritesCount = user ? getFavoritesCount(user.id) : 0

  const startEditing = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      age: String(user.age),
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

  const handleSave = (event) => {
    event.preventDefault()
    setEditError('')

    if (!emailPattern.test(editForm.email.trim().toLowerCase())) {
      setEditError('Enter a valid email address.')
      return
    }

    const result = updateUser(user.id, editForm)

    if (result.error) {
      setEditError(result.error)
      return
    }

    setUser(result.user)
    setIsEditing(false)
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
              {!isEditing ? (
                <button className="profile-edit-button" type="button" onClick={startEditing}>
                  Edit Profile
                </button>
              ) : null}
            </div>

            <div className="profile-header">
              <div className="profile-avatar" aria-hidden="true">
                {getInitials(isEditing ? editForm.name : user.name)}
              </div>
              <div className="profile-identity">
                {isEditing ? (
                  <h1>Edit your details</h1>
                ) : (
                  <>
                    <h1>{user.name}</h1>
                    {plan ? <span className="profile-plan-badge">{plan.name}</span> : null}
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
                  Age
                  <input
                    name="age"
                    type="number"
                    min="13"
                    value={editForm.age}
                    onChange={handleEditChange}
                  />
                </label>
                {editError ? <p className="profile-edit-error">{editError}</p> : null}
                <div className="profile-edit-actions">
                  <button className="primary-button" type="submit">
                    Save Changes
                  </button>
                  <button className="ghost-button" type="button" onClick={cancelEditing}>
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
                    <span className="profile-detail-label">Age</span>
                    <span className="profile-detail-value">{user.age}</span>
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
                    ✓
                  </span>
                  <div>
                    <h2>Payment up to date</h2>
                    <p>Your Telebirr subscription is active and paid through the next billing cycle.</p>
                  </div>
                </article>

                {plan ? (
                  <article className="profile-plan-card">
                    <p className="profile-plan-kicker">Membership</p>
                    <h2>{plan.name} Plan</h2>
                    <p className="profile-plan-price">{plan.price}</p>
                    <ul className="profile-plan-features">
                      <li>{plan.quality}</li>
                      <li>{plan.devices}</li>
                    </ul>
                  </article>
                ) : null}
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}

export default Profile
