import { Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux/features/auth/authSlice";
import { type TUserRole, USER_STATUS } from "@/constants/role";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: TUserRole[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but trying to access auth pages
  if (!requireAuth && isAuthenticated) {
    // Redirect based on user role
    if (user) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If user is authenticated and specific roles are required
  if (requireAuth && isAuthenticated && allowedRoles && user) {
    // Check if user has required role
    if (!allowedRoles.includes(user.role)) {
      // Redirect to dashboard root - the dashboard will handle role-based rendering
      return <Navigate to="/dashboard" replace />;
    }

    // Check user status for blocked/suspended users
    if (
      user.status === USER_STATUS.BLOCKED ||
      user.status === USER_STATUS.SUSPENDED
    ) {
      return <Navigate to="/account/status" replace />;
    }
  }

  // Check user status for authenticated users accessing dashboard
  if (requireAuth && isAuthenticated && user) {
    if (
      user.status === USER_STATUS.BLOCKED ||
      user.status === USER_STATUS.SUSPENDED
    ) {
      return <Navigate to="/account/status" replace />;
    }
  }

  return <>{children}</>;
}
