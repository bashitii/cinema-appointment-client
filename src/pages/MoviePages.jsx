import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { movies, showtimes } from "../data";

export function Movies() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const visibleMovies = useMemo(() => movies.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()) && (genre === "All" || movie.genre === genre)), [query, genre]);
  return <><Navbar /><main className="page-content"><h1 className="page-title">Movies</h1><p className="page-subtitle">Browse everything playing and coming soon</p><div className="filter-bar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="🔍 Search movies..." /><select value={genre} onChange={(event) => setGenre(event.target.value)}><option>All</option><option>Sci-Fi</option><option>Action</option><option>Animation</option></select><select><option>Status</option><option>Now Showing</option><option>Coming Soon</option></select></div><div className="movie-grid">{visibleMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div></main><Footer /></>;
}

export function MovieDetails() {
  const { id } = useParams();
  const movie = movies.find((item) => item.id === Number(id)) || movies[0];
  const [day, setDay] = useState("Fri 21");
  return <><Navbar /><main className="page-content"><Link className="back-link" to="/movies">← Back to Movies</Link><section className="details-layout"><div className={`details-poster poster ${movie.color}`}><span>{movie.title}</span></div><div className="details-copy"><span className="status-pill">{movie.status}</span><h1>{movie.title}</h1><p className="movie-large-meta">{movie.genre} · {movie.duration} · ★ {movie.rating || "Coming soon"}</p><p>{movie.description}</p><h2>Choose a Showtime</h2><div className="day-buttons">{["Fri 21", "Sat 22", "Sun 23"].map((item) => <button key={item} onClick={() => setDay(item)} className={day === item ? "selected" : ""}>{item}<small>Aug</small></button>)}</div><div className="showtime-list">{showtimes.map((time) => <Link key={time} to="/booking" className="showtime-card"><span>{time}</span><small>Screen 1 · Available seats</small></Link>)}</div></div></section></main><Footer /></>;
}

