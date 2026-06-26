import { Navbar } from "../components/Navbar"

function Favorites() {
  return (
    <>
      <Navbar activePage={'favorites'} />
      <section className="page-panel">
        <p className="eyebrow">Your list</p>
        <h1>Favorites</h1>
        <p>
          Saved movies will appear here. This page is ready for localStorage or
          account-based favorites when the app gets a real movie API.
        </p>
        <button type="button" className="primary-button">
          Browse Movies
        </button>
      </section>
    </>
  )
}

export default Favorites

