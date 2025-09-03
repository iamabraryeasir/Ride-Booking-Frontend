import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  selectCurrentUser,
  selectUserRole,
} from "@/redux/features/auth/authSlice";
import { ROLES, USER_STATUS } from "@/constants/role";

// Import dashboard components
import RiderDashboard from "./Rider/RiderDashboard";
import DriverDashboard from "./Driver/DriverDashboard";
import AdminDashboard from "./Admin/AdminDashboard";

export default function DashboardIndex() {
  const user = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle blocked or suspended users
    if (
      user?.status === USER_STATUS.BLOCKED ||
      user?.status === USER_STATUS.SUSPENDED
    ) {
      navigate("/account/status");
      return;
    }

    // For drivers with offline status, they can still access dashboard
    // but with limited features (handled in driver dashboard)
  }, [user, navigate]);

  // Show loading if no user data yet
  if (!user || !userRole) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  switch (userRole) {
    case ROLES.RIDER:
      return <RiderDashboard />;

    case ROLES.DRIVER:
      return <DriverDashboard />;

    case ROLES.ADMIN:
      return <AdminDashboard />;

    default:
      // Fallback for unknown roles
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            Your account role is not recognized. Please contact support.
          </p>
        </div>
      );
  }
}
