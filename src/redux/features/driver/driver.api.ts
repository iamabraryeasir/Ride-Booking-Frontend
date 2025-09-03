import { baseApi } from "@/redux/baseApi";
import type {
  IResponse,
  IDriver,
  IDriverApplication,
  IEarnings,
  IRide,
} from "@/types";

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Driver application
    applyAsDriver: builder.mutation<IResponse<IDriver>, IDriverApplication>({
      query: (applicationData) => ({
        url: "/drivers/apply",
        method: "POST",
        data: applicationData,
      }),
      invalidatesTags: ["DRIVER", "USER"],
    }),

    // Driver availability management
    toggleAvailability: builder.mutation<IResponse<IDriver>, void>({
      query: () => ({
        url: "/drivers/toggle-availability",
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER"],
    }),

    // Driver earnings
    getEarnings: builder.query<
      IResponse<IEarnings>,
      { period?: "daily" | "weekly" | "monthly" }
    >({
      query: (params) => ({
        url: "/drivers/earnings",
        method: "GET",
        params,
      }),
      providesTags: ["EARNINGS"],
    }),

    // Driver ride history
    getMyRides: builder.query<
      IResponse<{ rides: IRide[]; total: number; page: number; limit: number }>,
      { page?: number; limit?: number; status?: string }
    >({
      query: (params) => ({
        url: "/drivers/my-rides",
        method: "GET",
        params,
      }),
      providesTags: ["RIDE", "DRIVER"],
    }),

    // Driver profile (using shared user profile endpoints)
    getDriverProfile: builder.query<IResponse<IDriver>, void>({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),

    updateDriverProfile: builder.mutation<IResponse<IDriver>, Partial<IDriver>>(
      {
        query: (updateData) => ({
          url: "/users/profile",
          method: "PATCH",
          data: updateData,
        }),
        invalidatesTags: ["DRIVER", "USER"],
      }
    ),

    // Driver statistics
    getDriverStats: builder.query<
      IResponse<{
        totalRides: number;
        completedRides: number;
        cancelledRides: number;
        rating: number;
        totalEarnings: number;
        todayEarnings: number;
        weeklyEarnings: number;
        monthlyEarnings: number;
      }>,
      void
    >({
      query: () => ({
        url: "/drivers/stats",
        method: "GET",
      }),
      providesTags: ["DRIVER", "EARNINGS"],
    }),

    // Update driver location (for real-time tracking)
    updateLocation: builder.mutation<
      IResponse<null>,
      { latitude: number; longitude: number }
    >({
      query: (location) => ({
        url: "/drivers/location",
        method: "PATCH",
        data: location,
      }),
    }),
  }),
});

export const {
  useApplyAsDriverMutation,
  useToggleAvailabilityMutation,
  useGetEarningsQuery,
  useGetMyRidesQuery,
  useGetDriverProfileQuery,
  useUpdateDriverProfileMutation,
  useGetDriverStatsQuery,
  useUpdateLocationMutation,
} = driverApi;
