import { HeroSection } from "../components/HeroSection"
import { Navbar } from "../components/Navbar"
import { moviesRows } from '../data/MoviesRows'
import { MovieRow } from '../components/MovieRow'

export function Home() {
  return (
    <>
      <Navbar activePage={'home'} />
      <HeroSection />

      {moviesRows.length > 0 ? (
        moviesRows.map((row) => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} />
        ))
      ) : (
        <div className="empty-state">
          <p>No movies found!</p>
        </div>
      )}
    </>
  )
}