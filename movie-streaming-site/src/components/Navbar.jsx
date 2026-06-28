import { Link } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { getCurrentUser } from '../data/mockUsers'
import './Navbar.css'

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function Navbar({ activePage }) {
  const user = getCurrentUser()
  const initials = user ? getInitials(user.name) : '?'

  return (
    <header className="navbar">
      <Link to='/' className='brand'>
        <span className="brand-mark">M</span>
        <span>RedStream</span>
      </Link>

      {/* <SearchBar value={searchQuery} onChange={onSearchChange} /> */}

      <SearchBar />

      <div className="nav-actions">
        <nav className='nav-links'>
          <Link className={activePage === 'home' ? 'active' : ''} to='/'>Home</Link>
          <Link className={activePage === 'favorites' ? 'active' : ''} to='/favorites'>Favorites</Link>
          <Link className={activePage === 'contact' ? 'active' : ''} to='/contact'>Contact</Link>
        </nav>

        <Link
          to="/profile"
          className={`profile-circle${activePage === 'profile' ? ' active' : ''}`}
          aria-label="View profile"
        >
          {initials}
        </Link>
      </div>

    </header>
  )
}
