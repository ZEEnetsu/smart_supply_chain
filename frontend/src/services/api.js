import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // base Url for frontend
  }),
  //chache labels
  tagTypes: ["Alert", "Event"],

  endpoints: (builder) => ({
    getAlerts: builder.query({
      query: (status = "open") => `/alerts?status=${status}`,
      providesTags: ["Alert"],
    }),
    getShipmentTimeline: builder.query({
      query: (shipmentId) => `/events/${shipmentId}`,
      providesTags: ["Event"],
    }),
    ingestEvents: builder.mutation({
      query: (body) => ({
        url: "/events",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Alert"],
    }),
    resolveAlert: builder.mutation({
      query: (id) => ({
        url: `/alerts/${id}/resolve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Alert"],
    }),
    optimizeRoute: builder.mutation({
      query: (body) => ({
        url: "/optimize",
        method: "POST",
        body,
      }),
    }),
  }),
});

console.log('API base URL:', import.meta.env.VITE_API_URL);
console.log("META ", import.meta.env);

export const {
  useGetAlertsQuery,
  useGetShipmentTimelineQuery,
  useIngestEventsMutation,
  useResolveAlertMutation,
  useOptimizeRouteMutation,
} = api;
