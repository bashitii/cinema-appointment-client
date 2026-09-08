# 🎬 Cinema Appointment Frontend (React)

This is the **frontend** for a cinema appointment web application built with **React + Vite**.

## 🎯 Description

The app allows two types of users:

- 👤 **Regular users**:
  - Browse movies and showtimes
  - Select seats and book appointments
  - View and cancel their appointments
  - Edit their profile

- 🛠️ **Admins**:
  - Add, edit, and delete movies (with TMDB auto-fill)
  - Manage screens and generate seats
  - Schedule showtimes
  - View and manage all appointments and users

Login and registration are included with a role-based flow (user/admin). Session is persisted using `localStorage`.

## 🧑‍💻 User Requirements

1. **Login or Register** with a name, email, and password
2. **Regular users** can:
   - Browse movies (now showing / coming soon)
   - Pick a showtime and select seats
   - Confirm and view their booking
   - Cancel an existing appointment
3. **Admin users** can:
   - Add movies manually or auto-fill from TMDB
   - Create screens and generate seats automatically
   - Schedule showtimes for any movie and screen
   - Manage all appointments and users
4. The app remembers login sessions using `localStorage`

## 🛠️ Technologies

- React 19
- Vite
- React Router DOM
- Fetch API
- LocalStorage (for session persistence)

## 🚀 Getting Started

```bash
cd Cinema-appointment-client
npm install
npm run dev
```

The app will run on: `http://localhost:5173`

## 🗂️ Project Structure

```
Cinema-appointment-client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Top navigation bar
│   │   ├── Footer.jsx        # Footer
│   │   ├── MovieCard.jsx     # Reusable movie card
│   │   └── AdminSidebar.jsx  # Admin panel sidebar
│   ├── context/
│   │   └── AuthContext.jsx   # Global auth state (login/logout)
│   ├── pages/
│   │   ├── AuthPages.jsx     # Login, Register, Admin Login
│   │   ├── Home.jsx          # Homepage with now showing + TMDB trending
│   │   ├── MoviePages.jsx    # Movie list and movie details
│   │   ├── BookingPages.jsx  # Seat selection, summary, confirmation
│   │   ├── AppointmentPages.jsx # My appointments, details, profile
│   │   └── AdminPages.jsx    # Full admin panel
│   ├── api.js                # Fetch wrapper (auto-attaches auth headers)
│   ├── utils.js              # Helper functions (format status, time, duration)
│   └── App.jsx               # Routes and protected route guards
├── .env                      # VITE_API_URL
└── vite.config.js            # Dev proxy to backend
```
