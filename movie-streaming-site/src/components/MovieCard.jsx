import { Link } from "react-router-dom"

export function MovieCard({ movie }) {
  return (
    <article className="movie-box">
      <Link to={`/player/${movie.id}`}>
        <div className="poster-area">
          <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
          <span className="rating-tag" aria-label={`Rating ${movie.rating}`}>
            <span aria-hidden="true">★</span>
            {movie.rating}
          </span>
        </div>
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>{movie.genre}</p>
        </div>
      </Link>
    </article>
  )
}


