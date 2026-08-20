import { Link } from "react-router-dom";

function MovieCard({ movie, compact = false }) {
  return (
    <article className={`movie-card ${compact ? "compact" : ""}`}>
      <div className={`poster ${movie.color}`}><span>{movie.title}</span></div>
      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        {compact ? <span className="coming-pill">Coming {movie.id === 6 ? "Sept 12" : "Soon"}</span> : <>
          <p>{movie.genre} · {movie.duration}</p>
          <div className="movie-meta"><span>★ {movie.rating}</span><span className="status-pill">{movie.status}</span></div>
          <Link className="btn btn-outline-dark btn-sm rounded-pill w-100" to={`/movies/${movie.id}`}>View Details</Link>
        </>}
      </div>
    </article>
  );
}

export default MovieCard;

