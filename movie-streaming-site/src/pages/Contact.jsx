import { Navbar } from "../components/Navbar"
import './Contact.css'

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
          Send Via email
        </a>

        <p>or Just fill the form</p>


        {/* kalid */}


        <div class="card">
          <form id="contactForm">
            <label for="name">Name</label>
            <input type="text" id="name" required />

            <label for="email">Email</label>
            <input type="email" id="email" required />

            <label for="message">Message</label>
            <textarea id="message" required></textarea>

            <button type="submit" class="send-btn">Send message</button>
          </form>

          <div class="confirmation" id="confirmation">
            ✅ Your message was sent! The admin team will see it in their inbox.
          </div>



        </div >
      </section>



    </>
  )
}

export default Contact


