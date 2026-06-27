import { Link } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import './Navbar.css'


export function Navbar({ activePage }) {
  return (
    <header className="navbar">
      <Link to='/' className='brand'>
        <span className="brand-mark">M</span>
        <span>RedStream</span>
      </Link>

      {/* <SearchBar value={searchQuery} onChange={onSearchChange} /> */}

      <SearchBar />

      <nav className='nav-links'>
        <Link className={activePage === 'home' ? 'active' : ''} to='/home'>Home</Link>
        <Link className={activePage === 'favorites' ? 'active' : ''} to='/favorites'>Favorites</Link>
        <Link className={activePage === 'contact' ? 'active' : ''} to='/contact'>Contact</Link>
      </nav>

    </header>
  )
}
