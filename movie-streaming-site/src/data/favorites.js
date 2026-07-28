// DB-backed favorites - talks to backend/api/favorites.php (the `favorites`
// table), replacing the old localStorage-only version. All functions here
// are async since they now involve a network request.

const API_BASE = 'http://192.168.1.8/backend/api'

export async function fetchFavoriteIds(userId) {
  if (!userId) return []

  try {
    const response = await fetch(`${API_BASE}/favorites.php?userId=${encodeURIComponent(userId)}`)
    const data = await response.json()
    return Array.isArray(data.movieIds) ? data.movieIds : []
  } catch (error) {
    console.error('Error fetching favorites', error)
    return []
  }
}

export async function addFavorite(userId, movieId) {
  if (!userId || !movieId) return
  await fetch(`${API_BASE}/favorites.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, movieId }),
  })
}

export async function removeFavorite(userId, movieId) {
  if (!userId || !movieId) return
  await fetch(
    `${API_BASE}/favorites.php?userId=${encodeURIComponent(userId)}&movieId=${encodeURIComponent(movieId)}`,
    { method: 'DELETE' }
  )
}

// wasFavorite = whether it was favorited *before* this call (the caller
// already knows this from the favoriteIds list it's tracking, so we don't
// need a separate round trip just to check).
export async function toggleFavorite(userId, movieId, wasFavorite) {
  if (!userId || !movieId) return wasFavorite

  if (wasFavorite) {
    await removeFavorite(userId, movieId)
    return false
  }

  await addFavorite(userId, movieId)
  return true
}
