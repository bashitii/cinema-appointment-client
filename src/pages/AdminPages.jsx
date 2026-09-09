import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { api } from "../api";

const TMDB_IMAGE = "https://image.tmdb.org/t/p/w92";

const TMDB_GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 18: "Drama", 14: "Fantasy", 27: "Horror",
  10749: "Romance", 878: "Sci-Fi", 53: "Thriller", 37: "Western",
  10751: "Family", 9648: "Mystery", 36: "History",
};

// ─── Shared Layout ────────────────────────────────────────────────────────────
function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
        {children}
      </main>
    </div>
  );
}

function Status({ value }) {
  return (
    <span className={`status-pill status-${(value || "").toLowerCase().replace(/\s+/g, "-")}`}>
      {value}
    </span>
  );
}

function SimpleTable({ headings, rows }) {
  if (!rows.length)
    return <p className="page-subtitle" style={{ padding: "1.5rem 0" }}>No records found.</p>;
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="table mb-0">
          <thead><tr>{headings.map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [stats, setStats] = useState({ movies: 0, showtimes: 0, appointments: 0, users: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/movies"),
      api.get("/showtimes"),
      api.get("/appointments"),
      api.get("/users"),
    ])
      .then(([movies, showtimes, appointments, users]) => {
        setStats({
          movies: movies.length,
          showtimes: showtimes.length,
          appointments: appointments.length,
          users: users.length,
        });
        setRecent(appointments.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your cinema operations">
      <div className="stat-grid">
        {[
          ["Total Movies", stats.movies],
          ["Total Showtimes", stats.showtimes],
          ["Total Appointments", stats.appointments],
          ["Total Users", stats.users],
        ].map(([label, value]) => (
          <div className="stat-card" key={label}>
            <small>{label}</small>
            <b>{value}</b>
            <i></i>
          </div>
        ))}
      </div>
      <h2>Recent Appointments</h2>
      {loading ? (
        <p className="page-subtitle">Loading...</p>
      ) : (
        <SimpleTable
          headings={["Customer", "Movie", "Date", "Screen", "Seats", "Status"]}
          rows={recent.map((a) => [
            a.full_name,
            a.title,
            fmtDate(a.start_time),
            a.screen_name,
            a.seats || "—",
            <Status value={a.status} />,
          ])}
        />
      )}
      <h2 className="mt-5">Quick Actions</h2>
      <div className="quick-actions">
        <Link className="btn btn-outline-dark" to="/admin/movies/new">+ Add Movie</Link>
        <Link className="btn btn-outline-dark" to="/admin/showtimes/new">+ Add Showtime</Link>
        <Link className="btn btn-outline-dark" to="/admin/appointments">View Appointments</Link>
      </div>
    </AdminLayout>
  );
}

// ─── Movies ───────────────────────────────────────────────────────────────────
export function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/movies").then(setMovies).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    try {
      await api.delete(`/movies/${id}`);
      setMovies((prev) => prev.filter((m) => m.movie_id !== id));
    } catch (err) { alert(err.message); }
  };

  const visible = movies.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Movies" subtitle="Add, edit, and organise the cinema movie list">
      <div className="admin-toolbar">
        <input
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Link className="btn gold-button" to="/admin/movies/new">+ Add Movie</Link>
      </div>
      {loading ? <p className="page-subtitle">Loading...</p> : (
        <SimpleTable
          headings={["Movie", "Genre", "Duration", "Status", "Actions"]}
          rows={visible.map((m) => [
            m.title, m.genre, m.duration,
            <Status value={m.status} />,
            <>
              <Link className="table-link" to={`/admin/movies/${m.movie_id}/edit`}>Edit</Link>{" "}
              <button className="table-link danger" onClick={() => handleDelete(m.movie_id)}>Delete</button>
            </>,
          ])}
        />
      )}
    </AdminLayout>
  );
}

