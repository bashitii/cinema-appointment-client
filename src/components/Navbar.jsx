import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path || (path === "/movies" && location.pathname.startsWith("/movies"));

  return (
    <header className="site-header">
      <Link className="brand" to="/"><span></span>CINEMA <strong>NOVA</strong></Link>
      <nav>
        <Link className={isActive("/") ? "active" : ""} to="/">Home</Link>
        <Link className={isActive("/movies") ? "active" : ""} to="/movies">Movies</Link>
        <Link className={isActive("/appointments") ? "active" : ""} to="/appointments">My Appointments</Link>
        <Link className={isActive("/profile") ? "active" : ""} to="/profile">Profile</Link>
      </nav>
      <Link className="btn btn-outline-dark btn-sm rounded-pill px-4" to="/login">Logout</Link>
    </header>
  );
}

export default Navbar;

