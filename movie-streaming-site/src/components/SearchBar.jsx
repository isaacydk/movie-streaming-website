export function SearchBar() {
  return (
    <label className="search-bar">
      <span className="sr-only">Search movies</span>
      <input
        type="search"
        // value={value}
        placeholder="Search..."
      // onChange={(event) => onChange(event.target.value)}
      />
      {/* <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10.8 4a6.8 6.8 0 0 1 5.39 10.94l3.44 3.43-1.41 1.42-3.44-3.44A6.8 6.8 0 1 1 10.8 4Zm0 2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Z" />
      </svg> */}
    </label>
  )
}