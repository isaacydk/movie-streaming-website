import { Link } from "react-router-dom"

export function HeroSection() {
  return (
    <section className="hero-box">
      <p className="small-title">Unlimited movie nights</p>
      <h1>Welcome to RedStream Movie App</h1>
      <p>
        Browse popular releases, save favorites, and build your next watchlist
        in a Netflix-inspired streaming dashboard.
      </p>
      <div className="button-row">
        <button type="button" className="watch-button" onClick={() =>
            document.getElementById("popular")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Start Watching
        </button>
        <Link to="/favorites" className="favorites-button">
          View Favorites
        </Link>
      </div>
    </section>
  )
}
