import { useState } from "react"
import { Navbar } from "../components/Navbar"
import './Contact.css'

function Contact() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null")

  const [form, setForm] = useState({
    name: storedUser?.full_name || '',
    email: storedUser?.email || '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { id, value } = event.target
    setForm((current) => ({ ...current, [id]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    setError('')

    try {
      const response = await fetch("http://192.168.1.8/backend/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || "Something went wrong")
      }

      setStatus('sent')
      setForm((current) => ({ ...current, message: '' }))
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <>
      <Navbar activePage={'contact'} />
      <section className="page-panel">
        <p className="eyebrow">Support</p>
        <h1>Contact RedStream</h1>
        <p>
          Have a movie request, feedback, or partnership idea? Reach the team and
          help shape the next version of the streaming experience.
        </p>
        <a className="primary-button" href="mailto:hello@redstream.example">
          Send Via email
        </a>

        <p>or Just fill the form</p>

        <div className="card">
          <form id="contactForm" onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={form.name} onChange={handleChange} required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={form.email} onChange={handleChange} required />

            <label htmlFor="message">Message</label>
            <textarea id="message" value={form.message} onChange={handleChange} required></textarea>

            <button type="submit" className="send-btn" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>

          {status === 'sent' ? (
            <div className="confirmation" style={{ display: 'block' }}>
              ✅ Your message was sent! The admin team will see it in their inbox.
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="confirmation" style={{ display: 'block', background: '#3a1c1c', borderColor: '#6b2e2e', color: '#d19e9e' }}>
              ⚠️ {error || 'Could not send your message. Please try again.'}
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}

export default Contact
