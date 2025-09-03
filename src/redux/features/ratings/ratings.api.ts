import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

type TRatingTarget = "RIDER" | "DRIVER";

export interface IRating {
  _id: string;
  rideId: string;
  raterId: string;
  targetUserId: string;
  targetRole: TRatingTarget;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRatingFilters {
  givenOrReceived?: "given" | "received";
  targetRole?: TRatingTarget;
  userId?: string; // optional admin filter
  page?: number;
  limit?: number;
}

export interface IUpdateRatingRequest {
  rating?: number;
  comment?: string;
}

export const ratingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /ratings
    getRatings: builder.query<
      IResponse<{
        ratings: IRating[];
        total: number;
        page: number;
        limit: number;
      }>,
      IRatingFilters | void
    >({
      query: (params = {}) => ({
        url: "/ratings",
        method: "GET",
        params,
      }),
      providesTags: ["RIDE"],
    }),

    // PATCH /ratings/:ratingId
    updateRating: builder.mutation<
      IResponse<IRating>,
      { ratingId: string; update: IUpdateRatingRequest }
    >({
      query: ({ ratingId, update }) => ({
        url: `/ratings/${ratingId}`,
        method: "PATCH",
        data: update,
      }),
      invalidatesTags: ["RIDE"],
    }),

    // DELETE /ratings/:ratingId
    deleteRating: builder.mutation<IResponse<null>, string>({
      query: (ratingId) => ({
        url: `/ratings/${ratingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RIDE"],
    }),

    // GET /ratings/average/:userId
    getAverageRating: builder.query<
      IResponse<{ userId: string; average: number; count: number }>,
      string
    >({
      query: (userId) => ({
        url: `/ratings/average/${userId}`,
        method: "GET",
      }),
      providesTags: ["RIDE"],
    }),
  }),
});

export const {
  useGetRatingsQuery,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
  useGetAverageRatingQuery,
} = ratingsApi;

