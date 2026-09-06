import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthCard({ type }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const isRegister = type === "register";
  const isAdmin = type === "admin";

  const title = isRegister ? "Create Account" : isAdmin ? "Admin Login" : "Welcome Back";
  const subtitle = isRegister
    ? "Join to start booking your favorite movies"
    : isAdmin
    ? "Login to manage your cinema"
    : "Login to manage your bookings";

  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister && form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(form.full_name, form.email, form.password);
        navigate("/login");
      } else {
        const user = await login(form.email, form.password);
        if (isAdmin && user.role !== "admin") {
          setError("Access denied: this is not an admin account");
          return;
        }
        navigate(user.role === "admin" ? "/admin" : "/movies");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link className="brand auth-brand" to="/"><span></span>CINEMA <strong>NOVA</strong></Link>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {error && (
          <div style={{
            background: "rgba(255,60,60,0.12)",
            border: "1px solid rgba(255,60,60,0.35)",
            color: "#ff6b6b",
            padding: "0.65rem 1rem",
            borderRadius: "8px",
            fontSize: "0.875rem",
            marginBottom: "0.5rem"
          }}>
            {error}
          </div>
        )}
        {isRegister && (
          <label>Full Name
            <input required name="full_name" placeholder="e.g. Abedalrahman Bashiti"
              value={form.full_name} onChange={handleChange} />
          </label>
        )}
        <label>Email
          <input required type="email" name="email" placeholder="you@example.com"
            value={form.email} onChange={handleChange} />
        </label>
        <label>Password
          <input required type="password" name="password" placeholder="••••••••"
            value={form.password} onChange={handleChange} />
        </label>
        {isRegister && (
          <label>Confirm Password
            <input required type="password" name="confirm" placeholder="••••••••"
              value={form.confirm} onChange={handleChange} />
          </label>
        )}
        <button className="btn gold-button w-100" type="submit" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
        {isAdmin ? (
          <Link className="text-link" to="/login">Customer login</Link>
        ) : (
          <Link className="btn btn-outline-dark w-100 mt-3" to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Already have an account? Login" : "Create Account"}
          </Link>
        )}
      </form>
    </div>
  );
}

export function Register() { return <AuthCard type="register" />; }
export function Login() { return <AuthCard type="login" />; }
export function AdminLogin() { return <AuthCard type="admin" />; }
