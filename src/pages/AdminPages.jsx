import { Link, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { adminRows, movies } from "../data";

function AdminLayout({ title, subtitle, children }) {
  return <div className="admin-shell"><AdminSidebar /><main className="admin-main"><h1>{title}</h1>{subtitle && <p className="page-subtitle">{subtitle}</p>}{children}</main></div>;
}

function Status({ value }) { return <span className={`status-pill status-${value.toLowerCase().replace(/\s+/g, '-')}`}>{value}</span>; }

function SimpleTable({ headings, rows }) {
  return <div className="table-card"><div className="table-responsive"><table className="table mb-0"><thead><tr>{headings.map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((value, cell) => <td key={cell}>{value}</td>)}</tr>)}</tbody></table></div></div>;
}

export function AdminDashboard() {
  return <AdminLayout title="Dashboard" subtitle="Overview of your cinema operations"><div className="stat-grid">{[["Total Movies", "18"], ["Total Showtimes", "54"], ["Total Appointments", "312"], ["Total Users", "145"]].map(([label, value]) => <div className="stat-card" key={label}><small>{label}</small><b>{value}</b><i></i></div>)}</div><h2>Recent Appointments</h2><SimpleTable headings={["Customer", "Movie", "Date", "Showtime", "Seats", "Status"]} rows={adminRows.map((row) => [row.customer, row.movie, row.date, row.time, row.seats, <Status value={row.status} />])} /><h2 className="mt-5">Quick Actions</h2><div className="quick-actions"><Link className="btn btn-outline-dark" to="/admin/movies/new">+ Add Movie</Link><Link className="btn btn-outline-dark" to="/admin/showtimes/new">+ Add Showtime</Link><Link className="btn btn-outline-dark" to="/admin/appointments">View Appointments</Link></div></AdminLayout>;
}

export function AdminMovies() {
  return <AdminLayout title="Manage Movies" subtitle="Add, edit, and organise the cinema movie list"><div className="admin-toolbar"><input placeholder="🔍 Search movies..." /><Link className="btn gold-button" to="/admin/movies/new">+ Add Movie</Link></div><SimpleTable headings={["Movie", "Genre", "Duration", "Release Date", "Status", "Actions"]} rows={movies.map((movie) => [movie.title, movie.genre, movie.duration, "Aug 21, 2026", <Status value={movie.status} />, <><Link className="table-link" to={`/admin/movies/${movie.id}/edit`}>Edit</Link> <button className="table-link danger">Delete</button></>])} /></AdminLayout>;
}

export function MovieForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const movie = movies.find((item) => item.id === Number(id));
  return <AdminLayout title="Add / Edit Movie"><Link className="back-link" to="/admin/movies">← Back to Manage Movies</Link><form className="admin-form" onSubmit={(event) => { event.preventDefault(); navigate("/admin/movies"); }}><label>Title<input required defaultValue={movie?.title} /></label><label>Description<textarea defaultValue={movie?.description} /></label><div className="form-row"><label>Genre<select defaultValue={movie?.genre || "Sci-Fi"}><option>Sci-Fi</option><option>Action</option><option>Animation</option></select></label><label>Duration<input defaultValue={movie?.duration} placeholder="e.g. 2h 20m" /></label></div><div className="form-row"><label>Release Date<input type="date" defaultValue="2026-08-21" /></label><label>Status<select defaultValue={movie?.status || "Now Showing"}><option>Now Showing</option><option>Coming Soon</option></select></label></div><button className="btn gold-button">Save Movie</button><Link className="btn btn-outline-dark ms-2" to="/admin/movies">Cancel</Link></form></AdminLayout>;
}

export function AdminScreens() {
  return <AdminLayout title="Manage Screens" subtitle="Manage cinema rooms and their capacity"><div className="admin-toolbar"><input placeholder="🔍 Search screens..." /><button className="btn gold-button">+ Add Screen</button></div><SimpleTable headings={["Screen", "Capacity", "Seats", "Status", "Actions"]} rows={[["Screen 1", "80", "80", <Status value="Active" />, "Edit Delete"], ["Screen 2", "64", "64", <Status value="Active" />, "Edit Delete"], ["Screen 3", "96", "96", <Status value="Active" />, "Edit Delete"]]} /></AdminLayout>;
}

