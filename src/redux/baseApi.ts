/**
 * Node Modules
 */
import { createApi } from "@reduxjs/toolkit/query/react";

/**
 * Local Modules
 */
import axiosBaseQuery from "@/redux/axiosBaseQuery";

/**
 * Create Base API
 */
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "USER", 
    "RIDE", 
    "DRIVER", 
    "ADMIN", 
    "EARNINGS", 
    "REPORTS",
    "EMERGENCY",
    "PAYMENT_METHOD"
  ],
  endpoints: () => ({}),
});
