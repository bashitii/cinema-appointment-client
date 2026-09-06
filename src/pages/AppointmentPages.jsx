import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

// ─── My Appointments ──────────────────────────────────────────────────────────
export function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/appointments")
      .then(setAppointments)
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter((a) => a.status === "confirmed");
  const past = appointments.filter((a) => a.status !== "confirmed");

  return (
    <>
      <Navbar />
      <main className="page-content">
        <h1 className="page-title">My Appointments</h1>
        <p className="page-subtitle">Keep track of your upcoming and past cinema visits</p>
        {loading ? (
          <p className="page-subtitle" style={{ textAlign: "center", padding: "3rem" }}>Loading...</p>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <p className="page-subtitle">You have no appointments yet.</p>
            <Link className="btn gold-button" to="/movies">Browse Movies</Link>
          </div>
        ) : (
          <>
            <h2>Upcoming Appointments</h2>
            {upcoming.length === 0 ? (
              <p className="page-subtitle">No upcoming appointments.</p>
            ) : (
              upcoming.map((a) => <AppointmentCard key={a.appointment_id} appointment={a} />)
            )}
            {past.length > 0 && (
              <>
                <h2 className="mt-5">Previous Appointments</h2>
                {past.map((a) => (
                  <AppointmentCard key={a.appointment_id} appointment={a} />
                ))}
              </>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function AppointmentCard({ appointment }) {
  return (
    <article className="appointment-card">
      <div className="appointment-poster poster poster-dune">
        {appointment.poster_url ? (
          <img
            src={appointment.poster_url}
            alt={appointment.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
          />
        ) : (
          <span>{appointment.title}</span>
        )}
      </div>
      <div className="appointment-info">
        <span className="status-pill">{appointment.status}</span>
        <h3>{appointment.title}</h3>
        <p>{formatDateTime(appointment.start_time)} · {appointment.screen_name}</p>
        <p>Seats: <b>{appointment.seats || "—"}</b></p>
      </div>
      <Link
        className="btn btn-outline-dark rounded-pill"
        to={`/appointments/${appointment.appointment_id}`}
      >
        View Details
      </Link>
    </article>
  );
}

// ─── Appointment Details ──────────────────────────────────────────────────────
export function AppointmentDetails() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/appointments/${id}`)
      .then(setAppointment)
      .catch(() => setAppointment(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.put(`/appointments/${id}/cancel`);
      setAppointment((a) => ({ ...a, status: "cancelled" }));
      setShowConfirm(false);
    } catch (err) {
      setError(err.message || "Failed to cancel appointment");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-content">
          <p className="page-subtitle" style={{ textAlign: "center", padding: "3rem" }}>Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!appointment) {
    return (
      <>
        <Navbar />
        <main className="page-content">
          <Link className="back-link" to="/appointments">← Back to My Appointments</Link>
          <p className="page-subtitle" style={{ padding: "2rem 0" }}>Appointment not found.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-content">
        <Link className="back-link" to="/appointments">← Back to My Appointments</Link>
        <div className="details-card">
          <div className="appointment-poster poster poster-dune">
            {appointment.poster_url ? (
              <img
                src={appointment.poster_url}
                alt={appointment.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
              />
            ) : (
              <span>{appointment.title}</span>
            )}
          </div>
          <div>
            <span className="status-pill">{appointment.status}</span>
            <h1>{appointment.title}</h1>
            <p>{formatDateTime(appointment.start_time)}</p>
            <p>{appointment.screen_name} · Seats {appointment.seats || "—"}</p>
            <hr />
            <h3>Appointment Details</h3>
            <p>Booking reference: #{appointment.appointment_id}</p>
            <p>Created for Cinema Nova</p>

            {appointment.status === "confirmed" && !showConfirm && (
              <button
                className="btn btn-cancel-appointment"
                onClick={() => setShowConfirm(true)}
              >
                Cancel Appointment
              </button>
            )}

            {showConfirm && (
              <div className="cancel-confirm-box">
                <p className="cancel-confirm-question">
                  Are you sure you want to cancel this appointment?
                </p>
                <div className="cancel-confirm-actions">
                  <button
                    className="btn btn-confirm-yes"
                    onClick={handleCancel}
                    disabled={cancelling}
                  >
                    {cancelling ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                  <button
                    className="btn btn-confirm-no"
                    onClick={() => setShowConfirm(false)}
                  >
                    No, Keep Appointment
                  </button>
                </div>
              </div>
            )}

            {appointment.status === "cancelled" && (
              <p className="cancel-done-msg">Your appointment has been cancelled.</p>
            )}
            {error && <p style={{ color: "#ff6b6b", marginTop: "0.5rem" }}>{error}</p>}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const data = await api.put("/auth/profile", form);
      updateUser(data.user);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-content profile-page">
        <h1>Customer Profile</h1>
        <p className="page-subtitle">Manage your personal information</p>
        <form className="profile-card" onSubmit={handleSubmit}>
          <label>Full Name
            <input name="full_name" value={form.full_name} onChange={handleChange} />
          </label>
          <label>Email
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </label>
          {error && <p style={{ color: "#ff6b6b", fontSize: "0.875rem" }}>{error}</p>}
          {success && <p style={{ color: "#4ade80", fontSize: "0.875rem" }}>Profile updated successfully!</p>}
          <button className="btn gold-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}
