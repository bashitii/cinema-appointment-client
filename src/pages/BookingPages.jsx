import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const booked = ["B3", "B4", "C6"];
const rows = ["A", "B", "C", "D"];

function SummaryCard({ selected = ["A4", "A5"] }) {
  return <aside className="booking-panel"><h3>Booking Summary</h3><hr /><small>Movie</small><b>Dune: Part Two</b><small>Showtime</small><b>Fri 21 · 05:00 PM</b><small>Screen</small><b>Screen 1</b><small>Selected Seats</small><b>{selected.length ? selected.join(", ") : "No seats selected"}</b></aside>;
}

export function SeatSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(["A4", "A5"]);
  const toggleSeat = (seat) => { if (!booked.includes(seat)) setSelected((old) => old.includes(seat) ? old.filter((item) => item !== seat) : [...old, seat]); };
  return <><Navbar /><main className="page-content booking-page"><h1 className="booking-title">Dune: Part Two</h1><p className="page-subtitle">Fri 21 · 05:00 PM · Screen 1</p><div className="booking-layout"><section className="seat-area"><p className="screen-label">SCREEN</p><div className="screen-bar"></div><div className="seats">{rows.map((row) => <div className="seat-row" key={row}><span>{row}</span>{Array.from({ length: 8 }, (_, index) => { const seat = `${row}${index + 1}`; return <button key={seat} onClick={() => toggleSeat(seat)} className={`seat ${booked.includes(seat) ? "booked" : selected.includes(seat) ? "selected" : ""}`}>{booked.includes(seat) ? "×" : seat}</button>; })}</div>)}</div><div className="seat-legend"><span><i></i>Available</span><span><i className="selected"></i>Selected</span><span><i className="booked"></i>Booked</span></div></section><div><SummaryCard selected={selected} /><button disabled={!selected.length} onClick={() => navigate("/booking/summary")} className="btn gold-button w-100 mt-3">Continue</button></div></div></main></>;
}

export function BookingSummary() {
  const navigate = useNavigate();
  return <><Navbar /><main className="page-content summary-page"><Link className="back-link" to="/booking">← Back to Seat Selection</Link><h1 className="text-center">Review Your Booking</h1><div className="confirmation-card"><div className="mini-poster poster poster-dune"><span>Dune: Part Two</span></div><div><h2>Dune: Part Two</h2><p>Fri, Aug 21 · 05:00 PM</p><p>Screen 1 · Seats A4, A5</p><span className="status-pill">2 Seats</span></div><hr /><div className="summary-lines"><span>Booking status</span><b>Ready to confirm</b><span>Appointment total</span><b>2 seats selected</b></div><button onClick={() => navigate("/confirmation")} className="btn gold-button w-100 mt-4">Confirm Appointment</button></div></main></>;
}

export function BookingConfirmation() {
  return <><Navbar /><main className="page-content confirmation-page"><div className="confirmation-icon">✓</div><h1>Appointment Confirmed!</h1><p>Your cinema appointment has been created successfully.</p><div className="confirmation-card text-start"><h3>Booking #0142</h3><hr /><p><b>Dune: Part Two</b></p><p>Fri, Aug 21 · 05:00 PM · Screen 1</p><p>Seats: <b>A4, A5</b></p></div><Link className="btn gold-button mt-4" to="/appointments">View My Appointments</Link></main></>;
}

