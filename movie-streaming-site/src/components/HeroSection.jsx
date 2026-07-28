import { Link } from "react-router-dom"

export function HeroSection() {
  return (
    <section className="hero-section">
      <p className="eyebrow">Unlimited movie nights</p>
      <h1>Welcome to RedStream Movie App</h1>
      <p>
        Browse popular releases, save favorites, and build your next watchlist
        in a Netflix-inspired streaming dashboard.
      </p>
      <div className="hero-actions">
        <button
          type="button"
          className="primary-button"
          onClick={() =>
            document.getElementById("popular")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Start Watching
        </button>
        <Link to="/favorites" className="ghost-button">
          View Favorites
        </Link>
      </div>
    </section>
  )
}