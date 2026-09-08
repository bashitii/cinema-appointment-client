import { useMemo, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { api } from "../api";
import { formatStatus, formatDuration, formatTime, formatDateTime } from "../utils";

// ─── Movie List ───────────────────────────────────────────────────────────────
export function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    api.get("/movies")
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  const genres = ["All", ...new Set(movies.map((m) => m.genre).filter(Boolean))];

  const visibleMovies = useMemo(
    () =>
      movies.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) &&
          (genre === "All" || m.genre === genre) &&
          (status === "All" || m.status === status)
      ),
    [movies, query, genre, status]
  );

  return (
    <>
      <Navbar />
      <main className="page-content">
        <h1 className="page-title">Movies</h1>
        <p className="page-subtitle">Browse everything playing and coming soon</p>
        <div className="filter-bar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search movies..." />
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {genres.map((g) => <option key={g}>{g}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="now_showing">Now Showing</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>
        {loading ? (
          <p className="page-subtitle" style={{ textAlign: "center", padding: "3rem" }}>Loading...</p>
        ) : (
          <div className="movie-grid">
            {visibleMovies.map((movie) => <MovieCard key={movie.movie_id} movie={movie} />)}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

// ─── Movie Details ────────────────────────────────────────────────────────────
export function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/movies/${id}`), api.get("/showtimes")])
      .then(([movieData, allShowtimes]) => {
        setMovie(movieData);
        const filtered = allShowtimes.filter((s) => String(s.movie_id) === String(id));
        setShowtimes(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookShowtime = (showtime) => {
    navigate("/booking", { state: { showtimeId: showtime.showtime_id, movie, showtime } });
  };

  if (loading) return (
    <><Navbar /><main className="page-content"><p className="page-subtitle" style={{ textAlign: "center", padding: "3rem" }}>Loading...</p></main><Footer /></>
  );

  if (!movie) return (
    <><Navbar /><main className="page-content"><Link className="back-link" to="/movies">← Back to Movies</Link><p>Movie not found.</p></main><Footer /></>
  );

  const FALLBACK_COLORS = [
    "poster-dune", "poster-avatar", "poster-batman",
    "poster-interstellar", "poster-spider", "poster-inside"
  ];
  const fallback = FALLBACK_COLORS[((movie.movie_id || 1) - 1) % FALLBACK_COLORS.length];

  return (
    <>
      <Navbar />
      <main className="page-content">
        <Link className="back-link" to="/movies">← Back to Movies</Link>
        <section className="details-layout">
          <div className={`details-poster poster ${fallback}`}>
            {movie.poster_url ? (
              <img src={movie.poster_url} alt={movie.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
            ) : (
              <span>{movie.title}</span>
            )}
          </div>
          <div className="details-copy">
            <span className="status-pill">{formatStatus(movie.status)}</span>
            <h1>{movie.title}</h1>
            <p className="movie-large-meta">
              {movie.genre} · {formatDuration(movie.duration)}
              {movie.imdb_rating ? ` · ★ ${movie.imdb_rating}` : ""}
            </p>
            <p>{movie.description}</p>
            <h2>Choose a Showtime</h2>
            {showtimes.length === 0 ? (
              <p className="page-subtitle">No showtimes scheduled yet.</p>
            ) : (
              <div className="showtime-list">
                {showtimes.map((s) => (
                  <button key={s.showtime_id} onClick={() => handleBookShowtime(s)} className="showtime-card">
                    <span>{formatDateTime(s.start_time)}</span>
                    <small>{s.screen_name} · Available seats</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
