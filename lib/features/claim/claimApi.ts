import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const claimApi = createApi({
  reducerPath: "claimApi",
  tagTypes: ["claims"],
  baseQuery: fetchBaseQuery({ baseUrl: "/api/claims" }),
  endpoints: () => ({}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
