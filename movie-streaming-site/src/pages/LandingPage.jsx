import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHomeMovies } from '../hooks/useHomeMovies'
import './LandingPage.css'

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

const initialSignupData = {
  name: '',
  email: '',
  password: '',
  password2: '',
}

const initialSignInData = {
  email: '',
  password: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ethiopianPhonePattern = /^(?:\+251|0)9\d{8}$/

export function LandingPage() {
  const navigate = useNavigate()
  const categorizedMovies = useHomeMovies()

  const allMovies = useMemo(
    () => categorizedMovies.flatMap((row) => row.movies),
    [categorizedMovies]
  )

  const heroMovies = allMovies.slice(0, 18)
  const trendingMovies = allMovies.slice(0, 5)

  const [email, setEmail] = useState('')
  const [flow, setFlow] = useState('none')
  const [signupData, setSignupData] = useState(initialSignupData)
  const [signInData, setSignInData] = useState(initialSignInData)
  const [telebirrPhone, setTelebirrPhone] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const resetFeedback = () => {
    setMessage('')
    setError('')
  }

  const openSignIn = () => {
    resetFeedback()
    setFlow('sign-in')
    setSignInData((currentData) => ({
      ...currentData,
      email: email.trim() || currentData.email,
    }))
  }

  const closeFlow = () => {
    setFlow('none')

    setSignupData(initialSignupData)
    setSignInData(initialSignInData)
    setTelebirrPhone('')
    resetFeedback()
  }

  const handleGetStarted = (event) => {
    event.preventDefault()
    resetFeedback()

    const normalizedEmail = email.trim().toLowerCase()

    if (!emailPattern.test(normalizedEmail)) {
      setError('Enter a valid email address to continue.')
      return
    }

    setSignupData({ ...initialSignupData, email: normalizedEmail })
    setFlow('details')
  }


  const updateSignupData = (event) => {
    const { name, value } = event.target
    setSignupData((currentData) => ({ ...currentData, [name]: value }))
  }

  const updateSignInData = (event) => {
    const { name, value } = event.target
    setSignInData((currentData) => ({ ...currentData, [name]: value }))
  }

  const handleSignupDetails = (event) => {
    event.preventDefault()
    resetFeedback()

    if (!signupData.name.trim()) {
      setError('Enter your full name.')
      return
    }


    if (!emailPattern.test(signupData.email.trim().toLowerCase())) {
      setError('Enter a valid email address.')
      return
    }

    if (!signupData.password.trim()) {
      setError('Create a password.')
      return
    }
    if (signupData.password.trim() !== signupData.password2.trim()) {
      setError('Your password does not match.')
      return
    }

    setFlow('payment')
  }

  const handleTelebirrPayment = async (event) => {
    event.preventDefault()
    resetFeedback()

    const normalizedPhone = telebirrPhone.replace(/\s+/g, '')

    if (!ethiopianPhonePattern.test(normalizedPhone)) {
      setError('Enter a valid Telebirr phone number, like 0912345678 or +251912345678.')
      return
    }


    const userData = {
      name: signupData.name,
      email: signupData.email,
      phone: telebirrPhone,
      password: signupData.password,

    }
    // Send signup data to backend PHP endpoint
    try {
      const response = await fetch("http://192.168.1.8/backend/api/signup.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      // ✅ store user (no JWT) and log them straight in, same as sign-in
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate('/home')
    } catch (error) {
      console.error("Error:", error);
      setError("Server error. Please try again.");
    }

    try {
      const response = await fetch("http://192.168.1.8/backend/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password
        })
      });

      const data = await response.json();
      console.log(data);

      if (data.error) {
        setError(data.error);
        return;
      }

      // ✅ store user (no JWT)
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ redirect
      navigate("/home");

    } catch (err) {
      console.error(err);
      setError("Server error");
    }


    navigate('/home')
  }

  const handleSignIn = async (event) => {
    event.preventDefault()
    resetFeedback()

    if (!emailPattern.test(signInData.email.trim().toLowerCase())) {
      setError('Enter a valid email address.')
      return
    }

    if (!signInData.password.trim()) {
      setError('Enter your password.')
      return
    }

    try {
      const response = await fetch("http://192.168.1.8/backend/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: signInData.email,
          password: signInData.password
        })
      });

      const data = await response.json();
      console.log(data);

      if (data.error) {
        setError(data.error);
        return;
      }

      // ✅ store user (no JWT)
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ redirect
      navigate("/home");

    } catch (err) {
      console.error(err);
      setError("Server error");
    }

  }




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
          <button className="sign-in-button" type="button" onClick={openSignIn}>
            Sign In
          </button>
        </nav>

        <div className="landing-hero-content">
          <h1 id="landing-title">Unlimited movies, Watch and relax</h1>
          <p className="landing-price">Starts at USD 2.99. Cancel anytime.</p>
          <form className="email-form" aria-label="Create or restart membership" onSubmit={handleGetStarted}>
            <label htmlFor="landing-email">
              Ready to watch? Enter your email to create or restart your membership.
            </label>
            <div className="email-row">
              <input
                id="landing-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit">
                <span>Get Started</span>
                <span className="cta-arrow" aria-hidden="true" />
              </button>
            </div>
            {flow === 'none' && error ? <p className="landing-form-error">{error}</p> : null}
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
                <h3>{reason.handleSignIntitle}</h3>
                <p>{reason.body}</p>
                <span className={`reason-icon reason-icon-${reason.icon}`} aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>
      </section>

      {flow !== 'none' ? (
        <div className="flow-overlay" role="dialog" aria-modal="true" aria-labelledby="flow-title">
          <section className="flow-panel">
            <button className="flow-close" type="button" onClick={closeFlow} aria-label="Close">
              ×
            </button>


            {flow === 'details' ? (
              <form className="flow-form" onSubmit={handleSignupDetails}>
                <p className="flow-kicker">Step 2 of 3</p>
                <h2 id="flow-title">Create your account</h2>
                <p className="flow-copy">Enter your details to continue with your selected plan.</p>
                <label>
                  Name
                  <input
                    name="name"
                    type="text"
                    value={signupData.name}
                    onChange={updateSignupData}
                    placeholder="Your full name"
                  />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={signupData.email} onChange={updateSignupData} />
                </label>
                <label>
                  Password
                  <input
                    name="password"
                    type="password"
                    value={signupData.password}
                    onChange={updateSignupData}
                    placeholder="Create a password"
                  />
                </label>
                <label>
                  Conform Password
                  <input
                    name="password2"
                    type="password"
                    value={signupData.password2}
                    onChange={updateSignupData}
                    placeholder="Conform password"
                  />
                </label>
                {error ? <p className="flow-error">{error}</p> : null}
                <button className="flow-submit" type="submit">
                  Continue to Telebirr
                </button>
                <button className="flow-secondary" type="button" onClick={() => setFlow('plans')}>
                  Back to plans
                </button>
              </form>
            ) : null}

            {flow === 'payment' ? (
              <form className="flow-form" onSubmit={handleTelebirrPayment}>
                <p className="flow-kicker">Step 3 of 3</p>
                <h2 id="flow-title">Pay with Telebirr</h2>
                <p className="flow-copy">
                  This is a mock payment. Enter your Telebirr phone number to finish and start watching.
                </p>
                <div className="telebirr-box">
                  <span>Telebirr</span>
                  <strong>.......</strong>
                </div>
                <label>
                  Telebirr phone number
                  <input
                    type="tel"
                    value={telebirrPhone}
                    onChange={(event) => setTelebirrPhone(event.target.value)}
                    placeholder="0912345678"
                  />
                </label>
                {error ? <p className="flow-error">{error}</p> : null}
                <button className="flow-submit" type="submit">
                  Finish and Watch
                </button>
              </form>
            ) : null}

            {flow === 'sign-in' ? (
              <form className="flow-form" onSubmit={handleSignIn}>
                <p className="flow-kicker">Welcome back</p>
                <h2 id="flow-title">Sign in to RedStream</h2>
                {message ? <p className="flow-message">{message}</p> : null}
                <label>
                  Email
                  <input name="email" type="email" value={signInData.email} onChange={updateSignInData} />
                </label>
                <label>
                  Password
                  <input
                    name="password"
                    type="password"
                    value={signInData.password}
                    onChange={updateSignInData}
                    placeholder="Your password"
                  />
                </label>
                {error ? <p className="flow-error">{error}</p> : null}
                <button className="flow-submit" type="submit">
                  Sign In
                </button>
              </form>
            ) : null}
          </section>
        </div>
      ) : null}
    </main>
  )
}
