import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div><p className="brand light"><span></span>CINEMA NOVA</p><small>Contact: info@cinemanova.com · +962 6 000 0000</small></div>
      <div><b>Navigation</b><Link to="/">Home</Link><Link to="/movies">Movies</Link><Link to="/appointments">My Appointments</Link></div>
      <div><b>Follow Us</b><small>Facebook · Instagram · X</small></div>
    </footer>
  );
}

export default Footer;

