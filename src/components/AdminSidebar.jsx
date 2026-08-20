import { Link, useLocation } from "react-router-dom";

const links = [["/admin", "Dashboard"], ["/admin/movies", "Movies"], ["/admin/screens", "Screens"], ["/admin/seats", "Seats"], ["/admin/showtimes", "Showtimes"], ["/admin/appointments", "Appointments"], ["/admin/users", "Users"]];

function AdminSidebar() {
  const location = useLocation();
  return (
    <aside className="admin-sidebar">
      <Link className="brand light" to="/admin"><span></span>CINEMA ADMIN</Link>
      <nav>{links.map(([path, label]) => <Link key={path} className={location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path)) ? "active" : ""} to={path}>{label}</Link>)}</nav>
      <Link className="admin-logout" to="/admin/login">Logout</Link>
    </aside>
  );
}

export default AdminSidebar;