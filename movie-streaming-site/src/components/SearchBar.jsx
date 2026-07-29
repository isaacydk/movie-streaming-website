import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHomeMovies } from '../hooks/useHomeMovies'

export function SearchBar() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const movieRows = useHomeMovies()

  function getSearchResults() {
    const searchTerm = query.trim().toLowerCase()
    if (searchTerm === '') {
      return []
    }

    const allMovies = []
    for (let i = 0; i < movieRows.length; i++) {
      const row = movieRows[i]
      for (let j = 0; j < row.movies.length; j++) {
        allMovies.push(row.movies[j])
      }
    }

    const foundIds = []
    const matchedMovies = []
    for (let i = 0; i < allMovies.length; i++) {
      const movie = allMovies[i]
      if (foundIds.includes(movie.id)) {
        continue
      }

      const text = (movie.title + " " + movie.genre).toLowerCase()
      if (text.includes(searchTerm)) {
        foundIds.push(movie.id)
        matchedMovies.push(movie)
      }

      if (matchedMovies.length === 30) {
        break
      }
    }

    return matchedMovies
  }

  const results = getSearchResults()

  function closeSearch() {
    setIsOpen(false)
    setQuery('')
  }

  function updateQuery(nextQuery) {
    setQuery(nextQuery)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (inputRef.current) {
      inputRef.current.focus()
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeSearch()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  function openPlayer(movie) {
    closeSearch()
    navigate(`/player/${movie.id}`, { state: { movie } })
  }

  return (
    <>
      <label className="search-bar">
        <span className="screen-reader-only">Search movies</span>
        <input
          type="search"
          placeholder="Search movies..."
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          readOnly
        />
        <span className="search-icon" aria-hidden="true">⌕</span>
      </label>

      {isOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search movies" onMouseDown={closeSearch}>
          <section className="search-dialog" onMouseDown={(event) => event.stopPropagation()}>
            <div className="search-dialog-heading">
              <h2>Search</h2>
              <button className="search-close" type="button" onClick={closeSearch} aria-label="Close search">×</button>
            </div>

            <label className="search-dialog-input">
              <span aria-hidden="true">⌕</span>
              <span className="screen-reader-only">Search for a movie</span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="Search movies..."
              />
            </label>

            <div className="search-results" aria-live="polite">
              {query.trim() === '' && <p className="search-message">Start typing to find a movie.</p>}
              {query.trim() !== '' && movieRows.length === 0 && (<p className="search-message">Loading movies…</p>)}
              {query.trim() !== '' && movieRows.length > 0 && results.length === 0 && (<p className="search-message">No movies found for "{query}".</p>)}
              {results.map((movie) => {
                return (
                  <button className="search-result" type="button" key={movie.id} onClick={() => openPlayer(movie)}>
                  {movie.poster ? <img src={movie.poster} alt="" /> : <div className="search-poster-placeholder">No image</div>}
                    <span className="search-result-copy">
                      <strong>{movie.title}</strong>
                    <small>{movie.genre || 'Movie'}{movie.releaseYear ? ` · ${movie.releaseYear}` : ''}</small>
                    </span>
                  <span className="search-result-rating" aria-label={`Rating ${movie.rating || '0'}`}>★ {movie.rating || '0.0'}</span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      )}
    </>
  )
}