// ─── Movie Form (with TMDB search auto-fill) ──────────────────────────────────
export function MovieForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "", description: "", genre: "Sci-Fi",
    duration: "", release_date: "", poster_url: "", status: "Now Showing",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── TMDB search state ──
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [showTmdb, setShowTmdb] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/movies/${id}`).then((movie) => {
        setForm({
          title: movie.title || "",
          description: movie.description || "",
          genre: movie.genre || "Sci-Fi",
          duration: movie.duration || "",
          release_date: movie.release_date ? movie.release_date.split("T")[0] : "",
          poster_url: movie.poster_url || "",
          status: movie.status === "now_showing"  ? "Now Showing" : "Coming Soon",
        });
      }).catch(() => {});
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Search TMDB
  const handleTmdbSearch = async (e) => {
    e.preventDefault();
    if (!tmdbQuery.trim()) return;
    setTmdbLoading(true);
    setTmdbResults([]);
    try {
      const data = await api.get(`/tmdb/search?query=${encodeURIComponent(tmdbQuery)}`);
      setTmdbResults(data.results?.slice(0, 8) || []);
    } catch {
      setTmdbResults([]);
    } finally {
      setTmdbLoading(false);
    }
  };

  // Auto-fill form from TMDB movie details
  const handlePickTmdb = async (tmdbMovie) => {
    try {
      const details = await api.get(`/tmdb/movie/${tmdbMovie.id}`);
      const genre = details.genres?.[0]?.name || TMDB_GENRE_MAP[tmdbMovie.genre_ids?.[0]] || "Drama";
      const runtimeMins = details.runtime || 0;
      const hours = Math.floor(runtimeMins / 60);
      const mins = runtimeMins % 60;
      const duration = runtimeMins ? `${hours}h ${mins}m` : "";
      const posterUrl = details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : "";

      setForm((f) => ({
        ...f,
        title: details.title || tmdbMovie.title || "",
        description: details.overview || "",
        genre: genre,
        duration: duration,
        release_date: details.release_date || "",
        poster_url: posterUrl,
      }));

      setShowTmdb(false);
      setTmdbResults([]);
      setTmdbQuery("");
    } catch {
      alert("Failed to load TMDB movie details.");
    }
  };

  // Converts "2h 46m" or "166" or 166 → integer minutes
  function parseDuration(d) {
    if (!d) return null;
    if (typeof d === "number") return d;
    const str = String(d).trim();
    // Already a plain number
    if (/^\d+$/.test(str)) return parseInt(str);
    // "2h 46m" or "2h" or "46m"
    const hMatch = str.match(/(\d+)\s*h/);
    const mMatch = str.match(/(\d+)\s*m/);
    const hours = hMatch ? parseInt(hMatch[1]) : 0;
    const mins  = mMatch ? parseInt(mMatch[1]) : 0;
    return hours * 60 + mins || null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Convert duration "2h 46m" → minutes integer for the DB
      const durationMins = parseDuration(form.duration);
      // Convert status to snake_case for DB constraint
      const statusDb = form.status === "Now Showing" ? "now_showing" : "coming_soon";
      const payload = { ...form, duration: durationMins, status: statusDb };

      if (isEdit) {
        await api.put(`/movies/${id}`, payload);
      } else {
        await api.post("/movies", payload);
      }
      navigate("/admin/movies");
    } catch (err) {
      setError(err.message || "Failed to save movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={isEdit ? "Edit Movie" : "Add Movie"}>
      <Link className="back-link" to="/admin/movies">← Back to Manage Movies</Link>

      {/* ── TMDB Search Panel ── */}
      <div style={{
        background: "rgba(99,102,241,0.08)",
        border: "1px solid rgba(99,102,241,0.25)",
        borderRadius: "12px",
        padding: "1.25rem",
        marginBottom: "1.5rem",
        marginTop: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div>
            <b style={{ fontSize: "0.95rem" }}>🎬 Auto-fill from TMDB</b>
            <span style={{
              marginLeft: "0.6rem",
              fontSize: "0.7rem",
              background: "rgba(99,102,241,0.25)",
              color: "#a5b4fc",
              padding: "2px 8px",
              borderRadius: "12px",
              fontWeight: 600
            }}>3rd Party API</span>
          </div>
          <button
            type="button"
            onClick={() => setShowTmdb(!showTmdb)}
            style={{
              background: showTmdb ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.15)",
              color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: "8px",
              padding: "6px 14px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {showTmdb ? "Hide Search" : "Search TMDB →"}
          </button>
        </div>

        {showTmdb && (
          <>
            <p style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "0.75rem" }}>
              Search for a movie on The Movie Database. Clicking a result will auto-fill all form fields below.
            </p>
            <form onSubmit={handleTmdbSearch} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <input
                value={tmdbQuery}
                onChange={(e) => setTmdbQuery(e.target.value)}
                placeholder="e.g. Dune, Interstellar, The Batman..."
                style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "inherit", fontSize: "0.9rem" }}
              />
              <button
                type="submit"
                disabled={tmdbLoading}
                style={{
                  background: "rgba(99,102,241,0.3)",
                  color: "#a5b4fc",
                  border: "1px solid rgba(99,102,241,0.4)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                {tmdbLoading ? "Searching..." : "Search"}
              </button>
            </form>

            {tmdbResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "320px", overflowY: "auto" }}>
                {tmdbResults.map((movie) => (
                  <button
                    key={movie.id}
                    type="button"
                    onClick={() => handlePickTmdb(movie)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.15s",
                      color: "inherit",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  >
                    {movie.poster_path ? (
                      <img
                        src={`${TMDB_IMAGE}${movie.poster_path}`}
                        alt={movie.title}
                        style={{ width: "36px", height: "54px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ width: "36px", height: "54px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{movie.title}</div>
                      <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                        {movie.release_date?.slice(0, 4)} · ★ {movie.vote_average?.toFixed(1)}
                      </div>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: "0.75rem", opacity: 0.5 }}>Click to use →</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Movie Form ── */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Title<input required name="title" value={form.title} onChange={handleChange} /></label>
        <label>Description<textarea name="description" value={form.description} onChange={handleChange} /></label>
        <div className="form-row">
          <label>Genre
            <select name="genre" value={form.genre} onChange={handleChange}>
              <option>Sci-Fi</option><option>Action</option><option>Animation</option>
              <option>Drama</option><option>Comedy</option><option>Horror</option>
              <option>Thriller</option><option>Adventure</option><option>Fantasy</option>
              <option>Romance</option><option>Family</option>
            </select>
          </label>
          <label>Duration<input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 2h 20m" /></label>
        </div>
        <div className="form-row">
          <label>Release Date<input type="date" name="release_date" value={form.release_date} onChange={handleChange} /></label>
          <label>Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Now Showing</option><option>Coming Soon</option>
            </select>
          </label>
        </div>
        <label>Poster URL
          <input name="poster_url" value={form.poster_url} onChange={handleChange} placeholder="Auto-filled from TMDB or paste a URL" />
        </label>
        {form.poster_url && (
          <img
            src={form.poster_url}
            alt="Poster preview"
            style={{ width: "80px", borderRadius: "6px", marginBottom: "0.5rem" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}
        {error && <p style={{ color: "#ff6b6b", fontSize: "0.875rem" }}>{error}</p>}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button className="btn gold-button" disabled={loading}>
            {loading ? "Saving..." : "Save Movie"}
          </button>
          <Link className="btn btn-outline-dark" to="/admin/movies">Cancel</Link>
        </div>
      </form>
    </AdminLayout>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────
export function AdminScreens() {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newScreen, setNewScreen] = useState({ screen_name: "", capacity: "" });

  useEffect(() => {
    api.get("/screens").then(setScreens).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const data = await api.post("/screens", { ...newScreen, capacity: Number(newScreen.capacity) });
      setScreens((prev) => [...prev, data.screen]);
      setShowForm(false);
      setNewScreen({ screen_name: "", capacity: "" });
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this screen?")) return;
    try {
      await api.delete(`/screens/${id}`);
      setScreens((prev) => prev.filter((s) => s.screen_id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <AdminLayout title="Manage Screens" subtitle="Manage cinema rooms and their capacity">
      <div className="admin-toolbar">
        <button className="btn gold-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Screen"}
        </button>
      </div>
      {showForm && (
        <form className="admin-form" onSubmit={handleAdd} style={{ marginBottom: "1.5rem" }}>
          <div className="form-row">
            <label>Screen Name
              <input required name="screen_name" value={newScreen.screen_name}
                onChange={(e) => setNewScreen((f) => ({ ...f, screen_name: e.target.value }))}
                placeholder="e.g. Screen 4" />
            </label>
            <label>Capacity
              <input required type="number" name="capacity" value={newScreen.capacity}
                onChange={(e) => setNewScreen((f) => ({ ...f, capacity: e.target.value }))}
                placeholder="e.g. 80" />
            </label>
          </div>
          <button className="btn gold-button" type="submit">Add Screen</button>
        </form>
      )}
      {loading ? <p className="page-subtitle">Loading...</p> : (
        <SimpleTable
          headings={["Screen Name", "Capacity", "Actions"]}
          rows={screens.map((s) => [
            s.screen_name, s.capacity,
            <button className="table-link danger" onClick={() => handleDelete(s.screen_id)}>Delete</button>,
          ])}
        />
      )}
    </AdminLayout>
  );
}

// ─── Seats ────────────────────────────────────────────────────────────────────
export function AdminSeats() {
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState("");
  const [seats, setSeats] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/screens").then((data) => {
      setScreens(data);
      if (data.length > 0) setSelectedScreen(String(data[0].screen_id));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedScreen) {
      setMessage("");
      api.get(`/seats/${selectedScreen}`).then(setSeats).catch(() => setSeats([]));
    }
  }, [selectedScreen]);

  const currentScreen = screens.find((s) => String(s.screen_id) === selectedScreen);

  const handleGenerate = async () => {
    if (!selectedScreen) return;
    const alreadyHas = seats.length > 0;
    const confirmed = alreadyHas
      ? window.confirm(`This screen already has ${seats.length} seat(s). Regenerate and replace them all?`)
      : true;
    if (!confirmed) return;

    setGenerating(true);
    setMessage("");
    try {
      const data = await api.post(`/screens/${selectedScreen}/generate-seats`);
      setMessage(`✓ ${data.seats_created} seats generated successfully`);
      const updated = await api.get(`/seats/${selectedScreen}`);
      setSeats(updated);
    } catch (err) {
      setMessage(`✗ ${err.message || "Failed to generate seats"}`);
    } finally {
      setGenerating(false);
    }
  };

  const rows = [...new Set(seats.map((s) => s.seat_row))].sort();

  return (
    <AdminLayout title="Manage Seats" subtitle="View and generate seats for each screen">
      <div className="admin-toolbar">
        <select value={selectedScreen} onChange={(e) => setSelectedScreen(e.target.value)}>
          {screens.map((s) => (
            <option key={s.screen_id} value={s.screen_id}>
              {s.screen_name} (capacity: {s.capacity})
            </option>
          ))}
        </select>
        <button
          className="btn gold-button"
          onClick={handleGenerate}
          disabled={generating || !selectedScreen}
        >
          {generating
            ? "Generating..."
            : seats.length > 0
            ? "Regenerate Seats"
            : "Generate Seats"}
        </button>
      </div>

      {message && (
        <p style={{
          color: message.startsWith("✓") ? "#4ade80" : "#ff6b6b",
          fontSize: "0.875rem",
          marginBottom: "1rem",
        }}>
          {message}
        </p>
      )}

      {seats.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2.5rem", opacity: 0.6 }}>
          <p>No seats for this screen yet.</p>
          {currentScreen && (
            <p style={{ fontSize: "0.85rem" }}>
              Click <b>Generate Seats</b> to create {currentScreen.capacity} seats automatically.
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="page-subtitle" style={{ marginBottom: "1rem" }}>
            {seats.length} seat{seats.length !== 1 ? "s" : ""} · {rows.length} row{rows.length !== 1 ? "s" : ""}
          </p>
          <div style={{ overflowX: "auto" }}>
            {rows.map((row) => (
              <div key={row} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <span style={{ width: "20px", fontWeight: 700, fontSize: "0.8rem", opacity: 0.6 }}>{row}</span>
                {seats
                  .filter((s) => s.seat_row === row)
                  .sort((a, b) => a.seat_number - b.seat_number)
                  .map((seat) => (
                    <div
                      key={seat.seat_id}
                      title={`${seat.seat_row}${seat.seat_number}`}
                      style={{
                        width: "36px",
                        height: "30px",
                        borderRadius: "6px 6px 4px 4px",
                        background: "rgba(212,175,55,0.18)",
                        border: "1px solid rgba(212,175,55,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        color: "#d4af37",
                      }}
                    >
                      {seat.seat_number}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}

// ─── Showtimes ────────────────────────────────────────────────────────────────
export function AdminShowtimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/showtimes").then(setShowtimes).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this showtime?")) return;
    try {
      await api.delete(`/showtimes/${id}`);
      setShowtimes((prev) => prev.filter((s) => s.showtime_id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <AdminLayout title="Manage Showtimes" subtitle="Schedule the movies shown at Cinema Nova">
      <div className="admin-toolbar">
        <Link className="btn gold-button" to="/admin/showtimes/new">+ Add Showtime</Link>
      </div>
      {loading ? <p className="page-subtitle">Loading...</p> : (
        <SimpleTable
          headings={["Movie", "Date", "Time", "Screen", "Actions"]}
          rows={showtimes.map((s) => [
            s.title, fmtDateOnly(s.start_time), fmtTimeOnly(s.start_time), s.screen_name,
            <>
              <Link className="table-link" to={`/admin/showtimes/${s.showtime_id}/edit`}>Edit</Link>{" "}
              <button className="table-link danger" onClick={() => handleDelete(s.showtime_id)}>Delete</button>
            </>,
          ])}
        />
      )}
    </AdminLayout>
  );
}

// ─── Showtime Form ────────────────────────────────────────────────────────────
export function ShowtimeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [form, setForm] = useState({ movie_id: "", screen_id: "", start_time: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/movies"), api.get("/screens")]).then(([m, s]) => {
      setMovies(m);
      setScreens(s);
      if (!isEdit) {
        setForm((f) => ({ ...f, movie_id: m[0]?.movie_id || "", screen_id: s[0]?.screen_id || "" }));
      }
    }).catch(() => {});

    if (isEdit) {
      api.get(`/showtimes/${id}`).then((s) => {
        setForm({
          movie_id: s.movie_id, screen_id: s.screen_id,
          start_time: toLocalInput(s.start_time),
        });
      }).catch(() => {});
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Add minutes to a datetime-local string WITHOUT timezone conversion
  // e.g. "2026-09-09T22:13" + 166 min = "2026-09-10T00:59"
  function addMinsToLocalString(localStr, mins) {
    if (!localStr) return "";
    const [datePart, timePart] = localStr.split("T");
    const [y, mo, d] = datePart.split("-").map(Number);
    const [h, mi] = timePart.split(":").map(Number);
    // Use Date.UTC so no local timezone offset is applied
    const ms = Date.UTC(y, mo - 1, d, h, mi) + mins * 60000;
    const end = new Date(ms);
    const pad = (n) => String(n).padStart(2, "0");
    return `${end.getUTCFullYear()}-${pad(end.getUTCMonth() + 1)}-${pad(end.getUTCDate())}T${pad(end.getUTCHours())}:${pad(end.getUTCMinutes())}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let payload = { ...form };
      // Auto-calculate end_time if not provided
      if (!payload.end_time && payload.start_time) {
        const selectedMovie = movies.find((m) => String(m.movie_id) === String(payload.movie_id));
        const durationMins = selectedMovie?.duration || 120;
        payload.end_time = addMinsToLocalString(payload.start_time, durationMins);
      }
      if (isEdit) { await api.put(`/showtimes/${id}`, payload); }
      else { await api.post("/showtimes", payload); }
      navigate("/admin/showtimes");
    } catch (err) {
      setError(err.message || "Failed to save showtime");
    } finally { setLoading(false); }
  };

  return (
    <AdminLayout title={isEdit ? "Edit Showtime" : "Add Showtime"}>
      <Link className="back-link" to="/admin/showtimes">← Back to Manage Showtimes</Link>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Movie
          <select name="movie_id" value={form.movie_id} onChange={handleChange}>
            {movies.map((m) => <option key={m.movie_id} value={m.movie_id}>{m.title}</option>)}
          </select>
        </label>
        <div className="form-row">
          <label>Start Time<input required type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} /></label>

        </div>
        <label>Screen
          <select name="screen_id" value={form.screen_id} onChange={handleChange}>
            {screens.map((s) => <option key={s.screen_id} value={s.screen_id}>{s.screen_name}</option>)}
          </select>
        </label>
        {error && <p style={{ color: "#ff6b6b", fontSize: "0.875rem" }}>{error}</p>}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button className="btn gold-button" disabled={loading}>{loading ? "Saving..." : "Save Showtime"}</button>
          <Link className="btn btn-outline-dark" to="/admin/showtimes">Cancel</Link>
        </div>
      </form>
    </AdminLayout>
  );
}

