import { useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { useHomeMovies } from '../hooks/useHomeMovies'
import { useFavoriteIds } from '../hooks/useFavoriteIds'
import { toggleFavorite } from '../data/favorites'
import playerVideo from '../data/type-vid.mp4'
import './Player.css'
import Footerbar from '../components/Footerbar'

function findMovieById(movieRows, id) {
  for (let i = 0; i < movieRows.length; i++) {
    const row = movieRows[i]
    for (let j = 0; j < row.movies.length; j++) {
      if (String(row.movies[j].id) === String(id)) {
        return row.movies[j]
      }
    }
  }
  return null
}

function Player() {
  const { id } = useParams()
  const location = useLocation()
  const savedUser = localStorage.getItem('user')
  const user = savedUser ? JSON.parse(savedUser) : null
  const userId = user ? user.id : null
  const { favoriteIds, setFavoriteIds } = useFavoriteIds(userId)
  const isFav = favoriteIds.includes(id)
  const [favBusy, setFavBusy] = useState(false)
  const categorizedMovies = useHomeMovies()

  // location.state.movie is passed in when we navigate here from a movie
  // card, so we can show the movie right away without waiting on a fetch.
  // Otherwise (e.g. a direct link or page refresh) we look it up by id.
  const movieFromNavigation = location.state ? location.state.movie : null
  const movie = movieFromNavigation || findMovieById(categorizedMovies, id)

  if (!movie) {
    // categorizedMovies starts empty while useHomeMovies is still fetching,
    // so an empty list doesn't necessarily mean the movie doesn't exist.
    const message = categorizedMovies.length > 0 ? 'Movie not found' : 'Loading movie…'
    return <p>{message}</p>
  }

  // Prefer the real file attached in the Admin panel / movie_content table.
  // Falls back to the local placeholder clip for movies that don't have a
  // file linked yet (e.g. freshly TMDB-synced titles you haven't filled in).
  const movieContent = movie.content || {}
  const videoSrc = movieContent.fileUrl || playerVideo

  const handleFavoriteClick = async () => {
    if (!user) {
      alert('Please log in to save favorites.')
      return
    }

    setFavBusy(true)
    const nowFavorite = await toggleFavorite(user.id, movie.id, isFav)
    setFavoriteIds((current) =>
      nowFavorite ? [...current, movie.id] : current.filter((movieId) => movieId !== movie.id)
    )
    setFavBusy(false)
  }

  const playerLabel = movie.title + ' player placeholder'
  const posterCardLabel = movie.title + ' poster and facts'
  const posterAlt = movie.title + ' poster'
  const favoriteButtonLabel = isFav ? 'Remove from Favorites' : 'Add to Favorites'

  return (
    <main className="player-page">
      <Navbar activePage="player" />

      <section className="player-header">
        <div className="player-grid">
          <div className="video-column">
            <div className="video-frame" aria-label={playerLabel}>
              <video
                className="video-element"
                src={videoSrc}
                poster={movie.poster}
                muted
                controls
                playsInline
              />
            </div>
          </div>

          <section className="details-panel" aria-labelledby="movie-details-title">
            <aside className="poster-card" aria-label={posterCardLabel}>
              <img src={movie.poster} alt={posterAlt} />
            </aside>

            <div className="details-copy">
              <p className="small-title">Movie Details</p>
              <h2 id="movie-details-title">{movie.title}</h2>
              <p className="synopsis-text">{movie.synopsis}</p>

              <div className="facts-grid">
                <div>
                  <span>Director</span>
                  <strong>{movie.director}</strong>
                </div>
                <div>
                  <span>Cast</span>
                  <strong>{movie.cast}</strong>
                </div>
                <div>
                  <span>Audio</span>
                  <strong>{movie.audio}</strong>
                </div>
                <div>
                  <span>Subtitles</span>
                  <strong>{movie.subtitles}</strong>
                </div>
                <div>
                  <span>Maturity</span>
                  <strong>{movie.maturity}</strong>
                </div>
                <div>
                  <span>Release year</span>
                  <strong>{movie.releaseYear}</strong>
                </div>
                <div>
                  <span>Run time</span>
                  <strong>{movie.runtime}</strong>
                </div>
                <div>
                  <span>Genre</span>
                  <strong>{movie.genre}</strong>
                </div>
              </div>

              <div className="action-button-row">
                <button
                  className="favorites-button"
                  type="button"
                  onClick={handleFavoriteClick}
                  aria-pressed={isFav}
                  disabled={favBusy}
                >
                  {favoriteButtonLabel}
                </button>
                <Link className="favorites-button secondary-link" to="/home">
                  Back to Home
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
      <Footerbar />
    </main>
  )
}

export default Player