export function AdminSeats() {
  const seats = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"];
  return <AdminLayout title="Manage Seats" subtitle="Screen 1"><div className="admin-toolbar"><select><option>Screen 1</option><option>Screen 2</option></select><button className="btn gold-button">+ Add Seat</button></div><div className="admin-seat-grid">{seats.map((seat) => <button key={seat}>{seat}</button>)}</div><p className="page-subtitle mt-3">Click a seat to edit it. Seats are shown as a simple grid, following the prototype.</p></AdminLayout>;
}

export function AdminShowtimes() {
  return <AdminLayout title="Manage Showtimes" subtitle="Schedule the movies shown at Cinema Nova"><div className="admin-toolbar"><input placeholder="🔍 Search showtimes..." /><Link className="btn gold-button" to="/admin/showtimes/new">+ Add Showtime</Link></div><SimpleTable headings={["Movie", "Date", "Time", "Screen", "Status", "Actions"]} rows={adminRows.map((row) => [row.movie, row.date, row.time, row.screen, <Status value={row.status === "Cancelled" ? "Cancelled" : "Active"} />, <><Link className="table-link" to="/admin/showtimes/1/edit">Edit</Link> <button className="table-link danger">Delete</button></>])} /></AdminLayout>;
}

export function ShowtimeForm() {
  const navigate = useNavigate();
  return <AdminLayout title="Add / Edit Showtime"><Link className="back-link" to="/admin/showtimes">← Back to Manage Showtimes</Link><form className="admin-form" onSubmit={(event) => { event.preventDefault(); navigate("/admin/showtimes"); }}><label>Movie<select><option>Dune: Part Two</option><option>The Batman</option><option>Interstellar</option></select></label><div className="form-row"><label>Date<input type="date" defaultValue="2026-08-21" /></label><label>Start Time<input type="time" defaultValue="17:00" /></label></div><div className="form-row"><label>Screen<select><option>Screen 1</option><option>Screen 2</option><option>Screen 3</option></select></label><label>Status<select><option>Active</option><option>Cancelled</option></select></label></div><button className="btn gold-button">Save Showtime</button><Link className="btn btn-outline-dark ms-2" to="/admin/showtimes">Cancel</Link></form></AdminLayout>;
}

export function AdminAppointments() {
  return <AdminLayout title="Manage Appointments"><div className="admin-toolbar filters"><select><option>Date</option></select><select><option>Movie</option></select><select><option>Status</option></select></div><SimpleTable headings={["ID", "Customer", "Movie", "Date", "Showtime", "Screen", "Seats", "Status", "Actions"]} rows={adminRows.map((row, index) => [`#014${2 - index}`, row.customer, row.movie, row.date, row.time, row.screen, row.seats, <Status value={row.status} />, "View · Manage"])} /></AdminLayout>;
}

export function AdminUsers() {
  return <AdminLayout title="Manage Users"><div className="admin-toolbar"><input placeholder="🔍 Search users..." /></div><SimpleTable headings={["Name", "Email", "Role", "Status", "Registered", "Actions"]} rows={[["Sarah Ahmad", "sarah.ahmad@email.com", "Customer", <Status value="Active" />, "Jan 12, 2026", "View Edit Deactivate"], ["Omar Khalil", "omar.khalil@email.com", "Customer", <Status value="Active" />, "Feb 3, 2026", "View Edit Deactivate"], ["Admin User", "admin@cinemanova.com", "Administrator", <Status value="Active" />, "Jan 1, 2026", "View Edit Deactivate"], ["Yousef Odeh", "yousef.odeh@email.com", "Customer", <Status value="Deactivated" />, "Mar 18, 2026", "View Edit Deactivate"]]} /></AdminLayout>;
}

