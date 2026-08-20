import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { movies } from "../data";

function Home() {
  return <><Navbar />
    <section className="home-hero"><div className="hero-copy"><span className="featured-pill">FEATURED</span><h1>Dune: Part Two</h1><p className="hero-info">Sci-Fi · Adventure &nbsp;|&nbsp; Rated PG-13 &nbsp;|&nbsp; 2h 46m</p><p>Paul Atreides unites with the Fremen to seek revenge against the conspirators who destroyed his family, facing a choice that will shape the fate of the universe.</p><div className="hero-actions"><Link className="btn gold-button" to="/booking">Book Now</Link><Link className="btn dark-outline" to="/movies">View Movies</Link></div><small>★ 8.5 IMDb &nbsp;·&nbsp; In theaters now</small></div><div className="hero-art">🎬<br /><span>Poster Art</span></div></section>
    <main className="page-content home-content"><section><h2>Now Showing</h2><p className="page-subtitle">Grab your seats for the newest releases</p><div className="movie-grid">{movies.slice(1, 5).map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div></section><section className="mt-5"><h2>Coming Soon</h2><div className="movie-grid coming-grid">{movies.slice(5).map((movie) => <MovieCard key={movie.id} movie={movie} compact />)}</div></section></main>
    <Footer />
  </>;
}

export default Home;

