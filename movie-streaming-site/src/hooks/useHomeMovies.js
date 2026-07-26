import { useEffect, useState } from 'react'

export const HOME_MOVIES_CACHE_KEY = 'home-movies-cache'
const CACHE_KEY = HOME_MOVIES_CACHE_KEY
// movies.php now reads from MySQL (movie_details + movie_categories)
// instead of calling TMDB live, so a cache miss is a fast local query.
// This TTL is a light perf/offline nicety, not a rate-limit workaround.
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Returns the same shape movies.php responds with:
 *   [{ title: "Popular", movies: [...] }, { title: "Top Rated", movies: [...] }, ...]
 *
 * Backed by the same "home-movies-cache" localStorage entry Player.jsx and
 * Favorites.jsx already read from, so every page stays in sync with
 * whatever the admin last edited or the TMDB sync last pulled in.
 */
export function useHomeMovies() {
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
    } catch {
      // fall through to a fresh fetch
    }

    fetch('http://localhost/backend/api/movies.php')
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
        console.error('Error fetching movies', error)
      })
  }, [])

  return movies
}
