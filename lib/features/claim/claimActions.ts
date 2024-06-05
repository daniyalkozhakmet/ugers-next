import { claimApi } from "./claimApi";
import {
  ClaimCreateRequest,
  ClaimCreateResponse,
  ClaimDeleteResponse,
  ClaimUpdateRequest,
  ClaimUpdateResponse,
  ClaimsGetResponse,
} from "@/lib/ts/claim";
import { ParamType } from "@/middleware";
import { headers } from "next/headers";
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const extendedApi = claimApi.injectEndpoints({
  endpoints: (build) => ({
    getClaims: build.query<ClaimsGetResponse, number | string>({
      query: (page) => {
        if (typeof page != "string") {
          const searchParams = new URLSearchParams(window.location.search);
          const params = {
            claim_number: searchParams.get("claim_number") || "",
            invent_num: searchParams.get("invent_num") || "",
            res: searchParams.get("res") || "",
            neighborhood: searchParams.get("neighborhood") || "",
          };
          let queryString = `?page=${page}`;
          if (params.claim_number && params.invent_num) {
            queryString = `?page=${page}&invent_num=${params.invent_num}&claim_number=${params.claim_number}`;
          } else if (params.claim_number) {
            queryString = `?page=${page}&claim_number=${params.claim_number}`;
          } else if (params.invent_num) {
            queryString = `?page=${page}&invent_num=${params.invent_num}`;
          } else if (params.neighborhood) {
            queryString = `?page=${page}&neighborhood=${params.neighborhood}`;
          } else if (params.res) {
            queryString = `?page=${page}&res=${params.res}`;
          }

          return queryString;
        }
        return page;
      },
      transformResponse: (response: ClaimsGetResponse) => {
        if (response.data) {
          response.data.claims = response.data.claims.map((claim) => ({
            ...claim,
            date_of_excavation: formatDate(claim.date_of_excavation),
            date_of_sending: formatDate(claim.date_of_sending),
            date_of_fixing: claim.date_of_fixing
              ? formatDate(claim.date_of_fixing)
              : undefined,
            date_of_obtaing_fail: claim.date_of_obtaing_fail
              ? formatDate(claim.date_of_obtaing_fail)
              : undefined,
            date_of_sending_claim_by_obtaining_fail:
              claim.date_of_sending_claim_by_obtaining_fail
                ? formatDate(claim.date_of_sending_claim_by_obtaining_fail)
                : undefined,
            date_of_signing: claim.date_of_signing
              ? formatDate(claim.date_of_signing)
              : undefined,
            date_recovery_ABP: claim.date_recovery_ABP
              ? formatDate(claim.date_recovery_ABP)
              : undefined,
          }));
        }
        return response;
      },
      providesTags: ["claims"],
    }),
    createClaim: build.mutation<ClaimCreateResponse, ClaimCreateRequest>({
      query: (payload) => ({
        url: `/`,
        method: "POST",
        body: payload,
      }),
    }),
    deleteClaim: build.mutation<ClaimDeleteResponse, string>({
      query: (payload) => ({
        url: `/${payload}`,
        method: "DELETE",
        body: payload,
      }),
    }),
    updateClaim: build.mutation<
      ClaimUpdateResponse,
      { text: { claim_id: string }; form: FormData }
    >({
      query: (payload) => ({
        url: `/${payload.text.claim_id}`,
        method: "PUT",
        body: payload.form,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateClaimMutation,
  useLazyGetClaimsQuery,
  useGetClaimsQuery,
  useUpdateClaimMutation,
  useDeleteClaimMutation,
} = extendedApi;
