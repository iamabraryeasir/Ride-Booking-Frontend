import { baseApi } from "@/redux/baseApi";
import type {
  IResponse,
  IPaymentMethod,
  IAddPaymentMethodRequest,
  IUpdatePaymentMethodRequest,
  IPaymentMethodFilters
} from "@/types";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all payment methods for current user
    getPaymentMethods: builder.query<IResponse<IPaymentMethod[]>, IPaymentMethodFilters | void>({
      query: (filters = {}) => ({
        url: "/payment-methods",
        method: "GET",
        params: filters,
      }),
      providesTags: ["PAYMENT_METHOD"],
    }),

    // Get payment method by ID
    getPaymentMethodById: builder.query<IResponse<IPaymentMethod>, string>({
      query: (paymentMethodId) => ({
        url: `/payment-methods/${paymentMethodId}`,
        method: "GET",
      }),
      providesTags: ["PAYMENT_METHOD"],
    }),

    // Add new payment method
    addPaymentMethod: builder.mutation<IResponse<IPaymentMethod>, IAddPaymentMethodRequest>({
      query: (paymentMethodData) => ({
        url: "/payment-methods",
        method: "POST",
        data: paymentMethodData,
      }),
      invalidatesTags: ["PAYMENT_METHOD"],
    }),

    // Update payment method
    updatePaymentMethod: builder.mutation<IResponse<IPaymentMethod>, { paymentMethodId: string; update: IUpdatePaymentMethodRequest }>({
      query: ({ paymentMethodId, update }) => ({
        url: `/payment-methods/${paymentMethodId}`,
        method: "PATCH",
        data: update,
      }),
      invalidatesTags: ["PAYMENT_METHOD"],
    }),

    // Set payment method as default
    setDefaultPaymentMethod: builder.mutation<IResponse<IPaymentMethod>, string>({
      query: (paymentMethodId) => ({
        url: `/payment-methods/${paymentMethodId}/set-default`,
        method: "PATCH",
      }),
      invalidatesTags: ["PAYMENT_METHOD"],
    }),

    // Delete payment method
    deletePaymentMethod: builder.mutation<IResponse<null>, string>({
      query: (paymentMethodId) => ({
        url: `/payment-methods/${paymentMethodId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PAYMENT_METHOD"],
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useGetPaymentMethodByIdQuery,
  useAddPaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentApi;
