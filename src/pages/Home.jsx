import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { api } from "../api";
import { formatStatus, formatDuration, TMDB_GENRE_MAP } from "../utils";

const TMDB_IMAGE_W500 = "https://image.tmdb.org/t/p/w500";
const TMDB_IMAGE_W92  = "https://image.tmdb.org/t/p/w92";

function TMDBMovieCard({ movie }) {
  const genre = TMDB_GENRE_MAP[movie.genre_ids?.[0]] || "Film";
  const posterUrl = movie.poster_path ? `${TMDB_IMAGE_W500}${movie.poster_path}` : null;

  return (
    <article className="movie-card tmdb-card">
      {posterUrl ? (
        <img src={posterUrl} alt={movie.title} className="poster"
          style={{ objectFit: "cover", width: "100%", aspectRatio: "2/3" }} />
      ) : (
        <div className="poster poster-dune"><span>{movie.title}</span></div>
      )}
      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        <p>{genre} · {movie.release_date?.slice(0, 4)}</p>
        <div className="movie-meta">
          <span>★ {movie.vote_average?.toFixed(1)}</span>
          <span className="status-pill" style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>TMDB</span>
        </div>
      </div>
    </article>
  );
}

function Home() {
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [loadingTmdb, setLoadingTmdb] = useState(true);
  const [heroPoster, setHeroPoster] = useState(null);

  useEffect(() => {
    api.get("/movies")
      .then(setMovies)
      .catch(() => setMovies([]))
      .finally(() => setLoadingMovies(false));

    api.get("/tmdb/popular")
      .then((data) => setTmdbMovies(data.results?.slice(0, 6) || []))
      .catch(() => setTmdbMovies([]))
      .finally(() => setLoadingTmdb(false));
  }, []);

  const featured = movies.find((m) => m.status === "now_showing") || movies[0];
  const nowShowing = movies.filter((m) => m.status === "now_showing").slice(0, 4);
  const comingSoon = movies.filter((m) => m.status === "coming_soon");

  // Fetch TMDB poster for the hero featured movie
  useEffect(() => {
    if (!featured?.title) return;
    // First check if movie already has a poster_url
    if (featured.poster_url) {
      setHeroPoster(featured.poster_url);
      return;
    }
    api.get(`/tmdb/search?query=${encodeURIComponent(featured.title)}`)
      .then((data) => {
        const first = data.results?.[0];
        if (first?.poster_path) {
          setHeroPoster(`${TMDB_IMAGE_W500}${first.poster_path}`);
        }
      })
      .catch(() => {});
  }, [featured?.title, featured?.poster_url]);

  return (
    <>
      <Navbar />
      <section className="home-hero">
        <div className="hero-copy">
          <span className="featured-pill">FEATURED</span>
          <h1>{featured?.title || "Cinema Nova"}</h1>
          <p className="hero-info">
            {featured?.genre}&nbsp;|&nbsp;{formatDuration(featured?.duration)}
          </p>
          <p>{featured?.description}</p>
          <div className="hero-actions">
            <Link className="btn gold-button" to="/movies">Book Now</Link>
            <Link className="btn dark-outline" to="/movies">View Movies</Link>
          </div>
          <small>In theaters now</small>
        </div>
        {/* ── Hero Poster from TMDB ── */}
        <div className="hero-art" style={{ overflow: "hidden", borderRadius: "16px", background: "transparent" }}>
          {heroPoster ? (
            <img
              src={heroPoster}
              alt={featured?.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "16px",
                display: "block",
              }}
            />
          ) : (
            <>🎬<br /><span>Poster Art</span></>
          )}
        </div>
      </section>

      <main className="page-content home-content">
        {loadingMovies ? (
          <p className="page-subtitle" style={{ textAlign: "center", padding: "3rem" }}>Loading movies...</p>
        ) : (
          <>
            {nowShowing.length > 0 && (
              <section>
                <h2>Now Showing</h2>
                <p className="page-subtitle">Grab your seats for the newest releases</p>
                <div className="movie-grid">
                  {nowShowing.map((movie) => <MovieCard key={movie.movie_id} movie={movie} />)}
                </div>
              </section>
            )}
            {comingSoon.length > 0 && (
              <section className="mt-5">
                <h2>Coming Soon</h2>
                <div className="movie-grid coming-grid">
                  {comingSoon.map((movie) => <MovieCard key={movie.movie_id} movie={movie} compact />)}
                </div>
              </section>
            )}
          </>
        )}

        {/* ── TMDB Trending Section ── */}
        <section className="mt-5">
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.25rem" }}>
            <h2 style={{ margin: 0 }}>Trending Worldwide</h2>
            <span style={{
              fontSize: "0.75rem",
              background: "rgba(99,102,241,0.2)",
              color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.3)",
              padding: "2px 10px",
              borderRadius: "20px",
              fontWeight: 600,
            }}>via TMDB</span>
          </div>
          <p className="page-subtitle">The most popular movies in cinemas around the world right now</p>
          {loadingTmdb ? (
            <p className="page-subtitle" style={{ textAlign: "center", padding: "2rem" }}>Fetching from TMDB...</p>
          ) : (
            <div className="movie-grid">
              {tmdbMovies.map((movie) => <TMDBMovieCard key={movie.id} movie={movie} />)}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
