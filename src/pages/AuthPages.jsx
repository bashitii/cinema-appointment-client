import { Link, useNavigate } from "react-router-dom";

function AuthCard({ type }) {
  const navigate = useNavigate();
  const isRegister = type === "register";
  const isAdmin = type === "admin";
  const title = isRegister ? "Create Account" : isAdmin ? "Admin Login" : "Welcome Back";
  const subtitle = isRegister ? "Join to start booking your favorite movies" : isAdmin ? "Login to manage your cinema" : "Login to manage your bookings";
  const submit = (event) => { event.preventDefault(); navigate(isAdmin ? "/admin" : "/movies"); };
  return <div className="auth-page"><Link className="brand auth-brand" to="/"><span></span>CINEMA <strong>NOVA</strong></Link><form className="auth-card" onSubmit={submit}><h1>{title}</h1><p>{subtitle}</p>{isRegister && <label>Full Name<input required placeholder="e.g. Abedalrahman Bashiti" /></label>}<label>Email<input required type="email" placeholder="you@example.com" /></label><label>Password<input required type="password" placeholder="••••••••" /></label>{isRegister && <label>Confirm Password<input required type="password" placeholder="••••••••" /></label>}<button className="btn gold-button w-100" type="submit">{isRegister ? "Register" : "Login"}</button>{isAdmin ? <Link className="text-link" to="/login">Customer login</Link> : <Link className="btn btn-outline-dark w-100 mt-3" to={isRegister ? "/login" : "/register"}>{isRegister ? "Login" : "Create Account"}</Link>}</form></div>;
}

export function Register() { return <AuthCard type="register" />; }
export function Login() { return <AuthCard type="login" />; }
export function AdminLogin() { return <AuthCard type="admin" />; }

