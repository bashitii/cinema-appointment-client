import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { appointments } from "../data";

export function MyAppointments() {
  return <><Navbar /><main className="page-content"><h1 className="page-title">My Appointments</h1><p className="page-subtitle">Keep track of your upcoming and past cinema visits</p><h2>Upcoming Appointments</h2>{appointments.slice(0, 2).map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)}<h2 className="mt-5">Previous Appointments</h2><AppointmentCard appointment={appointments[2]} /></main><Footer /></>;
}

function AppointmentCard({ appointment }) {
  return <article className="appointment-card"><div className={`appointment-poster poster ${appointment.color}`}><span>{appointment.movie}</span></div><div className="appointment-info"><span className="status-pill">{appointment.status}</span><h3>{appointment.movie}</h3><p>{appointment.date} · {appointment.time} · {appointment.screen}</p><p>Seats: <b>{appointment.seats}</b></p></div><Link className="btn btn-outline-dark rounded-pill" to={`/appointments/${appointment.id}`}>View Details</Link></article>;
}

export function AppointmentDetails() {
  const { id } = useParams();
  const appointment = appointments.find((item) => item.id === id) || appointments[0];
  return <><Navbar /><main className="page-content"><Link className="back-link" to="/appointments">← Back to My Appointments</Link><div className="details-card"><div className={`appointment-poster poster ${appointment.color}`}><span>{appointment.movie}</span></div><div><span className="status-pill">{appointment.status}</span><h1>{appointment.movie}</h1><p>{appointment.date} · {appointment.time}</p><p>{appointment.screen} · Seats {appointment.seats}</p><hr /><h3>Appointment Details</h3><p>Booking reference: #{appointment.id}</p><p>Created for Cinema Nova</p>{appointment.status === "Confirmed" && <button className="btn btn-outline-danger">Cancel Appointment</button>}</div></div></main><Footer /></>;
}

export function Profile() {
  return <><Navbar /><main className="page-content profile-page"><h1>Customer Profile</h1><p className="page-subtitle">Manage your personal information</p><form className="profile-card"><label>Full Name<input defaultValue="Abedalrahman Bashiti" /></label><label>Email<input type="email" defaultValue="abedalrahman@example.com" /></label><label>New Password<input type="password" placeholder="Leave blank to keep current password" /></label><button className="btn gold-button">Save Changes</button></form></main><Footer /></>;
}

