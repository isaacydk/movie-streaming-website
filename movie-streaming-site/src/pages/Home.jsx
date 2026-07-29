import { HeroSection } from "../components/HeroSection"
import { Navbar } from "../components/Navbar"
import { MovieRow } from "../components/MovieRow"
import Footerbar from "../components/Footerbar"
import { useHomeMovies } from "../hooks/useHomeMovies"

export function Home() {
  const movies = useHomeMovies()

  return (
    <>
      <Navbar activePage="home" />
      <HeroSection />

      {movies.length > 0 ? (
        <div className="content-section">
          {movies.map((row) => (
            <MovieRow key={row.title} title={row.title} movies={row.movies} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Loading Movies...</p>
        </div>
      )}

      <Footerbar />
    </>
  )
}
