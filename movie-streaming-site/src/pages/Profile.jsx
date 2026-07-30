import { useState } from 'react'
import { Link, Routes } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { useFavoriteIds } from '../hooks/useFavoriteIds'
import './Profile.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const API_BASE = 'http://192.168.1.8/backend/api'

function getInitials(fullName) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .map((namePart) => namePart[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Profile() {
  // Kept in React state (not just read once from localStorage) so a
  // successful save re-renders the page immediately with the new details.
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user')))
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' })
  const [formError, setFormError] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const { favoriteIds } = useFavoriteIds(currentUser?.id)
  const favoritesCount = favoriteIds.length

  const startEditingProfile = () => {
    setProfileForm({
      name: currentUser.full_name,
      email: currentUser.email,
      phone: currentUser.phone,
    })
    setFormError('')
    setIsEditingProfile(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setCurrentUser(null)
  }

  const cancelEditingProfile = () => {
    setIsEditingProfile(false)
    setFormError('')
  }

  const handleFormFieldChange = (event) => {
    const { name: fieldName, value: fieldValue } = event.target
    setProfileForm((previousForm) => ({ ...previousForm, [fieldName]: fieldValue }))
  }

  const handleSaveProfile = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!profileForm.name.trim()) {
      setFormError('Name is required.')
      return
    }

    if (!emailPattern.test(profileForm.email.trim().toLowerCase())) {
      setFormError('Enter a valid email address.')
      return
    }

    if (!profileForm.phone.trim()) {
      setFormError('Phone number is required.')
      return
    }

    setIsSavingProfile(true)

    try {
      const response = await fetch(`${API_BASE}/profile.php`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentUser.id,
          full_name: profileForm.name.trim(),
          email: profileForm.email.trim().toLowerCase(),
          phone: profileForm.phone.trim(),
        }),
      })

      const responseData = await response.json()

      if (!response.ok || responseData.error) {
        setFormError(responseData.error || 'Something went wrong. Please try again.')
        return
      }

      localStorage.setItem('user', JSON.stringify(responseData.user))
      setCurrentUser(responseData.user)
      setIsEditingProfile(false)
    } catch {
      setFormError('Could not reach the server. Please try again.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  return (
    <>
      <Navbar activePage="profile" />
      <section className="profile-page page-panel">
        {!currentUser ? (
          <>
            <p className="eyebrow">Account</p>
            <h1>Sign in to view your profile</h1>
            <p>Your account details will appear here once you sign in to RedStream.</p>
            <Link className="watch-button" to="/">
              Sign In
            </Link>
          </>
        ) : (
          <>
            <div className="profile-top-row">
              <p className="eyebrow">Your account</p>
              <div className="profile-top-actions">
                {currentUser.role === 'admin' ? (
                  <Link className="profile-admin-button" to="/admin">
                    Admin Dashboard
                  </Link>
                ) : null}
                {!isEditingProfile ? (
                  <>
                    <button className="profile-edit-button" type="button" onClick={startEditingProfile}>
                      Edit Profile
                    </button>
                    <Link className="profile-edit-button" to="/" onClick={handleLogout}>
                      Log Out
                    </Link>
                  </>
                ) : null}
              </div>
            </div>

            <div className="profile-header">
              <div className="profile-avatar" aria-hidden="true">
                {getInitials(isEditingProfile ? profileForm.name : currentUser.full_name)}
              </div>
              <div className="profile-identity">
                {isEditingProfile ? (
                  <h1>Edit your details</h1>
                ) : (
                  <>
                    <h1>{currentUser.full_name}</h1>
                    <span className="profile-plan-badge">
                      {currentUser.subscription_active ? 'Subscription Active' : 'Subscription Expired'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {isEditingProfile ? (
              <form className="profile-edit-form" onSubmit={handleSaveProfile}>
                <label>
                  Name
                  <input name="name" type="text" value={profileForm.name} onChange={handleFormFieldChange} />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={profileForm.email} onChange={handleFormFieldChange} />
                </label>
                <label>
                  Phone
                  <input name="phone" type="tel" value={profileForm.phone} onChange={handleFormFieldChange} />
                </label>
                {formError ? <p className="profile-edit-error">{formError}</p> : null}
                <div className="profile-edit-actions">
                  <button className="watch-button" type="submit" disabled={isSavingProfile}>
                    {isSavingProfile ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={cancelEditingProfile}
                    disabled={isSavingProfile}
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
                    <span className="profile-detail-value">{currentUser.email}</span>
                  </div>
                  <div className="profile-detail-row">
                    <span className="profile-detail-label">phone</span>
                    <span className="profile-detail-value">{currentUser.phone}</span>
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
                    {currentUser.subscription_active ? '✓' : '!'}
                  </span>
                  <div>
                    <h2>{currentUser.subscription_active ? 'Payment up to date' : 'Subscription expired'}</h2>
                    <p>
                      {currentUser.subscription_active
                        ? `Your subscription is active, with ${currentUser.days_remaining} day${
                            currentUser.days_remaining === 1 ? '' : 's'
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
