import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

export interface IUserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    showProfileToDrivers: boolean;
    shareRideStats: boolean;
  };
  safety: {
    autoShareLocationOnSOS: boolean;
    defaultSOSOption: "POLICE" | "EMERGENCY_CONTACT" | "LOCATION_SHARE";
  };
}

export type IUpdateSettingsRequest = Partial<IUserSettings>;

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<IResponse<IUserSettings>, void>({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateSettings: builder.mutation<
      IResponse<IUserSettings>,
      IUpdateSettingsRequest
    >({
      query: (update) => ({
        url: "/settings",
        method: "PATCH",
        data: update,
      }),
      invalidatesTags: ["USER"],
    }),

    resetSettings: builder.mutation<IResponse<IUserSettings>, void>({
      query: () => ({
        url: "/settings/reset",
        method: "POST",
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useResetSettingsMutation,
} = settingsApi;
