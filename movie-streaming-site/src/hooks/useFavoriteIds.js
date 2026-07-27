import { useEffect, useState } from 'react'
import { fetchFavoriteIds } from '../data/favorites'

/**
 * Fetches the logged-in user's favorite movie ids from the database.
 * Returns setFavoriteIds too, so callers can optimistically update the
 * list right after a successful add/remove instead of re-fetching.
 */
export function useFavoriteIds(userId) {
  const [favoriteIds, setFavoriteIds] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!userId) {
      setFavoriteIds([])
      setLoaded(true)
      return
    }

    setLoaded(false)
    fetchFavoriteIds(userId).then((ids) => {
      if (!cancelled) {
        setFavoriteIds(ids)
        setLoaded(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [userId])

  return { favoriteIds, loaded, setFavoriteIds }
}
