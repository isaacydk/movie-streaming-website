import { HeroSection } from "../components/HeroSection"
import { useEffect, useState } from "react"
import { Navbar } from "../components/Navbar"
import { MovieRow } from "../components/MovieRow"
import Footerbar from "../components/Footerbar"

const CACHE_KEY = "home-movies-cache"
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

export function Home() {
  const [movies, setMovies] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return []

      const parsed = JSON.parse(cached)
      return parsed.data || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      let parsed = null

      if (cached) {
        parsed = JSON.parse(cached)
      }

      const isFresh =
        parsed &&
        parsed.timestamp &&
        Date.now() - parsed.timestamp < CACHE_TTL

      if (isFresh) {
        setMovies(parsed.data || [])
        return
      }
    } catch { }

    fetch("http://localhost/backend/api/movies.php")
      .then((response) => response.json())
      .then((data) => {
        setMovies(data)
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        )
      })
      .catch((error) => {
        console.error("Error fetching movies", error)
      })
  }, [])

  return (
    <>
      <Navbar activePage={"home"} />
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