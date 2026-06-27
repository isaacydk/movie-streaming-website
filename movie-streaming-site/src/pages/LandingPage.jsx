import { moviesRows } from '../data/MoviesRows'
import './LandingPage.css'

const allMovies = moviesRows.flatMap((row) => row.movies)
const heroMovies = allMovies.slice(0, 18)
const trendingMovies = allMovies.slice(0, 5)

const reasons = [
  {
    title: 'Enjoy on your TV',
    body: 'Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.',
    icon: 'tv',
  },
  {
    title: 'Download your shows to watch offline',
    body: 'Save your favorites easily and always have something to watch.',
    icon: 'download',
  },
  {
    title: 'Watch everywhere',
    body: 'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.',
    icon: 'spotlight',
  },
  {
    title: 'Create profiles for kids',
    body: 'Send kids on adventures with their favorite characters in a space made just for them.',
    icon: 'kids',
  },
]

export function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="poster-collage" aria-hidden="true">
          {heroMovies.map((movie, index) => (
            <div
              className="poster-tile"
              key={`${movie.id}-${index}`}
              style={{ '--poster': `url(${movie.poster})` }}
            />
          ))}
        </div>

        <nav className="landing-nav" aria-label="Landing page">
          <a className="landing-brand" href="/" aria-label="RedStream home">
            RedStream
          </a>
          <button className="sign-in-button" type="button">
            Sign In
          </button>
        </nav>

        <div className="landing-hero-content">
          <h1 id="landing-title">Unlimited movies, Watch and relax</h1>
          <p className="landing-price">Starts at USD 2.99. Cancel anytime.</p>
          <form className="email-form" aria-label="Create or restart membership">
            <label htmlFor="landing-email">
              Ready to watch? Enter your email to create or restart your membership.
            </label>
            <div className="email-row">
              <input id="landing-email" type="email" placeholder="Email address" />
              <button type="button">
                <span>Get Started</span>
                <span className="cta-arrow" aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="curve-divider" aria-hidden="true" />

      <section className="landing-content">
        <section className="landing-section landing-trending" aria-labelledby="trending-title">
          <h2 id="trending-title">Trending Now</h2>
          <div className="trending-scroller">
            {trendingMovies.map((movie, index) => (
              <article className="trending-card" key={movie.id}>
                <span className="trend-rank" aria-hidden="true">
                  {index + 1}
                </span>
                <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section landing-reasons" aria-labelledby="reasons-title">
          <h2 id="reasons-title">More Reasons to Join</h2>
          <div className="reason-grid">
            {reasons.map((reason) => (
              <article className="reason-card" key={reason.title}>
                <h3>{reason.title}</h3>
                <p>{reason.body}</p>
                <span className={`reason-icon reason-icon-${reason.icon}`} aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
