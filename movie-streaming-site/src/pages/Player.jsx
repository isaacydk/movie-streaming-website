import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { useHomeMovies } from '../hooks/useHomeMovies'
import { isFavorite, toggleFavorite } from '../data/favorites'
import playerVideo from '../data/type-vid.mp4'
import './Player.css'
import Footerbar from '../components/Footerbar'


// const featuredMovies = detailMovieRows.flatMap((row) => row.movies).filter((movie) => movie.id === 'morbius')

// const featuredMovie = featuredMovies[0]

// const highlights = [
//   { label: 'Genre', value: featuredMovie.genre },
//   { label: 'Rating', value: featuredMovie.rating },
//   { label: 'Release', value: featuredMovie.releaseYear },
//   { label: 'Runtime', value: featuredMovie.runtime },
// ]

function Player() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isFav, setIsFav] = useState(() => isFavorite(user?.id, id))
  const categorizedMovies = useHomeMovies()

  const movie = useMemo(
    () => categorizedMovies.flatMap((row) => row.movies).find((m) => m.id === id) || null,
    [categorizedMovies, id]
  )

  if (!movie) {
    // categorizedMovies starts empty while useHomeMovies is still fetching,
    // so an empty list doesn't necessarily mean the movie doesn't exist.
    return <p>{categorizedMovies.length > 0 ? 'Movie not found' : 'Loading movie…'}</p>;
  }

  // Prefer the real file attached in the Admin panel / movie_content table.
  // Falls back to the local placeholder clip for movies that don't have a
  // file linked yet (e.g. freshly TMDB-synced titles you haven't filled in).
  const videoSrc = movie.content?.fileUrl || playerVideo

  const handleFavoriteClick = () => {
    if (!user) {
      alert('Please log in to save favorites.')
      return
    }
    setIsFav(toggleFavorite(user.id, movie.id))
  }

  return (
    <main className="player-page">
      <Navbar activePage="player" />

      <section className="player-hero">
        <div className="player-layout">
          <div className="player-stage">
            <div className="player-screen" aria-label={`${movie.title} player placeholder`}>
              <video
                className="player-video"
                src={videoSrc}
                poster={movie.poster}
                muted
                controls
                playsInline
              />
            </div>
          </div>

          <section className="movie-details-panel" aria-labelledby="movie-details-title">
            <aside className="movie-poster-card" aria-label={`${movie.title} poster and facts`}>
              <img src={movie.poster} alt={`${movie.title} poster`} />
            </aside>

            <div className="movie-details-copy">
              <p className="eyebrow">Movie Details</p>
              <h2 id="movie-details-title">{movie.title}</h2>
              <p className="movie-synopsis">{movie.synopsis}</p>

              <div className="detail-grid">
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

              {/* <div className="player-summary-strip">
                {highlights.map((item) => (
                  <article className="summary-chip" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </article>
                ))}
              </div> */}

              <div className="action-row">
                {/* <button className="primary-button" type="button">
                                    Play Now
                                </button> */}
                <button
                  className="ghost-button"
                  type="button"
                  onClick={handleFavoriteClick}
                  aria-pressed={isFav}
                >
                  {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <Link className="ghost-button secondary-link" to="/home">
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