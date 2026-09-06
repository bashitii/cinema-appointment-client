import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import { Login, Register, AdminLogin } from "./pages/AuthPages";
import { Movies, MovieDetails } from "./pages/MoviePages";
import { SeatSelection, BookingSummary, BookingConfirmation } from "./pages/BookingPages";
import { MyAppointments, AppointmentDetails, Profile } from "./pages/AppointmentPages";
import {
  AdminDashboard, AdminMovies, MovieForm,
  AdminScreens, AdminSeats, AdminShowtimes, ShowtimeForm,
  AdminAppointments, AdminUsers
} from "./pages/AdminPages";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/booking" element={<ProtectedRoute><SeatSelection /></ProtectedRoute>} />
      <Route path="/booking/summary" element={<ProtectedRoute><BookingSummary /></ProtectedRoute>} />
      <Route path="/confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
      <Route path="/appointments/:id" element={<ProtectedRoute><AppointmentDetails /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/movies" element={<AdminRoute><AdminMovies /></AdminRoute>} />
      <Route path="/admin/movies/new" element={<AdminRoute><MovieForm /></AdminRoute>} />
      <Route path="/admin/movies/:id/edit" element={<AdminRoute><MovieForm /></AdminRoute>} />
      <Route path="/admin/screens" element={<AdminRoute><AdminScreens /></AdminRoute>} />
      <Route path="/admin/seats" element={<AdminRoute><AdminSeats /></AdminRoute>} />
      <Route path="/admin/showtimes" element={<AdminRoute><AdminShowtimes /></AdminRoute>} />
      <Route path="/admin/showtimes/new" element={<AdminRoute><ShowtimeForm /></AdminRoute>} />
      <Route path="/admin/showtimes/:id/edit" element={<AdminRoute><ShowtimeForm /></AdminRoute>} />
      <Route path="/admin/appointments" element={<AdminRoute><AdminAppointments /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
