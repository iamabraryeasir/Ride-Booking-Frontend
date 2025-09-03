/* eslint-disable @typescript-eslint/no-unused-vars */
import { baseApi } from "@/redux/baseApi";
import { setCredentials, logout as logoutAction } from "./authSlice";
import type {
  IResponse,
  ISendOtp,
  IVerifyOtp,
  ILoginRequest,
  IRegisterRequest,
  IAuthResponse,
  IUpdateProfileRequest,
  IChangePasswordRequest,
  IUser,
} from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<IResponse<IAuthResponse>, ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                token: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );
          }
        } catch (error) {
          // Handle error in component
        }
      },
      invalidatesTags: ["USER"],
    }),

    register: builder.mutation<IResponse<IAuthResponse>, IRegisterRequest>({
      query: (userInfo) => ({
        url: "/users/register",
        method: "POST",
        data: userInfo,
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(
              setCredentials({
                user: data.data.user,
                token: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );
          }
        } catch (error) {
          // Handle error in component
        }
      },
    }),

    logout: builder.mutation<IResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logoutAction());
        } catch (error) {
          // Even if logout fails on server, clear local auth
          dispatch(logoutAction());
        }
      },
      invalidatesTags: ["USER", "RIDE", "DRIVER", "EARNINGS"],
    }),

    refreshToken: builder.mutation<
      IResponse<{ token: string }>,
      { refreshToken: string }
    >({
      query: (data) => ({
        url: "/auth/refresh-token",
        method: "POST",
        data,
      }),
    }),

    // User profile endpoints
    getUserInfo: builder.query<IResponse<IUser>, void>({
      query: () => ({
        url: "/users/profile",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateProfile: builder.mutation<IResponse<IUser>, IUpdateProfileRequest>({
      query: (data) => ({
        url: "/users/profile",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    changePassword: builder.mutation<IResponse<null>, IChangePasswordRequest>({
      query: (data) => ({
        url: "/users/change-password",
        method: "PATCH",
        data,
      }),
    }),

    // Legacy OTP endpoints (if still needed)
    sendOtp: builder.mutation<IResponse<null>, ISendOtp>({
      query: (userInfo) => ({
        url: "/otp/send",
        method: "POST",
        data: userInfo,
      }),
    }),

    verifyOtp: builder.mutation<IResponse<null>, IVerifyOtp>({
      query: (userInfo) => ({
        url: "/otp/verify",
        method: "POST",
        data: userInfo,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetUserInfoQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
