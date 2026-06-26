import { MovieCard } from './MovieCard'

export function MovieRow({ title, movies }) {
  if (!movies.length) {
    return null
  }

  const headingId = `${title.toLowerCase().replace(/\s+/g, '-')}-heading`

  return (
    <section className="movie-row" aria-labelledby={headingId}>
      <div className="row-header">
        <h2 id={headingId}>{title}</h2>
        <button type="button">View All</button>
      </div>
      <div className="movie-scroller">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}


