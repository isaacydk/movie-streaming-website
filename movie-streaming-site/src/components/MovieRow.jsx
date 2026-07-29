import { MovieCard } from './MovieCard'

export function MovieRow({ title, movies }) {
  if (movies.length === 0) {
    return null
  }

  const sectionId = title.toLowerCase().split(" ").join("-")
  const headingId = sectionId + "-heading"

  return (
    <section id={sectionId} className="row-box" aria-labelledby={headingId}>
      <div className="row-title-bar">
        <h2 id={headingId}>{title}</h2>
      </div>
      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
