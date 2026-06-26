import { Navbar } from "../components/Navbar"

function Contact() {
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
          Send Message
        </a>
      </section>
    </>
  )
}

export default Contact


