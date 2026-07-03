import { HeroSection } from "../components/HeroSection"
import { Navbar } from "../components/Navbar"
import { detailMovieRows } from '../data/DetailMovieRows'
import { MovieRow } from '../components/MovieRow'

export function Home() {
  return (
    <>
      <Navbar activePage={'home'} />
      <HeroSection />

      {detailMovieRows.length > 0 ? (
        detailMovieRows.map((row) => (
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