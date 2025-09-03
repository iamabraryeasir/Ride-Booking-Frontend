import { baseApi } from "@/redux/baseApi";
import type {
  IResponse,
  IRide,
  IRideRequest,
  IFareEstimate,
  IRideUpdate,
  IRideFilters,
  IPaginatedResponse,
} from "@/types";

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Rider endpoints
    requestRide: builder.mutation<IResponse<IRide>, IRideRequest>({
      query: (rideData) => ({
        url: "/rides/request",
        method: "POST",
        data: rideData,
      }),
      invalidatesTags: ["RIDE"],
    }),

    cancelRide: builder.mutation<
      IResponse<IRide>,
      { rideId: string; cancelReason: string }
    >({
      query: ({ rideId, cancelReason }) => ({
        url: `/rides/cancel/${rideId}`,
        method: "PATCH",
        data: { cancelReason },
      }),
      invalidatesTags: ["RIDE"],
    }),

    getMyRides: builder.query<
      IResponse<IPaginatedResponse<IRide>>,
      IRideFilters
    >({
      query: (filters) => ({
        url: "/rides/my-rides",
        method: "GET",
        params: filters,
      }),
      providesTags: ["RIDE"],
    }),

    getRideById: builder.query<IResponse<IRide>, string>({
      query: (rideId) => ({
        url: `/rides/${rideId}`,
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),

    // Driver endpoints
    acceptRide: builder.mutation<IResponse<IRide>, string>({
      query: (rideId) => ({
        url: `/rides/accept/${rideId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDE"],
    }),

    rejectRide: builder.mutation<
      IResponse<IRide>,
      { rideId: string; reason: string }
    >({
      query: ({ rideId, reason }) => ({
        url: `/rides/reject/${rideId}`,
        method: "PATCH",
        data: { reason },
      }),
      invalidatesTags: ["RIDE"],
    }),

    updateRideStatus: builder.mutation<
      IResponse<IRide>,
      { rideId: string; update: IRideUpdate }
    >({
      query: ({ rideId, update }) => ({
        url: `/rides/update-ride-status/${rideId}`,
        method: "PATCH",
        data: update,
      }),
      invalidatesTags: ["RIDE"],
    }),

    // Driver-specific ride queries
    getPendingRides: builder.query<IResponse<IRide[]>, void>({
      query: () => ({
        url: "/rides/incoming",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),

    getActiveRide: builder.query<IResponse<IRide | null>, void>({
      query: () => ({
        url: "/rides/active",
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),

    // Utility endpoints
    estimateFare: builder.mutation<
      IResponse<IFareEstimate>,
      { pickupAddress: string; destinationAddress: string }
    >({
      query: (addressData) => ({
        url: "/rides/estimate-fare",
        method: "POST",
        data: addressData,
      }),
    }),

    // Rating endpoint
    rateRide: builder.mutation<
      IResponse<IRide>,
      { rideId: string; rating: number; comment?: string }
    >({
      query: ({ rideId, ...ratingData }) => ({
        url: `/ratings/ride/${rideId}`,
        method: "POST",
        data: ratingData,
      }),
      invalidatesTags: ["RIDE"],
    }),
  }),
});

export const {
  // Rider hooks
  useRequestRideMutation,
  useCancelRideMutation,
  useGetMyRidesQuery,
  useGetRideByIdQuery,

  // Driver hooks
  useAcceptRideMutation,
  useRejectRideMutation,
  useUpdateRideStatusMutation,
  useGetPendingRidesQuery,
  useGetActiveRideQuery,

  // Utility hooks
  useEstimateFareMutation,
  useRateRideMutation,
} = rideApi;
