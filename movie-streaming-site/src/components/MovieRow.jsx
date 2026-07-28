import { MovieCard } from './MovieCard'

export function MovieRow({ title, movies }) {
  if (!movies.length) {
    return null
  }

  const sectionId = title.toLowerCase().replace(/\s+/g, '-')
  const headingId = `${sectionId}-heading`

  return (
    <section id={sectionId} className="movie-row" aria-labelledby={headingId}>
      <div className="row-header">
        <h2 id={headingId}>{title}</h2>
      </div>
      <div className="movie-scroller">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}


