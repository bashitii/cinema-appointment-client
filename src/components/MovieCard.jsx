import { Link } from "react-router-dom";
import { formatStatus, formatDuration } from "../utils";

const FALLBACK_COLORS = [
  "poster-dune", "poster-avatar", "poster-batman",
  "poster-interstellar", "poster-spider", "poster-inside"
];

function MovieCard({ movie, compact = false }) {
  const fallback = FALLBACK_COLORS[((movie.movie_id || 1) - 1) % FALLBACK_COLORS.length];

  return (
    <article className={`movie-card ${compact ? "compact" : ""}`}>
      {movie.poster_url ? (
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="poster"
          style={{ objectFit: "cover", width: "100%", aspectRatio: "2/3" }}
          onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
        />
      ) : null}
      <div
        className={`poster ${fallback}`}
        style={movie.poster_url ? { display: "none" } : {}}
      >
        <span>{movie.title}</span>
      </div>
      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        {compact ? (
          <span className="coming-pill">Coming Soon</span>
        ) : (
          <>
            <p>{movie.genre} · {formatDuration(movie.duration)}</p>
            <div className="movie-meta">
              <span>★ {movie.imdb_rating || "TBD"}</span>
              <span className="status-pill">{formatStatus(movie.status)}</span>
            </div>
            <Link
              className="btn btn-outline-dark btn-sm rounded-pill w-100"
              to={`/movies/${movie.movie_id}`}
            >
              View Details
            </Link>
          </>
        )}
      </div>
    </article>
  );
}

export default MovieCard;
