import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import { Login, Register, AdminLogin } from "./pages/AuthPages";
import { Movies, MovieDetails } from "./pages/MoviePages";
import { SeatSelection, BookingSummary, BookingConfirmation } from "./pages/BookingPages";
import { MyAppointments, AppointmentDetails, Profile } from "./pages/AppointmentPages";
import { AdminDashboard, AdminMovies, MovieForm, AdminScreens, AdminSeats, AdminShowtimes, ShowtimeForm, AdminAppointments, AdminUsers } from "./pages/AdminPages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/booking" element={<SeatSelection />} />
        <Route path="/booking/summary" element={<BookingSummary />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />
        <Route path="/appointments" element={<MyAppointments />} />
        <Route path="/appointments/:id" element={<AppointmentDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/movies" element={<AdminMovies />} />
        <Route path="/admin/movies/new" element={<MovieForm />} />
        <Route path="/admin/movies/:id/edit" element={<MovieForm />} />
        <Route path="/admin/screens" element={<AdminScreens />} />
        <Route path="/admin/seats" element={<AdminSeats />} />
        <Route path="/admin/showtimes" element={<AdminShowtimes />} />
        <Route path="/admin/showtimes/new" element={<ShowtimeForm />} />
        <Route path="/admin/showtimes/:id/edit" element={<ShowtimeForm />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

