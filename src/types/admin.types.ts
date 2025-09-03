import type { IDriver } from "./user.types";
import type { IRide } from "./ride.types";
import type { TUserStatus, TDriverStatus } from "@/constants/role";

export interface IAdminStats {
  users: {
    total: number;
    riders: number;
    drivers: number;
    activeUsers: number;
    newUsersThisMonth: number;
  };
  rides: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
    todayRides: number;
    thisWeekRides: number;
    thisMonthRides: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    today: number;
    averageRideFare: number;
  };
  drivers: {
    total: number;
    online: number;
    offline: number;
    pending: number;
    approved: number;
    suspended: number;
  };
}

export interface IRevenueData {
  date: string;
  revenue: number;
  rides: number;
}

export interface IUserFilters {
  role?: "RIDER" | "DRIVER" | "ADMIN";
  status?: TUserStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "name" | "email";
  sortOrder?: "asc" | "desc";
}

export interface IDriverFilters {
  status?: TDriverStatus;
  isApproved?: boolean;
  search?: string;
  vehicleType?: "CAR" | "MOTORCYCLE" | "BICYCLE";
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "name" | "rating" | "totalRides";
  sortOrder?: "asc" | "desc";
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface IUserManagementAction {
  userId: string;
  action: "BLOCK" | "UNBLOCK" | "SUSPEND" | "ACTIVATE";
  reason?: string;
}

export interface IDriverManagementAction {
  driverId: string;
  action: "APPROVE" | "REJECT" | "SUSPEND" | "UNSUSPEND";
  reason?: string;
}

export interface ISystemReport {
  overview: IAdminStats;
  revenueChart: IRevenueData[];
  recentActivity: [string];
  disputedRides: number;
  blockedUsers: number;
  totalUsers: number;
  activeRides: number;
  topDrivers: Array<{
    driver: IDriver;
    earnings: number;
    rides: number;
  }>;
  recentRides: IRide[];
  activeIssues: Array<{
    type: "USER_COMPLAINT" | "DRIVER_ISSUE" | "SYSTEM_ERROR";
    description: string;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    createdAt: string;
  }>;
}
