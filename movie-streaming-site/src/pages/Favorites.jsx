// import Footerbar from "../components/Footerbar"
// import { Navbar } from "../components/Navbar"

// function Favorites() {
//   return (
//     <>
//       <Navbar activePage={'favorites'} />
//       <section className="page-panel">
//         <p className="eyebrow">Your list</p>
//         <h1>Favorites</h1>
//         <p>
//           Saved movies will appear here. This page is ready for localStorage or
//           account-based favorites when the app gets a real movie API.
//         </p>
//         <button type="button" className="primary-button">
//           Browse Movies
//         </button>
//       </section>
//       <Footerbar />
//     </>
//   )
// }

// export default Favorites

import { HeroSection } from "../components/HeroSection"
import { Navbar } from "../components/Navbar"
import { favoriteMovieRows } from '../data/FavoriteMovieRows'
import { MovieRow } from '../components/MovieRow'

function Favorites() {
  return (
    <>
      <Navbar activePage={'favorites'} />
      <HeroSection />

      {favoriteMovieRows.length > 0 ? (
        favoriteMovieRows.map((row) => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} />
        ))
      ) : (
        <div className="empty-state">
          <p>No favorite movies yet!</p>
        </div>
      )}
    </>
  )
}

export default Favorites
