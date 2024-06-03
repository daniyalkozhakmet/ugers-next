import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const resApi = createApi({
  reducerPath: "resApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/res" }),
  endpoints: () => ({}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
