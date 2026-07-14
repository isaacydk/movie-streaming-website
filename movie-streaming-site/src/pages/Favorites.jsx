import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footerbar from '../components/Footerbar'
import { Navbar } from '../components/Navbar'
import { MovieRow } from '../components/MovieRow'
import { getCurrentUser } from '../data/mockUsers'
import { getFavoriteIds } from '../data/favorites'
import { detailMovieRows } from '../data/DetailMovieRows'

const CACHE_KEY = 'home-movies-cache'

// Same movie source Player.jsx uses: prefer the cached API movies, and
// fall back to the local mock data if nothing has been cached yet.
function getAllMovies() {
  let rows = null

  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      rows = JSON.parse(cached)?.data
    } catch {
      rows = null
    }
  }

  if (!rows || !rows.length) {
    rows = detailMovieRows
  }

  return rows.flatMap((row) => row.movies)
}

function Favorites() {
  const [user] = useState(() => getCurrentUser())
  const [favoriteMovies] = useState(() => {
    if (!user) return []

    const favoriteIds = getFavoriteIds(user.id)
    return getAllMovies().filter((movie) => favoriteIds.includes(movie.id))
  })

  if (!user) {
    return (
      <>
        <Navbar activePage="favorites" />
        <section className="page-panel">
          <p className="eyebrow">Your list</p>
          <h1>Favorites</h1>
          <p>Log in to save movies and build your personal watchlist.</p>
          <Link to="/" className="primary-button">
            Log In
          </Link>
        </section>
        <Footerbar />
      </>
    )
  }

  if (favoriteMovies.length === 0) {
    return (
      <>
        <Navbar activePage="favorites" />
        <section className="page-panel">
          <p className="eyebrow">Your list</p>
          <h1>Favorites</h1>
          <p>
            Saved movies will appear here. Open any title and tap
            &ldquo;Add to Favorites&rdquo; to add it to your list.
          </p>
          <Link to="/home" className="primary-button">
            Browse Movies
          </Link>
        </section>
        <Footerbar />
      </>
    )
  }

  return (
    <>
      <Navbar activePage="favorites" />
      <section className="page-panel" style={{ minHeight: 'auto', paddingBottom: 0 }}>
        <p className="eyebrow">Your list</p>
        <h1>Favorites</h1>
        <p>
          {favoriteMovies.length} title{favoriteMovies.length === 1 ? '' : 's'} saved to your
          watchlist.
        </p>
      </section>

      <div className="content-section">
        <MovieRow title="My List" movies={favoriteMovies} />
      </div>

      <Footerbar />
    </>
  )
}

export default Favorites
