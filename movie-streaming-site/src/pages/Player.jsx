import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { detailMovieRows } from '../data/DetailMovieRows'
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

  const movie = useMemo(() => {
    let data = null

    const cachedHomeMovies = localStorage.getItem('home-movies-cache')
    if (cachedHomeMovies) {
      try {
        const parsed = JSON.parse(cachedHomeMovies)
        data = parsed?.data
      } catch (error) {
        console.error('Invalid home movie cache', error)
      }
    }

    if (!data) {
      data = detailMovieRows
    }

    return data.flatMap((row) => row.movies).find((m) => m.id === id) || null
  }, [id])

  if (!movie) return <p>Movie not found</p>;

  return (
    <main className="player-page">
      <Navbar activePage="player" />

      <section className="player-hero">
        <div className="player-layout">
          <div className="player-stage">
            <div className="player-screen" aria-label={`${movie.title} player placeholder`}>
              <video
                className="player-video"
                src={playerVideo}
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
                <button className="ghost-button" type="button">
                  Add to Favorite
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