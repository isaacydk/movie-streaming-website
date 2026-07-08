import { HeroSection } from "../components/HeroSection"
import { useEffect, useState } from "react"
import { Navbar } from "../components/Navbar"
// import { detailMovieRows } from '../data/DetailMovieRows'
import { MovieRow } from '../components/MovieRow'
import Footerbar from "../components/Footerbar"

export function Home() {
  const [movies, setMovies] = useState([]);



  useEffect(() => {
    fetch('http://localhost/backend/api/movies.php')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data)

      })
      .catch((error) => {
        console.error('Error fetching movies', error);

      })
  }, [])

  return (
    <>
      <Navbar activePage={'home'} />
      <HeroSection />

      {movies.length > 0 ? (
        movies.map((row) => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} />
        ))
      ) : (
        <div className="empty-state">
          <p>Loading Movies...</p>
        </div>
      )}
      <Footerbar />
    </>
  )
}