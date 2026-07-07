import './Footerbar.css'

function Footerbar() {
  return (
    <footer className="footerbar">
      <div className="footerbar__bottom">
        <a href="/contact" className="footerbar__contact-btn">
          Contact Us
        </a>

        <p>&copy; {new Date().getFullYear()} Movie Streaming. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footerbar;