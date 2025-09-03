import { baseApi } from "@/redux/baseApi";
import type {
  IResponse,
  IUser,
  IDriver,
  IRide,
  IAdminStats,
  ISystemReport,
  IPaginatedResponse,
  IUserFilters,
  IDriverFilters,
  IRideFilters,
  IUserManagementAction,
  IDriverManagementAction
} from "@/types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard and analytics
    getSystemReport: builder.query<IResponse<ISystemReport>, void>({
      query: () => ({
        url: "/reports",
        method: "GET",
      }),
      providesTags: ["REPORTS"],
    }),

    getDailyAnalytics: builder.query<IResponse<{
      totalRides: number;
      completedRides: number;
      cancelledRides: number;
      totalRevenue: number;
      averageFare: number;
      topRiders: Array<{ user: IUser; ridesCount: number }>;
      topDrivers: Array<{ driver: IDriver; ridesCount: number }>;
    }>, void>({
      query: () => ({
        url: "/reports/daily-analytics",
        method: "GET", 
      }),
      providesTags: ["REPORTS"],
    }),

    getMonthlyAnalytics: builder.query<IResponse<{
      totalRides: number;
      totalRevenue: number;
      averageFare: number;
      ridesByDay: Array<{ date: string; rides: number; revenue: number }>;
      topPerformers: {
        riders: Array<{ user: IUser; ridesCount: number }>;
        drivers: Array<{ driver: IDriver; ridesCount: number; earnings: number }>;
      };
    }>, void>({
      query: () => ({
        url: "/reports/monthly-analytics",
        method: "GET",
      }),
      providesTags: ["REPORTS"],
    }),

    getDriverActivityStats: builder.query<IResponse<{
      totalDrivers: number;
      onlineDrivers: number;
      offlineDrivers: number;
      averageRating: number;
      totalEarnings: number;
      topDrivers: Array<{ driver: IDriver; earnings: number; rating: number }>;
    }>, void>({
      query: () => ({
        url: "/reports/driver-activity",
        method: "GET",
      }),
      providesTags: ["REPORTS"],
    }),

    getRevenueTrends: builder.query<IResponse<{
      daily: Array<{ date: string; revenue: number; rides: number }>;
      weekly: Array<{ week: string; revenue: number; rides: number }>;
      monthly: Array<{ month: string; revenue: number; rides: number }>;
      yearly: Array<{ year: string; revenue: number; rides: number }>;
    }>, { period: 'daily' | 'weekly' | 'monthly' | 'yearly'; days?: number }>({
      query: (params) => ({
        url: "/reports/revenue-trends",
        method: "GET",
        params,
      }),
      providesTags: ["REPORTS"],
    }),

    // User Management
    getAllUsers: builder.query<IResponse<IPaginatedResponse<IUser>>, IUserFilters>({
      query: (filters) => ({
        url: "/users",
        method: "GET",
        params: filters,
      }),
      providesTags: ["USER"],
    }),

    toggleBlockUser: builder.mutation<IResponse<IUser>, string>({
      query: (userId) => ({
        url: `/users/toggle-block/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),

    // Driver Management
    getAllDrivers: builder.query<IResponse<IPaginatedResponse<IDriver>>, IDriverFilters>({
      query: (filters) => ({
        url: "/drivers",
        method: "GET",
        params: filters,
      }),
      providesTags: ["DRIVER"],
    }),

    approveDriver: builder.mutation<IResponse<IDriver>, string>({
      query: (driverId) => ({
        url: `/drivers/approve/${driverId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER"],
    }),

    rejectDriver: builder.mutation<IResponse<IDriver>, { driverId: string; rejectionReason: string }>({
      query: ({ driverId, rejectionReason }) => ({
        url: `/drivers/reject/${driverId}`,
        method: "PATCH",
        data: { rejectionReason },
      }),
      invalidatesTags: ["DRIVER"],
    }),

    toggleSuspendDriver: builder.mutation<IResponse<IDriver>, string>({
      query: (driverId) => ({
        url: `/drivers/toggle-suspend/${driverId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER"],
    }),

    // Ride Management
    getAllRides: builder.query<IResponse<IPaginatedResponse<IRide>>, IRideFilters>({
      query: (filters) => ({
        url: "/rides",
        method: "GET",
        params: filters,
      }),
      providesTags: ["RIDE"],
    }),

    getRideDetails: builder.query<IResponse<IRide>, string>({
      query: (rideId) => ({
        url: `/rides/${rideId}`,
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),

    // Analytics endpoints
    getRevenueAnalytics: builder.query<IResponse<{
      daily: Array<{ date: string; revenue: number; rides: number }>;
      weekly: Array<{ week: string; revenue: number; rides: number }>;
      monthly: Array<{ month: string; revenue: number; rides: number }>;
    }>, { period: 'daily' | 'weekly' | 'monthly'; days?: number }>({
      query: (params) => ({
        url: "/admin/analytics/revenue",
        method: "GET",
        params,
      }),
      providesTags: ["REPORTS"],
    }),

    getUserAnalytics: builder.query<IResponse<{
      registrations: Array<{ date: string; riders: number; drivers: number }>;
      activeUsers: Array<{ date: string; count: number }>;
      usersByRole: { riders: number; drivers: number; admins: number };
    }>, { period: 'daily' | 'weekly' | 'monthly'; days?: number }>({
      query: (params) => ({
        url: "/admin/analytics/users",
        method: "GET",
        params,
      }),
      providesTags: ["REPORTS"],
    }),

    getRideAnalytics: builder.query<IResponse<{
      ridesByStatus: { [key: string]: number };
      ridesByDate: Array<{ date: string; rides: number }>;
      averageRideDistance: number;
      averageRideFare: number;
      peakHours: Array<{ hour: number; rides: number }>;
    }>, { period: 'daily' | 'weekly' | 'monthly'; days?: number }>({
      query: (params) => ({
        url: "/admin/analytics/rides",
        method: "GET",
        params,
      }),
      providesTags: ["REPORTS"],
    }),

    // Export data
    exportUsers: builder.mutation<Blob, IUserFilters>({
      query: (filters) => ({
        url: "/admin/export/users",
        method: "POST",
        data: filters,
        responseType: 'blob',
      }),
    }),

    exportRides: builder.mutation<Blob, IRideFilters>({
      query: (filters) => ({
        url: "/admin/export/rides", 
        method: "POST",
        data: filters,
        responseType: 'blob',
      }),
    }),
  }),
});

export const {
  // Analytics and Dashboard
  useGetSystemReportQuery,
  useGetDailyAnalyticsQuery,
  useGetMonthlyAnalyticsQuery,
  useGetDriverActivityStatsQuery,
  useGetRevenueTrendsQuery,
  
  // User Management
  useGetAllUsersQuery,
  useToggleBlockUserMutation,
  
  // Driver Management  
  useGetAllDriversQuery,
  useApproveDriverMutation,
  useRejectDriverMutation,
  useToggleSuspendDriverMutation,
  
  // Ride Management
  useGetAllRidesQuery,
  useGetRideDetailsQuery,
  
  // Legacy Analytics (remove if not used)
  useGetRevenueAnalyticsQuery,
  useGetUserAnalyticsQuery,
  useGetRideAnalyticsQuery,
  
  // Export
  useExportUsersMutation,
  useExportRidesMutation,
} = adminApi;
