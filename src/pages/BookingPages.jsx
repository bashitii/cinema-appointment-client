import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../api";

// ─── Seat Selection ───────────────────────────────────────────────────────────
export function SeatSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showtimeId, movie, showtime } = location.state || {};

  const [seats, setSeats] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showtimeId) {
      setError("No showtime selected. Please pick a showtime from the movie page.");
      setLoading(false);
      return;
    }
    api.get(`/showtimes/${showtimeId}/seats`)
      .then(setSeats)
      .catch(() => setError("Failed to load seats. Please try again."))
      .finally(() => setLoading(false));
  }, [showtimeId]);

  const toggleSeat = (seat) => {
    if (seat.booked) return;
    const label = seat.seat_row + seat.seat_number;
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
    setSelectedIds((prev) =>
      prev.includes(seat.seat_id)
        ? prev.filter((id) => id !== seat.seat_id)
        : [...prev, seat.seat_id]
    );
  };

  const rows = [...new Set(seats.map((s) => s.seat_row))].sort();

  if (!showtimeId && !loading) {
    return (
      <>
        <Navbar />
        <main className="page-content" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <p className="page-subtitle">{error}</p>
          <Link className="btn gold-button" to="/movies">Browse Movies</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-content booking-page">
        <h1 className="booking-title">{movie?.title || "Seat Selection"}</h1>
        <p className="page-subtitle">
          {showtime ? formatTime(showtime.start_time) : ""} · {showtime?.screen_name}
        </p>
        {loading ? (
          <p className="page-subtitle" style={{ textAlign: "center", padding: "3rem" }}>Loading seats...</p>
        ) : error ? (
          <p className="page-subtitle" style={{ textAlign: "center", color: "#ff6b6b" }}>{error}</p>
        ) : (
          <div className="booking-layout">
            <section className="seat-area">
              <p className="screen-label">SCREEN</p>
              <div className="screen-bar"></div>
              <div className="seats">
                {rows.map((row) => (
                  <div className="seat-row" key={row}>
                    <span>{row}</span>
                    {seats
                      .filter((s) => s.seat_row === row)
                      .map((seat) => {
                        const label = seat.seat_row + seat.seat_number;
                        const isSelected = selectedLabels.includes(label);
                        return (
                          <button
                            key={seat.seat_id}
                            onClick={() => toggleSeat(seat)}
                            className={`seat ${seat.booked ? "booked" : isSelected ? "selected" : ""}`}
                          >
                            {seat.booked ? "×" : label}
                          </button>
                        );
                      })}
                  </div>
                ))}
              </div>
              <div className="seat-legend">
                <span><i></i>Available</span>
                <span><i className="selected"></i>Selected</span>
                <span><i className="booked"></i>Booked</span>
              </div>
            </section>
            <div>
              <aside className="booking-panel">
                <h3>Booking Summary</h3>
                <hr />
                <small>Movie</small><b>{movie?.title || "—"}</b>
                <small>Showtime</small><b>{showtime ? formatTime(showtime.start_time) : "—"}</b>
                <small>Screen</small><b>{showtime?.screen_name || "—"}</b>
                <small>Selected Seats</small>
                <b>{selectedLabels.length ? selectedLabels.join(", ") : "No seats selected"}</b>
              </aside>
              <button
                disabled={!selectedLabels.length}
                onClick={() =>
                  navigate("/booking/summary", {
                    state: {
                      showtimeId,
                      movie,
                      showtime,
                      selectedSeats: selectedLabels,
                      selectedSeatIds: selectedIds,
                    },
                  })
                }
                className="btn gold-button w-100 mt-3"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

// ─── Booking Summary ──────────────────────────────────────────────────────────
export function BookingSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showtimeId, movie, showtime, selectedSeats, selectedSeatIds } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.post("/appointments", {
        showtime_id: showtimeId,
        seat_ids: selectedSeatIds,
      });
      navigate("/confirmation", {
        state: {
          appointment: data.appointment,
          movie,
          showtime,
          seats: selectedSeats,
        },
      });
    } catch (err) {
      setError(err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!showtimeId) {
    return (
      <>
        <Navbar />
        <main className="page-content" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <p>No booking in progress.</p>
          <Link className="btn gold-button mt-3" to="/movies">Browse Movies</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-content summary-page">
        <Link className="back-link" to="/booking" state={location.state}>
          ← Back to Seat Selection
        </Link>
        <h1 className="text-center">Review Your Booking</h1>
        <div className="confirmation-card">
          <div className="mini-poster poster poster-dune">
            <span>{movie?.title}</span>
          </div>
          <div>
            <h2>{movie?.title}</h2>
            <p>{formatDate(showtime?.start_time)}</p>
            <p>{showtime?.screen_name} · Seats {selectedSeats?.join(", ")}</p>
            <span className="status-pill">
              {selectedSeats?.length} Seat{selectedSeats?.length !== 1 ? "s" : ""}
            </span>
          </div>
          <hr />
          <div className="summary-lines">
            <span>Booking status</span><b>Ready to confirm</b>
            <span>Total seats</span><b>{selectedSeats?.length} selected</b>
          </div>
          {error && (
            <p style={{ color: "#ff6b6b", marginTop: "1rem", textAlign: "center" }}>{error}</p>
          )}
          <button
            onClick={handleConfirm}
            className="btn gold-button w-100 mt-4"
            disabled={loading}
          >
            {loading ? "Confirming..." : "Confirm Appointment"}
          </button>
        </div>
      </main>
    </>
  );
}

// ─── Booking Confirmation ─────────────────────────────────────────────────────
export function BookingConfirmation() {
  const location = useLocation();
  const { appointment, movie, showtime, seats } = location.state || {};

  return (
    <>
      <Navbar />
      <main className="page-content confirmation-page">
        <div className="confirmation-icon">✓</div>
        <h1>Appointment Confirmed!</h1>
        <p>Your cinema appointment has been created successfully.</p>
        <div className="confirmation-card text-start">
          <h3>Booking #{appointment?.appointment_id || "—"}</h3>
          <hr />
          <p><b>{movie?.title || "—"}</b></p>
          <p>{formatDate(showtime?.start_time)} · {showtime?.screen_name}</p>
          <p>Seats: <b>{seats?.join(", ") || "—"}</b></p>
        </div>
        <Link className="btn gold-button mt-4" to="/appointments">
          View My Appointments
        </Link>
      </main>
    </>
  );
}

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}
