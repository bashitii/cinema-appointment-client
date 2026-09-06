import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    location.pathname === path ||
    (path === "/movies" && location.pathname.startsWith("/movies"));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="site-header">
      <Link className="brand" to="/"><span></span>CINEMA <strong>NOVA</strong></Link>
      <nav>
        <Link className={isActive("/") ? "active" : ""} to="/">Home</Link>
        <Link className={isActive("/movies") ? "active" : ""} to="/movies">Movies</Link>
        <Link className={isActive("/appointments") ? "active" : ""} to="/appointments">My Appointments</Link>
        <Link className={isActive("/profile") ? "active" : ""} to="/profile">Profile</Link>
      </nav>
      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>Hi, {user.full_name?.split(" ")[0]}</span>
          <button
            className="btn btn-outline-dark btn-sm rounded-pill px-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <Link className="btn btn-outline-dark btn-sm rounded-pill px-4" to="/login">Login</Link>
      )}
    </header>
  );
}

export default Navbar;
