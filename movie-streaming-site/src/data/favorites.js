const FAVORITES_KEY = 'redstream_favorites'

function getStorageKey(userId) {
  return `${FAVORITES_KEY}_${userId}`
}

export function getFavoriteIds(userId) {
  if (!userId) return []

  const raw = localStorage.getItem(getStorageKey(userId))
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getFavoritesCount(userId) {
  return getFavoriteIds(userId).length
}

function saveFavoriteIds(userId, ids) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(ids))
}

export function isFavorite(userId, movieId) {
  if (!userId || !movieId) return false
  return getFavoriteIds(userId).includes(movieId)
}

export function addFavorite(userId, movieId) {
  if (!userId || !movieId) return []

  const ids = getFavoriteIds(userId)
  if (!ids.includes(movieId)) {
    const updated = [...ids, movieId]
    saveFavoriteIds(userId, updated)
    return updated
  }
  return ids
}

export function removeFavorite(userId, movieId) {
  if (!userId || !movieId) return []

  const updated = getFavoriteIds(userId).filter((id) => id !== movieId)
  saveFavoriteIds(userId, updated)
  return updated
}

export function toggleFavorite(userId, movieId) {
  if (!userId || !movieId) return false

  if (isFavorite(userId, movieId)) {
    removeFavorite(userId, movieId)
    return false
  }

  addFavorite(userId, movieId)
  return true
}
