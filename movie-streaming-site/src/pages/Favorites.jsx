import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Footerbar from '../components/Footerbar'
import { Navbar } from '../components/Navbar'
import { MovieRow } from '../components/MovieRow'
import { useHomeMovies } from '../hooks/useHomeMovies'
import { useFavoriteIds } from '../hooks/useFavoriteIds'

function Favorites() {
  const user = JSON.parse(localStorage.getItem("user"));
  const categorizedMovies = useHomeMovies()
  const { favoriteIds, loaded } = useFavoriteIds(user?.id)

  // A movie can appear in more than one homepage row (e.g. a title can be
  // both "Popular" and "Trending" at the same time). Flattening all rows
  // together would otherwise produce duplicate entries for that movie -
  // one from its first row, one from its last - so we dedupe by id.
  const favoriteMovies = useMemo(() => {
    const seen = new Set()
    const unique = []

    for (const movie of categorizedMovies.flatMap((row) => row.movies)) {
      if (favoriteIds.includes(movie.id) && !seen.has(movie.id)) {
        seen.add(movie.id)
        unique.push(movie)
      }
    }

    return unique
  }, [favoriteIds, categorizedMovies])

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

  if (!loaded) {
    return (
      <>
        <Navbar activePage="favorites" />
        <section className="page-panel">
          <p className="eyebrow">Your list</p>
          <h1>Favorites</h1>
          <p>Loading your list…</p>
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
