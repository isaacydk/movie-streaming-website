export function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
        <span className="rating-badge" aria-label={`Rating ${movie.rating}`}>
          <span aria-hidden="true">★</span>
          {movie.rating}
        </span>
      </div>
      <div className="movie-meta">
        <h3>{movie.title}</h3>
        <p>{movie.genre}</p>
      </div>
    </article>
  )
}


