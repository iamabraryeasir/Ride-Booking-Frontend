# 🚖 RideMate – Ride Hailing Platform (Frontend)

🔗 **Live Demo**: [https://ride-booking-frontend-ebon.vercel.app](https://ride-booking-frontend-ebon.vercel.app)

---

## 📌 Project Overview

RideMate is a **full-featured ride-hailing frontend application** built using **React.js, Redux Toolkit with RTK Query, React Router, and React Hot Toast**.  
It provides **role-based dashboards** and **dynamic features** for Riders, Drivers, and Admins, ensuring a seamless user experience across devices.

This project demonstrates **responsive UI/UX, authentication, error handling, state management, and data visualization** with a focus on performance and accessibility.

---

## ✨ Features

### 🔓 Public Pages

-   **Home Page** with 5+ structured sections (Hero, How it Works, Services, Testimonials, CTA).
-   **About Us** with company mission and team profiles.
-   **Features** page describing Rider, Driver, and Admin capabilities.
-   **Contact Page** with validated form (simulated submission).
-   **FAQ** section with search functionality.

### 🔐 Authentication & Authorization

-   JWT-based **Login/Registration** with role selection (Rider/Driver/Admin).
-   Persistent authentication across sessions.
-   Blocked/Suspended accounts redirected to status page.
-   Driver “Offline” mode supported.
-   Secure **Logout** functionality.

### 👤 Rider Features

-   Ride Request form with fare estimation & payment options.
-   Ride History with search & filters.
-   Ride Details page (map, driver info, timeline).
-   Profile management (edit name, phone, password).
-   **Optional** live ride tracking.

### 🚗 Driver Features

-   Toggle **Online/Offline** availability.
-   Accept/Reject incoming ride requests.
-   Active Ride Management (status updates).
-   Earnings Dashboard with charts (daily, weekly, monthly).
-   Ride History with pagination and filters.
-   Profile management (vehicle, contact info, password).

### 🛠 Admin Features

-   User Management (search, filter, block/unblock, approve/suspend).
-   Ride Oversight with advanced filtering.
-   Analytics Dashboard (ride volume, revenue trends, driver activity).
-   Consistent search & filter tools.
-   Profile management.

### 🚨 Emergency / SOS Feature

-   Floating SOS button during active rides.
-   Options: Call Police, Notify Emergency Contact, Share Live Location.
-   Live GPS sharing via **WhatsApp/SMS/Email API**.
-   Pre-set emergency contact management in Settings → Safety.
-   Clear visual feedback (“Emergency contact notified”).

### 🎨 General UI/UX

-   Responsive design for mobile, tablet, desktop.
-   Sticky Navbar & themed Footer.
-   Role-based navigation with profile dropdown.
-   Interactive UI (carousels, ride cards, charts).
-   Skeleton loaders & lazy-loading heavy assets.
-   Global error handling + success/error toast notifications.
-   Accessibility-compliant components.

---

## 🛠️ Technology Stack

-   **Frontend Framework**: React.js
-   **State Management**: Redux Toolkit + RTK Query
-   **Routing**: React Router
-   **Notifications**: React Hot Toast
-   **Charts & Data Viz**: Recharts / Chart.js
-   **Maps & Geolocation**: Leaflet / react-geolocated
-   **Emergency Communication**: tel:, EmailJS, WhatsApp API, Twilio
-   **UI Enhancements**: TailwindCSS / Material UI (if used)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ridemate-frontend.git
cd ridemate-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root and configure:

```env
VITE_BASE_URL=your-backend-api-url
```

### 4. Run the Project

```bash
npm start
```

The app will start at **http://localhost:5173/**

### 5. Build for Production

```bash
npm run build
```

---

## ⚠️ Notes

-   Proper **form validation & error handling** implemented (API, forms, unauthorized access).
-   Toast notifications for success & error states.
-   All links, buttons, and forms are fully functional.
-   Realistic seed data provided to replace placeholders.

---

## 🚀 Future Improvements

-   Payment gateway integration (Stripe/PayPal).
-   Push notifications for ride updates.
-   Multi-language support.
-   Dark mode toggle.
