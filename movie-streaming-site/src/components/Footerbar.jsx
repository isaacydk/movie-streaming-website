import { Link } from 'react-router-dom'
import './Footerbar.css'

function Footerbar() {
  return (
    <footer className="footerbar">
      <div className="footerbar__bottom">
        <Link to="/contact" className="footerbar__contact-btn">
          Contact Us
        </Link>

        <p>&copy; {new Date().getFullYear()} Movie Streaming. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footerbar
