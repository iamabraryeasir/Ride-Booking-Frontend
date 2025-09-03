import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

export interface IEmergencyContact {
  _id: string;
  name: string;
  phone: string;
  relationship: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateEmergencyContactRequest {
  name: string;
  phone: string;
  relationship: string;
  isActive?: boolean;
}

export interface IUpdateEmergencyContactRequest {
  name?: string;
  phone?: string;
  relationship?: string;
  isActive?: boolean;
}

export const emergencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmergencyContacts: builder.query<IResponse<IEmergencyContact[]>, void>({
      query: () => ({
        url: "/emergency-contacts",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    addEmergencyContact: builder.mutation<
      IResponse<IEmergencyContact>,
      ICreateEmergencyContactRequest
    >({
      query: (payload) => ({
        url: "/emergency-contacts",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["USER"],
    }),

    updateEmergencyContact: builder.mutation<
      IResponse<IEmergencyContact>,
      { contactId: string; update: IUpdateEmergencyContactRequest }
    >({
      query: ({ contactId, update }) => ({
        url: `/emergency-contacts/${contactId}`,
        method: "PATCH",
        data: update,
      }),
      invalidatesTags: ["USER"],
    }),

    deleteEmergencyContact: builder.mutation<IResponse<null>, string>({
      query: (contactId) => ({
        url: `/emergency-contacts/${contactId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useGetEmergencyContactsQuery,
  useAddEmergencyContactMutation,
  useUpdateEmergencyContactMutation,
  useDeleteEmergencyContactMutation,
} = emergencyApi;
