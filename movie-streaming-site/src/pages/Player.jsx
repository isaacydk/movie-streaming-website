import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { detailMovieRows } from '../data/DetailMovieRows'
import playerVideo from '../data/type-vid.mp4'
import './Player.css'

const featuredMovies = detailMovieRows.flatMap((row) => row.movies).filter((movie) => movie.id === 'morbius')

const featuredMovie = featuredMovies[0]

const highlights = [
    { label: 'Genre', value: featuredMovie.genre },
    { label: 'Rating', value: featuredMovie.rating },
    { label: 'Release', value: featuredMovie.releaseYear },
    { label: 'Runtime', value: featuredMovie.runtime },
]

function Player() {
    return (
        <main className="player-page">
            <Navbar activePage="player" />

            <section className="player-hero">
                <div className="player-layout">
                    <div className="player-stage">
                        <div className="player-screen" aria-label={`${featuredMovie.title} player placeholder`}>
                            <video
                                className="player-video"
                                src={playerVideo}
                                poster={featuredMovie.poster}
                                muted
                                controls
                                playsInline
                            />
                        </div>
                    </div>

                    <section className="movie-details-panel" aria-labelledby="movie-details-title">
                        <aside className="movie-poster-card" aria-label={`${featuredMovie.title} poster and facts`}>
                            <img src={featuredMovie.poster} alt={`${featuredMovie.title} poster`} />
                        </aside>

                        <div className="movie-details-copy">
                            <p className="eyebrow">Movie Details</p>
                            <h2 id="movie-details-title">{featuredMovie.title}</h2>
                            <p className="movie-synopsis">{featuredMovie.synopsis}</p>

                            <div className="detail-grid">
                                <div>
                                    <span>Director</span>
                                    <strong>{featuredMovie.director}</strong>
                                </div>
                                <div>
                                    <span>Cast</span>
                                    <strong>{featuredMovie.cast}</strong>
                                </div>
                                <div>
                                    <span>Audio</span>
                                    <strong>{featuredMovie.audio}</strong>
                                </div>
                                <div>
                                    <span>Subtitles</span>
                                    <strong>{featuredMovie.subtitles}</strong>
                                </div>
                            </div>

                            <div className="player-summary-strip">
                                {highlights.map((item) => (
                                    <article className="summary-chip" key={item.label}>
                                        <span>{item.label}</span>
                                        <strong>{item.value}</strong>
                                    </article>
                                ))}
                            </div>

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
        </main>
    )
}

export default Player