// ─── Appointments (Admin) ─────────────────────────────────────────────────────
export function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/appointments").then(setAppointments).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      setAppointments((prev) => prev.map((a) => (a.appointment_id === id ? { ...a, status } : a)));
    } catch (err) { alert(err.message); }
  };

  return (
    <AdminLayout title="Manage Appointments">
      {loading ? <p className="page-subtitle">Loading...</p> : (
        <SimpleTable
          headings={["ID", "Customer", "Movie", "Date", "Screen", "Seats", "Status", "Change Status"]}
          rows={appointments.map((a) => [
            `#${a.appointment_id}`, a.full_name, a.title,
            fmtDate(a.start_time), a.screen_name, a.seats || "—",
            <Status value={a.status} />,
            <select value={a.status}
              onChange={(e) => handleStatusChange(a.appointment_id, e.target.value)}
              style={{ padding: "2px 6px", fontSize: "0.8rem", borderRadius: "6px", cursor: "pointer" }}>
              <option value="confirmed">confirmed</option>
              <option value="cancelled">cancelled</option>
            </select>,
          ])}
        />
      )}
    </AdminLayout>
  );
}

// ─── Users ────────────────────────────────────────────────────────────────────
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users").then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.user_id !== id));
    } catch (err) { alert(err.message); }
  };

  const visible = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(query.toLowerCase()) ||
      u.email?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Users">
      <div className="admin-toolbar">
        <input placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {loading ? <p className="page-subtitle">Loading...</p> : (
        <SimpleTable
          headings={["Name", "Email", "Role", "Registered", "Actions"]}
          rows={visible.map((u) => [
            u.full_name, u.email, u.role,
            u.created_at ? new Date(u.created_at).toLocaleDateString("en-US") : "—",
            <button className="table-link danger" onClick={() => handleDelete(u.user_id)}>Delete</button>,
          ])}
        />
      )}
    </AdminLayout>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function fmtDateOnly(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtTimeOnly(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function toLocalInput(iso) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}
