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
