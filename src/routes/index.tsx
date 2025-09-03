/**
 * Node Modules
 */
import { createBrowserRouter } from "react-router";

/**
 * Components
 */
import App from "@/App";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

/**
 * Public Pages
 */
import HomePage from "@/pages/Public/HomePage";
import AboutPage from "@/pages/Public/AboutPage";
import FeaturesPage from "@/pages/Public/FeaturesPage";
import ContactPage from "@/pages/Public/ContactPage";
import FaqPage from "@/pages/Public/FaqPage";

/**
 * Auth Pages
 */
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import AccountStatusPage from "@/pages/Auth/AccountStatusPage";

/**
 * Dashboard Components
 */
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardIndex from "@/pages/Dashboard/DashboardIndex";
import RiderDashboard from "@/pages/Dashboard/Rider/RiderDashboard";
import BookRidePage from "@/pages/Dashboard/Rider/BookRidePage";
import RideHistoryPage from "@/pages/Dashboard/Rider/RideHistoryPage";
import RideDetailsPage from "@/pages/Dashboard/Rider/RideDetailsPage";
import ProfilePage from "@/pages/Dashboard/Rider/ProfilePage";
import DriverDashboard from "@/pages/Dashboard/Driver/DriverDashboard";
import AdminDashboard from "@/pages/Dashboard/Admin/AdminDashboard";
import PaymentMethods from "@/pages/Dashboard/PaymentMethods";
import SettingsPage from "@/pages/Dashboard/Settings/SettingsPage";

/**
 * Router
 */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        Component: HomePage,
        index: true,
      },
      {
        path: "about",
        Component: AboutPage,
      },
      {
        path: "features",
        Component: FeaturesPage,
      },
      {
        path: "contact",
        Component: ContactPage,
      },
      {
        path: "faq",
        Component: FaqPage,
      },
    ],
  },
  // Auth routes (accessible only when not authenticated)
  {
    path: "/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <LoginPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute requireAuth={false}>
        <RegisterPage />
      </ProtectedRoute>
    ),
  },
  // Account status page
  {
    path: "/account/status",
    Component: AccountStatusPage,
  },

  // Dashboard routes (protected - require authentication)
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requireAuth={true}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardIndex,
      },
      // Rider routes
      {
        path: "rider",
        element: (
          <ProtectedRoute requireAuth={true} allowedRoles={["RIDER"]}>
            <RiderDashboard />
          </ProtectedRoute>
        ),
      },
      // Driver routes
      {
        path: "driver",
        element: (
          <ProtectedRoute requireAuth={true} allowedRoles={["DRIVER"]}>
            <DriverDashboard />
          </ProtectedRoute>
        ),
      },
      // Admin routes
      {
        path: "admin",
        element: (
          <ProtectedRoute requireAuth={true} allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      // Rider specific routes
      {
        path: "book-ride",
        element: (
          <ProtectedRoute requireAuth={true} allowedRoles={["RIDER"]}>
            <BookRidePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "rides",
        element: (
          <ProtectedRoute requireAuth={true} allowedRoles={["RIDER"]}>
            <RideHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "rides/:rideId",
        element: (
          <ProtectedRoute requireAuth={true} allowedRoles={["RIDER"]}>
            <RideDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute requireAuth={true} allowedRoles={["RIDER"]}>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-methods",
        element: (
          <ProtectedRoute requireAuth={true} allowedRoles={["RIDER"]}>
            <PaymentMethods />
          </ProtectedRoute>
        ),
      },
      // Common dashboard routes
      {
        path: "settings",
        element: (
          <ProtectedRoute requireAuth={true}>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
